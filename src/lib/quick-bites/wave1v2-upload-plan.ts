/**
 * Exact private Blob pathnames for the temporary nursing wave 1 v2 upload route.
 * Potassium, ep02–ep15, and the exam-day bonus. Episodes 17–25 and the pharmacy
 * catalog, including the already-uploaded pharmacy ep07 re-render, are not in this set.
 * Original wave 1 objects at quick-bites/<slug>-* are not in this set.
 */

import { quickBiteCaptionsPath, quickBiteVideoPath } from "@/lib/quick-bites/catalog";

/** About 60 MB. Client tokens cannot authorize a larger object. */
export const QB_WAVE1V2_MAX_UPLOAD_BYTES = 60 * 1024 * 1024;

export type Wave1V2UploadContentType = "video/mp4" | "text/vtt";

const NURSING_WAVE1_V2_SLUGS = [
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

function mediaPair(
  videoPath: string,
  captionsPath: string
): Array<[string, Wave1V2UploadContentType]> {
  return [
    [videoPath, "video/mp4"],
    [captionsPath, "text/vtt"],
  ];
}

export const QB_WAVE1V2_UPLOAD_PATHS: ReadonlyMap<string, Wave1V2UploadContentType> = new Map(
  NURSING_WAVE1_V2_SLUGS.flatMap((slug) =>
    mediaPair(quickBiteVideoPath(slug), quickBiteCaptionsPath(slug))
  )
);

export function contentTypeForWave1V2Path(pathname: string): Wave1V2UploadContentType | null {
  return QB_WAVE1V2_UPLOAD_PATHS.get(pathname) ?? null;
}

/** Constraints passed to onBeforeGenerateToken. Throws for any other pathname. */
export function wave1v2ClientTokenConstraints(pathname: string): {
  allowedContentTypes: [Wave1V2UploadContentType];
  maximumSizeInBytes: number;
  addRandomSuffix: false;
  allowOverwrite: false;
} {
  const contentType = contentTypeForWave1V2Path(pathname);
  if (!contentType) {
    throw new Error("Path is not in the wave 1 v2 upload plan");
  }
  return {
    allowedContentTypes: [contentType],
    maximumSizeInBytes: QB_WAVE1V2_MAX_UPLOAD_BYTES,
    addRandomSuffix: false,
    allowOverwrite: false,
  };
}
