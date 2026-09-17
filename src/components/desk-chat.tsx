import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { FlameMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { STARTERS, type DeskMessage } from "@/lib/desk/faq";
import { cn } from "@/lib/utils";

const GREETING: DeskMessage = {
  role: "assistant",
  text: "Desk here. Self-serve only — we don’t run ads or take calls. One watermarked draft is free. Pay $12 for 3 live statics and a 7-day Launch plan, or add your own key. Ask about going live, plans, or cancel.",
};

function guestId() {
  if (typeof window === "undefined") return "anon";
  const key = "adfuel.desk.guest";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  sessionStorage.setItem(key, next);
  return next;
}

export function DeskChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<DeskMessage[]>([GREETING]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(question: string) {
    const text = question.trim();
    if (text.length < 2 || busy) return;
    const history = messages.slice(-6);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setBusy(true);
    try {
      const res = await fetch("/api/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, history, guestId: guestId() }),
      });
      const result = (await res.json()) as { ok?: boolean; text?: string; error?: string };
      const reply = result.ok
        ? result.text || "The desk didn’t answer. Try Pricing or Account."
        : result.error || "The desk didn’t answer. Try Pricing or Account.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: err instanceof Error ? err.message : "The desk didn’t answer. Try Pricing or Account.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 sm:p-5">
      {open ? (
        <section
          className="pointer-events-auto flex h-[min(32rem,calc(100dvh-6rem))] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[0_16px_48px_rgb(0_0_0/0.4)]"
          role="dialog"
          aria-label="AdFuel Ask"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <FlameMark className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Ask</p>
                <p className="text-xs text-faint">No humans. No agency.</p>
              </div>
            </div>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-sm text-muted hover:bg-surface-2 hover:text-fg"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((item, index) => (
              <p
                key={`${item.role}-${index}`}
                className={cn(
                  "max-w-[92%] text-sm leading-relaxed",
                  item.role === "user"
                    ? "ml-auto rounded-md bg-primary/15 px-3 py-2 text-fg"
                    : "text-muted",
                )}
              >
                {item.text}
              </p>
            ))}
            {busy ? <p className="text-sm text-faint">Writing…</p> : null}
            {messages.length < 3 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    className="h-11 rounded-full border border-border px-3 text-xs text-muted hover:text-fg"
                    onClick={() => void send(starter)}
                    disabled={busy}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question"
                maxLength={400}
                className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg px-3 text-sm outline-none placeholder:text-faint focus-visible:border-primary/60"
              />
              <Button type="submit" size="sm" className="h-11 w-11 shrink-0 px-0" disabled={busy || input.trim().length < 2}>
                <ArrowUp className="size-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg shadow-[0_8px_24px_rgb(249_115_22/0.28)] hover:bg-primary-hover"
          aria-label="Ask"
        >
          <MessageCircle className="size-4" />
          Ask
        </button>
      )}
    </div>
  );
}
