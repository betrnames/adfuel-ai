import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { GenerateBox } from "@/components/generate-box";
import { LaunchKit, SAMPLE_LAUNCH } from "@/components/launch-kit";
import { PricingGrid } from "@/components/pricing-grid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
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
            Add a product. Get the first campaign kit — headlines, budget, audience, and the
            clicks to go live yourself on Google, Meta, TikTok, or LinkedIn. Free kits are drafts.
          </p>
          <div className="mt-12 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#start">
                Get your first campaign
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

      <section id="start" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-peach">
            Start free
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Add a product. Get a campaign kit.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Three free draft kits. AI and image ads start when you pay — or when you add your own
            key. No Ads Manager required.
          </p>
          <div className="mt-8">
            <GenerateBox variant="hero" />
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
              t: "Get a campaign kit",
              b: "Copy, budget, audience, and an Octane Score. Written for a first run, not an agency deck.",
            },
            {
              n: "03",
              t: "You go live",
              b: "Open the ad account, add a card, paste the pack. We write the kit. You press launch.",
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
            A first-campaign playbook, not a paste dump.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Every pack opens on Launch. Budget, who to show, where it should run, and the exact clicks
            — you paste it into the ad account. We never press launch for you.
          </p>
          <div className="mt-8 rounded-xl border border-border bg-surface p-4 sm:p-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-faint">
              First campaign kit · {SAMPLE_LAUNCH.productName} · Facebook & Instagram
            </p>
            <LaunchKit plan={SAMPLE_LAUNCH.plan} platform={SAMPLE_LAUNCH.platform} />
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-peach">Pricing</p>
          <h2 className="mt-2 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Three drafts free. $12 for 50 AI campaigns.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            AdCreative starts at $39. Predis at $19. Pencil at $14. Regular is $12.
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
