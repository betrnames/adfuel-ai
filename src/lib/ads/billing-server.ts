import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { PLAN_DETAILS, parsePlan, type PlanId } from "./plans";
import {
  createStripeCheckout,
  periodEndFromNow,
  retrieveStripeSession,
  sessionIsPaid,
  stripeConfigured,
  validateBilling,
  type PaymentRecord,
} from "./billing";
import type { Profile } from "./types";

async function readProfile(userId: string): Promise<Profile> {
  const sql = await getSql();
  const rows = await sql<{
    user_id: string;
    plan: string;
    credits: number;
    created_at: string;
  }>`select user_id, plan, credits, created_at from profiles where user_id = ${userId} limit 1`;
  const row = rows[0];
  return {
    userId: row?.user_id ?? userId,
    plan: row?.plan ?? "trial",
    credits: Number(row?.credits ?? 0),
    createdAt: row?.created_at ?? new Date().toISOString(),
  };
}

async function activatePaidPlan(input: {
  userId: string;
  plan: Exclude<PlanId, "trial">;
  amountCents: number;
  provider: "stripe" | "ledger";
  providerRef: string | null;
  billingEmail: string;
  billingName: string;
}): Promise<Profile> {
  const details = PLAN_DETAILS[input.plan];
  const sql = await getSql();

  if (input.providerRef) {
    const existing = await sql<{ id: number }>`
      select id from payments
      where provider = ${input.provider} and provider_ref = ${input.providerRef}
      limit 1`;
    if (existing[0]) return readProfile(input.userId);
  }

  await sql`insert into payments (
      user_id, plan, amount_cents, currency, status, provider, provider_ref, billing_email, billing_name
    ) values (
      ${input.userId},
      ${input.plan},
      ${input.amountCents},
      ${"usd"},
      ${"paid"},
      ${input.provider},
      ${input.providerRef},
      ${input.billingEmail},
      ${input.billingName}
    )`;

  await sql`insert into subscriptions (
      user_id, plan, amount_cents, status, provider, provider_ref, billing_email, billing_name, period_end
    ) values (
      ${input.userId},
      ${input.plan},
      ${input.amountCents},
      ${"active"},
      ${input.provider},
      ${input.providerRef},
      ${input.billingEmail},
      ${input.billingName},
      ${periodEndFromNow()}
    )`;

  await sql`insert into profiles (user_id, plan, credits)
    values (${input.userId}, ${input.plan}, ${details.credits})
    on conflict (user_id) do update
    set plan = excluded.plan, credits = excluded.credits, updated_at = now()`;

  return readProfile(input.userId);
}

export async function fulfillStripeSession(sessionId: string, expectedUserId?: string) {
  const session = await retrieveStripeSession(sessionId);
  if (!sessionIsPaid(session)) throw new Error("Payment is not complete");
  const userId = session.metadata?.userId ?? session.client_reference_id ?? "";
  const plan = parsePlan(session.metadata?.plan ?? "");
  if (!userId || !plan) throw new Error("Checkout session is missing plan data");
  if (expectedUserId && expectedUserId !== userId) throw new Error("This payment belongs to another account");
  const details = PLAN_DETAILS[plan];
  return activatePaidPlan({
    userId,
    plan,
    amountCents: details.price * 100,
    provider: "stripe",
    providerRef: session.id,
    billingEmail: session.customer_email ?? "",
    billingName: session.metadata?.billingName ?? "",
  });
}

export const getBillingConfig = createServerFn({ method: "GET" }).handler(async () => {
  return { processor: stripeConfigured() ? ("stripe" as const) : ("ledger" as const) };
});

export const listMyPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      plan: string;
      amount_cents: number;
      currency: string;
      status: string;
      provider: string;
      billing_email: string | null;
      created_at: string;
    }>`select id, plan, amount_cents, currency, status, provider, billing_email, created_at
       from payments
       where user_id = ${context.userId}
       order by created_at desc
       limit 24`;
    return rows.map(
      (row): PaymentRecord => ({
        id: Number(row.id),
        plan: row.plan,
        amountCents: Number(row.amount_cents),
        currency: row.currency,
        status: row.status,
        provider: row.provider,
        billingEmail: row.billing_email,
        createdAt: row.created_at,
      }),
    );
  });

export const startCheckout = createServerFn({ method: "POST" })
  .validator((input: { plan: string; name: string; email: string; country: string; origin: string }) => {
    const plan = parsePlan(input.plan);
    if (!plan) throw new Error("Pick a plan");
    const billing = validateBilling(input);
    const origin = input.origin.trim().slice(0, 200);
    if (!/^https?:\/\//i.test(origin)) throw new Error("Invalid checkout origin");
    return { plan, ...billing, origin };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const details = PLAN_DETAILS[data.plan];

    if (stripeConfigured()) {
      const session = await createStripeCheckout({
        userId: context.userId,
        plan: data.plan,
        email: data.email,
        name: data.name,
        origin: data.origin,
      });
      return { ok: true as const, processor: "stripe" as const, url: session.url };
    }

    const profile = await activatePaidPlan({
      userId: context.userId,
      plan: data.plan,
      amountCents: details.price * 100,
      provider: "ledger",
      providerRef: null,
      billingEmail: data.email,
      billingName: data.name,
    });
    return { ok: true as const, processor: "ledger" as const, profile };
  });

export const finalizeStripeCheckout = createServerFn({ method: "POST" })
  .validator((input: { sessionId: string }) => {
    const sessionId = input.sessionId.trim();
    if (!sessionId) throw new Error("Missing session");
    return { sessionId };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    return fulfillStripeSession(data.sessionId, context.userId);
  });
