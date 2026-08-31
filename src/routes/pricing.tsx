import { createFileRoute } from "@tanstack/react-router";
import { PricingGrid } from "@/components/pricing-grid";
import { PLAN_DETAILS } from "@/lib/ads/plans";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

const regular = PLAN_DETAILS.regular;

const faqs = [
  {
    q: "Do I need Ads Manager or an agency first?",
    a: "No. AdFuel is the first tool. Every pack includes a launch playbook with the exact clicks to open a free ad account and go live.",
  },
  {
    q: "What am I paying for?",
    a: `The generator. Three draft kits are free so you can see the Octane Score and the launch steps — no hosted AI on us. Regular is ${regular.priceLabel}/mo for ${regular.credits} AI campaigns. Plus adds image ads. Premium fills the tank.`,
  },
  {
    q: "Why is it cheaper than the other ad AIs?",
    a: "AdCreative starts at $39. Predis Core is $19. Pencil Core is $14 for 50 gens. Regular is $12 for 50 campaigns and a launch playbook. You pay for the generator, not an agency retainer.",
  },
  {
    q: "Does this use AI / my API key?",
    a: "Free kits are drafts — no API spend until you pay. Hosted AI is included on paid plans. Add your own xAI, OpenAI, or Anthropic key on Connections anytime (even free). Credits bill AdFuel either way.",
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
    a: "A website or one sentence: product, price, who it’s for. AdFuel writes the campaign and the launch steps.",
  },
];

function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Pricing</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">
        Three free. Then {regular.priceLabel}.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Undercuts AdCreative ($39), Predis ($19), and Pencil ($14). Regular is {regular.priceLabel}/mo for{" "}
        {regular.credits} first campaigns.
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
