import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal")({ component: LegalPage });

function LegalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Legal</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Terms and privacy.</h1>
      <p className="mt-3 text-sm text-muted">
        AdFuel.ai is a product of BetrNames. These pages cover the waitlist now and Studio when it opens. Not legal
        advice. Last updated 16 September 2026.
      </p>

      <section id="terms" className="mt-12 scroll-mt-28 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Terms of Service</h2>
        <p>
          By using adfuel.ai you agree to these terms. If you join the waitlist, you ask us to email you once when
          Studio is live. You may ignore or unsubscribe from that mail.
        </p>
        <p>
          When Studio opens, AdFuel provides generated ad copy, static images, and a 7-day launch checklist. You
          remain solely responsible for ads you publish, claims you make, targeting, spend, and platform rules (Meta,
          Google, TikTok, LinkedIn, X). We do not run ads, manage budgets, or act as your agency.
        </p>
        <p>
          Generated output can be wrong, generic, or unlike your real product. Review it before you spend. Paid plans
          and API keys, when offered, are billed as described on Pricing. We may refuse or suspend abuse (scraping,
          resale of the generator, attacks on the service).
        </p>
        <p>
          The site is provided as-is. We are not liable for lost ad spend, lost profits, or platform bans. California
          law, excluding conflict rules. Independent product — not affiliated with Adfuel.com, Adfuel.io, or any other
          Adfuel brand.
        </p>
        <p>Contact: hello@adfuel.ai</p>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-28 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Privacy Policy</h2>
        <p>
          We collect your email if you join the waitlist, plus a one-way hash of your network address to stop spam.
          We use that email only to notify you that AdFuel is live. We do not sell the list. We do not run ads
          trackers on this site.
        </p>
        <p>
          When you later create an account we will store account data, generated packs, and (if you add one) an
          encrypted API key. Payment data is handled by Stripe; we store plan, credits, and invoice metadata, not
          full card numbers.
        </p>
        <p>
          Cookies: essential only (session if you sign in, and this consent choice in local storage). No advertising
          cookies. You can ask us to delete a waitlist email at hello@adfuel.ai.
        </p>
        <p>
          We use infrastructure processors (hosting, database, email, and — when Studio is live — the AI provider that
          writes copy and images). They see what they need to run the feature you asked for.
        </p>
        <p>Contact: hello@adfuel.ai</p>
      </section>
    </main>
  );
}
