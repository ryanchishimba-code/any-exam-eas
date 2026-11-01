import { studyGuideRouteBases } from "@/lib/nclex-study-guide/guide-registry";

/** Login-gated full study guide readers. The public /pance-study-guide page is not one of these. */
export function gatedStudyGuidePaths(): string[] {
  return studyGuideRouteBases();
}

export function isGatedStudyGuidePath(urlOrPath: string): boolean {
  let path = urlOrPath;
  try {
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      path = new URL(urlOrPath).pathname;
    }
  } catch {
    return false;
  }
  const normalized = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return gatedStudyGuidePaths().some(
    (base) => normalized === base || normalized.startsWith(`${base}/`)
  );
}
