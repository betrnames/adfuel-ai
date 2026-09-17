import { createFileRoute } from "@tanstack/react-router";
import { SignedInPage } from "@/lib/auth/signed-in";
import { StudioApp } from "@/components/studio-app";
import { WaitlistGate } from "@/components/waitlist-gate";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  return (
    <WaitlistGate>
      <SignedInPage
        skeleton={
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="h-16 animate-pulse rounded-lg bg-surface" />
          </div>
        }
      >
        {() => <StudioApp />}
      </SignedInPage>
    </WaitlistGate>
  );
}
