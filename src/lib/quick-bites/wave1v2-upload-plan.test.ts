import { describe, expect, it } from "vitest";
import { QUICK_BITE_EPISODES, quickBiteCaptionsPath, quickBiteVideoPath } from "@/lib/quick-bites/catalog";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";
import {
  QB_WAVE1V2_MAX_UPLOAD_BYTES,
  QB_WAVE1V2_UPLOAD_PATHS,
  contentTypeForWave1V2Path,
  wave1v2ClientTokenConstraints,
} from "@/lib/quick-bites/wave1v2-upload-plan";

const VERSION = "v2-20261017";

const WAVE1_SLUGS = [
  "quick-bites-potassium",
  "quick-bites-ep02-nclex-works",
  "quick-bites-ep03-priority",
  "quick-bites-ep04-delegation",
  "quick-bites-ep05-isolation",
  "quick-bites-ep06-sodium-calcium",
  "quick-bites-ep07-acid-base",
  "quick-bites-ep08-cardiac",
  "quick-bites-ep09-respiratory",
  "quick-bites-ep10-endocrine",
  "quick-bites-ep11-neuro",
  "quick-bites-ep12-high-alert-pharm",
  "quick-bites-ep13-psych",
  "quick-bites-ep14-maternity",
  "quick-bites-ep15-peds",
  "quick-bites-bonus-labs-examday",
] as const;

const EXPECTED_PATHS = WAVE1_SLUGS.flatMap((slug) => [
  `quick-bites/${VERSION}/${slug}-web.mp4`,
  `quick-bites/${VERSION}/${slug}.vtt`,
]);

describe("Quick Bites wave 1 v2 upload plan", () => {
  it("allows exactly the 32 new pathnames and the matching content type", () => {
    expect(EXPECTED_PATHS).toHaveLength(32);
    expect(new Set(EXPECTED_PATHS).size).toBe(32);
    expect([...QB_WAVE1V2_UPLOAD_PATHS.keys()].sort()).toEqual([...EXPECTED_PATHS].sort());
    for (const pathname of EXPECTED_PATHS) {
      const contentType = pathname.endsWith(".mp4") ? "video/mp4" : "text/vtt";
      expect(contentTypeForWave1V2Path(pathname)).toBe(contentType);
      expect(wave1v2ClientTokenConstraints(pathname)).toEqual({
        allowedContentTypes: [contentType],
        maximumSizeInBytes: 60 * 1024 * 1024,
        addRandomSuffix: false,
        allowOverwrite: false,
      });
    }
    expect(QB_WAVE1V2_MAX_UPLOAD_BYTES).toBe(60 * 1024 * 1024);
  });

  it("follows the catalog paths for the 16 re-rendered episodes only", () => {
    const allowed = new Set<string>(WAVE1_SLUGS);
    for (const episode of QUICK_BITE_EPISODES) {
      const video = quickBiteVideoPath(episode.slug);
      const captions = quickBiteCaptionsPath(episode.slug);
      expect(QB_WAVE1V2_UPLOAD_PATHS.has(video)).toBe(allowed.has(episode.slug));
      expect(QB_WAVE1V2_UPLOAD_PATHS.has(captions)).toBe(allowed.has(episode.slug));
    }
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      expect(QB_WAVE1V2_UPLOAD_PATHS.has(pharmacyQuickBiteVideoPath(episode.slug))).toBe(false);
      expect(QB_WAVE1V2_UPLOAD_PATHS.has(pharmacyQuickBiteCaptionsPath(episode.slug))).toBe(false);
    }
    expect(QB_WAVE1V2_UPLOAD_PATHS.has("quick-bites/quick-bites-potassium-web.mp4")).toBe(false);
    expect(QB_WAVE1V2_UPLOAD_PATHS.has("quick-bites/quick-bites-ep17-gi-bleed-obstruction-web.mp4")).toBe(
      false
    );
    expect(
      QB_WAVE1V2_UPLOAD_PATHS.has("quick-bites-pharmacy/v2-20261017/quick-bites-pharm-ep07-insulin-web.mp4")
    ).toBe(false);
  });

  it("rejects pathnames outside the plan", () => {
    const rejected = [
      "",
      "quick-bites/v2-20261017/quick-bites-ep02-nclex-works-web.mp4 ",
      "quick-bites/../v2-20261017/quick-bites-ep02-nclex-works-web.mp4",
      "quick-bites/v2-20261017/quick-bites-ep02-nclex-works-web.mp4/extra",
      "quick-bites/quick-bites-ep02-nclex-works-web.mp4",
      "quick-bites/quick-bites-ep17-gi-bleed-obstruction-web.mp4",
      "quick-bites/quick-bites-ep25-dosage-calc.vtt",
      "quick-bites/v2-20261017/quick-bites-ep02-nclex-works-web.mp4.txt",
      "QUICK-BITES/v2-20261017/quick-bites-ep02-nclex-works-web.mp4",
      "quick-bites-pharmacy/v2-20261017/quick-bites-pharm-ep07-insulin-web.mp4",
    ];
    for (const pathname of rejected) {
      expect(contentTypeForWave1V2Path(pathname)).toBeNull();
      expect(() => wave1v2ClientTokenConstraints(pathname)).toThrow(
        /not in the wave 1 v2 upload plan/
      );
    }
  });
});
