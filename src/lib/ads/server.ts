import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  ENGINE_COST,
  PLATFORMS,
  TRIAL_CREDITS,
  maxEngineForPlan,
  type Engine,
  type Goal,
  type PlanId,
  type Platform,
} from "./plans";
import { writerLabel, type WriterKind } from "./connections";
import type { AdPackContent, AdPackRecord, AdImage, GenerateInput, Profile } from "./types";
import { brandImageHint, sniffBrand, type BrandLook } from "./brand";

function inferProductName(prompt: string): string {
  const trimmed = prompt.trim();
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    if (url.hostname.includes(".")) {
      return url.hostname.replace(/^www\./, "");
    }
  } catch {
    /* not a url */
  }
  const first = trimmed.split(/[\n.|]/)[0]?.trim() ?? trimmed;
  return first.slice(0, 48) || "Product";
}

async function ensureProfile(userId: string): Promise<Profile> {
  const sql = await getSql();
  const existing = await sql<{
    user_id: string;
    plan: string;
    credits: number;
    created_at: string;
  }>`select user_id, plan, credits, created_at from profiles where user_id = ${userId} limit 1`;
  if (existing[0]) {
    return {
      userId: existing[0].user_id,
      plan: existing[0].plan,
      credits: Number(existing[0].credits),
      createdAt: existing[0].created_at,
    };
  }
  await sql`insert into profiles (user_id, plan, credits) values (${userId}, ${"trial"}, ${TRIAL_CREDITS})`;
  const created = await sql<{
    user_id: string;
    plan: string;
    credits: number;
    created_at: string;
  }>`select user_id, plan, credits, created_at from profiles where user_id = ${userId} limit 1`;
  const row = created[0];
  return {
    userId: row?.user_id ?? userId,
    plan: row?.plan ?? "trial",
    credits: Number(row?.credits ?? TRIAL_CREDITS),
    createdAt: row?.created_at ?? new Date().toISOString(),
  };
}

function parsePackJson(raw: string): AdPackContent {
  const data = JSON.parse(raw) as AdPackContent;
  if (!data.launch) data.launch = null;
  if (!Array.isArray(data.images)) data.images = [];
  return data;
}

function mapPackRow(row: {
  id: number;
  share_id: string | null;
  product_name: string;
  brief: string;
  platform: string;
  goal: string;
  engine: string;
  octane: number | null;
  pack_json: string;
  created_at: string;
}): AdPackRecord {
  return {
    id: Number(row.id),
    shareId: row.share_id,
    productName: row.product_name,
    brief: row.brief,
    platform: row.platform as Platform,
    goal: row.goal as Goal,
    engine: row.engine as Engine,
    octane: row.octane === null ? null : Number(row.octane),
    pack: parsePackJson(row.pack_json),
    createdAt: row.created_at,
  };
}

type PackRow = {
  id: number;
  share_id: string | null;
  product_name: string;
  brief: string;
  platform: string;
  goal: string;
  engine: string;
  octane: number | null;
  pack_json: string;
  created_at: string;
};

function newShareId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 12);
}

function pickEngine(plan: PlanId, credits: number): Engine | null {
  const preferred = maxEngineForPlan(plan);
  if (credits >= ENGINE_COST[preferred]) return preferred;
  if (credits >= ENGINE_COST.regular) return "regular";
  return null;
}

async function generateImages(input: {
  engine: Engine;
  prompt: string;
  apiKey: string | null;
  provider: "xai" | "openai" | "anthropic";
  brand?: BrandLook | null;
}): Promise<AdImage[]> {
  if (!input.prompt || input.engine === "regular" || !input.apiKey || input.provider !== "xai") {
    return [];
  }
  const { generateXaiImage } = await import("./llm.server");
  const look = brandImageHint(input.brand ?? null);
  const jobs: { aspect: string; extra: string }[] =
    input.engine === "premium"
      ? [
          { aspect: "1:1", extra: "Square paid-social feed ad, 1:1, product hero filling the frame." },
          { aspect: "9:16", extra: "Vertical story/reel ad, 9:16, large product, safe margins for UI chrome." },
        ]
      : [{ aspect: "1:1", extra: "Square paid-social feed ad, 1:1, product hero filling the frame." }];

  const results = await Promise.all(
    jobs.map(async (job) => {
      const url = await generateXaiImage(
        input.apiKey as string,
        `${input.prompt}\n${job.extra}\n${look}`,
        job.aspect,
      );
      return url ? { url, aspect: job.aspect, prompt: input.prompt } : null;
    }),
  );

  return results.filter((img): img is AdImage => Boolean(img));
}

function validateGenerateInput(input: GenerateInput): GenerateInput {
  const prompt = input.prompt.trim().slice(0, 2000);
  if (prompt.length < 8) throw new Error("Paste a site or a one-line offer");
  if (!PLATFORMS.includes(input.platform)) throw new Error("Pick a platform");
  return { prompt, platform: input.platform };
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return ensureProfile(context.userId);
  });

