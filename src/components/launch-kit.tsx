import { ExternalLink, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_ADS, PLATFORM_WHERE, type LaunchPlan } from "@/lib/ads/launch";
import type { Platform } from "@/lib/ads/plans";

export function LaunchKit({
  plan,
  platform,
}: {
  plan: LaunchPlan;
  platform: Platform;
}) {
  const ads = PLATFORM_ADS[platform];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
        <p className="text-sm font-medium">You don’t need an ad account yet.</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          This pack is the first tool. Open {ads.name}, follow the five steps, paste the copy. That’s a live campaign.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Daily budget" value={plan.dailyBudget} />
        <Stat label="Run for" value={plan.duration} />
        <Stat label="Goal" value={plan.objective} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Note label="Who to show" text={plan.audience} />
        <Note label={`Where · ${PLATFORM_WHERE[platform]}`} text={plan.placements} />
      </div>

      {plan.keywords.length ? (
        <div className="rounded-md border border-border bg-bg p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Keywords</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.keywords.map((word) => (
              <span key={word} className="rounded-full border border-border px-3 py-1 text-xs text-fg">
                {word}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <ol className="space-y-3">
        {plan.steps.map((step) => (
          <li key={step.n} className="rounded-md border border-border bg-bg p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm bg-surface-2 text-xs font-semibold tabular-nums text-primary-soft">
                {step.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
                {step.href ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover"
                  >
                    {step.hrefLabel ?? "Open"}
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="rounded-md border border-border bg-bg p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">What good looks like</p>
        <p className="mt-2 text-sm leading-relaxed text-fg">{plan.success}</p>
      </div>

      <Button asChild variant="secondary" className="w-full sm:w-auto">
        <a href={ads.href} target="_blank" rel="noreferrer">
          <Wallet className="size-4" />
          {ads.label}
          <ExternalLink className="size-3.5" />
        </a>
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-bg px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-1 text-sm font-medium leading-snug">{value}</p>
    </div>
  );
}

function Note({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-md border border-border bg-bg p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg">{text}</p>
    </div>
  );
}

export const SAMPLE_LAUNCH: { platform: Platform; productName: string; plan: LaunchPlan } = {
  platform: "meta",
  productName: "Harbor CRM",
  plan: resolveSample(),
};

function resolveSample(): LaunchPlan {
  return {
    dailyBudget: "$20 / day",
    duration: "7 days",
    objective: "Leads from 2–10 person shops",
    audience: "Owners and office managers at 2–10 person shops who still run the business from a spreadsheet.",
    placements: "Facebook and Instagram feed. One image, one offer.",
    keywords: [],
    success: "A handful of form fills in seven days at under $25 each is a win. Don’t raise budget until the first lead lands.",
    steps: [
      {
        n: 1,
        title: "Open a free Meta Ads account",
        detail: "No page, no pixel, no agency. Sign in and create the ads account.",
        href: PLATFORM_ADS.meta.href,
        hrefLabel: PLATFORM_ADS.meta.label,
      },
      {
        n: 2,
        title: "Add a card under Billing",
        detail: "A debit card is enough for a first $20/day test.",
      },
      {
        n: 3,
        title: "Create → Traffic",
        detail: "One campaign. Point it at the product URL.",
      },
      {
        n: 4,
        title: "Paste this audience",
        detail: "Owners of small shops. Skip the 40-checkbox targeting form.",
      },
      {
        n: 5,
        title: "Paste the copy, publish",
        detail: "Headline + primary text from the pack. $20/day. Go live.",
      },
    ],
  };
}
