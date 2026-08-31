import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { PLAN_DETAILS, isPaidPlan } from "@/lib/ads/plans";
import type { Profile } from "@/lib/ads/types";

export function FuelGauge({ profile, className }: { profile: Profile; className?: string }) {
  const details = isPaidPlan(profile.plan) ? PLAN_DETAILS[profile.plan] : null;
  const cap = details?.credits ?? 3;
  const pct = Math.max(0, Math.min(100, Math.round((profile.credits / cap) * 100)));
  const planName = details ? `${details.name} ${details.octane}` : "3 free campaigns";
  const empty = profile.credits < 1;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3",
        className,
      )}
    >
      <div className="relative size-10 shrink-0">
        <svg viewBox="0 0 36 36" className="size-10 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" className="text-surface-2" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="4"
            strokeDasharray={`${(pct / 100) * 88} 88`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xs font-semibold tabular-nums">
          {profile.credits}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{planName}</p>
        <p className="text-sm font-medium tabular-nums">
          {profile.credits} <span className="font-normal text-muted">left</span>
        </p>
      </div>
      {empty ? (
        <Link
          to="/checkout"
          search={{ plan: "regular" }}
          className="ml-auto inline-flex h-9 items-center rounded-sm bg-primary px-3 text-sm font-medium text-primary-fg"
        >
          Pay $12
        </Link>
      ) : null}
    </div>
  );
}
