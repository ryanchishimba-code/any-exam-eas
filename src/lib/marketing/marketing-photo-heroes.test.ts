import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MARKETING_PHOTO_HEROES,
  MARKETING_PHOTO_HERO_BOX_ASPECT,
  MARKETING_PHOTO_HERO_IMAGE_ASPECT,
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
  });

  it("crops a 16:9 photo to the phone hero the way object-fit cover would", () => {
    expect(marketingPhotoHeroSlice("42% 38%", 390 / 704)).toBe("0 39.93% 0 28.91% fill");
  });

  it("does not crop the pre-cropped portrait a second time", () => {
    expect(
      marketingPhotoHeroSlice(
        "50% 40%",
        MARKETING_PHOTO_HERO_BOX_ASPECT.mobile,
        MARKETING_PHOTO_HERO_IMAGE_ASPECT.mobile
      )
    ).toBe("0.00% 0 0.00% 0 fill");
  });

  it("gives every page its own photo file", () => {
    const ids = Object.keys(MARKETING_PHOTO_HEROES) as MarketingPhotoHeroId[];
    expect(ids).toEqual(["home", "nclex", "naplex", "usmle", "pance", "aanp-fnp", "npte-pt"]);
    const hashes = new Set<string>();
    for (const id of ids) {
      for (const variant of ["desktop", "mobile"] as const) {
        for (const format of ["avif", "webp"] as const) {
          const rel = marketingPhotoHeroSrc(id, variant, format).replace(/^\//, "");
          const buf = readFileSync(path.join(process.cwd(), "public", rel));
          const hash = createHash("sha256").update(buf).digest("hex");
          expect(hashes.has(hash), rel).toBe(false);
          hashes.add(hash);
        }
      }
    }
    expect(hashes.size).toBe(28);
  });
});
