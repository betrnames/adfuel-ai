export const ENGINES = ["regular", "plus", "premium"] as const;
export type Engine = (typeof ENGINES)[number];

export const PLANS = ["trial", "regular", "plus", "premium"] as const;
export type PlanId = (typeof PLANS)[number];

export const PLATFORMS = ["meta", "google", "tiktok", "linkedin", "x"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const GOALS = ["sales", "leads", "awareness"] as const;
export type Goal = (typeof GOALS)[number];

export const TONES = ["bold", "premium", "friendly", "urgent"] as const;
export type Tone = (typeof TONES)[number];

export type Plan = {
  id: PlanId;
  octane: string;
  name: string;
  tagline: string;
  price: number;
  priceLabel: string;
  credits: number;
  maxEngine: Engine;
  features: string[];
  cta: string;
};

export const PLAN_DETAILS: Record<Exclude<PlanId, "trial">, Plan> = {
  regular: {
    id: "regular",
    octane: "87",
    name: "Regular",
    tagline: "3 live statics and a 7-day Launch plan.",
    price: 12,
    priceLabel: "$12",
    credits: 10,
    maxEngine: "regular",
    features: [
      "10 first-week packs (30 statics)",
      "3 on-brand 1:1 ads per pack",
      "Copy + 7-day Launch clicks",
      "Octane Score on every pack",
      "Facebook, Google, TikTok, LinkedIn, X",
    ],
    cta: "Pay Regular — $12",
  },
  plus: {
    id: "plus",
    octane: "91",
    name: "Plus",
    tagline: "More packs, plus a story static.",
    price: 29,
    priceLabel: "$29",
    credits: 30,
    maxEngine: "plus",
    features: [
      "30 first-week packs (120 statics)",
      "Everything in Regular",
      "Extra 9:16 story static per pack",
      "6 copy variants per pack",
    ],
    cta: "Pay Plus — $29",
  },
  premium: {
    id: "premium",
    octane: "93",
    name: "Premium",
    tagline: "Volume for weekly tests.",
    price: 79,
    priceLabel: "$79",
    credits: 80,
    maxEngine: "premium",
    features: [
      "80 first-week packs (400 statics)",
      "Everything in Plus",
      "Extra story variants per pack",
      "Audience and placement notes",
    ],
    cta: "Pay Premium — $79",
  },
};

/** One credit = one pack. Regular packs ship 3 feed statics. */
export const STATICS_PER_PACK: Record<Engine, number> = {
  regular: 3,
  plus: 4,
  premium: 5,
};

export const TRIAL_CREDITS = 1;

export const COMPETITOR_PRICES = {
  adCreative: 39,
  predis: 19,
  pencil: 14,
} as const;

export const CREDITS_EMPTY_ERROR = `Your free draft pack is used. Pay ${PLAN_DETAILS.regular.priceLabel} for 3 live statics and the 7-day Launch plan, or add your own key.`;

export function trialKitLine(): string {
  return `${TRIAL_CREDITS} free watermarked draft`;
}

export function regularOfferLine(): string {
  const regular = PLAN_DETAILS.regular;
  return `${regular.priceLabel} for ${regular.credits} first-week packs (${regular.credits * STATICS_PER_PACK.regular} statics)`;
}

export function competitorLine(): string {
  return `AdCreative starts at $${COMPETITOR_PRICES.adCreative}. Predis at $${COMPETITOR_PRICES.predis}. Pencil at $${COMPETITOR_PRICES.pencil}. Regular is ${PLAN_DETAILS.regular.priceLabel} for live statics plus the 7-day clicks.`;
}

export function deskPriceAnswer(): string {
  const regular = PLAN_DETAILS.regular;
  const plus = PLAN_DETAILS.plus;
  const premium = PLAN_DETAILS.premium;
  return `${TRIAL_CREDITS} watermarked draft pack is free — no API spend. Then Regular is ${regular.priceLabel}/mo for ${regular.credits} packs (${regular.credits * STATICS_PER_PACK.regular} statics) with a 7-day Launch plan. Plus is ${plus.priceLabel}/mo for ${plus.credits} packs plus a story size. Premium is ${premium.priceLabel}/mo for ${premium.credits} packs. That’s under AdCreative ($${COMPETITOR_PRICES.adCreative}). We don’t run the ads. Pay on Checkout.`;
}

export const ENGINE_COST: Record<Engine, number> = {
  regular: 1,
  plus: 1,
  premium: 1,
};

export const ENGINE_LABEL: Record<Engine, string> = {
  regular: "Regular 87 · First week",
  plus: "Plus 91 · Story",
  premium: "Premium 93 · Volume",
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  meta: "Meta",
  google: "Google",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
};

export const GOAL_LABEL: Record<Goal, string> = {
  sales: "Sales",
  leads: "Leads",
  awareness: "Awareness",
};

export const TONE_LABEL: Record<Tone, string> = {
  bold: "Bold",
  premium: "Premium",
  friendly: "Friendly",
  urgent: "Urgent",
};

export function planRank(plan: PlanId): number {
  if (plan === "premium") return 3;
  if (plan === "plus") return 2;
  if (plan === "regular") return 1;
  return 0;
}

export function engineRank(engine: Engine): number {
  if (engine === "premium") return 3;
  if (engine === "plus") return 2;
  return 1;
}

export function maxEngineForPlan(plan: PlanId): Engine {
  if (plan === "premium") return "premium";
  if (plan === "plus") return "plus";
  return "regular";
}

export function engineForCredits(plan: PlanId, credits: number): Engine | null {
  const preferred = maxEngineForPlan(plan);
  if (credits >= ENGINE_COST[preferred]) return preferred;
  if (credits >= ENGINE_COST.regular) return "regular";
  return null;
}

export function canUseEngine(plan: PlanId, engine: Engine): boolean {
  return engineRank(engine) <= engineRank(maxEngineForPlan(plan));
}

export function isPaidPlan(plan: string): plan is Exclude<PlanId, "trial"> {
  return plan === "regular" || plan === "plus" || plan === "premium";
}

export function parseEngine(value: string): Engine | null {
  return ENGINES.includes(value as Engine) ? (value as Engine) : null;
}

export function parsePlan(value: string): Exclude<PlanId, "trial"> | null {
  return isPaidPlan(value) ? value : null;
}
