import { PLATFORM_LABEL, type Platform } from "@/lib/ads/plans";
import { cn } from "@/lib/utils";

export function OctaneCard({
  score,
  productName,
  platform,
  rationale,
  size = "md",
}: {
  score: number;
  productName: string;
  platform: Platform;
  rationale?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface text-center",
        size === "lg" ? "px-6 py-10" : "px-5 py-6",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Octane Score</p>
      <p
        className={cn(
          "mt-2 font-semibold tabular-nums tracking-tight text-primary",
          size === "lg" ? "text-7xl leading-none sm:text-8xl" : "text-5xl leading-none",
        )}
      >
        {score}
      </p>
      <p className="mt-3 text-sm text-muted">
        {productName}
        <span className="text-faint"> · {PLATFORM_LABEL[platform]}</span>
      </p>
      {rationale ? (
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg">{rationale}</p>
      ) : null}
    </div>
  );
}
