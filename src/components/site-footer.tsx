import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Self-serve first-campaign kit. Copy, budget, launch steps. You go live. We don’t run ads.
            Free kits are drafts. AI when you pay — or your own key.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link to="/studio" className="hover:text-fg">
            Studio
          </Link>
          <Link to="/pricing" className="hover:text-fg">
            Pricing
          </Link>
          <Link to="/connections" className="hover:text-fg">
            Connections
          </Link>
          <Link to="/account" className="hover:text-fg">
            Account
          </Link>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs leading-relaxed text-faint sm:px-6">
          <p>
            AdFuel.ai is an independent product. Not affiliated with any other ad marketing
            agency, site, trademark, or brand.
          </p>
        </div>
      </div>
    </footer>
  );
}
