/**
 * Practice CAT scores every item right/wrong through the same grader the
 * full-exam UI already uses for bow-tie, matrix, SATA, highlight, ordered
 * response, and drag-and-drop. Published NGN rows are included by default.
 * Set NCLEX_CAT_INCLUDE_NGN=0 to assemble nursing full exams without that quota.
 */
/** Blueprint ceiling. A sitting never aims above the eligible NGN rows it actually has. */
export const NCLEX_CAT_NGN_TARGET_RATIO = 0.22;

/** Share of the sitting that eligible NGN rows can fill, never above the blueprint ceiling. */
export function cappedNgnTargetRatio(eligibleNgn: number, length: number): number {
  if (eligibleNgn <= 0 || length <= 0) return 0;
  return Math.min(NCLEX_CAT_NGN_TARGET_RATIO, eligibleNgn / length);
}

export function nclexCatNgnEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  const raw = env.NCLEX_CAT_INCLUDE_NGN;
  if (raw == null || raw.trim() === "") return true;
  const value = raw.trim().toLowerCase();
  return value !== "0" && value !== "false" && value !== "off" && value !== "no";
}
