import type { Engine, Platform } from "./plans";
import type { LlmProviderId } from "./connections";
import { PROVIDER_META } from "./connections";
import type { AdPackContent } from "./types";
import { parseLaunchFields } from "./launch";
import { parseBrand, type BrandLook } from "./brand";

const IMAGE_MODELS = ["grok-imagine-image-2.0", "grok-imagine-image"] as const;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown, max = 8): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asString(item))
    .filter(Boolean)
    .slice(0, max);
}

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 70;
  return Math.max(1, Math.min(100, Math.round(n)));
}

export function extractJson(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("The model did not return JSON");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

export function normalizePack(raw: Record<string, unknown>, productName: string): AdPackContent {
  const octaneRaw =
    raw.octane && typeof raw.octane === "object" ? (raw.octane as Record<string, unknown>) : {};
  const targetingRaw =
    raw.targeting && typeof raw.targeting === "object"
      ? (raw.targeting as Record<string, unknown>)
      : null;
  const videoRaw = Array.isArray(raw.video_scripts) ? raw.video_scripts : null;
  const anglesRaw = Array.isArray(raw.angles) ? raw.angles : [];
  const launchParsed = parseLaunchFields(raw.launch);

  return {
    productName: asString(raw.product_name, productName) || productName,
    headlines: asStringArray(raw.headlines, 8),
    primaryTexts: asStringArray(raw.primary_texts, 6),
    descriptions: asStringArray(raw.descriptions, 4),
    ctas: asStringArray(raw.ctas, 6),
    angles: anglesRaw
      .map((item) => {
        const a = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          name: asString(a.name),
          hook: asString(a.hook),
          why: asString(a.why),
        };
      })
      .filter((a) => a.name && a.hook)
      .slice(0, 6),
    octane: {
      score: clampScore(octaneRaw.score),
      rationale: asString(octaneRaw.rationale, "Strong offer with a clear hook."),
      lifts: asStringArray(octaneRaw.lifts, 4),
    },
    targeting: targetingRaw
      ? {
          audiences: asStringArray(targetingRaw.audiences, 5),
          placements: asStringArray(targetingRaw.placements, 5),
        }
      : null,
    videoScripts: videoRaw
      ? videoRaw
          .map((item) => {
            const v = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              length: asString(v.length),
              hook: asString(v.hook),
              body: asString(v.body),
              cta: asString(v.cta),
              overlayText: asString(v.overlay_text ?? v.overlayText),
            };
          })
          .filter((v) => v.hook && v.body)
          .slice(0, 2)
      : null,
    imagePrompt: asString(raw.image_prompt),
    images: [],
    launch: launchParsed
      ? {
          dailyBudget: launchParsed.dailyBudget ?? "",
          duration: launchParsed.duration ?? "",
          objective: launchParsed.objective ?? "",
          audience: launchParsed.audience ?? "",
          placements: launchParsed.placements ?? "",
          keywords: launchParsed.keywords ?? [],
          success: launchParsed.success ?? "",
        }
      : null,
    brand: parseBrand(raw.brand),
  };
}

export function buildSystemPrompt(engine: Engine): string {
  const extra =
    engine === "premium"
      ? `Include 6 headlines, 4 primary_texts, 3 descriptions, 5 ctas, 4 angles, targeting {audiences[3], placements[3]}, and 2 video_scripts (15s and 30s) with overlay_text.`
      : engine === "plus"
        ? `Include 6 headlines, 3 primary_texts, 3 descriptions, 4 ctas, 3 angles. targeting and video_scripts must be null.`
        : `Include 3 headlines, 2 primary_texts, 2 descriptions, 3 ctas, 3 angles. targeting and video_scripts must be null.`;

  return `You are AdFuel.ai's octane engine — a senior performance creative director writing for people who have NEVER run ads and have no Ads Manager, no pixel, no agency. Specific, benefit-led, never generic agency filler. Match the native voice of the chosen platform. No hashtag spam. No emoji unless the tone is playful and a single one earns its place in a CTA.

Keep the product’s existing colors and typography. Do not restyle into AdFuel orange/navy or invent a new look. Infer hex colors and type from the URL/brief (and from any brand object we pass). image_prompt must name those hex values and the type treatment for on-image text.

Always include a launch object so a first-timer can go live this week. Budgets should be conservative starter tests, not agency retainers. Audience in one plain-English sentence. Success in one sentence a founder can check on day 7. For Google, include 5-8 keywords. For other platforms keywords may be [].

If brand context from an MCP server is provided, treat it as source of truth for product facts, tone, and claims. Do not invent features that contradict it.

Return ONLY JSON with this shape:
{
  "product_name": string,
  "headlines": string[],
  "primary_texts": string[],
  "descriptions": string[],
  "ctas": string[],
  "angles": [{"name": string, "hook": string, "why": string}],
  "octane": {"score": number, "rationale": string, "lifts": string[]},
  "targeting": {"audiences": string[], "placements": string[]} | null,
  "video_scripts": [{"length": string, "hook": string, "body": string, "cta": string, "overlay_text": string}] | null,
  "image_prompt": string,
  "brand": {"bg": "#hex", "fg": "#hex", "accent": "#hex", "type": "typeface / treatment"},
  "launch": {
    "daily_budget": string,
    "duration": string,
    "objective": string,
    "audience": string,
    "placements": string,
    "keywords": string[],
    "success": string
  }
}

${extra}

octane.score is 1-100 predicted creative strength for paid social, honest not inflated. image_prompt is a detailed photorealistic ad-creative brief: product hero, lighting, composition, mood, on-image headline of 3-5 words max, no watermarks, no logos that you invent, no tiny unreadable paragraphs. The on-image type and palette MUST match brand.`;
}

