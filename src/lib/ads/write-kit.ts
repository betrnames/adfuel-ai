import type { Engine, Platform } from "./plans.ts";
import { decideWriter, writerLabel, type GenerationSource, type WriterKind } from "./connections.ts";
import type { AdImage, AdPackContent } from "./types.ts";
import { brandImageHint, type BrandLook } from "./brand.ts";
import { watermarkedStatics } from "./draft-statics.ts";

export function inferProductName(prompt: string): string {
  const trimmed = prompt.trim();
  const token = trimmed.split(/\s+/)[0] ?? "";
  try {
    const candidate = token.includes("://") ? token : `https://${token}`;
    const url = new URL(candidate);
    if (url.hostname.includes(".")) {
      return url.hostname.replace(/^www\./, "");
    }
  } catch {
    /* not a url */
  }
  const first = trimmed.split(/[\n.|]/)[0]?.trim() ?? trimmed;
  return first.slice(0, 48) || "Product";
}

const FILL_FRAME =
  "Fill the entire frame edge to edge. Well-lit photoreal scene. No black bars, no letterboxing, no empty canvas, no watermark.";

function imageJobsForEngine(engine: Engine): { aspect: string; extra: string }[] {
  const feed: { aspect: string; extra: string }[] = [
    {
      aspect: "1:1",
      extra: `${FILL_FRAME} Square paid-social feed ad, 1:1, product hero filling the frame.`,
    },
    {
      aspect: "1:1",
      extra: `${FILL_FRAME} Square paid-social feed ad, 1:1, lifestyle in-use shot, product still hero.`,
    },
    {
      aspect: "1:1",
      extra: `${FILL_FRAME} Square paid-social feed ad, 1:1, tight crop, short on-image headline, high contrast.`,
    },
  ];
  if (engine === "plus" || engine === "premium") {
    feed.push({
      aspect: "9:16",
      extra: `${FILL_FRAME} Vertical story/reel ad, 9:16, large product, safe margins for UI chrome.`,
    });
  }
  if (engine === "premium") {
    feed.push({
      aspect: "9:16",
      extra: `${FILL_FRAME} Vertical story/reel ad, 9:16, alternate angle, product in hand, bold type.`,
    });
  }
  return feed;
}

async function generateImages(input: {
  engine: Engine;
  prompt: string;
  apiKey: string | null;
  provider: "xai" | "openai" | "anthropic";
  brand?: BrandLook | null;
}): Promise<AdImage[]> {
  if (!input.prompt || !input.apiKey || input.provider !== "xai") {
    return [];
  }
  const { generateXaiImage } = await import("./llm.server");
  const look = brandImageHint(input.brand ?? null);
  const jobs = imageJobsForEngine(input.engine);
  const images: AdImage[] = [];

  for (const job of jobs) {
    const url = await generateXaiImage(
      input.apiKey as string,
      `${input.prompt}\n${job.extra}\n${look}`,
      job.aspect,
    );
    if (url) images.push({ url, aspect: job.aspect, prompt: input.prompt });
  }

  return images;
}

export async function writeKit(input: {
  plan: string;
  source: GenerationSource;
  mcpCount?: number;
  prompt: string;
  platform: Platform;
  engine: Engine;
  productName: string;
  mcpContext: string;
  brand: BrandLook | null;
}): Promise<
  | { ok: true; pack: AdPackContent; writer: WriterKind; writerLabel: string }
  | { ok: false; code: "ai"; error: string }
> {
  const decision = decideWriter(input.plan, input.source);
  if (decision.kind === "error") {
    return { ok: false, code: "ai", error: decision.error };
  }

  let pack: AdPackContent;
  let writer: WriterKind = "draft";
  let imageKey: string | null = null;
  let imageProvider: "xai" | "openai" | "anthropic" = "xai";

  try {
    if (decision.kind === "byok") {
      const { writePackWithKey } = await import("./llm.server");
      pack = await writePackWithKey({
        provider: decision.provider,
        apiKey: decision.apiKey,
        model: decision.model,
        prompt: input.prompt,
        platform: input.platform,
        engine: input.engine,
        productName: input.productName,
        mcpContext: input.mcpContext,
        brand: input.brand,
      });
      writer = "byok";
      imageKey = decision.provider === "xai" ? decision.apiKey : null;
      imageProvider = decision.provider;
    } else if (decision.kind === "hosted") {
      const { writePackWithKey } = await import("./llm.server");
      pack = await writePackWithKey({
        provider: "xai",
        apiKey: decision.apiKey,
        model: "grok-4.5",
        prompt: input.prompt,
        platform: input.platform,
        engine: input.engine,
        productName: input.productName,
        mcpContext: input.mcpContext,
        brand: input.brand,
      });
      writer = "hosted";
      imageKey = decision.apiKey;
      imageProvider = "xai";
    } else {
      const { writeDraftPack } = await import("./template-pack");
      pack = writeDraftPack({
        prompt: input.prompt,
        platform: input.platform,
        productName: input.productName,
        engine: input.engine,
        mcpContext: input.mcpContext,
        brand: input.brand,
      });
      writer = "draft";
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return { ok: false, code: "ai", error: message };
  }

  pack.writer = writer;
  if (input.brand) pack.brand = input.brand;
  if (pack.brand && !pack.imagePrompt.includes(pack.brand.bg)) {
    pack.imagePrompt = `${pack.imagePrompt}\n${brandImageHint(pack.brand)}`;
  }

  if (writer === "draft") {
    pack.images = watermarkedStatics({
      productName: pack.productName,
      headlines: pack.headlines,
      brand: pack.brand ?? null,
    });
  } else {
    try {
      pack.images = await generateImages({
        engine: input.engine,
        prompt: pack.imagePrompt,
        apiKey: imageKey,
        provider: imageProvider,
        brand: pack.brand ?? null,
      });
    } catch {
      pack.images = [];
    }
  }

  return {
    ok: true,
    pack,
    writer,
    writerLabel: writerLabel(writer, input.source.provider, input.mcpCount ?? 0),
  };
}
