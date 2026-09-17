import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal")({ component: LegalPage });

function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Legal</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Terms, privacy, and policies.</h1>
      <p className="mt-3 text-sm text-muted">
        AdFuel.ai is an independent product. These pages cover the waitlist now and Studio when it opens. Not legal
        advice. Last updated 16 September 2026.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted">
        <a href="#terms" className="rounded-full border border-border px-3 py-1 hover:border-border-strong hover:text-fg">
          Terms of Service
        </a>
        <a href="#privacy" className="rounded-full border border-border px-3 py-1 hover:border-border-strong hover:text-fg">
          Privacy & Cookies
        </a>
        <a href="#refunds" className="rounded-full border border-border px-3 py-1 hover:border-border-strong hover:text-fg">
          Refunds & Cancel
        </a>
        <a href="#acceptable-use" className="rounded-full border border-border px-3 py-1 hover:border-border-strong hover:text-fg">
          Acceptable Use
        </a>
        <a href="#disclaimers" className="rounded-full border border-border px-3 py-1 hover:border-border-strong hover:text-fg">
          Disclaimers & DMCA
        </a>
      </nav>

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
          and API keys, when offered, are billed as described on Pricing and Checkout. We may refuse or suspend abuse
          (scraping, resale of the generator, attacks on the service).
        </p>
        <p>
          The site is provided as-is. We are not liable for lost ad spend, lost profits, or platform bans. California
          law, excluding conflict rules. Independent product — not affiliated with Adfuel.com, Adfuel.io, or any other
          Adfuel brand.
        </p>
        <p>Contact: hello@adfuel.ai</p>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-28 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Privacy Policy & Cookies</h2>
        <p>
          We collect your email if you join the waitlist, plus a one-way hash of your network address to stop spam.
          We use that email only to notify you that AdFuel is live. We do not sell or rent the list. We do not run ads
          trackers on this site.
        </p>
        <p>
          When you later create an account we store account data, generated packs, and (if you add one) an
          encrypted API key. Payment data is processed securely by Stripe; we store plan, credit balances, and invoice
          metadata, not full credit card numbers.
        </p>
        <p>
          Cookies: essential only (session tokens if you sign in, and your cookie consent preference in local storage).
          We do not use advertising or third-party behavioral tracking cookies.
        </p>
        <p>
          Sub-processors: We use trusted infrastructure providers to deliver the service: hosting and database
          infrastructure, Stripe for billing, transactional email for waitlist notifications, and upstream AI models
          (e.g., OpenAI, Anthropic, xAI) to generate ad copy and creatives. They only receive the data necessary to
          execute requested features.
        </p>
        <p>
          Your rights: You may request deletion of your waitlist email or account data at any time by contacting{" "}
          <a href="mailto:hello@adfuel.ai" className="text-fg underline-offset-4 hover:underline">
            hello@adfuel.ai
          </a>
          .
        </p>
      </section>

      <section id="refunds" className="mt-12 scroll-mt-28 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Refund & Cancellation Policy</h2>
        <p>
          Subscription billing: Paid plans (Regular, Plus, Premium) are billed in advance on a recurring monthly basis.
          Your subscription automatically renews each month unless cancelled before your next billing date.
        </p>
        <p>
          Cancel anytime: You can cancel your subscription at any time directly from your{" "}
          <a href="/account" className="text-fg underline-offset-4 hover:underline">
            Account
          </a>{" "}
          page with a single click. There are no cancellation fees, lock-in periods, or phone calls required. Upon
          cancellation, you retain access to your plan and remaining credits until the end of your current paid billing period.
        </p>
        <p>
          Digital goods & refund policy: Because AdFuel delivers instantaneous digital assets (ad copy, static creative
          files, and 7-day Launch plans) and incurs real-time compute/AI costs, payments are non-refundable once pack
          credits have been used or generated.
        </p>
        <p>
          Exceptions & billing errors: If you believe you were charged in error, experienced a duplicate billing transaction,
          or encountered a technical failure that prevented you from generating packs, please email{" "}
          <a href="mailto:hello@adfuel.ai" className="text-fg underline-offset-4 hover:underline">
            hello@adfuel.ai
          </a>{" "}
          within 7 days of the charge. We review every report in good faith and issue refunds when appropriate.
        </p>
        <p>
          European & UK statutory rights: If you are located in the EU or UK, you acknowledge and agree that by initiating
          digital generation or accessing your deliverables immediately upon purchase, you request immediate performance of
          the contract and waive your statutory 14-day cooling-off withdrawal right once service delivery has begun.
        </p>
      </section>

      <section id="acceptable-use" className="mt-12 scroll-mt-28 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Acceptable Use Policy</h2>
        <p>
          AdFuel is built to help legitimate founders, marketers, and creators launch initial ad campaigns. You agree to use
          our service only for lawful purposes and in accordance with these guidelines.
        </p>
        <p>Prohibited uses: You may not use AdFuel to generate ad copy, images, or campaigns that involve or promote:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Deceptive, fraudulent, counterfeit, or misleading products or claims.</li>
          <li>Hate speech, harassment, defamation, threats, or incitement to violence.</li>
          <li>Sexually explicit, pornographic, or adult content.</li>
          <li>Illegal drugs, regulated pharmaceuticals, weapons, explosives, or ammunition.</li>
          <li>Multi-level marketing, predatory financial schemes, get-rich-quick scams, or phishing.</li>
          <li>Malware, spyware, or malicious links.</li>
        </ul>
        <p>
          Intellectual property rights: You represent and warrant that you own or possess all necessary rights, licenses,
          and permissions for the URLs, brand names, product descriptions, and assets you input into AdFuel.
        </p>
        <p>
          Platform compliance: You are solely responsible for ensuring that all published ads comply with the advertising
          policies and terms of the platforms you use (including Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads, and X Ads).
        </p>
        <p>
          Service protection: You may not scrape, reverse engineer, resell, or exploit AdFuel’s generation endpoints or user
          interface without explicit written authorization. Accounts found violating these terms may be terminated immediately.
        </p>
      </section>

      <section id="disclaimers" className="mt-12 scroll-mt-28 space-y-3 text-sm leading-relaxed text-muted">
        <h2 className="text-xl font-semibold tracking-tight text-fg">Marketing Disclaimers & DMCA</h2>
        <p>
          <strong>No Earnings or Ad Performance Guarantee:</strong> AdFuel provides generative ad creative suggestions, copy
          frameworks, and estimated &ldquo;Octane Scores&rdquo; based on structural ad creative heuristics. We make no representations,
          warranties, or guarantees regarding return on ad spend (ROAS), click-through rates (CTR), conversion rates, sales, or
          campaign profitability. Ad performance depends entirely on your market, offer, pricing, audience targeting, and ad
          platform algorithms. You assume full financial risk for any ad budget spent.
        </p>
        <p>
          <strong>No Guarantee of Platform Approval:</strong> Third-party ad networks (Meta, Google, TikTok, LinkedIn, X)
          operate automated and human review processes with strict policies. AdFuel does not guarantee that generated ads will
          be approved or stay active on any ad network.
        </p>
        <p>
          <strong>DMCA Copyright Policy:</strong> We respect the intellectual property of others and respond to notices of
          alleged copyright infringement pursuant to the Digital Millennium Copyright Act (17 U.S.C. § 512). If you believe
          that any content hosted on AdFuel (including publicly shared packs at /p/*) infringes your copyright, please send a
          formal notice to{" "}
          <a href="mailto:hello@adfuel.ai" className="text-fg underline-offset-4 hover:underline">
            hello@adfuel.ai
          </a>{" "}
          containing:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the URL or material claimed to be infringing.</li>
          <li>Your contact information (name, address, telephone number, and email).</li>
          <li>
            A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its
            agent, or the law.
          </li>
          <li>
            A statement, made under penalty of perjury, that the information in the notification is accurate and that you are
            authorized to act on behalf of the owner.
          </li>
        </ul>
      </section>
    </main>
  );
}
