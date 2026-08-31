type RpcResult = { json: unknown; sessionId: string | null };

const BLOCKED_HOSTS = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|10\.|192\.168\.|169\.254\.|metadata\.google\.internal)/i;

export function assertSafeMcpUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("Enter a full MCP server URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("MCP URL must start with https://");
  }
  if (url.protocol === "http:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("Only https:// MCP servers are allowed (except local)");
  }
  if (BLOCKED_HOSTS.test(url.hostname) && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("That host is not allowed");
  }
  if (/^(10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(url.hostname)) {
    throw new Error("That host is not allowed");
  }
  return url.toString().replace(/\/$/, "");
}

function parseSseOrJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  const dataLines = trimmed
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter((line) => line && line !== "[DONE]");
  const last = dataLines.at(-1);
  return last ? JSON.parse(last) : null;
}

async function rpc(
  url: string,
  auth: string | null,
  body: Record<string, unknown>,
  sessionId: string | null,
): Promise<RpcResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        ...(auth ? { Authorization: auth.startsWith("Bearer ") ? auth : `Bearer ${auth}` } : {}),
        ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const nextSession = res.headers.get("mcp-session-id") || sessionId;
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`MCP ${res.status}${text ? `: ${text.slice(0, 120)}` : ""}`);
    }
    return { json: parseSseOrJson(text), sessionId: nextSession };
  } finally {
    clearTimeout(timer);
  }
}

function rpcResult(json: unknown): unknown {
  if (!json || typeof json !== "object") return json;
  const rec = json as { error?: { message?: string }; result?: unknown };
  if (rec.error) throw new Error(rec.error.message || "MCP error");
  return rec.result;
}

export type McpProbe = {
  ok: boolean;
  toolCount: number;
  tools: string[];
  error?: string;
};

export async function probeMcpServer(url: string, auth: string | null): Promise<McpProbe> {
  const safe = assertSafeMcpUrl(url);
  try {
    const init = await rpc(
      safe,
      auth,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "AdFuel.ai", version: "1.0.0" },
        },
      },
      null,
    );
    rpcResult(init.json);
    await rpc(
      safe,
      auth,
      { jsonrpc: "2.0", method: "notifications/initialized" },
      init.sessionId,
    ).catch(() => undefined);

    const listed = await rpc(
      safe,
      auth,
      { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
      init.sessionId,
    );
    const result = rpcResult(listed.json) as { tools?: { name?: string }[] } | null;
    const tools = (result?.tools ?? []).map((t) => t.name).filter((n): n is string => Boolean(n));
    return { ok: true, toolCount: tools.length, tools: tools.slice(0, 12) };
  } catch (err) {
    return {
      ok: false,
      toolCount: 0,
      tools: [],
      error: err instanceof Error ? err.message : "Could not reach MCP server",
    };
  }
}

function textFromContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const rec = item as { text?: string; type?: string };
          return rec.text ?? "";
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof value === "object") {
    const rec = value as { text?: string; contents?: unknown; content?: unknown };
    if (rec.text) return rec.text;
    if (rec.contents) return textFromContent(rec.contents);
    if (rec.content) return textFromContent(rec.content);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

export async function gatherMcpContext(
  servers: { name: string; url: string; auth: string | null }[],
  brief: string,
): Promise<string> {
  const chunks: string[] = [];
  await Promise.all(
    servers.slice(0, 3).map(async (server) => {
      try {
        const safe = assertSafeMcpUrl(server.url);
        const init = await rpc(
          safe,
          server.auth,
          {
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
              protocolVersion: "2025-03-26",
              capabilities: {},
              clientInfo: { name: "AdFuel.ai", version: "1.0.0" },
            },
          },
          null,
        );
        await rpc(
          safe,
          server.auth,
          { jsonrpc: "2.0", method: "notifications/initialized" },
          init.sessionId,
        ).catch(() => undefined);

        const resourcesRpc = await rpc(
          safe,
          server.auth,
          { jsonrpc: "2.0", id: 2, method: "resources/list", params: {} },
          init.sessionId,
        ).catch(() => null);
        const resources = resourcesRpc
          ? ((rpcResult(resourcesRpc.json) as { resources?: { uri?: string; name?: string }[] })?.resources ?? [])
          : [];

        for (const resource of resources.slice(0, 3)) {
          if (!resource.uri) continue;
          const read = await rpc(
            safe,
            server.auth,
            { jsonrpc: "2.0", id: 3, method: "resources/read", params: { uri: resource.uri } },
            init.sessionId,
          );
          const text = textFromContent(rpcResult(read.json)).slice(0, 2500);
          if (text) chunks.push(`[${server.name} / ${resource.name || resource.uri}]\n${text}`);
        }

        if (chunks.some((c) => c.startsWith(`[${server.name}`))) return;

        const toolsRpc = await rpc(
          safe,
          server.auth,
          { jsonrpc: "2.0", id: 4, method: "tools/list", params: {} },
          init.sessionId,
        ).catch(() => null);
        const tools = toolsRpc
          ? ((rpcResult(toolsRpc.json) as { tools?: { name?: string }[] })?.tools ?? [])
          : [];
        const search = tools.find((t) =>
          /search|brand|product|get_|fetch|lookup|context|read/i.test(t.name ?? ""),
        );
        if (!search?.name) return;
        const called = await rpc(
          safe,
          server.auth,
          {
            jsonrpc: "2.0",
            id: 5,
            method: "tools/call",
            params: { name: search.name, arguments: { query: brief, q: brief, text: brief } },
          },
          init.sessionId,
        );
        const text = textFromContent(rpcResult(called.json)).slice(0, 2500);
        if (text) chunks.push(`[${server.name} / ${search.name}]\n${text}`);
      } catch {
        /* fail open — a down MCP server must not block a campaign */
      }
    }),
  );
  return chunks.join("\n\n").slice(0, 8000);
}
