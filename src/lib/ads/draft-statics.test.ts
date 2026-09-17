import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { watermarkedStatics } from "./draft-statics.ts";

describe("watermarkedStatics", () => {
  it("returns three 1:1 draft frames with a paywall mark", () => {
    const images = watermarkedStatics({
      productName: "chanclazo.com",
      headlines: ["Throw the chancla", "Family party game", "Play in the browser"],
      brand: { bg: "#111111", fg: "#f4efe8", accent: "#ff8c00", type: "Sora" },
    });
    assert.equal(images.length, 3);
    for (const image of images) {
      assert.equal(image.aspect, "1:1");
      assert.match(image.url, /^data:image\/svg\+xml/);
      assert.match(decodeURIComponent(image.url), /DRAFT/);
      assert.match(decodeURIComponent(image.url), /\$12/);
    }
  });
});
