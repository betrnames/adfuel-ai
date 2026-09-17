import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/lib/waitlist-server";

export function WaitlistForm({ id = "notify" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"new" | "already" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await joinWaitlist({ data: { email, website, consent } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(result.already ? "already" : "new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the list");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div id={id} className="rounded-xl border border-primary/30 bg-primary/10 p-5">
        <p className="text-sm font-medium">
          {done === "already" ? "You’re already on the list." : "You’re on the list."}
        </p>
        <p className="mt-2 text-sm text-muted">We’ll email when Studio is live. No other mail.</p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <div>
        <label htmlFor="waitlist-email" className="text-xs font-medium uppercase tracking-wide text-muted">
          Email
        </label>
        <Input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-primary"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Email me when AdFuel is live. I agree to the{" "}
          <Link to="/legal" hash="privacy" className="text-fg underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" disabled={busy} className="w-full sm:w-auto">
        {busy ? "Joining…" : "Notify me"}
      </Button>
    </form>
  );
}
