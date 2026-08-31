import type { Platform } from "./plans";

export type LaunchStep = {
  n: number;
  title: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

export type LaunchFields = {
  dailyBudget: string;
  duration: string;
  objective: string;
  audience: string;
  placements: string;
  keywords: string[];
  success: string;
};

export type LaunchPlan = LaunchFields & {
  steps: LaunchStep[];
};

export const PLATFORM_WHERE: Record<Platform, string> = {
  meta: "Facebook & Instagram",
  google: "Google Search",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
};

export const PLATFORM_ADS: Record<
  Platform,
  { name: string; href: string; label: string }
> = {
  meta: {
    name: "Meta Ads",
    href: "https://adsmanager.facebook.com",
    label: "Open Meta Ads",
  },
  google: {
    name: "Google Ads",
    href: "https://ads.google.com",
    label: "Open Google Ads",
  },
  tiktok: {
    name: "TikTok Ads",
    href: "https://ads.tiktok.com",
    label: "Open TikTok Ads",
  },
  linkedin: {
    name: "LinkedIn Campaign Manager",
    href: "https://www.linkedin.com/campaignmanager",
    label: "Open Campaign Manager",
  },
  x: {
    name: "X Ads",
    href: "https://ads.x.com",
    label: "Open X Ads",
  },
};

const DEFAULT_FIELDS: Record<Platform, LaunchFields> = {
  meta: {
    dailyBudget: "$20 / day",
    duration: "7 days",
    objective: "Traffic to the site",
    audience: "People already searching for this kind of product, plus lookalikes of buyers.",
    placements: "Facebook and Instagram feed. Skip Stories until the feed ad works.",
    keywords: [],
    success: "If you get clicks under $2 and the page loads, let it run the week. Kill it only if spend hits $80 with no clicks.",
  },
  google: {
    dailyBudget: "$20 / day",
    duration: "7 days",
    objective: "Search clicks from people already looking",
    audience: "Searchers using the product-category keywords in this pack.",
    placements: "Google Search. Leave Display off for the first week.",
    keywords: [],
    success: "Watch cost per click. Under $3 with real visits is a win. Pause any keyword that spends $20 with zero clicks.",
  },
  tiktok: {
    dailyBudget: "$20 / day",
    duration: "7 days",
    objective: "Traffic or views, then conversions once the hook works",
    audience: "People who watch similar product videos. Start broad, then tighten.",
    placements: "TikTok For You feed. One ad, one hook.",
    keywords: [],
    success: "If 3-second views are healthy but no clicks, rewrite the first line. Don’t raise budget until a hook sticks.",
  },
  linkedin: {
    dailyBudget: "$40 / day",
    duration: "7 days",
    objective: "Leads or site visits from the right job titles",
    audience: "Job titles and company sizes that match the buyer, in the countries you sell.",
    placements: "LinkedIn feed sponsored content.",
    keywords: [],
    success: "Clicks will cost more here. A handful of on-title visits in a week is the goal, not cheap traffic.",
  },
  x: {
    dailyBudget: "$15 / day",
    duration: "7 days",
    objective: "Website traffic from a single sharp post",
    audience: "People following adjacent products, plus keyword targeting on the offer.",
    placements: "X timeline. One ad group.",
    keywords: [],
    success: "If the post gets engagement but no clicks, the headline is the problem. Iterate copy before budget.",
  },
};

function stepsFor(platform: Platform): LaunchStep[] {
  const ads = PLATFORM_ADS[platform];
  if (platform === "meta") {
    return [
      {
        n: 1,
        title: "Open a free Meta Ads account",
        detail:
          "Go to Ads Manager and sign in with Facebook. If it asks to create a Business, say yes — it’s free and you don’t need a page yet.",
        href: ads.href,
        hrefLabel: ads.label,
      },
      {
        n: 2,
        title: "Add a card under Billing",
        detail: "A debit card is enough. Meta holds a small authorization, then you only pay for what runs.",
      },
      {
        n: 3,
        title: "Create → Sales or Traffic",
        detail:
          "Click Create. Pick Sales if you sell something, Traffic if you just want visits. One campaign. Don’t turn on every placement.",
      },
      {
        n: 4,
        title: "Paste the audience from this pack",
        detail:
          "When it asks who should see the ad, use the audience below. Leave Advantage+ on if you’re unsure — defaults beat a blank targeting form.",
      },
      {
        n: 5,
        title: "Paste the copy, set the budget, publish",
        detail:
          "Use the headline and primary text from the Copy tab. Set the daily budget from this pack. Publish. You can edit tomorrow.",
      },
    ];
  }
  if (platform === "google") {
    return [
      {
        n: 1,
        title: "Open Google Ads",
        detail:
          "Start a new account if you don’t have one. If Google tries to auto-build a campaign, look for “Switch to Expert Mode” or “create your own.”",
        href: ads.href,
        hrefLabel: ads.label,
      },
      {
        n: 2,
        title: "Add billing",
        detail: "A card is fine. You can set an account budget cap so a first test can’t run away.",
      },
      {
        n: 3,
        title: "New Search campaign",
        detail:
          "Choose Search, not Display, for week one. Point it at the product URL from your brief.",
      },
      {
        n: 4,
        title: "Paste headlines and descriptions",
        detail:
          "Google wants multiple headlines. Drop in every headline from the Copy tab, then the descriptions.",
      },
      {
        n: 5,
        title: "Add keywords, set budget, launch",
        detail:
          "Use the keywords in this pack as phrase match. Set the daily budget. Launch. Check Search terms after two days.",
      },
    ];
  }
  if (platform === "tiktok") {
    return [
      {
        n: 1,
        title: "Open TikTok Ads",
        detail: "Register with email or your TikTok login. Create a Business Center if prompted — it’s free.",
        href: ads.href,
        hrefLabel: ads.label,
      },
      {
        n: 2,
        title: "Add a payment method",
        detail: "Billing lives under Finance. A card is enough for a first auction campaign.",
      },
      {
        n: 3,
        title: "Create an Auction campaign",
        detail: "Pick Traffic (or Conversions if you already have a pixel). One ad group. One creative.",
      },
      {
        n: 4,
        title: "Set the audience",
        detail: "Use the audience below. Start broad. TikTok finds the viewers — your job is the hook.",
      },
      {
        n: 5,
        title: "Paste the ad text, set budget, publish",
        detail:
          "Primary text from the Copy tab goes on the ad. Set the daily budget. Publish and watch the first three seconds.",
      },
    ];
  }
  if (platform === "linkedin") {
    return [
      {
        n: 1,
        title: "Open Campaign Manager",
        detail: "Sign in with LinkedIn. Create an ad account if it asks — you don’t need a company page to test, but it helps.",
        href: ads.href,
        hrefLabel: ads.label,
      },
      {
        n: 2,
        title: "Add billing",
        detail: "Set a campaign group budget so a first run can’t overspend.",
      },
      {
        n: 3,
        title: "Sponsored Content",
        detail: "Create a campaign group, then a Sponsored Content campaign aimed at website visits or leads.",
      },
      {
        n: 4,
        title: "Build the audience from job titles",
        detail: "Use the audience in this pack. Job title + company size beats interest targeting on LinkedIn.",
      },
      {
        n: 5,
        title: "Paste intro + headline, launch",
        detail: "Intro text is primary text. Headline is the headline. Set the daily budget and launch.",
      },
    ];
  }
  return [
    {
      n: 1,
      title: "Open X Ads",
      detail: "Create an ads account with the same login you use on X. You don’t need a huge following to run traffic ads.",
      href: ads.href,
      hrefLabel: ads.label,
    },
    {
      n: 2,
      title: "Add a payment method",
      detail: "Billing is under your ads account settings. Set a cap if the UI offers one.",
    },
    {
      n: 3,
      title: "Website traffic campaign",
      detail: "Create a campaign. Choose Website traffic. One ad group is enough.",
    },
    {
      n: 4,
      title: "Target the audience below",
      detail: "Keyword and follower lookalikes beat a giant interest dump. Keep it tight.",
    },
    {
      n: 5,
      title: "Paste the post, set budget, launch",
      detail: "The first headline is the tweet. Primary text can sit under it. Set the daily budget and launch.",
    },
  ];
}

function asTrimmed(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

export function parseLaunchFields(raw: unknown): Partial<LaunchFields> | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const fields: Partial<LaunchFields> = {};
  if (typeof data.daily_budget === "string" || typeof data.dailyBudget === "string") {
    fields.dailyBudget = asTrimmed(data.daily_budget ?? data.dailyBudget, "");
  }
  if (typeof data.duration === "string") fields.duration = asTrimmed(data.duration, "");
  if (typeof data.objective === "string") fields.objective = asTrimmed(data.objective, "");
  if (typeof data.audience === "string") fields.audience = asTrimmed(data.audience, "");
  if (typeof data.placements === "string") fields.placements = asTrimmed(data.placements, "");
  if (typeof data.success === "string") fields.success = asTrimmed(data.success, "");
  const keywords = asKeywords(data.keywords);
  if (keywords.length) fields.keywords = keywords;
  return fields;
}

export function resolveLaunch(
  platform: Platform,
  stored?: Partial<LaunchFields> | null,
): LaunchPlan {
  const base = DEFAULT_FIELDS[platform];
  return {
    dailyBudget: stored?.dailyBudget || base.dailyBudget,
    duration: stored?.duration || base.duration,
    objective: stored?.objective || base.objective,
    audience: stored?.audience || base.audience,
    placements: stored?.placements || base.placements,
    keywords: stored?.keywords?.length ? stored.keywords : base.keywords,
    success: stored?.success || base.success,
    steps: stepsFor(platform),
  };
}

export function launchPlainText(plan: LaunchPlan, platform: Platform): string {
  const ads = PLATFORM_ADS[platform];
  const lines = [
    `LAUNCH · ${PLATFORM_WHERE[platform]}`,
    `Budget ${plan.dailyBudget} · ${plan.duration} · ${plan.objective}`,
    "",
    "WHO TO SHOW",
    plan.audience,
    "",
    "WHERE",
    plan.placements,
  ];
  if (plan.keywords.length) {
    lines.push("", "KEYWORDS", ...plan.keywords.map((k) => `• ${k}`));
  }
  lines.push("", "STEPS");
  for (const step of plan.steps) {
    lines.push(`${step.n}. ${step.title}`, `   ${step.detail}`);
    if (step.href) lines.push(`   ${step.href}`);
  }
  lines.push("", "WHAT GOOD LOOKS LIKE", plan.success, "", ads.href);
  return lines.join("\n");
}
