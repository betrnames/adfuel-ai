import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { normalizeWaitlistEmail } from "./waitlist";

const MAX_PER_IP_HOUR = 5;

function hashIp(ip: string): string {
  const salt = process.env.BETTER_AUTH_SECRET || process.env.XAI_API_KEY || "adfuel-waitlist";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40);
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((input: { email: string; website?: string; consent?: boolean }) => ({
    email: String(input.email ?? ""),
    website: String(input.website ?? "").trim(),
    consent: Boolean(input.consent),
  }))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, already: false };
    }
    if (!data.consent) {
      return { ok: false as const, error: "Agree to the privacy policy to join the list." };
    }
    const email = normalizeWaitlistEmail(data.email);
    if (!email) {
      return { ok: false as const, error: "Enter a valid email." };
    }

    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request?.headers.get("x-real-ip")?.trim() || "unknown";
    const ipHash = hashIp(ip);

    const sql = await getSql();
    const recent = await sql<{ n: number }>`
      select count(*)::int as n from waitlist
      where ip_hash = ${ipHash}
        and created_at > now() - interval '1 hour'`;
    if (Number(recent[0]?.n ?? 0) >= MAX_PER_IP_HOUR) {
      return { ok: false as const, error: "Too many tries from this network. Wait an hour." };
    }

    const existing = await sql<{ email: string }>`
      select email from waitlist where email = ${email} limit 1`;
    if (existing[0]) {
      return { ok: true as const, already: true };
    }

    await sql`
      insert into waitlist (email, ip_hash) values (${email}, ${ipHash})`;
    return { ok: true as const, already: false };
  });
