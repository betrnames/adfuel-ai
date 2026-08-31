import type { Platform } from "./plans";

const KEY = "adfuel.pending";

export type PendingBrief = {
  prompt: string;
  platform: Platform;
};

export function savePending(brief: PendingBrief) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(brief));
  } catch {
    /* ignore */
  }
}

export function takePending(): PendingBrief | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as PendingBrief;
    if (typeof parsed.prompt !== "string" || typeof parsed.platform !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}
