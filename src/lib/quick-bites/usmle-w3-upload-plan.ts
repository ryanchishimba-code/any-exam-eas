const VERSION = "v3-20261121";

const FILES = [
  "quick-bites-usmle-ep21-glucose-calcium-cortisol",
  "quick-bites-usmle-ep22-gram-positive-hepatitis",
  "quick-bites-usmle-ep23-do-not-wait-until-morning",
  "quick-bites-usmle-ep24-belly-emergencies",
  "quick-bites-usmle-ep25-blood-emergencies",
  "quick-bites-usmle-ep26-airway-pneumonia-embolus",
  "quick-bites-usmle-ep27-preeclampsia-adrenal-gdm",
  "quick-bites-usmle-ep28-screens-when-to-stop",
  "quick-bites-usmle-ep29-discharge-orders",
  "quick-bites-usmle-ep30-safety-ethics-practice",
] as const;

export function contentTypeForUsmleW3Path(pathname: string): string | null {
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

export function usmleW3ClientTokenConstraints(pathname: string) {
  const contentType = contentTypeForUsmleW3Path(pathname);
  if (!contentType) throw new Error("Path is not in the USMLE wave 3 upload plan");
  return {
    allowedContentTypes: [contentType],
    maximumSizeInBytes: 60 * 1024 * 1024,
    addRandomSuffix: false,
    allowOverwrite: true,
  };
}
