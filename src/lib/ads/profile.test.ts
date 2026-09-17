import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { profileFromRow } from "./profile.ts";
import { CREDITS_EMPTY_ERROR, TRIAL_CREDITS, engineForCredits } from "./plans.ts";

describe("profileFromRow", () => {
  it("maps a stored row", () => {
    const profile = profileFromRow(
      { user_id: "u1", plan: "regular", credits: 50, created_at: "2026-01-01" },
      "fallback",
    );
    assert.deepEqual(profile, {
      userId: "u1",
      plan: "regular",
      credits: 50,
      createdAt: "2026-01-01",
    });
  });

  it("uses the fallback id when the row id is empty", () => {
    const profile = profileFromRow(
      { user_id: "", plan: "trial", credits: TRIAL_CREDITS, created_at: "2026-01-01" },
      "u-fallback",
    );
    assert.equal(profile.userId, "u-fallback");
    assert.equal(profile.credits, TRIAL_CREDITS);
  });
});

describe("engineForCredits", () => {
  it("trial with credits uses regular; empty tank is null", () => {
    assert.equal(engineForCredits("trial", 1), "regular");
    assert.equal(engineForCredits("trial", 0), null);
  });

  it("one credit is enough for any paid engine", () => {
    assert.equal(engineForCredits("plus", 1), "plus");
    assert.equal(engineForCredits("premium", 1), "premium");
    assert.equal(engineForCredits("regular", 1), "regular");
  });
});

describe("credits empty copy", () => {
  it("matches the generate paywall string", () => {
    assert.equal(
      CREDITS_EMPTY_ERROR,
      "Your free draft pack is used. Pay $12 for 3 live statics and the 7-day Launch plan, or add your own key.",
    );
  });
});
