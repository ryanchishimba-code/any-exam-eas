/**
 * Client-safe USMLE study-guide flags. No session or database imports.
 *
 * NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC turns on in-app links after a rebuild.
 * USMLE_STUDY_GUIDE_PUBLIC is server-only and is read at request time.
 * Either flag releases the books to students. Until then, students get a 404
 * and admins can preview.
 */

export function isUsmleStudyGuidePublic(): boolean {
  const raw = process.env.NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}

export function isUsmleStudyGuideReleased(): boolean {
  if (isUsmleStudyGuidePublic()) return true;
  const raw = process.env.USMLE_STUDY_GUIDE_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}

/**
 * Local screenshot and admin-less reading of the markdown sources.
 * Refuses to turn on in a production build, so a stray env var cannot
 * publish the books.
 */
export function isUsmleGuideFileFallback(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.USMLE_STUDY_GUIDE_FILE_FALLBACK === "1"
  );
}
