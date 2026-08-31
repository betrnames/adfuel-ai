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
    tagline: "First campaigns, from scratch.",
    price: 12,
    priceLabel: "$12",
    credits: 50,
    maxEngine: "regular",
    features: [
      "50 campaigns each month",
      "Headlines, primary text, CTAs",
      "First-campaign launch playbook",
      "Octane Score on every pack",
      "Facebook, Google, TikTok, LinkedIn, X",
    ],
    cta: "Pay Regular — $12",
  },
  plus: {
    id: "plus",
    octane: "91",
    name: "Plus",
    tagline: "Copy plus scroll-stopping creatives.",
    price: 29,
    priceLabel: "$29",
    credits: 120,
    maxEngine: "plus",
    features: [
      "120 campaigns each month",
      "Everything in Regular",
      "AI image ads in feed size",
      "6 copy variants per pack",
    ],
    cta: "Pay Plus — $29",
  },
  premium: {
    id: "premium",
    octane: "93",
    name: "Premium",
    tagline: "The full tank. Campaign-ready.",
    price: 79,
    priceLabel: "$79",
    credits: 400,
    maxEngine: "premium",
    features: [
      "400 campaigns each month",
      "Everything in Plus",
      "Story creatives + video scripts",
      "Audience and placement targeting",
    ],
    cta: "Pay Premium — $79",
  },
};

export const TRIAL_CREDITS = 3;

export const ENGINE_COST: Record<Engine, number> = {
  regular: 1,
  plus: 4,
  premium: 8,
};

export const ENGINE_LABEL: Record<Engine, string> = {
  regular: "Regular 87 · Copy",
  plus: "Plus 91 · Creative",
  premium: "Premium 93 · Full tank",
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
