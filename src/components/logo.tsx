import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlameMark({ className }: { className?: string }) {
  return (
    <Flame
      className={cn("shrink-0", className)}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5 text-fg", className)}
      aria-label="AdFuel.ai home"
    >
      <FlameMark className="size-7 text-primary flame-sway" />
      <span className="text-xl font-bold tracking-tight">
        AdFuel
        <span className="text-primary-soft">.ai</span>
      </span>
    </Link>
  );
}
