import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plug, KeyRound, Trash2 } from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LLM_PROVIDERS,
  PROVIDER_META,
  type ConnectionPublic,
  type EngineSource,
  type LlmProviderId,
} from "@/lib/ads/connections";
import {
  addMcpServer,
  deleteMcpServer,
  getMyConnections,
  saveGenerationSource,
  testMcpServer,
  toggleMcpServer,
} from "@/lib/ads/connections-server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connections")({ component: ConnectionsPage });

function ConnectionsPage() {
  const { user, isPending } = useCurrentUserState();
  const [data, setData] = useState<ConnectionPublic | null>(null);
  const [source, setSource] = useState<EngineSource>("hosted");
  const [provider, setProvider] = useState<LlmProviderId>("xai");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [mcpName, setMcpName] = useState("");
  const [mcpUrl, setMcpUrl] = useState("");
  const [mcpAuth, setMcpAuth] = useState("");
  const [adding, setAdding] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyConnections()
      .then((next) => {
        if (cancelled) return;
        setData(next);
        if (!hydrated.current) {
          setSource(next.source);
          setProvider(next.provider);
          hydrated.current = true;
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not load connections");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-40 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function saveSource(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const next = await saveGenerationSource({
        data: { source, provider, apiKey: apiKey || undefined },
      });
      setData(next);
      setApiKey("");
      toast.success(source === "byok" ? "Your key is connected" : "Hosted AI is on");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function addServer(event: FormEvent) {
    event.preventDefault();
    setAdding(true);
    try {
      const result = await addMcpServer({
        data: { name: mcpName, url: mcpUrl, auth: mcpAuth || undefined },
      });
      setData(result.connections);
      setMcpName("");
      setMcpUrl("");
      setMcpAuth("");
      if (result.probe.ok) {
        toast.success(
          result.probe.toolCount
            ? `Connected · ${result.probe.toolCount} tools`
            : "Connected",
        );
      } else {
        toast.error(result.probe.error || "Saved, but the server did not answer");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add server");
    } finally {
      setAdding(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Connections</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How campaigns get written.</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Hosted AI is a paid perk. Free kits use the draft engine unless you add your own key (xAI,
        OpenAI, or Anthropic). MCP is optional. Credits always bill AdFuel.
      </p>

      <form onSubmit={saveSource} className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-primary-soft" />
          <h2 className="text-lg font-semibold tracking-tight">Model</h2>
        </div>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => setSource("hosted")}
            className={cn(
              "rounded-lg border px-4 py-3 text-left",
              source === "hosted" ? "border-primary/50 bg-primary/10" : "border-border hover:border-border-strong",
            )}
          >
            <p className="text-sm font-medium">Hosted AI</p>
            <p className="mt-1 text-xs text-muted">
              {data?.hostedAvailable
                ? "Included on paid plans. Uses AdFuel’s AI after you subscribe. Free accounts get drafts unless you add a key."
                : "Hosted AI is off on this deploy. Add your own key below, or the draft engine writes the kit."}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setSource("byok")}
            className={cn(
              "rounded-lg border px-4 py-3 text-left",
              source === "byok" ? "border-primary/50 bg-primary/10" : "border-border hover:border-border-strong",
            )}
          >
            <p className="text-sm font-medium">Your API key</p>
            <p className="mt-1 text-xs text-muted">
              xAI, OpenAI, or Anthropic. The call hits your account. Keys are stored encrypted and
              never shown in full.
            </p>
          </button>
        </div>

        {source === "byok" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="provider">Provider</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {LLM_PROVIDERS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setProvider(id)}
                    className={cn(
                      "h-11 rounded-full border px-3 text-xs font-medium",
                      provider === id
                        ? "border-primary/50 bg-primary/10 text-fg"
                        : "border-border text-muted hover:text-fg",
                    )}
                  >
                    {PROVIDER_META[id].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="apiKey">API key</Label>
              <Input
                id="apiKey"
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  data?.keyHint
                    ? `Saved ${data.keyHint} — paste to replace`
                    : PROVIDER_META[provider].keyPlaceholder
                }
                className="mt-2"
              />
              <p className="mt-2 text-xs text-faint">From {PROVIDER_META[provider].hint}. Tested on save.</p>
            </div>
          </div>
        ) : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : source === "byok" ? "Save and test key" : "Use hosted AI"}
        </Button>
      </form>

      <section className="mt-6 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <Plug className="size-4 text-primary-soft" />
          <h2 className="text-lg font-semibold tracking-tight">MCP servers</h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Point AdFuel at a brand wiki, catalog, or docs server. On generate, we pull resources and
          tools and fold them into the pack.
        </p>

        <ul className="mt-4 divide-y divide-border">
          {data?.servers.length ? (
            data.servers.map((server) => (
              <li key={server.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{server.name}</p>
                  <p className="truncate text-xs text-faint">{server.url}</p>
                  <p className="mt-1 text-xs text-muted">
                    {server.lastError
                      ? server.lastError
                      : server.toolCount != null
                        ? `${server.toolCount} tools · last ok`
                        : "Not tested yet"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={testingId === server.id}
                    onClick={() => {
                      setTestingId(server.id);
                      testMcpServer({ data: { id: server.id } })
                        .then((result) => {
                          setData(result.connections);
                          if (result.probe.ok) toast.success(`Reached ${server.name}`);
                          else toast.error(result.probe.error || "No answer");
                        })
                        .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Test failed"))
                        .finally(() => setTestingId(null));
                    }}
                  >
                    {testingId === server.id ? "Testing…" : "Test"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleMcpServer({ data: { id: server.id, enabled: !server.enabled } })
                        .then(setData)
                        .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Could not update"));
                    }}
                  >
                    {server.enabled ? "On" : "Off"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      deleteMcpServer({ data: { id: server.id } })
                        .then(setData)
                        .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Could not remove"));
                    }}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="py-4 text-sm text-muted">None yet. A catalog MCP is enough to stop the model guessing.</li>
          )}
        </ul>

        <form onSubmit={addServer} className="mt-4 grid gap-3 border-t border-border pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="mcpName">Name</Label>
              <Input
                id="mcpName"
                value={mcpName}
                onChange={(e) => setMcpName(e.target.value)}
                placeholder="Brand wiki"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="mcpAuth">Bearer token</Label>
              <Input
                id="mcpAuth"
                type="password"
                value={mcpAuth}
                onChange={(e) => setMcpAuth(e.target.value)}
                placeholder="Optional"
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="mcpUrl">Server URL</Label>
            <Input
              id="mcpUrl"
              value={mcpUrl}
              onChange={(e) => setMcpUrl(e.target.value)}
              placeholder="https://mcp.yourapp.com/sse"
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" variant="outline" disabled={adding}>
            {adding ? "Connecting…" : "Add MCP server"}
          </Button>
        </form>
      </section>

      <p className="mt-6 text-sm text-muted">
        Billing stays on{" "}
        <Link to="/account" className="text-fg underline-offset-4 hover:underline">
          Account
        </Link>
        . The tank pays for AdFuel, not the model vendor.
      </p>
    </main>
  );
}
