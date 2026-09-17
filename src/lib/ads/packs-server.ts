import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { CREDITS_EMPTY_ERROR, ENGINE_COST, PLATFORMS, engineForCredits, type Engine, type Goal, type PlanId, type Platform } from "./plans";
import { loadOrCreateProfile } from "./profile";
import { inferProductName, writeKit } from "./write-kit";
import type { AdPackContent, AdPackRecord, GenerateInput } from "./types";
import { sniffBrand } from "./brand";
import { waitlistPublic } from "@/lib/waitlist";

function parsePackJson(raw: string): AdPackContent {
  const data = JSON.parse(raw) as AdPackContent;
  if (!data.launch) data.launch = null;
  if (!Array.isArray(data.images)) data.images = [];
  return data;
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

function mapPackRow(row: PackRow): AdPackRecord {
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

function newShareId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 12);
}

function validateGenerateInput(input: GenerateInput): GenerateInput {
  const prompt = input.prompt.trim().slice(0, 2000);
  if (prompt.length < 8) throw new Error("Paste a site or a one-line offer");
  if (!PLATFORMS.includes(input.platform)) throw new Error("Pick a platform");
  return { prompt, platform: input.platform };
}

async function chargeAndSave(input: {
  userId: string;
  cost: number;
  engine: Engine;
  prompt: string;
  platform: Platform;
  productName: string;
  pack: AdPackContent;
}): Promise<{ row: PackRow; credits: number } | null> {
  const sql = await getSql();
  const updated = await sql<{ credits: number }>`
    update profiles
    set credits = credits - ${input.cost}, updated_at = now()
    where user_id = ${input.userId} and credits >= ${input.cost}
    returning credits`;
  if (!updated[0]) return null;

  const shareId = newShareId();
  const inserted = await sql<PackRow>`insert into ad_packs (
      user_id, share_id, product_name, brief, platform, goal, engine, octane, pack_json
    ) values (
      ${input.userId},
      ${shareId},
      ${input.pack.productName || input.productName},
      ${input.prompt},
      ${input.platform},
      ${"sales"},
      ${input.engine},
      ${input.pack.octane.score},
      ${JSON.stringify(input.pack)}
    ) returning id, share_id, product_name, brief, platform, goal, engine, octane, pack_json, created_at`;
  const row = inserted[0];
  if (!row) return null;
  return { row, credits: Number(updated[0].credits) };
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadOrCreateProfile(context.userId));

export const listMyPacks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await loadOrCreateProfile(context.userId);
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
    if (waitlistPublic()) {
      return {
        ok: false as const,
        code: "waitlist" as const,
        error: "Studio opens when we go live. Join the list on the home page.",
        requiredPlan: "regular" as const,
        profile: await loadOrCreateProfile(context.userId),
      };
    }
    const profile = await loadOrCreateProfile(context.userId);
    const plan = profile.plan as PlanId;
    const engine = engineForCredits(plan, profile.credits);
    if (!engine) {
      return {
        ok: false as const,
        code: "credits" as const,
        error: CREDITS_EMPTY_ERROR,
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

    const written = await writeKit({
      plan,
      source,
      mcpCount: source.mcp.length,
      prompt: data.prompt,
      platform: data.platform,
      engine,
      productName,
      mcpContext,
      brand,
    });
    if (!written.ok) {
      return { ok: false as const, code: "ai" as const, error: written.error, profile };
    }

    const saved = await chargeAndSave({
      userId: context.userId,
      cost,
      engine,
      prompt: data.prompt,
      platform: data.platform,
      productName,
      pack: written.pack,
    });
    if (!saved) {
      return {
        ok: false as const,
        code: "credits" as const,
        error: CREDITS_EMPTY_ERROR,
        requiredPlan: "regular" as const,
        profile,
      };
    }

    return {
      ok: true as const,
      pack: mapPackRow(saved.row),
      profile: { ...profile, credits: saved.credits },
      writer: written.writer,
      writerLabel: written.writerLabel,
    };
  });
