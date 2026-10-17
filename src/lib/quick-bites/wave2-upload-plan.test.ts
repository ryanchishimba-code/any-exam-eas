import { describe, expect, it } from "vitest";
import {
  QUICK_BITE_EPISODES,
  quickBiteCaptionsPath,
  quickBiteVideoPath,
} from "@/lib/quick-bites/catalog";
import {
  PHARMACY_QUICK_BITE_EPISODES,
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";
import {
  QB_WAVE2_MAX_UPLOAD_BYTES,
  QB_WAVE2_UPLOAD_PATHS,
  contentTypeForWave2Path,
  wave2ClientTokenConstraints,
} from "@/lib/quick-bites/wave2-upload-plan";

const EXPECTED_PATHS = [
  "quick-bites/quick-bites-ep17-gi-bleed-obstruction-web.mp4",
  "quick-bites/quick-bites-ep17-gi-bleed-obstruction.vtt",
  "quick-bites/quick-bites-ep18-liver-pancreas-web.mp4",
  "quick-bites/quick-bites-ep18-liver-pancreas.vtt",
  "quick-bites/quick-bites-ep19-kidneys-dialysis-web.mp4",
  "quick-bites/quick-bites-ep19-kidneys-dialysis.vtt",
  "quick-bites/quick-bites-ep20-transfusion-web.mp4",
  "quick-bites/quick-bites-ep20-transfusion.vtt",
  "quick-bites/quick-bites-ep21-neutropenia-sickle-cell-web.mp4",
  "quick-bites/quick-bites-ep21-neutropenia-sickle-cell.vtt",
  "quick-bites/quick-bites-ep22-surgery-wounds-web.mp4",
  "quick-bites/quick-bites-ep22-surgery-wounds.vtt",
  "quick-bites/quick-bites-ep23-burns-web.mp4",
  "quick-bites/quick-bites-ep23-burns.vtt",
  "quick-bites/quick-bites-ep24-ortho-web.mp4",
  "quick-bites/quick-bites-ep24-ortho.vtt",
  "quick-bites/quick-bites-ep25-dosage-calc-web.mp4",
  "quick-bites/quick-bites-ep25-dosage-calc.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep17-antiseizure-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep17-antiseizure.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep18-antidepressants-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep18-antidepressants.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep19-antipsychotics-lithium-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep19-antipsychotics-lithium.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep20-thyroid-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep20-thyroid.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep21-oncology-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep21-oncology.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep22-hiv-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep22-hiv.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep23-pain-opioids-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep23-pain-opioids.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep24-pediatric-dosing-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep24-pediatric-dosing.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep25-pregnancy-lactation-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep25-pregnancy-lactation.vtt",
  "quick-bites-pharmacy/quick-bites-pharm-ep26-antidotes-web.mp4",
  "quick-bites-pharmacy/quick-bites-pharm-ep26-antidotes.vtt",
  "quick-bites-pharmacy/v2-20261017/quick-bites-pharm-ep07-insulin-web.mp4",
  "quick-bites-pharmacy/v2-20261017/quick-bites-pharm-ep07-insulin.vtt",
] as const;

describe("Quick Bites wave 2 upload plan", () => {
  it("allows exactly the 40 new pathnames and the matching content type", () => {
    expect(EXPECTED_PATHS).toHaveLength(40);
    expect(new Set(EXPECTED_PATHS).size).toBe(40);
    expect([...QB_WAVE2_UPLOAD_PATHS.keys()].sort()).toEqual([...EXPECTED_PATHS].sort());
    for (const pathname of EXPECTED_PATHS) {
      const contentType = pathname.endsWith(".mp4") ? "video/mp4" : "text/vtt";
      expect(contentTypeForWave2Path(pathname)).toBe(contentType);
      expect(wave2ClientTokenConstraints(pathname)).toEqual({
        allowedContentTypes: [contentType],
        maximumSizeInBytes: 60 * 1024 * 1024,
        addRandomSuffix: false,
        allowOverwrite: false,
      });
    }
    expect(QB_WAVE2_MAX_UPLOAD_BYTES).toBe(60 * 1024 * 1024);
  });

  it("follows the catalog paths for the new slugs and pharmacy ep07 v2 only", () => {
    const nursingWave2 = new Set([
      "quick-bites-ep17-gi-bleed-obstruction",
      "quick-bites-ep18-liver-pancreas",
      "quick-bites-ep19-kidneys-dialysis",
      "quick-bites-ep20-transfusion",
      "quick-bites-ep21-neutropenia-sickle-cell",
      "quick-bites-ep22-surgery-wounds",
      "quick-bites-ep23-burns",
      "quick-bites-ep24-ortho",
      "quick-bites-ep25-dosage-calc",
    ]);
    const pharmacyWave2 = new Set([
      "quick-bites-pharm-ep17-antiseizure",
      "quick-bites-pharm-ep18-antidepressants",
      "quick-bites-pharm-ep19-antipsychotics-lithium",
      "quick-bites-pharm-ep20-thyroid",
      "quick-bites-pharm-ep21-oncology",
      "quick-bites-pharm-ep22-hiv",
      "quick-bites-pharm-ep23-pain-opioids",
      "quick-bites-pharm-ep24-pediatric-dosing",
      "quick-bites-pharm-ep25-pregnancy-lactation",
      "quick-bites-pharm-ep26-antidotes",
      "quick-bites-pharm-ep07-insulin",
    ]);
    for (const episode of QUICK_BITE_EPISODES) {
      const video = quickBiteVideoPath(episode.slug);
      const captions = quickBiteCaptionsPath(episode.slug);
      const included = nursingWave2.has(episode.slug);
      expect(QB_WAVE2_UPLOAD_PATHS.has(video)).toBe(included);
      expect(QB_WAVE2_UPLOAD_PATHS.has(captions)).toBe(included);
    }
    for (const episode of PHARMACY_QUICK_BITE_EPISODES) {
      const video = pharmacyQuickBiteVideoPath(episode.slug);
      const captions = pharmacyQuickBiteCaptionsPath(episode.slug);
      const included = pharmacyWave2.has(episode.slug);
      expect(QB_WAVE2_UPLOAD_PATHS.has(video)).toBe(included);
      expect(QB_WAVE2_UPLOAD_PATHS.has(captions)).toBe(included);
    }
    expect(
      QB_WAVE2_UPLOAD_PATHS.has("quick-bites-pharmacy/quick-bites-pharm-ep07-insulin-web.mp4")
    ).toBe(false);
    expect(
      QB_WAVE2_UPLOAD_PATHS.has("quick-bites-pharmacy/quick-bites-pharm-bonus-exam-format-web.mp4")
    ).toBe(false);
  });

  it("rejects pathnames outside the plan", () => {
    const rejected = [
      "",
      "quick-bites/quick-bites-ep17-gi-bleed-obstruction-web.mp4 ",
      "quick-bites/../quick-bites-ep17-gi-bleed-obstruction-web.mp4",
      "quick-bites/quick-bites-ep17-gi-bleed-obstruction-web.mp4/extra",
      "quick-bites/quick-bites-ep02-nclex-works-web.mp4",
      "quick-bites-pharmacy/v2-20261017/quick-bites-pharm-ep07-insulin-web.mp4.txt",
      "QUICK-BITES/quick-bites-ep17-gi-bleed-obstruction-web.mp4",
    ];
    for (const pathname of rejected) {
      expect(contentTypeForWave2Path(pathname)).toBeNull();
      expect(() => wave2ClientTokenConstraints(pathname)).toThrow(/not in the wave 2 upload plan/);
    }
  });
});
