import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      suppressHydrationWarning
      className={cn(
        "min-h-28 w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-faint outline-none transition-colors duration-150 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}
