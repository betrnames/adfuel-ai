import { PLATFORM_LABEL, type Platform } from "@/lib/ads/plans";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function OctaneCard({
  score,
  productName,
  platform,
  rationale,
  meta,
  size = "md",
  align = "center",
  children,
}: {
  score: number;
  productName: string;
  platform: Platform;
  rationale?: string;
  meta?: string;
  size?: "md" | "lg";
  align?: "center" | "start";
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface",
        centered ? "text-center" : "text-left",
        size === "lg" ? "px-6 py-10" : centered ? "px-5 py-6" : "p-0 border-0 bg-transparent",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">
        {centered ? "Octane Score" : "Octane"}
      </p>
      <p
        className={cn(
          "font-semibold tabular-nums tracking-tight text-primary",
          centered ? "mt-2" : "mt-0",
          size === "lg" ? "text-7xl leading-none sm:text-8xl" : "text-5xl leading-none",
        )}
      >
        {score}
      </p>
      <p className={cn("text-sm text-muted", centered ? "mt-3" : "mt-1")}>
        {productName}
        <span className="text-faint">
          {" "}
          · {PLATFORM_LABEL[platform]}
          {meta ? ` · ${meta}` : ""}
        </span>
      </p>
      {children}
      {rationale ? (
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fg">{rationale}</p>
      ) : null}
    </div>
  );
}
