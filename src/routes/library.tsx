import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AdPreview } from "@/components/ad-preview";
import { listMyPacks } from "@/lib/ads/server";
import { ENGINE_LABEL, PLATFORM_LABEL } from "@/lib/ads/plans";
import type { AdPackRecord } from "@/lib/ads/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function LibraryPage() {
  const { user, isPending } = useCurrentUserState();
  const [packs, setPacks] = useState<AdPackRecord[]>([]);
  const [active, setActive] = useState<AdPackRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    listMyPacks()
      .then((rows) => {
        if (cancelled) return;
        setPacks(rows);
        setActive(rows[0] ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return <div className="mx-auto max-w-6xl px-4 py-10"><div className="h-16 animate-pulse rounded-lg bg-surface" /></div>;
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Library</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Saved campaigns</h1>
      <p className="mt-2 text-sm text-muted">Every generation stays on your account. Open one to launch, copy, or restyle.</p>

      {!loaded ? (
        <div className="mt-8 h-64 animate-pulse rounded-xl bg-surface" />
      ) : packs.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted">No campaigns yet.</p>
          <Link to="/studio" className="mt-4 inline-flex h-11 items-center rounded-sm bg-primary px-5 text-sm font-medium text-primary-fg">
            Generate the first one
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
          <ul className="space-y-2">
            {packs.map((pack) => (
              <li key={pack.id}>
                <button
                  type="button"
                  onClick={() => setActive(pack)}
                  className={cn(
                    "w-full rounded-md border px-3 py-3 text-left",
                    active?.id === pack.id ? "border-primary/40 bg-surface" : "border-border bg-bg hover:border-border-strong",
                  )}
                >
                  <p className="text-sm font-medium">{pack.productName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {PLATFORM_LABEL[pack.platform]} · {ENGINE_LABEL[pack.engine]} · {pack.octane ?? "—"}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          {active ? <AdPreview pack={active} /> : null}
        </div>
      )}
    </main>
  );
}
