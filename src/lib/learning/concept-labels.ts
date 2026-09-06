/**
 * Student-facing labels for conceptMastery keys and session titles.
 * Generation batch IDs must never appear in Library / dashboard UI.
 */

const INTERNAL_PREFIX_RE = /^(tag:|subject:)?batch[-_\s]/i;
const NCLEX_GAP_BATCH_RE = /nclex[-_\s]?gap[-_\s]?\d{4}/i;
const EXAM_LEVEL_RE = /^(tag:|subject:)?exam[-_\s]?level$/i;
/** batch-…-zm54j9 style machine suffixes */
const BATCH_WITH_SUFFIX_RE = /^(tag:|subject:)?batch[-_].+[-_][a-z0-9]{4,12}$/i;

/** True when the mastery key is an import/generation artifact, not a study topic. */
export function isInternalMasteryConceptKey(key: string): boolean {
  const trimmed = key.trim();
  if (!trimmed) return true;
  if (INTERNAL_PREFIX_RE.test(trimmed)) return true;
  if (NCLEX_GAP_BATCH_RE.test(trimmed)) return true;
  if (EXAM_LEVEL_RE.test(trimmed)) return true;
  if (BATCH_WITH_SUFFIX_RE.test(trimmed)) return true;
  return false;
}

/** Title-case a slug/key for display (assumes student-facing). */
export function formatConceptLabel(key: string): string {
  const raw = key
    .replace(/^(tag|subject):/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) return "Practice area";
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Prefer a real subject/domain label when the concept key maps to one.
 * Falls back to formatted slug; never invents batch titles.
 */
export function studentFacingConceptLabel(
  key: string,
  options?: { subjectLabel?: string | null }
): string | null {
  if (isInternalMasteryConceptKey(key)) return null;
  const subject = options?.subjectLabel?.trim();
  if (subject) return subject;
  return formatConceptLabel(key);
}

/** Drop generation-batch weak topics from Library / dashboard chips. */
export function filterStudentFacingWeakTopics<T extends { id: string; name?: string }>(
  topics: T[]
): T[] {
  return topics.filter(
    (t) =>
      !isInternalMasteryConceptKey(t.id) &&
      !(t.name && isInternalMasteryConceptKey(t.name))
  );
}

/**
 * Replace batch/generation exam titles with a clean practice label.
 * Used for Recent activity and similar history rows.
 */
export function studentFacingSessionTitle(
  title: string | null | undefined,
  options?: { fieldLabel?: string | null; fallback?: string }
): string {
  const raw = title?.trim() || "";
  const fallback = options?.fallback?.trim() || "Practice set";
  if (!raw || isInternalMasteryConceptKey(raw)) {
    const field = options?.fieldLabel?.trim();
    return field ? `${field} practice` : fallback;
  }
  return raw;
}
