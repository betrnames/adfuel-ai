export type BrandLook = {
  bg: string;
  fg: string;
  accent: string;
  type: string;
};

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeHex(value: string): string | null {
  const raw = value.trim();
  if (!HEX.test(raw)) return null;
  let hex = raw.slice(1).toLowerCase();
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return `#${hex}`;
}

function channel(n: number) {
  const v = n / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function isDark(hex: string): boolean {
  const n = normalizeHex(hex);
  if (!n) return true;
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  const L = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  return L < 0.45;
}

function contrastOn(bg: string): string {
  return isDark(bg) ? "#f4efe8" : "#121212";
}

export function parseBrand(raw: unknown): BrandLook | null {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const bg = normalizeHex(String(rec.bg ?? rec.background ?? ""));
  const fg = normalizeHex(String(rec.fg ?? rec.foreground ?? rec.text ?? ""));
  const accent = normalizeHex(String(rec.accent ?? rec.primary ?? ""));
  const type = String(rec.type ?? rec.typography ?? rec.font ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
  if (!bg && !accent) return null;
  const useBg = bg ?? "#111111";
  const useAccent = accent ?? bg ?? "#f4efe8";
  return {
    bg: useBg,
    fg: fg ?? contrastOn(useBg),
    accent: useAccent,
    type: type || "the product site’s sans-serif",
  };
}

export function hexesIn(text: string): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
    const hex = normalizeHex(match[0] ?? "");
    if (hex && !found.includes(hex)) found.push(hex);
  }
  return found.slice(0, 3);
}

function parsePromptUrl(prompt: string): URL | null {
  const token = prompt.trim().split(/\s+/)[0] ?? "";
  try {
    const url = new URL(token.includes("://") ? token : `https://${token}`);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (!host.includes(".")) return null;
    if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return null;
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) return null;
    if (host.includes(":")) return null;
    return url;
  } catch {
    return null;
  }
}

function fontFromHtml(html: string): string | null {
  const css2 = html.match(/fonts\.googleapis\.com\/css2\?family=([A-Za-z0-9_+%:-]+)/);
  const css1 = html.match(/fonts\.googleapis\.com\/css\?family=([A-Za-z0-9_+%:-]+)/);
  const raw = css2?.[1] ?? css1?.[1];
  if (!raw) return null;
  const family = decodeURIComponent(raw.split(":")[0] ?? "")
    .replaceAll("+", " ")
    .trim();
  return family.slice(0, 40) || null;
}

function themeFromHtml(html: string): string | null {
  const meta =
    html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i);
  return meta?.[1] ? normalizeHex(meta[1]) : null;
}

export async function sniffBrand(prompt: string): Promise<BrandLook | null> {
  const pasted = hexesIn(prompt);
  if (pasted.length) {
    const bg = pasted[0]!;
    const accent = pasted[1] ?? bg;
    const fg = pasted[2] ?? contrastOn(bg);
    return { bg, fg, accent, type: "the product site’s sans-serif" };
  }

  const url = parsePromptUrl(prompt);
  if (!url) return null;

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(3500),
      headers: { Accept: "text/html", "User-Agent": "AdFuel.ai brand look" },
    });
    const finalHost = new URL(res.url).hostname.toLowerCase();
    if (finalHost === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(finalHost)) return null;
    const ctype = res.headers.get("content-type") ?? "";
    if (!res.ok || !ctype.includes("html")) return null;
    const html = (await res.text()).slice(0, 80_000);
    const theme = themeFromHtml(html);
    const type = fontFromHtml(html);
    if (!theme && !type) return null;
    const bg = theme ?? "#111111";
    return {
      bg,
      fg: contrastOn(bg),
      accent: theme ?? contrastOn(bg),
      type: type ? `${type}` : "the product site’s sans-serif",
    };
  } catch {
    return null;
  }
}

export function brandImageHint(brand: BrandLook | null): string {
  if (!brand) {
    return "Keep the product’s existing colors and typography. Do not restyle into a new palette or a different typeface.";
  }
  return `Keep this exact look: background ${brand.bg}, type/foreground ${brand.fg}, accent ${brand.accent}. Typography: ${brand.type}. Do not restyle into a new palette or a different typeface.`;
}
