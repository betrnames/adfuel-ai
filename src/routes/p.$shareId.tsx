import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdPreview } from "@/components/ad-preview";
import { OctaneCard } from "@/components/octane-card";
import { getSharedPack } from "@/lib/ads/packs-server";
import type { AdPackRecord } from "@/lib/ads/types";
import { TRIAL_CREDITS } from "@/lib/ads/plans";

export const Route = createFileRoute("/p/$shareId")({ component: SharedPack });

function SharedPack() {
  const { shareId } = Route.useParams();
  const [pack, setPack] = useState<AdPackRecord | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getSharedPack({ data: { shareId } })
      .then((row) => {
        if (!cancelled) setPack(row);
      })
      .catch(() => {
        if (!cancelled) setPack(null);
      });
    return () => {
      cancelled = true;
    };
  }, [shareId]);

  if (pack === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="h-80 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }

  if (!pack) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Pack not found</h1>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-fg"
        >
          Make your own
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <OctaneCard
        size="lg"
        score={pack.pack.octane.score}
        productName={pack.productName}
        platform={pack.platform}
        rationale={pack.pack.octane.rationale}
      />

      {pack.pack.headlines.length ? (
        <section className="mt-6 rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Headlines you can run</p>
          <ul className="mt-3 space-y-2">
            {pack.pack.headlines.slice(0, 3).map((line) => (
              <li key={line} className="text-lg font-medium tracking-tight">
                {line}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-5 text-center">
        <p className="text-base font-medium">Can you beat {pack.pack.octane.score}?</p>
        <p className="mt-1 text-sm text-muted">
          Paste a product URL. Get 3 statics, copy, and a 7-day plan. {TRIAL_CREDITS} watermarked draft is free.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-fg"
        >
          Make mine
        </Link>
      </div>

      <div className="mt-10">
        <AdPreview pack={pack} shareable={false} />
      </div>
    </main>
  );
}
