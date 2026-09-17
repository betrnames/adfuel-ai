import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const KEY = "adfuel.cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(!window.localStorage.getItem(KEY));
    } catch {
      setOpen(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(KEY, "essential");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 p-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Essential cookies only (sign-in, if you ever use Studio). Waitlist emails are stored to notify you. No ads
          trackers. See{" "}
          <Link to="/legal" hash="privacy" className="text-fg underline-offset-4 hover:underline">
            Privacy
          </Link>
          .
        </p>
        <Button type="button" size="sm" onClick={accept} className="shrink-0">
          OK
        </Button>
      </div>
    </div>
  );
}
