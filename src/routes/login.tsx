import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlameMark } from "@/components/logo";
import { PLAN_DETAILS, trialKitLine } from "@/lib/ads/plans";
import { WaitlistGate } from "@/components/waitlist-gate";

export const Route = createFileRoute("/login")({
  component: () => (
    <WaitlistGate>
      <Login />
    </WaitlistGate>
  ),
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/studio" });
    }
  }, [isPending, user, navigate]);

  async function onEmail(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Advertiser",
        });
        if (err) {
          setError(err.message || "Could not create the account");
          return;
        }
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) {
          setError(err.message || "Could not sign in");
          return;
        }
      }
      await router.invalidate();
      await navigate({ to: "/studio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full rounded-xl border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-2">
          <FlameMark className="size-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Sign in to AdFuel.ai</h1>
            <p className="text-xs text-muted">{trialKitLine().replace(/^./, (c) => c.toUpperCase())}. Then {PLAN_DETAILS.regular.priceLabel} for 3 live statics.</p>
          </div>
        </div>

        {authEnabled ? (
          <div className="space-y-5">
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/studio" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-faint">
              <span className="h-px flex-1 bg-border" />
              or email
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={onEmail} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
              </Button>
            </form>

            <button
              type="button"
              className="w-full text-center text-sm text-muted hover:text-fg"
              onClick={() => {
                setMode(mode === "up" ? "in" : "up");
                setError(null);
              }}
            >
              {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
