import { useEffect, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "./gates";
import { useCurrentUserState, type AppUser } from "./use-current-user";

export function SignedInPage({
  children,
  skeleton,
}: {
  children: (user: AppUser) => ReactNode;
  skeleton?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pulse =
    skeleton ?? (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-40 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  if (!mounted || isPending) return pulse;
  if (!user) return <RedirectToSignIn />;
  return <>{children(user)}</>;
}
