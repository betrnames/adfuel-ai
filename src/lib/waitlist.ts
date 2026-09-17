/** Production is waitlist-only unless VITE_ADFUEL_WAITLIST=false. Local dev keeps Studio. */
export function waitlistPublic(): boolean {
  const env =
    typeof import.meta !== "undefined"
      ? (import.meta as { env?: { VITE_ADFUEL_WAITLIST?: string; PROD?: boolean } }).env
      : undefined;
  const explicit = env?.VITE_ADFUEL_WAITLIST;
  if (explicit === "false") return false;
  if (explicit === "true") return true;
  return Boolean(env?.PROD);
}

export function normalizeWaitlistEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (email.length < 6) return null;
  return email;
}
