import { createFileRoute, Link } from "@tanstack/react-router";
import { PLAN_DETAILS, STATICS_PER_PACK, TRIAL_CREDITS, competitorLine } from "@/lib/ads/plans";

export const Route = createFileRoute("/faq")({ component: FaqPage });

const regular = PLAN_DETAILS.regular;

const ITEMS: { q: string; a: string }[] = [
  {
    q: "What is AdFuel.ai?",
    a: "A self-serve first-week ad pack. Paste a product URL. Get 3 on-brand statics, copy, and a 7-day Launch plan. You go live. We don’t run ads.",
  },
  {
    q: "Is it live?",
    a: "Not yet. This site takes emails so we can tell you when Studio opens. No cards, no ad generation on this public site.",
  },
  {
    q: "How much will it cost?",
    a: `Regular is ${regular.priceLabel}/mo for ${regular.credits} first-week packs (${regular.credits * STATICS_PER_PACK.regular} statics). ${competitorLine()}`,
  },
  {
    q: "Do you run my ads?",
    a: "No. No retainers, no hopping on calls, no Ads Manager login. You paste the pack and press launch.",
  },
  {
    q: "Do I need Ads Manager first?",
    a: "No. The Launch plan is the clicks to open a free account, add a card, and publish. You still press the button.",
  },
  {
    q: "What do you do with my email?",
    a: "One list: notify you when AdFuel is live. We don’t sell it. Unsubscribe when we mail. See Privacy.",
  },
  {
    q: "Is this affiliated with other Adfuel brands?",
    a: "No. Independent. The only AdFuel on .ai. Not Adfuel.com or Adfuel.io.",
  },
  {
    q: "Can I talk to a human?",
    a: "The desk in the corner answers product questions. There is no support inbox for the waitlist.",
  },
  {
    q: `What’s included in the free draft?`,
    a: `${TRIAL_CREDITS} watermarked draft pack when Studio opens. Live statics after ${regular.priceLabel} or your own API key.`,
  },
];

function FaqPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">FAQ</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Questions.</h1>
      <p className="mt-3 text-sm text-muted">
        Short answers.{" "}
        <Link to="/" hash="notify" className="text-fg underline-offset-4 hover:underline">
          Get notified
        </Link>{" "}
        when we open.
      </p>
      <dl className="mt-10 space-y-6">
        {ITEMS.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-medium">{item.q}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
