import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LaunchKit } from "@/components/launch-kit";
import { launchPlainText, resolveLaunch } from "@/lib/ads/launch";
import { ENGINE_LABEL, PLATFORM_LABEL } from "@/lib/ads/plans";
import type { AdPackRecord } from "@/lib/ads/types";
import { parseBrand } from "@/lib/ads/brand";
import { cn } from "@/lib/utils";

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="grid size-9 shrink-0 place-items-center rounded-sm text-faint hover:bg-surface-2 hover:text-fg"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
      aria-label="Copy"
    >
      {done ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function Line({ label, text }: { label?: string; text: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-sm border border-border bg-bg px-3 py-2.5">
      <div className="min-w-0">
        {label ? <p className="mb-1 text-xs uppercase tracking-wide text-faint">{label}</p> : null}
        <p className="text-sm leading-relaxed text-fg">{text}</p>
      </div>
      <CopyBtn text={text} />
    </div>
  );
}

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
          <span
            className="size-3 rounded-full border border-border"
            style={{ background: hex }}
            aria-hidden
          />
          <span className="tabular-nums">{hex}</span>
        </span>
      ))}
      <span className="text-faint">{brand.type}</span>
    </p>
  );
}

function FeedMock({
  pack,
  productName,
  platform,
  headline,
  body,
  heroUrl,
}: {
  pack: AdPackRecord["pack"];
  productName: string;
  platform: string;
  headline: string;
  body: string;
  heroUrl?: string;
}) {
  const brand = parseBrand(pack.brand);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="size-2 rounded-full bg-danger/80" />
        <span className="size-2 rounded-full bg-warn/80" />
        <span className="size-2 rounded-full bg-ok/80" />
        <span className="ml-2 text-xs text-faint">{platform} feed</span>
      </div>
      {heroUrl ? (
        <img
          src={heroUrl}
          alt=""
          className="aspect-square w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
          crossOrigin="anonymous"
        />
      ) : (
        <div
          className="grid h-64 w-full place-items-center bg-surface-2 px-6 text-center"
          style={brand ? { background: brand.bg, color: brand.fg } : undefined}
        >
          <div>
            <p className={cn("text-sm font-medium", !brand && "text-muted")}>{productName}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight" style={brand ? { color: brand.accent } : undefined}>
              {headline}
            </p>
          </div>
        </div>
      )}
      <div className="space-y-1 p-3" style={brand ? { background: brand.bg, color: brand.fg } : undefined}>
        <p className="text-sm font-medium">{headline}</p>
        <p className={cn("text-xs leading-relaxed", !brand && "text-muted")} style={brand ? { opacity: 0.72 } : undefined}>
          {body}
        </p>
      </div>
    </div>
  );
}

export function AdPreview({ pack, shareable = true }: { pack: AdPackRecord; shareable?: boolean }) {
  const [tab, setTab] = useState<"launch" | "copy" | "creative" | "strategy">("launch");
  const [shared, setShared] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const content = pack.pack;
  const hero = content.images[0];
  const launch = resolveLaunch(pack.platform, content.launch);
  const shareUrl = pack.shareId ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${pack.shareId}` : "";

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "launch", label: "Launch" },
    { id: "copy", label: "Copy" },
    { id: "creative", label: "Creative" },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Octane</p>
          <p className="text-5xl font-semibold tabular-nums tracking-tight text-primary">{content.octane.score}</p>
          <p className="mt-1 text-sm text-muted">
            {pack.productName}
            <span className="text-faint">
              {" "}
              · {PLATFORM_LABEL[pack.platform]} · {ENGINE_LABEL[pack.engine]}
            </span>
          </p>
          <BrandChip pack={content} />
        </div>
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

      {tab === "launch" ? <LaunchKit plan={launch} platform={pack.platform} /> : null}

      {tab === "copy" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
          <FeedMock
            pack={content}
            productName={pack.productName}
            platform={PLATFORM_LABEL[pack.platform]}
            headline={content.headlines[0] ?? pack.productName}
            body={content.primaryTexts[0] ?? ""}
            heroUrl={hero?.url}
          />

          <div className="space-y-4">
            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Headlines</h3>
              {content.headlines.map((line) => (
                <Line key={line} text={line} />
              ))}
            </section>
            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Primary text</h3>
              {content.primaryTexts.map((line) => (
                <Line key={line} text={line} />
              ))}
            </section>
            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">CTAs</h3>
              <div className="flex flex-wrap gap-2">
                {content.ctas.map((cta) => (
                  <span
                    key={cta}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-2 py-1 pl-3 pr-1 text-xs"
                  >
                    {cta}
                    <CopyBtn text={cta} />
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {tab === "creative" ? (
        <div className="space-y-4">
          {content.images.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {content.images.map((img) => (
                <figure key={img.url} className="overflow-hidden rounded-lg border border-border bg-bg">
                  <img
                    src={img.url}
                    alt=""
                    className={cn(
                      "w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10",
                      img.aspect === "9:16" ? "aspect-[9/16]" : "aspect-square",
                    )}
                    crossOrigin="anonymous"
                  />
                  <figcaption className="px-3 py-2 text-xs text-muted">{img.aspect} creative</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <p className="text-sm text-muted">
                Image ads unlock on Plus. Upgrade to generate feed creatives with this copy.
              </p>
              <Button asChild className="mt-4" size="sm">
                <a href="/pricing">See Plus</a>
              </Button>
            </div>
          )}
          {content.descriptions.length ? (
            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Descriptions</h3>
              {content.descriptions.map((line) => (
                <Line key={line} text={line} />
              ))}
            </section>
          ) : null}
        </div>
      ) : null}

      {tab === "strategy" ? (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-bg p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Why this score</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{content.octane.rationale}</p>
            {content.octane.lifts.length ? (
              <ul className="mt-3 space-y-1 text-sm text-fg">
                {content.octane.lifts.map((lift) => (
                  <li key={lift} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {lift}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <section className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Angles</h3>
            {content.angles.map((angle) => (
              <div key={angle.name} className="rounded-sm border border-border bg-bg px-3 py-3">
                <p className="text-sm font-medium">{angle.name}</p>
                <p className="mt-1 text-sm text-fg">{angle.hook}</p>
                <p className="mt-1 text-xs text-muted">{angle.why}</p>
              </div>
            ))}
          </section>
          {content.targeting ? (
            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-border bg-bg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Audiences</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {content.targeting.audiences.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-border bg-bg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Placements</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {content.targeting.placements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}
          {content.videoScripts?.length ? (
            <section className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Video scripts</h3>
              {content.videoScripts.map((script) => (
                <div key={script.length} className="rounded-sm border border-border bg-bg p-3">
                  <p className="text-xs text-primary-soft">{script.length}</p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted">Hook. </span>
                    {script.hook}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted">Body. </span>
                    {script.body}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted">CTA. </span>
                    {script.cta}
                  </p>
                  {script.overlayText ? (
                    <p className="mt-1 text-sm">
                      <span className="text-muted">Overlay. </span>
                      {script.overlayText}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : (
            pack.engine !== "premium" && (
              <p className="text-sm text-muted">Targeting and video scripts ship with Premium.</p>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
