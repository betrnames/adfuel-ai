import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  LLM_PROVIDERS,
  PROVIDER_META,
  type ConnectionPublic,
  type EngineSource,
  type LlmProviderId,
  type McpServerPublic,
} from "./connections";

type ConnRow = {
  user_id: string;
  source: string;
  llm_provider: string;
  llm_model: string | null;
  llm_key_enc: string | null;
  updated_at: string;
};

type McpRow = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  auth_enc: string | null;
  enabled: boolean;
  last_ok: string | null;
  last_error: string | null;
  tool_count: number | null;
  created_at: string;
};

function asProvider(value: string | null | undefined): LlmProviderId {
  return LLM_PROVIDERS.includes(value as LlmProviderId) ? (value as LlmProviderId) : "xai";
}

function asSource(value: string | null | undefined): EngineSource {
  return value === "byok" ? "byok" : "hosted";
}

function hostedAvailable() {
  return Boolean(process.env.XAI_API_KEY);
}

async function loadRows(userId: string): Promise<{ conn: ConnRow | null; servers: McpRow[] }> {
  const sql = await getSql();
  const conn = await sql<ConnRow>`
    select user_id, source, llm_provider, llm_model, llm_key_enc, updated_at
    from user_connections where user_id = ${userId} limit 1`;
  const servers = await sql<McpRow>`
    select id, user_id, name, url, auth_enc, enabled, last_ok, last_error, tool_count, created_at
    from mcp_servers where user_id = ${userId}
    order by created_at asc`;
  return { conn: conn[0] ?? null, servers };
}

async function toPublic(userId: string): Promise<ConnectionPublic> {
  const { decryptSecret, maskKey } = await import("./secrets.server");
  const { conn, servers } = await loadRows(userId);
  let keyHint: string | null = null;
  if (conn?.llm_key_enc) {
    try {
      keyHint = maskKey(decryptSecret(conn.llm_key_enc));
    } catch {
      keyHint = "••••";
    }
  }
  const provider = asProvider(conn?.llm_provider);
  return {
    source: asSource(conn?.source),
    provider,
    model: conn?.llm_model || PROVIDER_META[provider].models[0],
    hasKey: Boolean(conn?.llm_key_enc),
    keyHint,
    hostedAvailable: hostedAvailable(),
    servers: servers.map(
      (row): McpServerPublic => ({
        id: row.id,
        name: row.name,
        url: row.url,
        hasAuth: Boolean(row.auth_enc),
        enabled: row.enabled,
        lastOk: row.last_ok,
        lastError: row.last_error,
        toolCount: row.tool_count === null ? null : Number(row.tool_count),
      }),
    ),
  };
}

export async function loadGenerationSource(userId: string): Promise<{
  source: EngineSource;
  provider: LlmProviderId;
  model: string;
  apiKey: string | null;
  hostedKey: string | null;
  mcp: { name: string; url: string; auth: string | null }[];
}> {
  const { decryptSecret } = await import("./secrets.server");
  const { conn, servers } = await loadRows(userId);
  let apiKey: string | null = null;
  if (conn?.llm_key_enc) {
    try {
      apiKey = decryptSecret(conn.llm_key_enc);
    } catch {
      apiKey = null;
    }
  }
  const mcp = await Promise.all(
    servers
      .filter((row) => row.enabled)
      .slice(0, 3)
      .map(async (row) => ({
        name: row.name,
        url: row.url,
        auth: row.auth_enc
          ? await Promise.resolve()
              .then(() => decryptSecret(row.auth_enc as string))
              .catch(() => null)
          : null,
      })),
  );
  return {
    source: asSource(conn?.source),
    provider: asProvider(conn?.llm_provider),
    model: conn?.llm_model || PROVIDER_META[asProvider(conn?.llm_provider)].models[0],
    apiKey,
    hostedKey: process.env.XAI_API_KEY ?? null,
    mcp,
  };
}

export const getMyConnections = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => toPublic(context.userId));

