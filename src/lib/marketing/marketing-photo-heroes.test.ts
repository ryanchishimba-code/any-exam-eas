import { describe, expect, it } from "vitest";
import { marketingPhotoHeroSrc } from "@/lib/marketing/marketing-photo-heroes";

describe("marketingPhotoHeroSrc", () => {
  it("builds static paths for each variant", () => {
    expect(marketingPhotoHeroSrc("home", "desktop", "webp")).toBe(
      "/images/marketing/heroes/home-desktop.webp"
    );
    expect(marketingPhotoHeroSrc("naplex", "mobile", "avif")).toBe(
      "/images/marketing/heroes/naplex-mobile.avif"
    );
  });
});
