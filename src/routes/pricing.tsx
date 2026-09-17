import { createFileRoute } from "@tanstack/react-router";
import { PricingGrid } from "@/components/pricing-grid";
import { COMPETITOR_PRICES, PLAN_DETAILS, TRIAL_CREDITS, competitorLine } from "@/lib/ads/plans";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

const regular = PLAN_DETAILS.regular;

const faqs = [
  {
    q: "Do I need Ads Manager or an agency first?",
    a: "No. Paste a product URL. Paid packs include 3 live statics, copy, and a 7-day Launch plan with the exact clicks. You press launch.",
  },
  {
    q: "What am I paying for?",
    a: `The generator. ${TRIAL_CREDITS} watermarked draft is free. Regular is ${regular.priceLabel}/mo for ${regular.credits} first-week packs (3 live statics + copy + 7-day Launch each). Plus adds a story size. Premium is volume.`,
  },
  {
    q: "Why is it cheaper than the other ad AIs?",
    a: `AdCreative starts at $${COMPETITOR_PRICES.adCreative}. Predis Core is $${COMPETITOR_PRICES.predis}. Pencil Core is $${COMPETITOR_PRICES.pencil}. Regular is ${regular.priceLabel} for ${regular.credits} packs of live statics plus the 7-day clicks. You pay for the files, not an agency retainer.`,
  },
  {
    q: "Does this use AI / my API key?",
    a: "The free pack is watermarked — no API spend until you pay. Live statics are included on paid plans. Add your own xAI, OpenAI, or Anthropic key on Connections anytime (even free). Credits bill AdFuel either way.",
  },
  {
    q: "How do I pay?",
    a: "Open checkout, enter billing details, and pay. Cards go through Stripe when it’s connected. Receipts and invoices live on your Account page.",
  },
  {
    q: "Can I share a pack?",
    a: "Yes. Every pack gets a public link with the score. That’s the loop — send a banger, they make their own.",
  },
  {
    q: "Can I talk to a human?",
    a: "No. AdFuel is self-serve on purpose. The desk in the corner answers product questions. Cancel and invoices are on Account. We don’t run ads or hop on calls.",
  },
  {
    q: "What do I paste in?",
    a: "A product URL, or one sentence with product, price, and who it’s for. AdFuel writes 3 statics, copy, and the 7-day Launch plan.",
  },
];

function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Pricing</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
        {TRIAL_CREDITS} free. Then {regular.priceLabel}.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        {competitorLine()}
      </p>
      <div className="mt-10">
        <PricingGrid />
      </div>
      <section className="mt-16 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
        <dl className="mt-6 space-y-5">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt className="text-sm font-medium">{item.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