export const saveGenerationSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { source: EngineSource; provider: LlmProviderId; model?: string; apiKey?: string }) => {
    if (input.source !== "hosted" && input.source !== "byok") throw new Error("Pick how campaigns are written");
    if (!LLM_PROVIDERS.includes(input.provider)) throw new Error("Pick a provider");
    return {
      source: input.source,
      provider: input.provider,
      model: (input.model ?? "").trim().slice(0, 80),
      apiKey: (input.apiKey ?? "").trim().slice(0, 256),
    };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const { encryptSecret } = await import("./secrets.server");
    const existing = await sql<ConnRow>`select user_id, llm_key_enc from user_connections where user_id = ${context.userId} limit 1`;
    let keyEnc = existing[0]?.llm_key_enc ?? null;
    if (data.apiKey) {
      const { pingProvider } = await import("./llm.server");
      await pingProvider(data.provider, data.apiKey, data.model || undefined);
      keyEnc = encryptSecret(data.apiKey);
    }
    if (data.source === "byok" && !keyEnc) {
      throw new Error("Paste an API key to use your own model");
    }
    const model = data.model || PROVIDER_META[data.provider].models[0];
    if (existing[0]) {
      await sql`
        update user_connections
        set source = ${data.source},
            llm_provider = ${data.provider},
            llm_model = ${model},
            llm_key_enc = ${keyEnc},
            updated_at = now()
        where user_id = ${context.userId}`;
    } else {
      await sql`
        insert into user_connections (user_id, source, llm_provider, llm_model, llm_key_enc)
        values (${context.userId}, ${data.source}, ${data.provider}, ${model}, ${keyEnc})`;
    }
    return toPublic(context.userId);
  });

export const addMcpServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; url: string; auth?: string }) => {
    const name = input.name.trim().slice(0, 60);
    const url = input.url.trim().slice(0, 400);
    if (name.length < 2) throw new Error("Name the server");
    if (url.length < 8) throw new Error("Paste the MCP URL");
    return { name, url, auth: (input.auth ?? "").trim().slice(0, 400) };
  })
  .handler(async ({ context, data }) => {
    const { assertSafeMcpUrl, probeMcpServer } = await import("./mcp.server");
    const { encryptSecret } = await import("./secrets.server");
    const url = assertSafeMcpUrl(data.url);
    const existing = await (await getSql())<McpRow>`
      select id from mcp_servers where user_id = ${context.userId}`;
    if (existing.length >= 5) throw new Error("Five MCP servers is the cap");
    const probe = await probeMcpServer(url, data.auth || null);
    const id = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
    const sql = await getSql();
    await sql`
      insert into mcp_servers (id, user_id, name, url, auth_enc, enabled, last_ok, last_error, tool_count)
      values (
        ${id},
        ${context.userId},
        ${data.name},
        ${url},
        ${data.auth ? encryptSecret(data.auth) : null},
        ${true},
        ${probe.ok ? new Date().toISOString() : null},
        ${probe.ok ? null : probe.error ?? "Could not reach server"},
        ${probe.ok ? probe.toolCount : null}
      )`;
    return { connections: await toPublic(context.userId), probe };
  });

export const testMcpServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => ({ id: input.id.trim().slice(0, 32) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<McpRow>`
      select id, user_id, name, url, auth_enc, enabled, last_ok, last_error, tool_count, created_at
      from mcp_servers where id = ${data.id} and user_id = ${context.userId} limit 1`;
    const row = rows[0];
    if (!row) throw new Error("Server not found");
    const { decryptSecret } = await import("./secrets.server");
    const { probeMcpServer } = await import("./mcp.server");
    const auth = row.auth_enc ? decryptSecret(row.auth_enc) : null;
    const probe = await probeMcpServer(row.url, auth);
    await sql`
      update mcp_servers
      set last_ok = ${probe.ok ? new Date().toISOString() : row.last_ok},
          last_error = ${probe.ok ? null : probe.error ?? "Failed"},
          tool_count = ${probe.ok ? probe.toolCount : row.tool_count}
      where id = ${row.id}`;
    return { connections: await toPublic(context.userId), probe };
  });

export const toggleMcpServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; enabled: boolean }) => ({
    id: input.id.trim().slice(0, 32),
    enabled: Boolean(input.enabled),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update mcp_servers set enabled = ${data.enabled}
      where id = ${data.id} and user_id = ${context.userId}`;
    return toPublic(context.userId);
  });

export const deleteMcpServer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => ({ id: input.id.trim().slice(0, 32) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from mcp_servers where id = ${data.id} and user_id = ${context.userId}`;
    return toPublic(context.userId);
  });
