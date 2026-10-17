/**
 * Exact private Blob pathnames for the temporary wave 2 upload route.
 * Nursing 17–25, pharmacy 17–26, and the re-rendered pharmacy ep07.
 * Existing files, including the original ep07 objects, are not in this set.
 */

import { quickBiteCaptionsPath, quickBiteVideoPath } from "@/lib/quick-bites/catalog";
import {
  pharmacyQuickBiteCaptionsPath,
  pharmacyQuickBiteVideoPath,
} from "@/lib/quick-bites/pharmacy-catalog";

/** About 60 MB. Client tokens cannot authorize a larger object. */
export const QB_WAVE2_MAX_UPLOAD_BYTES = 60 * 1024 * 1024;

export type Wave2UploadContentType = "video/mp4" | "text/vtt";

const NURSING_WAVE2_SLUGS = [
  "quick-bites-ep17-gi-bleed-obstruction",
  "quick-bites-ep18-liver-pancreas",
  "quick-bites-ep19-kidneys-dialysis",
  "quick-bites-ep20-transfusion",
  "quick-bites-ep21-neutropenia-sickle-cell",
  "quick-bites-ep22-surgery-wounds",
  "quick-bites-ep23-burns",
  "quick-bites-ep24-ortho",
  "quick-bites-ep25-dosage-calc",
] as const;

const PHARMACY_WAVE2_SLUGS = [
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
] as const;

const PHARMACY_EP07_SLUG = "quick-bites-pharm-ep07-insulin";

function mediaPair(
  videoPath: string,
  captionsPath: string
): Array<[string, Wave2UploadContentType]> {
  return [
    [videoPath, "video/mp4"],
    [captionsPath, "text/vtt"],
  ];
}

export const QB_WAVE2_UPLOAD_PATHS: ReadonlyMap<string, Wave2UploadContentType> = new Map([
  ...NURSING_WAVE2_SLUGS.flatMap((slug) =>
    mediaPair(quickBiteVideoPath(slug), quickBiteCaptionsPath(slug))
  ),
  ...PHARMACY_WAVE2_SLUGS.flatMap((slug) =>
    mediaPair(pharmacyQuickBiteVideoPath(slug), pharmacyQuickBiteCaptionsPath(slug))
  ),
  ...mediaPair(
    pharmacyQuickBiteVideoPath(PHARMACY_EP07_SLUG),
    pharmacyQuickBiteCaptionsPath(PHARMACY_EP07_SLUG)
  ),
]);

export function contentTypeForWave2Path(pathname: string): Wave2UploadContentType | null {
  return QB_WAVE2_UPLOAD_PATHS.get(pathname) ?? null;
}

/** Constraints passed to onBeforeGenerateToken. Throws for any other pathname. */
export function wave2ClientTokenConstraints(pathname: string): {
  allowedContentTypes: [Wave2UploadContentType];
  maximumSizeInBytes: number;
  addRandomSuffix: false;
  allowOverwrite: false;
} {
  const contentType = contentTypeForWave2Path(pathname);
  if (!contentType) {
    throw new Error("Path is not in the wave 2 upload plan");
  }
  return {
    allowedContentTypes: [contentType],
    maximumSizeInBytes: QB_WAVE2_MAX_UPLOAD_BYTES,
    addRandomSuffix: false,
    allowOverwrite: false,
  };
}
