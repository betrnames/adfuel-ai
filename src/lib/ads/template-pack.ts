import type { Engine, Platform } from "./plans";
import type { AdPackContent } from "./types";
import type { BrandLook } from "./brand";
import { brandImageHint } from "./brand";

const PLATFORM_VOICE: Record<Platform, { place: string; cta: string }> = {
  meta: { place: "Facebook and Instagram feed", cta: "Shop now" },
  tiktok: { place: "TikTok For You", cta: "Shop now" },
  google: { place: "Google Search", cta: "Get started" },
  linkedin: { place: "LinkedIn feed", cta: "Book a demo" },
  x: { place: "X feed", cta: "Learn more" },
};

function firstSentence(prompt: string): string {
  return prompt.split(/[\n.|]/)[0]?.trim().slice(0, 90) || prompt.slice(0, 90);
}

export function writeDraftPack(input: {
  prompt: string;
  platform: Platform;
  productName: string;
  engine: Engine;
  mcpContext?: string;
  brand?: BrandLook | null;
}): AdPackContent {
  const { productName, platform, prompt, engine } = input;
  const voice = PLATFORM_VOICE[platform];
  const offer = firstSentence(prompt);
  const brandNote = input.mcpContext?.trim()
    ? " Brand facts from a connected MCP server were mixed in."
    : "";

  const headlines =
    engine === "regular"
      ? [`${productName} — start this week`, offer.slice(0, 40), `The first ${productName} run`]
      : [
          `${productName} for people who are done waiting`,
          offer.slice(0, 40),
          `Try ${productName} this week`,
          `Stop guessing. Run ${productName}.`,
          `${productName}. First campaign, real offer.`,
          `Go live with ${productName}`,
        ];

  const primary =
    engine === "regular"
      ? [
          `${offer} Built for a first paid run, not an agency deck. Put this in front of people who already want it.`,
          `No pixel. No Ads Manager experience required. ${productName} is the offer. ${voice.place} is the place.`,
        ]
      : [
          `${offer} This is the first campaign version — specific, priced, and ready to paste.`,
          `${productName} is for the person who already wants this, not a cold audience of millions. Start small on ${voice.place}.`,
          `Paste this, pick a daily cap, and watch seven days. Then keep the line that sold.`,
        ];

  return {
    productName,
    headlines: headlines.slice(0, engine === "premium" ? 6 : engine === "plus" ? 6 : 3),
    primaryTexts: primary.slice(0, engine === "regular" ? 2 : 3),
    descriptions: [
      `${productName} — first campaign kit.`,
      `A starter test on ${voice.place}.`,
    ],
    ctas: [voice.cta, "Learn more", "Get started"],
    angles: [
      {
        name: "First-run offer",
        hook: offer,
        why: "Leads with the product as it is, not a rebrand.",
      },
      {
        name: "From zero",
        hook: `You don’t need an ad account yet. ${productName} still needs a first campaign.`,
        why: "Matches the advertiser who has never opened Ads Manager.",
      },
      {
        name: "Small test",
        hook: `Run ${productName} for a week at a starter budget and keep the winner.`,
        why: "Keeps spend honest for a first-timer.",
      },
    ],
    octane: {
      score: input.mcpContext ? 68 : 62,
      rationale: `Draft engine wrote this from the brief without a live model.${brandNote} Add AI or your own key for a tighter score.`,
      lifts: ["Name the buyer in the first line", "Put the price in the primary text", "Cut any line a stranger wouldn’t say"],
    },
    targeting: engine === "premium" ? { audiences: [`People searching for ${productName}`], placements: [voice.place] } : null,
    videoScripts: null,
    imagePrompt: `Photoreal product hero of ${productName}, clean studio light, short on-image line: ${headlines[0]?.slice(0, 28) ?? productName}. ${brandImageHint(input.brand ?? null)}`,
    images: [],
    launch: {
      dailyBudget: platform === "google" ? "$15" : "$20",
      duration: "7 days",
      objective: "Sales / conversions",
      audience: `People already looking for ${productName}, in the same country you sell in.`,
      placements: voice.place,
      keywords: platform === "google" ? [productName, `${productName} buy`, offer.slice(0, 24)] : [],
      success: "A click that lands on the offer and a purchase, or a clear reason nobody bought.",
    },
    brand: input.brand ?? null,
  };
}
