import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MARKETING_PHOTO_HEROES,
  MARKETING_PHOTO_HERO_BOX_ASPECT,
  MARKETING_PHOTO_HERO_IMAGE_ASPECT,
  MARKETING_PHOTO_HERO_MOBILE_FOCAL,
  marketingPhotoHeroMobileImageSet,
  marketingPhotoHeroMobilePreload,
  marketingPhotoHeroSlice,
  marketingPhotoHeroSrc,
  type MarketingPhotoHeroId,
} from "@/lib/marketing/marketing-photo-heroes";

describe("marketingPhotoHeroSrc", () => {
  it("builds static paths for each variant", () => {
    expect(marketingPhotoHeroSrc("home", "desktop", "webp")).toBe(
      "/images/marketing/heroes/home-desktop.webp"
    );
    expect(marketingPhotoHeroSrc("naplex", "mobile", "avif")).toBe(
      "/images/marketing/heroes/naplex-mobile.avif"
    );
    expect(marketingPhotoHeroSrc("usmle", "mobile2x", "avif")).toBe(
      "/images/marketing/heroes/usmle-mobile-2x.avif"
    );
  });

  it("points a phone preload at that page's own 1x and 2x files", () => {
    const preload = marketingPhotoHeroMobilePreload("nclex");
    expect(preload.media).toBe("(max-width: 767px)");
    expect(preload.href).toBe("/images/marketing/heroes/nclex-mobile-2x.avif");
    expect(preload.imageSrcSet).toBe(
      "/images/marketing/heroes/nclex-mobile.avif 360w, /images/marketing/heroes/nclex-mobile-2x.avif 720w"
    );
    expect(marketingPhotoHeroMobileImageSet("home")).toContain(
      'url("/images/marketing/heroes/home-mobile-2x.avif") type("image/avif") 2x'
    );
    expect(marketingPhotoHeroMobileImageSet("home")).not.toContain("nclex");
  });

  it("crops a 16:9 photo to the phone hero the way object-fit cover would", () => {
    expect(marketingPhotoHeroSlice("42% 38%", 390 / 704)).toBe("0 39.93% 0 28.91% fill");
  });

  it("center-crops the 9:16 phone file into the slightly taller hero", () => {
    expect(
      marketingPhotoHeroSlice(
        MARKETING_PHOTO_HERO_MOBILE_FOCAL,
        MARKETING_PHOTO_HERO_BOX_ASPECT.mobile,
        MARKETING_PHOTO_HERO_IMAGE_ASPECT.mobile
      )
    ).toBe("0 5.56% 0 5.56% fill");
  });

  it("gives every page its own photo file", () => {
    const ids = Object.keys(MARKETING_PHOTO_HEROES) as MarketingPhotoHeroId[];
    expect(ids).toEqual(["home", "nclex", "naplex", "usmle", "pance", "aanp-fnp", "npte-pt"]);
    const hashes = new Set<string>();
    for (const id of ids) {
      for (const variant of ["desktop", "mobile", "mobile2x"] as const) {
        for (const format of ["avif", "webp"] as const) {
          const rel = marketingPhotoHeroSrc(id, variant, format).replace(/^\//, "");
          const buf = readFileSync(path.join(process.cwd(), "public", rel));
          const hash = createHash("sha256").update(buf).digest("hex");
          expect(hashes.has(hash), rel).toBe(false);
          hashes.add(hash);
        }
      }
    }
    expect(hashes.size).toBe(42);
  });
});
