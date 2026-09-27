import { describe, expect, it } from "vitest";
import { isShareFabHiddenRoute } from "./share-fab";

describe("share fab public routes", () => {
  it("stays off the contact page and other public marketing pages", () => {
    for (const path of [
      "/",
      "/feedback",
      "/contact",
      "/toolkit",
      "/blog",
      "/blog/how-to-study",
      "/pricing",
      "/about",
      "/compare",
      "/free-guides",
      "/community",
      "/employers",
      "/how-questions-are-reviewed",
      "/legal/privacy",
      "/legal/terms",
      "/resources/nclex-study-plan",
      "/aanp-fnp",
      "/nclex",
      "/npte-pt",
      "/dev/home-frames",
      "/faq",
    ]) {
      expect(isShareFabHiddenRoute(path), path).toBe(true);
    }
  });

  it("can still mount on study surfaces outside the marketing site", () => {
    expect(isShareFabHiddenRoute("/learn")).toBe(false);
    expect(isShareFabHiddenRoute("/prep/nclex")).toBe(false);
    expect(isShareFabHiddenRoute("/study")).toBe(false);
  });
});
