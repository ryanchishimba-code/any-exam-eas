import { servedWeakAreaTarget } from "@/lib/learning/weak-areas-from-attempts";

export const WEAK_AREA_MIN_SERVED = 5;

/**
 * A weak-area target the bank can filter, or null.
 * Catalog subjects and same-step blueprint topics only. No generic fallback.
 */
export function usmleWeakAreaServedSubject(input: {
  fieldId: string;
  topicKey: string;
  subjectCounts?: Record<string, number> | null;
}): { subjectId: string; blueprintTopics: string[] } | null {
  const target = servedWeakAreaTarget(input.fieldId, input.topicKey);
  if (!target) return null;
  if (
    input.subjectCounts &&
    target.blueprintTopics.length === 0 &&
    (input.subjectCounts[target.subjectId] ?? 0) < WEAK_AREA_MIN_SERVED
  ) {
    return null;
  }
  return { subjectId: target.subjectId, blueprintTopics: target.blueprintTopics };
}
