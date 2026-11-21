const FILES = [
  "quick-bites-medmath-ep01-dosing-drips",
  "quick-bites-medmath-ep02-clinical-formulas",
  "quick-bites-medmath-ep03-biostats",
] as const;

export function contentTypeForMedmathPath(pathname: string): string | null {
  const prefix = "quick-bites-medmath/v1-20261121/";
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

export function medmathClientTokenConstraints(pathname: string) {
  const contentType = contentTypeForMedmathPath(pathname);
  if (!contentType) throw new Error("Path is not in the Medical Math upload plan");
  return {
    allowedContentTypes: [contentType],
    maximumSizeInBytes: 60 * 1024 * 1024,
    addRandomSuffix: false,
    allowOverwrite: true,
  };
}
