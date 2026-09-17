import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PLAN_DETAILS, STATICS_PER_PACK } from "@/lib/ads/plans";
import { cn } from "@/lib/utils";

const order = ["regular", "plus", "premium"] as const;

export function PricingGrid({ highlight = "regular" }: { highlight?: "regular" | "plus" | "premium" }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
      {order.map((id) => {
        const plan = PLAN_DETAILS[id];
        const featured = id === highlight;
        return (
          <article
            key={id}
            className={cn(
              "flex flex-col rounded-xl border p-5",
              featured ? "border-primary/40 bg-surface" : "border-border bg-surface/60",
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">
              {featured ? "Start here" : `Octane ${plan.octane}`}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
            <p className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{plan.priceLabel}</span>
              <span className="text-sm text-muted">/mo</span>
            </p>
            <p className="mt-1 text-xs text-faint">
              {plan.credits} packs · {plan.credits * STATICS_PER_PACK[plan.maxEngine]} statics ·{" "}
              {Math.round((plan.price / (plan.credits * STATICS_PER_PACK[plan.maxEngine])) * 100)}¢ each
            </p>
            <Link
              to="/checkout"
              search={{ plan: id }}
              className={cn(
                "mt-6 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold",
                featured
                  ? "bg-primary text-primary-fg hover:bg-primary-hover"
                  : "border border-border bg-surface-2 text-fg hover:border-border-strong",
              )}
            >
              {plan.cta}
            </Link>
            <ul className="mt-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-muted">
                  <Check className={cn("mt-0.5 size-4 shrink-0", featured ? "text-primary" : "text-faint")} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
