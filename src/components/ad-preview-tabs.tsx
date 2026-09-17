import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LaunchKit } from "@/components/launch-kit";
import { PLAN_DETAILS, PLATFORM_LABEL } from "@/lib/ads/plans";
import type { AdPackRecord } from "@/lib/ads/types";
import { parseBrand } from "@/lib/ads/brand";
import { cn } from "@/lib/utils";
import type { LaunchPlan } from "@/lib/ads/launch";

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

export function PreviewLaunch({
  plan,
  platform,
  locked = false,
}: {
  plan: LaunchPlan;
  platform: AdPackRecord["platform"];
  locked?: boolean;
}) {
  if (locked) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
          <p className="text-sm font-medium">Draft pack. Pay {PLAN_DETAILS.regular.priceLabel} for the live 7-day Launch plan.</p>
          <p className="mt-2 text-sm text-muted">
            Budget, audience, and the exact clicks unlock with 3 live statics on Regular.
          </p>
          <Button asChild className="mt-4">
            <Link to="/checkout" search={{ plan: "regular" }}>
              {PLAN_DETAILS.regular.cta}
            </Link>
          </Button>
        </div>
        <div className="pointer-events-none select-none opacity-40 blur-[1px]">
          <LaunchKit plan={plan} platform={platform} />
        </div>
      </div>
    );
  }
  return <LaunchKit plan={plan} platform={platform} />;
}

export function PreviewCopy({ pack }: { pack: AdPackRecord }) {
  const content = pack.pack;
  const hero = content.images[0];
  return (
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
              <span key={cta} className="inline-flex items-center gap-1 rounded-full bg-surface-2 py-1 pl-3 pr-1 text-xs">
                {cta}
                <CopyBtn text={cta} />
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function PreviewCreative({ pack }: { pack: AdPackRecord }) {
  const content = pack.pack;
  return (
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
              />
              <figcaption className="px-3 py-2 text-xs text-muted">{img.aspect} creative</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm text-muted">
            Live statics ship on Regular. Pay {PLAN_DETAILS.regular.priceLabel} for 3 on-brand ads in this pack.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/checkout" search={{ plan: "regular" }}>
              {PLAN_DETAILS.regular.cta}
            </Link>
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
  );
}

export function PreviewStrategy({ pack }: { pack: AdPackRecord }) {
  const content = pack.pack;
  return (
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
          <p className="text-sm text-muted">Audience notes ship with Premium. We don’t write video ads.</p>
        )
      )}
    </div>
  );
}
