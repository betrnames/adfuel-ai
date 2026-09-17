import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SignedInPage } from "@/lib/auth/signed-in";
import { ModelSourceForm } from "@/components/model-source-form";
import { McpServerList } from "@/components/mcp-server-list";
import { canUseHostedAi, type ConnectionPublic, type EngineSource, type LlmProviderId } from "@/lib/ads/connections";
import { getMyConnections, saveGenerationSource } from "@/lib/ads/connections-server";
import { WaitlistGate } from "@/components/waitlist-gate";

export const Route = createFileRoute("/connections")({
  component: () => (
    <WaitlistGate>
      <ConnectionsPage />
    </WaitlistGate>
  ),
});

function ConnectionsPage() {
  return (
    <SignedInPage>
      {() => <ConnectionsInner />}
    </SignedInPage>
  );
}

function ConnectionsInner() {
  const navigate = useNavigate();
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
  }, []);

  async function saveSource(event: FormEvent) {
    event.preventDefault();
    if (source === "hosted" && !canUseHostedAi(data?.plan ?? "trial")) {
      void navigate({ to: "/checkout", search: { plan: "regular" } });
      return;
    }
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Connections</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How the ads get written.</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Live statics are a paid perk. The free pack is watermarked unless you add your own key (xAI, OpenAI, or
        Anthropic). MCP is optional. Credits always bill AdFuel.
      </p>

      <ModelSourceForm
        data={data}
        source={source}
        provider={provider}
        apiKey={apiKey}
        saving={saving}
        onSource={setSource}
        onProvider={setProvider}
        onApiKey={setApiKey}
        onSubmit={saveSource}
      />

      <McpServerList
        data={data}
        mcpName={mcpName}
        mcpUrl={mcpUrl}
        mcpAuth={mcpAuth}
        adding={adding}
        testingId={testingId}
        onName={setMcpName}
        onUrl={setMcpUrl}
        onAuth={setMcpAuth}
        onAdding={setAdding}
        onTesting={setTestingId}
        onData={setData}
      />

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
