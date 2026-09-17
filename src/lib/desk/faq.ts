import { COMPETITOR_PRICES, PLAN_DETAILS, TRIAL_CREDITS, deskPriceAnswer } from "@/lib/ads/plans";

export type DeskMessage = { role: "user" | "assistant"; text: string };

export const STARTERS = [
  "Do you run the ads for me?",
  "How do I go live?",
  `What’s ${PLAN_DETAILS.regular.priceLabel} include?`,
  "How do I cancel?",
];

const FAQ: { keys: string[]; answer: string }[] = [
  {
    keys: [
      "run the ads",
      "run my ads",
      "manage my ads",
      "agency",
      "do it for me",
      "full service",
      "done for me",
      "media buyer",
      "you launch",
      "onboard me",
      "call me",
      "talk to a human",
      "speak to someone",
      "customer service",
      "support ticket",
      "email support",
    ],
    answer:
      "No. AdFuel.ai is self-serve — we don’t run ads, hop on calls, or act like an agency. You paste a product in Studio, get a pack and the clicks to open a free ad account, then you go live. This desk answers product questions. Billing, cancel, and invoices are on Account.",
  },
  {
    keys: ["price", "pricing", "cost", "how much", "$12", "$29", "$79", "plan", "cheap", "undercut"],
    answer: deskPriceAnswer(),
  },
  {
    keys: ["cancel", "refund", "stop paying", "unsubscribe", "billing", "invoice", "receipt", "card"],
    answer:
      "Open Account for invoices and plan. Cancel from there — no email, no call. Charges are monthly until you cancel. We don’t do custom refunds by hand; if a charge looks wrong, the desk can point you at the invoice list.",
  },
  {
    keys: ["go live", "launch", "ads manager", "how do i start", "first campaign", "no ad account", "pixel"],
    answer:
      `Paste a product URL in Studio. Free is one watermarked draft. Pay ${PLAN_DETAILS.regular.priceLabel} for 3 live statics, copy, and a 7-day Launch plan. You open the ad account and press launch. We don’t run ads.`,
  },
  {
    keys: ["grok", "api key", "byok", "openai", "anthropic", "mcp", "connection", "xai", "draft", "hosted"],
    answer:
      "Live statics are a paid perk. The free pack is watermarked so AdFuel doesn’t spend on the API until you subscribe. Add your own xAI, OpenAI, or Anthropic key on Connections anytime — even on free. The tank still bills AdFuel. Keys are encrypted and never shown in full.",
  },
  {
    keys: ["octane", "score", "what is octane"],
    answer:
      "Octane Score is 1–100 predicted creative strength for a first paid run. Honest, not inflated. Every pack gets one. Share the public link from the pack if you want someone else to see it.",
  },
  {
    keys: ["color", "colours", "colors", "typography", "typeface", "brand look", "keep the same", "same font"],
    answer:
      "Ads keep the product’s colors and typography. Paste a URL or hex codes in Studio — we read the look and don’t restyle you into AdFuel orange. AdFuel itself stays Sora, navy, orange, and teal.",
  },
  {
    keys: ["affiliate", "adfuel.com", "adfuel.io", "who are you", "trademark"],
    answer:
      "AdFuel.ai is independent. Not affiliated with Adfuel.com, Adfuel.io, or any other Adfuel site or brand. The only AdFuel on .ai.",
  },
];

export function matchFaq(question: string): string | null {
  const q = question.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const item of FAQ) {
    let score = 0;
    for (const key of item.keys) {
      if (q.includes(key)) score += key.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { score, answer: item.answer };
  }
  return best && best.score >= 4 ? best.answer : null;
}

export const DESK_SYSTEM = `You are the AdFuel.ai desk — a self-serve receptionist. There is no human on the other end and no agency behind this.

Product facts:
- AdFuel.ai writes first-week ad packs: 3 on-brand statics, copy, and a 7-day Launch plan. The customer goes live. We do not.
- Independent. Not affiliated with Adfuel.com, Adfuel.io, or any other Adfuel brand. The only AdFuel on .ai.
- ${TRIAL_CREDITS} watermarked draft pack (no API). Then Regular ${PLAN_DETAILS.regular.priceLabel}/mo (${PLAN_DETAILS.regular.credits} packs), Plus ${PLAN_DETAILS.plus.priceLabel}/mo (${PLAN_DETAILS.plus.credits} packs + story size), Premium ${PLAN_DETAILS.premium.priceLabel}/mo (${PLAN_DETAILS.premium.credits} packs).
- Undercuts AdCreative ($${COMPETITOR_PRICES.adCreative}), Predis ($${COMPETITOR_PRICES.predis}), Pencil ($${COMPETITOR_PRICES.pencil}).
- Studio generates the pack. Launch tab has budget, audience, and the clicks to go live. Ads keep the product’s colors and type.
- Account: invoices, plan, cancel. Checkout: pay. Connections: add your own key (xAI / OpenAI / Anthropic) on any plan; live statics only after they pay. Optional MCP.
- Free / no key → watermarked draft. Paid + no BYOK → live statics. The tank bills AdFuel either way. No URL-to-video.
- We do not run ads, manage budgets, book calls, or offer done-for-you service.
- Product chrome is Sora on black-navy #050B14, orange #F97316, peach #FB8A3C, teal #26DBE2. Generated ads keep the source product’s look.

Rules:
- Short. Direct. No emoji. No filler.
- If they want a human, an agency, or “just run it for me”, say no and point at Studio + Launch.
- Point to in-app routes by name: Studio, Pricing, Checkout, Connections, Account.
- If you don’t know a billing exception, say so and point at Account. Never invent a refund policy beyond cancel-anytime monthly.
- Max ~80 words.`;
