import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inferProductName } from "./write-kit.ts";

describe("inferProductName", () => {
  it("uses the hostname from a URL plus an offer", () => {
    assert.equal(
      inferProductName("https://chanclazo.com — Mexican family party game. Throw the chancla."),
      "chanclazo.com",
    );
  });

  it("does not chop .com off a bare host", () => {
    assert.equal(inferProductName("chanclazo.com — Mexican family party game"), "chanclazo.com");
  });

  it("keeps a one-line offer without a URL", () => {
    assert.equal(inferProductName("Weeknight meal kit. $12 a plate."), "Weeknight meal kit");
  });
});