export const listMyPacks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql<PackRow>`select id, share_id, product_name, brief, platform, goal, engine, octane, pack_json, created_at
       from ad_packs
       where user_id = ${context.userId}
       order by created_at desc
       limit 40`;
    return rows.map(mapPackRow);
  });

export const getSharedPack = createServerFn({ method: "GET" })
  .validator((input: { shareId: string }) => {
    const shareId = input.shareId.trim().slice(0, 32);
    if (!/^[a-zA-Z0-9]+$/.test(shareId)) throw new Error("Not found");
    return { shareId };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<PackRow>`select id, share_id, product_name, brief, platform, goal, engine, octane, pack_json, created_at
       from ad_packs
       where share_id = ${data.shareId}
       limit 1`;
    return rows[0] ? mapPackRow(rows[0]) : null;
  });

export const generateAdPack = createServerFn({ method: "POST" })
  .validator((input: GenerateInput) => validateGenerateInput(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const profile = await ensureProfile(context.userId);
    const plan = profile.plan as PlanId;
    const engine = pickEngine(plan, profile.credits);
    if (!engine) {
      return {
        ok: false as const,
        code: "credits" as const,
        error: "Your 3 free campaigns are used. Unlock Regular to keep going.",
        requiredPlan: "regular",
        profile,
      };
    }

    const cost = ENGINE_COST[engine];
    const productName = inferProductName(data.prompt);
    const brand = await sniffBrand(data.prompt);
    const { loadGenerationSource } = await import("./connections-server");
    const source = await loadGenerationSource(context.userId);

    let mcpContext = "";
    if (source.mcp.length > 0) {
      const { gatherMcpContext } = await import("./mcp.server");
      mcpContext = await gatherMcpContext(source.mcp, data.prompt);
    }

    let pack: AdPackContent;
    let writer: WriterKind = "draft";
    let imageKey: string | null = null;
    let imageProvider: "xai" | "openai" | "anthropic" = "xai";

    try {
      if (source.source === "byok") {
        if (!source.apiKey) {
          return {
            ok: false as const,
            code: "ai" as const,
            error: "Add your API key on Connections. Paid plans can use hosted AI instead.",
            profile,
          };
        }
        const { writePackWithKey } = await import("./llm.server");
        pack = await writePackWithKey({
          provider: source.provider,
          apiKey: source.apiKey,
          model: source.model,
          prompt: data.prompt,
          platform: data.platform,
          engine,
          productName,
          mcpContext,
          brand,
        });
        writer = "byok";
        imageKey = source.provider === "xai" ? source.apiKey : null;
        imageProvider = source.provider;
      } else if (plan !== "trial" && source.hostedKey) {
        const { writePackWithKey } = await import("./llm.server");
        pack = await writePackWithKey({
          provider: "xai",
          apiKey: source.hostedKey,
          model: "grok-4.5",
          prompt: data.prompt,
          platform: data.platform,
          engine,
          productName,
          mcpContext,
          brand,
        });
        writer = "hosted";
        imageKey = source.hostedKey;
        imageProvider = "xai";
      } else {
        const { writeDraftPack } = await import("./template-pack");
        pack = writeDraftPack({
          prompt: data.prompt,
          platform: data.platform,
          productName,
          engine,
          mcpContext,
          brand,
        });
        writer = "draft";
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      return { ok: false as const, code: "ai" as const, error: message, profile };
    }

    if (brand) pack.brand = brand;
    if (pack.brand && !pack.imagePrompt.includes(pack.brand.bg)) {
      pack.imagePrompt = `${pack.imagePrompt}\n${brandImageHint(pack.brand)}`;
    }

    try {
      pack.images = await generateImages({
        engine,
        prompt: pack.imagePrompt,
        apiKey: imageKey,
        provider: imageProvider,
        brand: pack.brand ?? null,
      });
    } catch {
      pack.images = [];
    }

    const sql = await getSql();
    const updated = await sql<{ credits: number }>`
      update profiles
      set credits = credits - ${cost}, updated_at = now()
      where user_id = ${context.userId} and credits >= ${cost}
      returning credits`;
    if (!updated[0]) {
      return {
        ok: false as const,
        code: "credits" as const,
        error: "Your 3 free campaigns are used. Unlock Regular to keep going.",
        requiredPlan: "regular" as const,
        profile,
      };
    }

    const shareId = newShareId();
    const inserted = await sql<PackRow>`insert into ad_packs (
        user_id, share_id, product_name, brief, platform, goal, engine, octane, pack_json
      ) values (
        ${context.userId},
        ${shareId},
        ${pack.productName || productName},
        ${data.prompt},
        ${data.platform},
        ${"sales"},
        ${engine},
        ${pack.octane.score},
        ${JSON.stringify(pack)}
      ) returning id, share_id, product_name, brief, platform, goal, engine, octane, pack_json, created_at`;

    const record = inserted[0] ? mapPackRow(inserted[0]) : null;
    const nextProfile = { ...profile, credits: Number(updated[0].credits) };
    return {
      ok: true as const,
      pack: record,
      profile: nextProfile,
      writer,
      writerLabel: writerLabel(writer, source.provider, source.mcp.length),
    };
  });
