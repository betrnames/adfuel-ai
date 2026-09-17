import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeWaitlistEmail } from "./waitlist.ts";

describe("normalizeWaitlistEmail", () => {
  it("accepts a normal address", () => {
    assert.equal(normalizeWaitlistEmail("  Gabe@AdFuel.AI "), "gabe@adfuel.ai");
  });

  it("rejects junk", () => {
    assert.equal(normalizeWaitlistEmail("not-an-email"), null);
    assert.equal(normalizeWaitlistEmail(""), null);
    assert.equal(normalizeWaitlistEmail("a@b"), null);
  });
});