export function buildUserPrompt(input: {
  prompt: string;
  platform: Platform;
  engine: Engine;
  productName: string;
  mcpContext?: string;
  brand?: BrandLook | null;
}): string {
  return [
    `Product name guess: ${input.productName}`,
    `Platform: ${input.platform}`,
    `Engine: ${input.engine}`,
    `Offer / URL / brief: ${input.prompt}`,
    `The advertiser will spend this week. Write a first-week test they can paste into Ads Manager themselves. We do not launch for them.`,
    `If the brief is a URL or domain, infer the product, offer, and buyer from it. Write as if you already know the brand.`,
    `Keep the same colors and typography as the product. Do not restyle.`,
    input.brand
      ? `Measured brand look (source of truth): bg ${input.brand.bg}, fg ${input.brand.fg}, accent ${input.brand.accent}, type ${input.brand.type}. Copy this into brand and image_prompt.`
      : `Infer brand {bg, fg, accent, type} from the product. Prefer the live site’s look over a generic startup palette.`,
    input.mcpContext ? `Brand context from connected MCP servers:\n${input.mcpContext}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function openaiCompatibleJson(input: {
  baseUrl: string;
  apiKey: string;
  model: string;
  system: string;
  user: string;
  maxTokens: number;
}): Promise<string> {
  const res = await fetch(`${input.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      model: input.model,
      temperature: 0.8,
      max_tokens: input.maxTokens,
      messages: [
        { role: "system", content: input.system },
        { role: "user", content: input.user },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Model error ${res.status}${errText ? `: ${errText.slice(0, 180)}` : ""}`);
  }
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Empty response from the model");
  return text;
}

async function anthropicJson(input: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  maxTokens: number;
}): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": input.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: input.model,
      max_tokens: input.maxTokens,
      temperature: 0.8,
      system: input.system,
      messages: [{ role: "user", content: input.user }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Model error ${res.status}${errText ? `: ${errText.slice(0, 180)}` : ""}`);
  }
  const body = (await res.json()) as { content?: { type?: string; text?: string }[] };
  const text = body.content?.find((part) => part.type === "text")?.text ?? "";
  if (!text) throw new Error("Empty response from the model");
  return text;
}

export async function writePackWithKey(input: {
  provider: LlmProviderId;
  apiKey: string;
  model?: string;
  prompt: string;
  platform: Platform;
  engine: Engine;
  productName: string;
  mcpContext?: string;
  brand?: BrandLook | null;
}): Promise<AdPackContent> {
  const model = input.model || PROVIDER_META[input.provider].models[0];
  const system = buildSystemPrompt(input.engine);
  const user = buildUserPrompt(input);
  const maxTokens = input.engine === "premium" ? 3000 : 2000;

  const text =
    input.provider === "anthropic"
      ? await anthropicJson({ apiKey: input.apiKey, model, system, user, maxTokens })
      : await openaiCompatibleJson({
          baseUrl: input.provider === "xai" ? "https://api.x.ai/v1" : "https://api.openai.com/v1",
          apiKey: input.apiKey,
          model,
          system,
          user,
          maxTokens,
        });

  return normalizePack(extractJson(text), input.productName);
}

export async function pingProvider(provider: LlmProviderId, apiKey: string, model?: string): Promise<void> {
  const picked = model || PROVIDER_META[provider].models[0];
  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: picked,
        max_tokens: 8,
        messages: [{ role: "user", content: "Reply with ok" }],
      }),
    });
    if (!res.ok) throw new Error(`Key was rejected (${res.status})`);
    return;
  }
  const base = provider === "xai" ? "https://api.x.ai/v1" : "https://api.openai.com/v1";
  const res = await fetch(`${base}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Key was rejected (${res.status})`);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateXaiImage(apiKey: string, prompt: string, aspect: string): Promise<string | null> {
  for (const model of IMAGE_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch("https://api.x.ai/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          resolution: "1k",
          aspect_ratio: aspect,
          response_format: "url",
        }),
      });
      if (res.status === 429 || res.status >= 500) {
        await wait(700 * (attempt + 1));
        continue;
      }
      if (!res.ok) break;
      const body = (await res.json()) as { data?: { url?: string }[] };
      const url = body.data?.[0]?.url;
      if (url) return url;
    }
  }
  return null;
}
