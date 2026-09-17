import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Lock } from "lucide-react";
import { SignedInPage } from "@/lib/auth/signed-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMyProfile } from "@/lib/ads/packs-server";
import { COUNTRIES } from "@/lib/ads/billing";
import { finalizeStripeCheckout, getBillingConfig, startCheckout } from "@/lib/ads/billing-server";
import { PLAN_DETAILS, parsePlan } from "@/lib/ads/plans";
import { FuelGauge } from "@/components/fuel-gauge";
import type { Profile } from "@/lib/ads/types";
import { WaitlistGate } from "@/components/waitlist-gate";

type CheckoutSearch = { plan: "regular" | "plus" | "premium"; session_id?: string };

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => {
    const plan = parsePlan(typeof search.plan === "string" ? search.plan : "");
    const session_id = typeof search.session_id === "string" ? search.session_id : undefined;
    return { plan: plan ?? "regular", session_id };
  },
  component: () => (
    <WaitlistGate>
      <CheckoutPage />
    </WaitlistGate>
  ),
});

function CheckoutPage() {
  return (
    <SignedInPage
      skeleton={
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="h-64 animate-pulse rounded-xl bg-surface" />
        </div>
      }
    >
      {(user) => <CheckoutInner user={user} />}
    </SignedInPage>
  );
}

function CheckoutInner({ user }: { user: { displayName: string | null; primaryEmail: string | null } }) {
  const { plan: planId, session_id: sessionId } = Route.useSearch();
  const plan = PLAN_DETAILS[planId];
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [processor, setProcessor] = useState<"stripe" | "ledger">("ledger");
  const [busy, setBusy] = useState(false);
  const [finalizing, setFinalizing] = useState(Boolean(sessionId));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");

  useEffect(() => {
    if (!user) return;
    setName((prev) => prev || user.displayName || "");
    setEmail((prev) => prev || user.primaryEmail || "");
    void getMyProfile().then(setProfile).catch(() => undefined);
    void getBillingConfig()
      .then((cfg) => setProcessor(cfg.processor))
      .catch(() => setProcessor("ledger"));
  }, [user]);

  useEffect(() => {
    if (!user || !sessionId) return;
    let cancelled = false;
    setFinalizing(true);
    finalizeStripeCheckout({ data: { sessionId } })
      .then(async (next) => {
        if (cancelled) return;
        setProfile(next);
        toast.success(`${plan.name} is paid. Tank refilled.`);
        await navigate({ to: "/studio" });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Could not confirm payment");
        }
      })
      .finally(() => {
        if (!cancelled) setFinalizing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, sessionId, plan.name, navigate]);

  async function onPay(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const result = await startCheckout({
        data: {
          plan: planId,
          name,
          email,
          country,
          origin: window.location.origin,
        },
      });
      if (result.processor === "stripe") {
        window.location.assign(result.url);
        return;
      }
      setProfile(result.profile);
      toast.success(`${plan.name} ${plan.octane} is billed. Tank refilled.`);
      await navigate({ to: "/studio" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not complete payment");
    } finally {
      setBusy(false);
    }
  }

  if (finalizing) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-muted">Confirming payment…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_minmax(0,380px)]">
      <form onSubmit={onPay} className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pay for {plan.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {plan.priceLabel}/mo for {plan.credits} first-week packs. Renews until you cancel.
          </p>
        </div>

        {profile ? <FuelGauge profile={profile} /> : null}

        <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Billing details</h2>
          <div className="space-y-1.5">
            <Label htmlFor="bill-name">Name</Label>
            <Input
              id="bill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bill-email">Email for receipts</Label>
            <Input
              id="bill-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bill-country">Country</Label>
            <select
              id="bill-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {COUNTRIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Payment</h2>
            <span className="inline-flex items-center gap-1 text-xs text-faint">
              <Lock className="size-3.5" />
              Encrypted
            </span>
          </div>
          <div className="mt-4 rounded-md border border-border bg-bg px-4 py-3">
            <p className="text-sm font-medium">Card</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {processor === "stripe"
                ? "Visa, Mastercard, Amex. You’ll enter the card on Stripe’s checkout next."
                : "Visa, Mastercard, Amex. Billed monthly to this account. Receipts go to the email above."}
            </p>
          </div>
        </section>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Processing…" : `Pay ${plan.priceLabel} today`}
        </Button>
        <p className="text-center text-xs leading-relaxed text-faint">
          By paying you start a monthly subscription of {plan.priceLabel}. Cancel anytime from{" "}
          <Link to="/account" className="text-muted hover:text-fg">
            Account
          </Link>
          . See our{" "}
          <Link to="/legal" hash="refunds" className="text-muted hover:text-fg">
            Refunds & Terms
          </Link>
          .
        </p>
      </form>

      <aside className="h-fit rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Order</p>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-sm">
            AdFuel.ai {plan.name} {plan.octane}
          </p>
          <p className="text-sm tabular-nums">{plan.priceLabel}</p>
        </div>
        <p className="mt-1 text-xs text-faint">Billed monthly</p>
        <ul className="mt-5 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
          <p className="text-sm font-medium">Due today</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{plan.priceLabel}</p>
        </div>
        <Link to="/pricing" className="mt-4 block text-center text-sm text-muted hover:text-fg">
          Choose a different plan
        </Link>
      </aside>
    </main>
  );
}
