import { matchFaq, type DeskMessage } from "./faq";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 20;
const hits = new Map<string, number[]>();

function allow(key: string): boolean {
  const now = Date.now();
  const next = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (next.length >= MAX_HITS) {
    hits.set(key, next);
    return false;
  }
  next.push(now);
  hits.set(key, next);
  return true;
}

export function parseDeskBody(input: unknown): {
  question: string;
  history: DeskMessage[];
  guestId: string;
} {
  const rec = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const question = String(rec.question ?? "").trim().slice(0, 400);
  if (question.length < 2) throw new Error("Ask a short question");
  const history = (Array.isArray(rec.history) ? rec.history : [])
    .slice(-6)
    .map((m) => {
      const row = m && typeof m === "object" ? (m as Record<string, unknown>) : {};
      return {
        role: row.role === "assistant" ? ("assistant" as const) : ("user" as const),
        text: String(row.text ?? "").trim().slice(0, 400),
      };
    })
    .filter((m) => m.text);
  const guestId = String(rec.guestId ?? "anon").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "anon";
  return { question, history, guestId };
}

export async function answerDesk(input: {
  question: string;
  history: DeskMessage[];
  guestId: string;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!allow(input.guestId)) {
    return { ok: false, error: "The desk is busy. Try again in a bit, or open Pricing / Account." };
  }

  const canned = matchFaq(input.question);
  if (canned) return { ok: true, text: canned };

  return {
    ok: true,
    text: "This desk answers from the product docs. Try: Do you run the ads? How do I go live? What’s $12 include? How do I cancel? Or open Studio, Pricing, Connections, or Account.",
  };
}
