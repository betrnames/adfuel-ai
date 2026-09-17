import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canUseHostedAi, decideWriter, packWriter, pickWriter } from "./connections.ts";
import type { AdPackContent } from "./types.ts";

function pack(partial: Partial<AdPackContent> = {}): AdPackContent {
  return {
    productName: "Demo",
    headlines: [],
    primaryTexts: [],
    descriptions: [],
    ctas: [],
    angles: [],
    octane: { score: 62, rationale: "Draft engine wrote this from the brief without a live model.", lifts: [] },
    targeting: null,
    videoScripts: null,
    imagePrompt: "",
    images: [],
    ...partial,
  };
}

describe("pickWriter", () => {
  it("trial without a key is always draft, even if hosted is selected", () => {
    assert.equal(
      pickWriter({ plan: "trial", source: "hosted", hasUserKey: false, hostedAvailable: true }),
      "draft",
    );
  });

  it("trial with a key uses BYOK", () => {
    assert.equal(
      pickWriter({ plan: "trial", source: "byok", hasUserKey: true, hostedAvailable: true }),
      "byok",
    );
  });

  it("paid plan uses hosted AI when the deploy has a key", () => {
    assert.equal(
      pickWriter({ plan: "regular", source: "hosted", hasUserKey: false, hostedAvailable: true }),
      "hosted",
    );
  });

  it("paid plan with BYOK prefers their key", () => {
    assert.equal(
      pickWriter({ plan: "regular", source: "byok", hasUserKey: true, hostedAvailable: true }),
      "byok",
    );
  });

  it("paid plan without hosted deploy falls back to draft", () => {
    assert.equal(
      pickWriter({ plan: "regular", source: "hosted", hasUserKey: false, hostedAvailable: false }),
      "draft",
    );
  });
});

describe("canUseHostedAi", () => {
  it("unlocks after they pay, not on trial", () => {
    assert.equal(canUseHostedAi("trial"), false);
    assert.equal(canUseHostedAi("regular"), true);
    assert.equal(canUseHostedAi("plus"), true);
    assert.equal(canUseHostedAi("premium"), true);
  });
});

describe("decideWriter", () => {
  const hosted = {
    source: "hosted" as const,
    provider: "xai" as const,
    model: "grok-4.5",
    apiKey: null,
    hostedKey: "xai-hosted",
  };

  it("trial with no key is draft even if hosted is selected", () => {
    assert.equal(decideWriter("trial", hosted).kind, "draft");
  });

  it("trial with a key uses BYOK", () => {
    const decision = decideWriter("trial", {
      source: "byok",
      provider: "openai",
      model: "gpt-4.1",
      apiKey: "sk-test",
      hostedKey: "xai-hosted",
    });
    assert.equal(decision.kind, "byok");
  });

  it("BYOK selected without a key errors instead of drafting", () => {
    const decision = decideWriter("trial", {
      source: "byok",
      provider: "openai",
      model: "gpt-4.1",
      apiKey: null,
      hostedKey: null,
    });
    assert.equal(decision.kind, "error");
  });

  it("paid plan with a hosted key uses hosted AI", () => {
    assert.equal(decideWriter("regular", hosted).kind, "hosted");
  });
});

describe("packWriter", () => {
  it("reads stored writer, else infers draft from the rationale", () => {
    assert.equal(packWriter(pack({ writer: "hosted" })), "hosted");
    assert.equal(packWriter(pack({ writer: "byok" })), "byok");
    assert.equal(packWriter(pack()), "draft");
  });
});
