import { type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LLM_PROVIDERS,
  PROVIDER_META,
  canUseHostedAi,
  type ConnectionPublic,
  type EngineSource,
  type LlmProviderId,
} from "@/lib/ads/connections";
import { cn } from "@/lib/utils";

export function ModelSourceForm({
  data,
  source,
  provider,
  apiKey,
  saving,
  onSource,
  onProvider,
  onApiKey,
  onSubmit,
}: {
  data: ConnectionPublic | null;
  source: EngineSource;
  provider: LlmProviderId;
  apiKey: string;
  saving: boolean;
  onSource: (source: EngineSource) => void;
  onProvider: (provider: LlmProviderId) => void;
  onApiKey: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  const paid = canUseHostedAi(data?.plan ?? "trial");
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <KeyRound className="size-4 text-primary-soft" />
        <h2 className="text-lg font-semibold tracking-tight">Model</h2>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => onSource("hosted")}
          className={cn(
            "rounded-lg border px-4 py-3 text-left",
            source === "hosted" ? "border-primary/50 bg-primary/10" : "border-border hover:border-border-strong",
          )}
        >
          <p className="text-sm font-medium">Hosted AI</p>
          <p className="mt-1 text-xs text-muted">
            {paid
              ? data?.hostedAvailable
                ? "Uses AdFuel’s AI. Credits still bill AdFuel."
                : "Hosted AI is off on this deploy. Add your own key below."
              : "The free pack stays watermarked. Live statics unlock at $12, or add your own key now."}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onSource("byok")}
          className={cn(
            "rounded-lg border px-4 py-3 text-left",
            source === "byok" ? "border-primary/50 bg-primary/10" : "border-border hover:border-border-strong",
          )}
        >
          <p className="text-sm font-medium">Your API key</p>
          <p className="mt-1 text-xs text-muted">
            xAI, OpenAI, or Anthropic. The call hits your account. Keys are stored encrypted and never shown in full.
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
                  onClick={() => onProvider(id)}
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
              onChange={(e) => onApiKey(e.target.value)}
              placeholder={
                data?.keyHint ? `Saved ${data.keyHint} — paste to replace` : PROVIDER_META[provider].keyPlaceholder
              }
              className="mt-2"
            />
            <p className="mt-2 text-xs text-faint">From {PROVIDER_META[provider].hint}. Tested on save.</p>
          </div>
        </div>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving
          ? "Saving…"
          : source === "byok"
            ? "Save and test key"
            : paid
              ? "Use hosted AI"
              : "Pay Regular — $12"}
      </Button>
    </form>
  );
}
