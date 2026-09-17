import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Logo } from "@/components/logo";
import { waitlistPublic } from "@/lib/waitlist";

export function SiteNav() {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const waitlist = waitlistPublic();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted md:flex">
          <a href="/#how" className="rounded-lg px-4 py-2 hover:bg-fg/5 hover:text-fg">
            How it works
          </a>
          <Link to="/pricing" className="rounded-lg px-4 py-2 hover:bg-fg/5 hover:text-fg">
            Pricing
          </Link>
          <Link to="/faq" className="rounded-lg px-4 py-2 hover:bg-fg/5 hover:text-fg">
            FAQ
          </Link>
          {!waitlist ? (
          <SignedIn>
            <Link to="/studio" className="rounded-lg px-4 py-2 hover:bg-fg/5 hover:text-fg">
              Studio
            </Link>
            <Link to="/connections" className="rounded-lg px-4 py-2 hover:bg-fg/5 hover:text-fg">
              Connections
            </Link>
            <Link to="/account" className="rounded-lg px-4 py-2 hover:bg-fg/5 hover:text-fg">
              Account
            </Link>
          </SignedIn>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          {waitlist ? (
            <a
              href="/#notify"
              className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover sm:inline-flex"
            >
              Get notified
            </a>
          ) : isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-surface-2" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/studio"
                className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover sm:inline-flex"
              >
                New pack
              </Link>
              <UserButton />
            </div>
          ) : (
            <SignedOut>
              <Link
                to="/login"
                className="hidden h-11 items-center rounded-full px-3 text-sm font-medium text-muted hover:text-fg sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg hover:bg-primary-hover sm:inline-flex"
              >
                Start free
              </Link>
            </SignedOut>
          )}
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-bg px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            <a href="/#how" className="rounded-full px-3 py-3 text-muted hover:bg-surface hover:text-fg" onClick={() => setOpen(false)}>
              How it works
            </a>
            <Link to="/pricing" className="rounded-full px-3 py-3 text-muted hover:bg-surface hover:text-fg" onClick={() => setOpen(false)}>
              Pricing
            </Link>
            <Link to="/faq" className="rounded-full px-3 py-3 text-muted hover:bg-surface hover:text-fg" onClick={() => setOpen(false)}>
              FAQ
            </Link>
            {waitlist ? (
              <a
                href="/#notify"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg"
                onClick={() => setOpen(false)}
              >
                Get notified
              </a>
            ) : user ? (
              <>
                <Link to="/studio" className="rounded-full px-3 py-3 text-muted hover:bg-surface hover:text-fg" onClick={() => setOpen(false)}>
                  Studio
                </Link>
                <Link to="/connections" className="rounded-full px-3 py-3 text-muted hover:bg-surface hover:text-fg" onClick={() => setOpen(false)}>
                  Connections
                </Link>
                <Link to="/account" className="rounded-full px-3 py-3 text-muted hover:bg-surface hover:text-fg" onClick={() => setOpen(false)}>
                  Account
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg"
                onClick={() => setOpen(false)}
              >
                Start free
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
