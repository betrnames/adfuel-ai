import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Self-serve first-week ads. 3 statics, copy, 7-day Launch plan. You go live. We don’t run ads.
            One watermarked draft is free. Live statics when you pay — or your own key.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link to="/pricing" className="hover:text-fg">
            Pricing
          </Link>
          <Link to="/faq" className="hover:text-fg">
            FAQ
          </Link>
          <Link to="/legal" hash="terms" className="hover:text-fg">
            Terms
          </Link>
          <Link to="/legal" hash="privacy" className="hover:text-fg">
            Privacy
          </Link>
          <a href="/llms.txt" className="hover:text-fg">
            llms.txt
          </a>
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
