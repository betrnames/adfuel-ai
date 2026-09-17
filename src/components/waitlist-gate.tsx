import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { WaitlistForm } from "@/components/waitlist-form";
import { waitlistPublic } from "@/lib/waitlist";

export function WaitlistGate({ children }: { children: ReactNode }) {
  if (!waitlistPublic()) return <>{children}</>;
  return (
    <main className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Coming soon</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Studio isn’t open yet.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Leave your email. We’ll tell you when first-week packs are live. We don’t run ads, and we won’t sell the list.
      </p>
      <div className="mt-8">
        <WaitlistForm />
      </div>
      <p className="mt-6 text-sm text-muted">
        <Link to="/" className="text-fg underline-offset-4 hover:underline">
          Back home
        </Link>
      </p>
    </main>
  );
}
