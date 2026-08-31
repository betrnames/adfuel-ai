import { createFileRoute } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { StudioApp } from "@/components/studio-app";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-16 animate-pulse rounded-lg bg-surface" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <StudioApp />;
}
