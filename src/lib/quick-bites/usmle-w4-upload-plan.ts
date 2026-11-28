const VERSION = "v4-20261121";

const FILES = [
  "quick-bites-usmle-ep31-fever-too-young",
  "quick-bites-usmle-ep32-next-psych-medicine",
  "quick-bites-usmle-ep33-four-pillars-weak-pump",
  "quick-bites-usmle-ep34-bleed-after-baby",
  "quick-bites-usmle-ep35-potassium-and-dialysis",
  "quick-bites-usmle-ep36-calories-change-plan",
  "quick-bites-usmle-ep37-soft-tissue-and-hip",
  "quick-bites-usmle-ep38-first-hour-of-sepsis",
  "quick-bites-usmle-ep39-sugar-and-thyroid-storm",
  "quick-bites-usmle-ep40-birth-control-and-bleeding",
  "quick-bites-usmle-ep41-abstract-and-advertisement",
  "quick-bites-usmle-ep42-pressure-and-aspirin",
  "quick-bites-usmle-ep43-first-orders-clock",
  "quick-bites-usmle-ep44-vitamin-and-feed",
  "quick-bites-usmle-ep45-after-the-stroke",
  "quick-bites-usmle-ep46-nodule-and-oxygen",
  "quick-bites-usmle-ep47-first-prenatal-visit",
  "quick-bites-usmle-ep48-breast-lump",
  "quick-bites-usmle-ep49-disclose-the-error",
  "quick-bites-usmle-ep50-floor-to-icu",
  "quick-bites-usmle-ep51-hepatitis-and-polyp",
  "quick-bites-usmle-ep52-blood-thinner",
  "quick-bites-usmle-ep53-mood-and-use",
] as const;

export function contentTypeForUsmleW4Path(pathname: string): string | null {
  const prefix = `quick-bites-usmle/${VERSION}/`;
  if (!pathname.startsWith(prefix)) return null;
  const name = pathname.slice(prefix.length);
  const stem = name.endsWith("-web.mp4")
    ? name.slice(0, -"-web.mp4".length)
    : name.endsWith(".vtt")
      ? name.slice(0, -".vtt".length)
      : null;
  if (!stem || !FILES.includes(stem as (typeof FILES)[number])) return null;
  if (name.endsWith("-web.mp4")) return "video/mp4";
  if (name.endsWith(".vtt")) return "text/vtt";
  return null;
}

export function usmleW4ClientTokenConstraints(pathname: string) {
  const contentType = contentTypeForUsmleW4Path(pathname);
  if (!contentType) throw new Error("Path is not in the USMLE wave 4 upload plan");
  return {
    allowedContentTypes: [contentType],
    maximumSizeInBytes: 60 * 1024 * 1024,
    addRandomSuffix: false,
    allowOverwrite: true,
  };
}
