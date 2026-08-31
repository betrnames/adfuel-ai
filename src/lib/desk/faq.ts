export type DeskMessage = { role: "user" | "assistant"; text: string };

export const STARTERS = [
  "Do you run the ads for me?",
  "How do I go live?",
  "What’s $12 include?",
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
    answer:
      "Three campaigns are free — draft kits, no hosted AI on AdFuel’s dime. Then Regular is $12/mo for 50 AI campaigns, Plus is $29/mo for 120 with image ads, Premium is $79/mo for 400 with story sizes and targeting. That’s under AdCreative ($39), Predis ($19), and Pencil ($14). Pay on Checkout. Receipts live on Account.",
  },
  {
    keys: ["cancel", "refund", "stop paying", "unsubscribe", "billing", "invoice", "receipt", "card"],
    answer:
      "Open Account for invoices and plan. Cancel from there — no email, no call. Charges are monthly until you cancel. We don’t do custom refunds by hand; if a charge looks wrong, the desk can point you at the invoice list.",
  },
  {
    keys: ["go live", "launch", "ads manager", "how do i start", "first campaign", "no ad account", "pixel"],
    answer:
      "You don’t need Ads Manager, a pixel, or an agency first. 1) Sign in. 2) Paste a site or one-line offer in Studio. 3) Open the Launch tab — budget, audience, and the exact clicks. 4) Open the platform, add a card, paste the pack. Three free, then $12/mo.",
  },
  {
    keys: ["grok", "api key", "byok", "openai", "anthropic", "mcp", "connection", "xai"],
    answer:
      "Hosted AI is a paid perk. Free kits use the draft engine so AdFuel doesn’t spend on the API until you subscribe. Add your own xAI, OpenAI, or Anthropic key on Connections anytime — even on free. The tank still bills AdFuel. Keys are encrypted and never shown in full.",
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
- AdFuel.ai writes first ad campaigns for people with no Ads Manager, no pixel, no agency.
- Independent. Not affiliated with Adfuel.com, Adfuel.io, or any other Adfuel brand. The only AdFuel on .ai.
- Three free draft kits (no hosted AI). Then Regular $12/mo (50, hosted AI), Plus $29/mo (120, image ads), Premium $79/mo (400, stories + targeting).
- Undercuts AdCreative ($39), Predis ($19), Pencil ($14).
- Studio generates the pack. Launch tab has budget, audience, and the clicks to go live. Ads keep the product’s colors and type.
- Account: invoices, plan, cancel. Checkout: pay. Connections: add your own key (xAI / OpenAI / Anthropic) on any plan; hosted AI only after they pay. Optional MCP.
- Free / no key → draft engine. Paid + no BYOK → hosted AI. The tank bills AdFuel either way.
- We do not run ads, manage budgets, book calls, or offer done-for-you service.
- Product chrome is Sora on black-navy #050B14, orange #F97316, peach #FB8A3C, teal #26DBE2. Generated ads keep the source product’s look.

Rules:
- Short. Direct. No emoji. No filler.
- If they want a human, an agency, or “just run it for me”, say no and point at Studio + Launch.
- Point to in-app routes by name: Studio, Pricing, Checkout, Connections, Account.
- If you don’t know a billing exception, say so and point at Account. Never invent a refund policy beyond cancel-anytime monthly.
- Max ~80 words.`;
