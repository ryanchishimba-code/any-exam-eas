import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";

/** Review-incorrect scope for open items that have no topic id. */
export const OTHER_OPEN_SUBJECT_ID = "__other__";

export function isOtherOpenSubject(subjectId: string | null | undefined): boolean {
  return subjectId?.trim() === OTHER_OPEN_SUBJECT_ID;
}

/** Misses that cannot be filed under a blueprint topic. */
export function isUntaggedOpenSubject(subjectId: string | null | undefined): boolean {
  const subject = subjectId?.trim() ?? "";
  return !subject || subject === MIXED_SUBJECT_ID || isInternalMasteryConceptKey(subject);
}
