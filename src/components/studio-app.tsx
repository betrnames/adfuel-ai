import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FuelGauge } from "@/components/fuel-gauge";
import { AdPreview } from "@/components/ad-preview";
import { GenerateBox } from "@/components/generate-box";
import { generateAdPack, getMyProfile, listMyPacks } from "@/lib/ads/server";
import { getMyConnections } from "@/lib/ads/connections-server";
import { pickWriter, writerLabel } from "@/lib/ads/connections";
import { takePending } from "@/lib/ads/pending";
import type { Platform } from "@/lib/ads/plans";
import type { AdPackRecord, Profile } from "@/lib/ads/types";
import { cn } from "@/lib/utils";

function isUnauthorized(err: unknown): boolean {
  return err instanceof Error && /unauthorized/i.test(err.message);
}

export function StudioApp() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [packs, setPacks] = useState<AdPackRecord[]>([]);
  const [active, setActive] = useState<AdPackRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("Draft free · AI when you pay or add a key");
  const autoRan = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyProfile(), listMyPacks(), getMyConnections().catch(() => null)])
      .then(([nextProfile, nextPacks, connections]) => {
        if (cancelled) return;
        setProfile(nextProfile);
        setPacks(nextPacks);
        setActive(nextPacks[0] ?? null);
        if (connections) {
          const kind = pickWriter({
            plan: nextProfile.plan,
            source: connections.source,
            hasUserKey: connections.hasKey,
            hostedAvailable: connections.hostedAvailable,
          });
          setHint(
            `Using ${writerLabel(kind, connections.provider, connections.servers.filter((s) => s.enabled).length)}`,
          );
        }
      })
      .catch((err: unknown) => {
        if (!cancelled && !isUnauthorized(err)) {
          toast.error(err instanceof Error ? err.message : "Could not load studio");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function run(input: { prompt: string; platform: Platform }) {
    if (busy) return;
    setBusy(true);
    try {
      const result = await generateAdPack({ data: input });
      if (!result.ok) {
        toast.error(result.error);
        if (result.profile) setProfile(result.profile);
        return;
      }
      if (result.profile) setProfile(result.profile);
      if (result.pack) {
        setPacks((prev) => [result.pack!, ...prev]);
        setActive(result.pack);
        const written =
          "writerLabel" in result && result.writerLabel
            ? result.writerLabel
            : "campaign";
        toast.success(`Octane ${result.pack.pack.octane.score} · ${written}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (loading || !profile || autoRan.current) return;
    const pending = takePending();
    if (!pending) return;
    autoRan.current = true;
    void run(pending);
  }, [loading, profile]);

  if (loading || !profile) {
    return (
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6">
        <div className="h-16 animate-pulse rounded-lg bg-surface" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className="h-80 animate-pulse rounded-xl bg-surface" />
          <div className="h-80 animate-pulse rounded-xl bg-surface" />
        </div>
      </div>
    );
  }

  const empty = profile.credits < 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Studio</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Build a first campaign.</h1>
        </div>
        <FuelGauge profile={profile} className="sm:min-w-[320px]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <GenerateBox variant="panel" onSubmitPrompt={run} busy={busy} empty={empty} writerHint={hint} />

        <div className="space-y-4">
          {busy ? (
            <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
              <div className="mx-auto h-1.5 w-40 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
              </div>
              <p className="mt-4 text-sm text-muted">Writing copy, budget, and the launch steps.</p>
            </div>
          ) : active ? (
            <AdPreview pack={active} shareable />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="text-sm font-medium">No ad account needed.</p>
              <p className="mt-2 text-sm text-muted">
                Three free campaigns. Each one includes the clicks to go live.
              </p>
            </div>
          )}

          {packs.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {packs.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item)}
                  className={cn(
                    "h-11 rounded-full border px-3 text-xs",
                    active?.id === item.id
                      ? "border-primary/50 text-fg"
                      : "border-border text-muted hover:text-fg",
                  )}
                >
                  {item.productName} · {item.octane ?? "—"}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
