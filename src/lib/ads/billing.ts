import { PLAN_DETAILS, type PlanId } from "./plans";

export type BillingFields = {
  name: string;
  email: string;
  country: string;
};

export type PaymentRecord = {
  id: number;
  plan: string;
  amountCents: number;
  currency: string;
  status: string;
  provider: string;
  billingEmail: string | null;
  createdAt: string;
};

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function validateBilling(input: {
  name: string;
  email: string;
  country: string;
}): BillingFields {
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().toLowerCase().slice(0, 120);
  const country = input.country.trim().slice(0, 56);
  if (name.length < 2) throw new Error("Enter the name on the account");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email");
  if (country.length < 2) throw new Error("Enter a country");
  return { name, email, country };
}

export function periodEndFromNow(days = 30): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

type StripeSession = {
  id: string;
  url?: string | null;
  payment_status?: string;
  status?: string;
  metadata?: Record<string, string> | null;
  customer_email?: string | null;
  client_reference_id?: string | null;
};

async function stripeForm(
  path: string,
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("Card payments are not connected");
  const body = new URLSearchParams(params);
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = (await res.json()) as Record<string, unknown> & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message || `Stripe error ${res.status}`);
  }
  return json;
}

async function stripeGet(path: string): Promise<Record<string, unknown>> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("Card payments are not connected");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = (await res.json()) as Record<string, unknown> & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json.error?.message || `Stripe error ${res.status}`);
  }
  return json;
}

export async function createStripeCheckout(input: {
  userId: string;
  plan: Exclude<PlanId, "trial">;
  email: string;
  name: string;
  origin: string;
}): Promise<{ id: string; url: string }> {
  const details = PLAN_DETAILS[input.plan];
  const origin = input.origin.replace(/\/$/, "");
  const session = (await stripeForm("checkout/sessions", {
    mode: "subscription",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(details.price * 100),
    "line_items[0][price_data][product_data][name]": `AdFuel.ai ${details.name} ${details.octane}`,
    "line_items[0][price_data][product_data][description]": `${details.credits} campaigns each month`,
    "line_items[0][price_data][recurring][interval]": "month",
    success_url: `${origin}/checkout?plan=${input.plan}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?plan=${input.plan}`,
    client_reference_id: input.userId,
    customer_email: input.email,
    "metadata[userId]": input.userId,
    "metadata[plan]": input.plan,
    "metadata[billingName]": input.name,
    "subscription_data[metadata][userId]": input.userId,
    "subscription_data[metadata][plan]": input.plan,
    allow_promotion_codes: "true",
  })) as unknown as StripeSession;

  if (!session.id || !session.url) throw new Error("Stripe did not return a checkout URL");
  return { id: session.id, url: session.url };
}

export async function retrieveStripeSession(sessionId: string): Promise<StripeSession> {
  if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
    throw new Error("Invalid checkout session");
  }
  return (await stripeGet(`checkout/sessions/${sessionId}`)) as unknown as StripeSession;
}

export function sessionIsPaid(session: StripeSession): boolean {
  return session.payment_status === "paid" || session.status === "complete";
}

export async function verifyStripeWebhook(
  rawBody: string,
  signatureHeader: string | null,
): Promise<{ type: string; data: { object: StripeSession } }> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (secret) {
    if (!signatureHeader) throw new Error("Missing Stripe signature");
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => {
        const [k, ...rest] = part.split("=");
        return [k, rest.join("=")];
      }),
    );
    const timestamp = parts.t;
    const v1 = parts.v1;
    if (!timestamp || !v1) throw new Error("Bad Stripe signature");
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${rawBody}`));
    const digest = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
    if (digest !== v1) throw new Error("Stripe signature mismatch");
    return JSON.parse(rawBody) as { type: string; data: { object: StripeSession } };
  }

  const parsed = JSON.parse(rawBody) as { type: string; data: { object: StripeSession } };
  if (parsed.type !== "checkout.session.completed" || !parsed.data?.object?.id) {
    throw new Error("Unsupported event");
  }
  const live = await retrieveStripeSession(parsed.data.object.id);
  return { type: parsed.type, data: { object: live } };
}

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Mexico",
  "India",
  "Brazil",
  "Other",
] as const;
