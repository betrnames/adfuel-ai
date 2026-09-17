import { isPaidPlan, type PlanId } from "./plans.ts";
import type { AdPackContent } from "./types.ts";

export const LLM_PROVIDERS = ["xai", "openai", "anthropic"] as const;
export type LlmProviderId = (typeof LLM_PROVIDERS)[number];
export type EngineSource = "hosted" | "byok";

export const PROVIDER_META: Record<
  LlmProviderId,
  { label: string; models: string[]; keyPlaceholder: string; hint: string }
> = {
  xai: {
    label: "xAI",
    models: ["grok-4.5", "grok-4"],
    keyPlaceholder: "xai-…",
    hint: "console.x.ai",
  },
  openai: {
    label: "OpenAI",
    models: ["gpt-4.1", "gpt-4o"],
    keyPlaceholder: "sk-…",
    hint: "platform.openai.com",
  },
  anthropic: {
    label: "Anthropic",
    models: ["claude-sonnet-4-5", "claude-3-5-sonnet-latest"],
    keyPlaceholder: "sk-ant-…",
    hint: "console.anthropic.com",
  },
};

export type McpServerPublic = {
  id: string;
  name: string;
  url: string;
  hasAuth: boolean;
  enabled: boolean;
  lastOk: string | null;
  lastError: string | null;
  toolCount: number | null;
};

export type ConnectionPublic = {
  plan: PlanId | string;
  source: EngineSource;
  provider: LlmProviderId;
  model: string;
  hasKey: boolean;
  keyHint: string | null;
  hostedAvailable: boolean;
  servers: McpServerPublic[];
};

export type WriterKind = "hosted" | "byok" | "draft";

/** Hosted AI is a paid perk. Trial is draft unless they bring a key. */
export function pickWriter(input: {
  plan: PlanId | string;
  source: EngineSource;
  hasUserKey: boolean;
  hostedAvailable: boolean;
}): WriterKind {
  if (input.source === "byok" && input.hasUserKey) return "byok";
  if (isPaidPlan(input.plan) && input.hostedAvailable) return "hosted";
  return "draft";
}

export function canUseHostedAi(plan: PlanId | string): boolean {
  return isPaidPlan(plan);
}

export function packWriter(pack: AdPackContent): WriterKind {
  if (pack.writer === "hosted" || pack.writer === "byok" || pack.writer === "draft") return pack.writer;
  if (/draft engine/i.test(pack.octane.rationale)) return "draft";
  return "hosted";
}

export const BYOK_MISSING_KEY_ERROR =
  "Add your API key on Connections. Paid plans can use hosted AI instead.";

export type GenerationSource = {
  source: EngineSource;
  provider: LlmProviderId;
  model: string;
  apiKey: string | null;
  hostedKey: string | null;
};

export type WriterDecision =
  | { kind: "byok"; apiKey: string; provider: LlmProviderId; model: string }
  | { kind: "hosted"; apiKey: string }
  | { kind: "draft" }
  | { kind: "error"; code: "ai"; error: string };

/** Exact generate path: BYOK with no key errors; hosted only after they pay. */
export function decideWriter(plan: PlanId | string, source: GenerationSource): WriterDecision {
  if (source.source === "byok") {
    if (!source.apiKey) {
      return { kind: "error", code: "ai", error: BYOK_MISSING_KEY_ERROR };
    }
    return { kind: "byok", apiKey: source.apiKey, provider: source.provider, model: source.model };
  }
  if (plan !== "trial" && source.hostedKey) {
    return { kind: "hosted", apiKey: source.hostedKey };
  }
  return { kind: "draft" };
}

export function writerLabel(kind: WriterKind, provider?: LlmProviderId, mcpCount = 0): string {
  const mcp = mcpCount > 0 ? ` + ${mcpCount} MCP` : "";
  if (kind === "hosted") return `AI${mcp}`;
  if (kind === "byok") return `${PROVIDER_META[provider ?? "openai"].label}${mcp}`;
  return `Draft engine${mcp}`;
}
