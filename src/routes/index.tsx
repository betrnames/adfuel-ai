import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { GenerateBox } from "@/components/generate-box";
import { LaunchKit, SAMPLE_LAUNCH } from "@/components/launch-kit";
import { PricingGrid } from "@/components/pricing-grid";
import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@/components/ui/button";
import { competitorLine, regularOfferLine, trialKitLine } from "@/lib/ads/plans";
import { waitlistPublic } from "@/lib/waitlist";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const waitlist = waitlistPublic();
  return (
    <main>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="hero-orb-orange pointer-events-none absolute -left-24 top-24 size-[420px] rounded-full" />
        <div className="hero-orb-teal pointer-events-none absolute -right-16 bottom-20 size-[380px] rounded-full" />
        <div className="pointer-events-none absolute inset-0">
          {[25, 50, 75].map((left) => (
            <div
              key={left}
              className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-fg/5 to-transparent"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
        <div className="relative mx-auto flex min-h-[100svh] max-w-4xl flex-col justify-center px-5 pb-16 pt-8 sm:px-6 sm:pt-10">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Ads that{" "}
            <span className="ignite">ignite</span>
            <br />
            growth.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Paste a product URL. Get 3 on-brand statics, copy, and a 7-day Launch plan.
            You go live. We don’t run ads.
            {waitlist ? " Studio isn’t open yet — leave your email." : " One watermarked draft is free."}
          </p>
          <div className="mt-12 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={waitlist ? "#notify" : "#start"}>
                {waitlist ? "Get notified" : "Get this week’s ads"}
                <ArrowRight className="size-5" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <a href="#how">
                <Play className="size-4 fill-current" />
                See How It Works
              </a>
            </Button>
          </div>
        </div>
      </section>

      {waitlist ? null : (
        <section id="start" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-peach">Start free</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Paste a URL. Get this week’s ads.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              {trialKitLine().replace(/^./, (c) => c.toUpperCase())}. Pay {regularOfferLine()}. Or add your own key.
            </p>
            <div className="mt-8">
              <GenerateBox variant="hero" />
            </div>
          </div>
        </section>
      )}

      <section id="notify" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-peach">Waitlist</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Get an email when Studio opens.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            No cards. No generation on the public site. We’ll mail once.
          </p>
          <div className="mt-8">
            <WaitlistForm id="notify-form" />
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Add the product",
              b: "A URL or one sentence. Pick where people should see it. That’s the whole brief.",
            },
            {
              n: "02",
              t: "Get 3 statics + copy",
              b: "On-brand feed ads, headlines, and an Octane Score. Built to paste, not to present.",
            },
            {
              n: "03",
              t: "Run the 7-day plan",
              b: "Open the ad account, add a card, paste the pack. We write the ads. You press launch.",
            },
          ].map((step) => (
            <article key={step.n} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-xs tabular-nums text-primary-peach">{step.n}</p>
              <h2 className="mt-3 text-lg font-semibold">{step.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.b}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-peach">What you get</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            File plus the 7-day clicks. Not a tutorial.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Paid packs open on Launch. Budget, who to show, where it should run, and the exact clicks
            — you paste it into the ad account. We never press launch for you.
          </p>
          <div className="mt-8 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-faint">
              First-week pack · {SAMPLE_LAUNCH.productName} · Facebook & Instagram
            </p>
            <LaunchKit plan={SAMPLE_LAUNCH.plan} platform={SAMPLE_LAUNCH.platform} />
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-peach">Pricing</p>
          <h2 className="mt-2 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {trialKitLine().replace(/^./, (c) => c.toUpperCase())}. {regularOfferLine()}.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            {competitorLine()}
          </p>
          <div className="mt-10">
            <PricingGrid highlight="regular" />
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/studio" className="text-primary-peach hover:underline">
              Open studio
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
