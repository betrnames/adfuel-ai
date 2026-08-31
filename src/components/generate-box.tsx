import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { savePending } from "@/lib/ads/pending";
import { PLATFORM_WHERE } from "@/lib/ads/launch";
import { PLATFORMS, type Platform } from "@/lib/ads/plans";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "allbirds.com — wool runners, $98",
  "Weeknight meal kit. $12 a plate. First box $20 off.",
  "Harbor CRM for 2–10 person shops. $29/mo.",
];

export function GenerateBox({
  variant,
  onSubmitPrompt,
  busy,
  empty,
  writerHint,
}: {
  variant: "hero" | "panel";
  onSubmitPrompt?: (input: { prompt: string; platform: Platform }) => void;
  busy?: boolean;
  empty?: boolean;
  writerHint?: string;
}) {
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState<Platform>("meta");

  function go(event: FormEvent) {
    event.preventDefault();
    const next = prompt.trim();
    if (next.length < 8) return;
    savePending({ prompt: next, platform });
    if (onSubmitPrompt && user) {
      onSubmitPrompt({ prompt: next, platform });
      return;
    }
    void navigate({ to: "/studio" });
  }

  return (
    <form
      onSubmit={go}
      className={cn(
        "rounded-xl border border-border bg-surface",
        variant === "hero" ? "p-4 sm:p-5" : "p-4",
      )}
    >
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Paste a site or one-line offer. Example: allbirds.com — wool runners, $98"
        className={variant === "hero" ? "min-h-28 text-base" : "min-h-28"}
        maxLength={2000}
        required
      />
      <p className="mt-3 text-xs font-medium text-muted">Where should people see this?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PLATFORMS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPlatform(item)}
            className={cn(
              "h-11 rounded-full border px-3 text-xs font-medium",
              platform === item
                ? "border-primary/50 bg-primary/10 text-fg"
                : "border-border text-muted hover:text-fg",
            )}
          >
            {PLATFORM_WHERE[item]}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-faint">
        No ad account yet is fine. Free kits are drafts. Pay or add your key for AI.
        {user ? (
          <>
            {" "}
            <Link to="/connections" className="text-muted underline-offset-4 hover:text-fg hover:underline">
              {writerHint ?? "Draft free · AI when you pay or add a key"}
            </Link>
          </>
        ) : null}
      </p>
      {variant === "hero" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted hover:text-fg"
              onClick={() => setPrompt(example)}
            >
              {example}
            </button>
          ))}
        </div>
      ) : null}
      {empty ? (
        <div className="mt-4 rounded-md border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-medium">Three free campaigns are used.</p>
          <p className="mt-1 text-sm text-muted">Pay $12/mo for 50 more. Receipts live on Account.</p>
          <Button
            type="button"
            className="mt-3 w-full"
            onClick={() => void navigate({ to: "/checkout", search: { plan: "regular" } })}
          >
            Pay Regular — $12
          </Button>
        </div>
      ) : (
        <Button type="submit" className="mt-4 w-full" size={variant === "hero" ? "lg" : "default"} disabled={busy}>
          {busy ? "Writing the campaign…" : "Get my first campaign"}
          {busy ? null : <ArrowRight className="size-4" />}
        </Button>
      )}
    </form>
  );
}
