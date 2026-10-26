import { describe, expect, it } from "vitest";
import {
  marketingPhotoHeroSlice,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";

describe("marketingPhotoHeroSrc", () => {
  it("builds static paths for each variant", () => {
    expect(marketingPhotoHeroSrc("home", "desktop", "webp")).toBe(
      "/images/marketing/heroes/home-desktop.webp"
    );
    expect(marketingPhotoHeroSrc("naplex", "mobile", "avif")).toBe(
      "/images/marketing/heroes/naplex-mobile.avif"
    );
  });

  it("crops a 16:9 photo to the phone hero the way object-fit cover would", () => {
    expect(marketingPhotoHeroSlice("42% 38%", 390 / 704)).toBe("0 39.93% 0 28.91% fill");
  });
});
