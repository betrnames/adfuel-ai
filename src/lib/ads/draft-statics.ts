import type { AdImage } from "./types.ts";
import type { BrandLook } from "./brand.ts";
import { PLAN_DETAILS } from "./plans.ts";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrap(text: string, max = 22): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export function watermarkedStatics(input: {
  productName: string;
  headlines: string[];
  brand: BrandLook | null;
}): AdImage[] {
  const bg = input.brand?.bg ?? "#111111";
  const fg = input.brand?.fg ?? "#f4efe8";
  const accent = input.brand?.accent ?? "#F97316";
  const price = PLAN_DETAILS.regular.priceLabel;
  const marks = input.headlines.slice(0, 3);
  while (marks.length < 3) marks.push(input.productName);

  return marks.map((headline, index) => {
    const lines = wrap(headline);
    const titleLines = wrap(input.productName, 18);
    const text = lines
      .map(
        (line, i) =>
          `<text x="540" y="${520 + i * 52}" text-anchor="middle" fill="${escapeXml(fg)}" font-size="40" font-family="Sora, Arial, sans-serif" font-weight="700">${escapeXml(line)}</text>`,
      )
      .join("");
    const titles = titleLines
      .map(
        (line, i) =>
          `<text x="540" y="${360 + i * 36}" text-anchor="middle" fill="${escapeXml(accent)}" font-size="28" font-family="Sora, Arial, sans-serif" font-weight="600">${escapeXml(line)}</text>`,
      )
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
      <rect width="1080" height="1080" fill="${escapeXml(bg)}"/>
      <rect x="48" y="48" width="984" height="984" fill="none" stroke="${escapeXml(accent)}" stroke-width="8" opacity="0.45"/>
      ${titles}
      ${text}
      <text x="540" y="980" text-anchor="middle" fill="${escapeXml(fg)}" opacity="0.55" font-size="26" font-family="Sora, Arial, sans-serif" font-weight="600">DRAFT ${index + 1}/3 · Pay ${escapeXml(price)} for live statics</text>
    </svg>`;
    return {
      url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      aspect: "1:1",
      prompt: "draft-watermark",
    };
  });
}
