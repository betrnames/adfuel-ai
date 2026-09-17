import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OctaneCard } from "@/components/octane-card";
import { PreviewCopy, PreviewCreative, PreviewLaunch, PreviewStrategy } from "@/components/ad-preview-tabs";
import { launchPlainText, resolveLaunch } from "@/lib/ads/launch";
import { ENGINE_LABEL, PLATFORM_LABEL } from "@/lib/ads/plans";
import { packWriter } from "@/lib/ads/connections";
import type { AdPackRecord } from "@/lib/ads/types";
import { parseBrand } from "@/lib/ads/brand";
import { cn } from "@/lib/utils";

function packPlainText(pack: AdPackRecord): string {
  const c = pack.pack;
  const launch = resolveLaunch(pack.platform, c.launch);
  const lines = [
    `${c.productName} · ${PLATFORM_LABEL[pack.platform]} · Octane ${c.octane.score}`,
    "",
    launchPlainText(launch, pack.platform),
    "",
    "HEADLINES",
    ...c.headlines.map((h) => `• ${h}`),
    "",
    "PRIMARY TEXT",
    ...c.primaryTexts.map((h) => `• ${h}`),
    "",
    "CTAs",
    ...c.ctas.map((h) => `• ${h}`),
  ];
  if (c.descriptions.length) {
    lines.push("", "DESCRIPTIONS", ...c.descriptions.map((h) => `• ${h}`));
  }
  return lines.join("\n");
}

function BrandChip({ pack }: { pack: AdPackRecord["pack"] }) {
  const brand = parseBrand(pack.brand);
  if (!brand) return null;
  return (
    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
      <span className="uppercase tracking-wide text-faint">Kept look</span>
      {[brand.bg, brand.fg, brand.accent].map((hex, i) => (
        <span key={`${hex}-${i}`} className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-full border border-border" style={{ background: hex }} aria-hidden />
          <span className="tabular-nums">{hex}</span>
        </span>
      ))}
      <span className="text-faint">{brand.type}</span>
    </p>
  );
}

export function AdPreview({ pack, shareable = true }: { pack: AdPackRecord; shareable?: boolean }) {
  const [tab, setTab] = useState<"launch" | "copy" | "creative" | "strategy">(
    packWriter(pack.pack) === "draft" ? "creative" : "launch",
  );
  const [shared, setShared] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const content = pack.pack;
  const writer = packWriter(content);
  const launch = resolveLaunch(pack.platform, content.launch);
  const shareUrl = pack.shareId ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${pack.shareId}` : "";
  const writerLabel =
    writer === "draft" ? "Draft pack" : writer === "byok" ? "Your key" : "Live pack";

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "launch", label: "Launch" },
    { id: "copy", label: "Copy" },
    { id: "creative", label: "Creative" },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <OctaneCard
          align="start"
          score={content.octane.score}
          productName={pack.productName}
          platform={pack.platform}
          meta={`${ENGINE_LABEL[pack.engine]} · ${writerLabel}`}
        >
          <BrandChip pack={content} />
        </OctaneCard>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(packPlainText(pack));
              setCopiedAll(true);
              window.setTimeout(() => setCopiedAll(false), 1400);
            }}
          >
            {copiedAll ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copiedAll ? "Copied pack" : "Copy campaign"}
          </Button>
          {shareable && pack.shareId ? (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(shareUrl);
                setShared(true);
                window.setTimeout(() => setShared(false), 1400);
              }}
            >
              <Share2 className="size-4" />
              {shared ? "Link copied" : "Share score"}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-md bg-bg p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "h-11 min-w-[4.5rem] flex-1 rounded-sm text-sm font-medium transition-colors duration-150",
              tab === item.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "launch" ? (
        <PreviewLaunch plan={launch} platform={pack.platform} locked={writer === "draft"} />
      ) : null}
      {tab === "copy" ? <PreviewCopy pack={pack} /> : null}
      {tab === "creative" ? <PreviewCreative pack={pack} /> : null}
      {tab === "strategy" ? <PreviewStrategy pack={pack} /> : null}
    </div>
  );
}
