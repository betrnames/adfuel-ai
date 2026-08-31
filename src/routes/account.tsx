import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FuelGauge } from "@/components/fuel-gauge";
import { getMyProfile } from "@/lib/ads/server";
import { listMyPayments } from "@/lib/ads/billing-server";
import { PLAN_DETAILS, isPaidPlan } from "@/lib/ads/plans";
import type { PaymentRecord } from "@/lib/ads/billing";
import type { Profile } from "@/lib/ads/types";

export const Route = createFileRoute("/account")({ component: AccountPage });

function money(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(0)}`;
  }
}

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([getMyProfile(), listMyPayments()])
      .then(([nextProfile, nextPayments]) => {
        if (cancelled) return;
        setProfile(nextProfile);
        setPayments(nextPayments);
      })
      .catch(() => {
        if (!cancelled) {
          setPayments([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-40 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const paid = profile && isPaidPlan(profile.plan) ? PLAN_DETAILS[profile.plan] : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-soft">Account</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-2 text-sm text-muted">{user.primaryEmail ?? user.displayName}</p>

      <div className="mt-8 space-y-4">
        {profile ? <FuelGauge profile={profile} /> : <div className="h-16 animate-pulse rounded-lg bg-surface" />}

        <section className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Plan</p>
          {paid ? (
            <>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {paid.name} {paid.octane}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {paid.priceLabel}/mo · {paid.credits} campaigns
              </p>
              <Link
                to="/pricing"
                className="mt-4 inline-flex h-11 items-center rounded-sm border border-border px-4 text-sm font-medium hover:border-border-strong"
              >
                Change plan
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Free trial</h2>
              <p className="mt-1 text-sm text-muted">Three campaigns. Pay $12/mo to keep going.</p>
              <Link
                to="/checkout"
                search={{ plan: "regular" }}
                className="mt-4 inline-flex h-11 items-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-fg"
              >
                Pay Regular — $12
              </Link>
            </>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Connections</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">AI after you pay</h2>
          <p className="mt-1 text-sm text-muted">
            Free kits are drafts. Hosted AI unlocks on a paid plan. Or add your own key on
            Connections anytime.
          </p>
          <Link
            to="/connections"
            className="mt-4 inline-flex h-11 items-center rounded-sm border border-border px-4 text-sm font-medium hover:border-border-strong"
          >
            Manage connections
          </Link>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Invoices</p>
          {!payments ? (
            <div className="mt-4 h-24 animate-pulse rounded-md bg-bg" />
          ) : payments.filter((p) => p.status === "paid").length === 0 ? (
            <p className="mt-3 text-sm text-muted">No invoices yet. Your first receipt lands after you pay.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {payments
                .filter((p) => p.status === "paid")
                .map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium capitalize">{payment.plan}</p>
                      <p className="text-xs text-faint">
                        {new Date(payment.createdAt).toLocaleDateString()} · Card
                      </p>
                    </div>
                    <p className="text-sm tabular-nums">{money(payment.amountCents, payment.currency)}</p>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
