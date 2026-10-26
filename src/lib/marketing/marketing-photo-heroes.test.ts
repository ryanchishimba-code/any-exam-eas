import { describe, expect, it } from "vitest";
import { marketingPhotoHeroMobileDataUri } from "@/lib/marketing/marketing-photo-hero-inline";
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

  it("inlines the same mobile AVIF bytes, without a second encode", () => {
    const uri = marketingPhotoHeroMobileDataUri("home");
    expect(uri.startsWith("data:image/avif;base64,")).toBe(true);
    expect(uri.length).toBeGreaterThan(4000);
  });
});
