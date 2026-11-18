/**
 * Student-facing USMLE book links.
 * NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC is inlined at build time.
 * Unset means the sidebar does not offer the books.
 * This file stays free of server-only imports so the sidebar can read it.
 */

export function isUsmleStudyGuidePublic(): boolean {
  const raw = process.env.NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}

/** Students can open the books when either flag is on. */
export function isUsmleStudyGuideReleased(): boolean {
  if (isUsmleStudyGuidePublic()) return true;
  const raw = process.env.USMLE_STUDY_GUIDE_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}
