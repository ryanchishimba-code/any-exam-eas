import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";

/** Strip analytics prefix from a mastery concept key. */
export function conceptKeyToSubjectSlug(conceptKey: string): string {
  return conceptKey.replace(/^(tag|subject):/, "");
}

/** Whether a slug maps to a selectable bank subject for the active field. */
export function isValidBankSubjectId(
  subjectId: string,
  fieldId: string,
  bankSubjectIds: readonly string[]
): boolean {
  const ids = new Set(bankSubjectIds);
  if (ids.has(subjectId)) return true;
  if (fieldId.startsWith("usmle") && isUsmleStep1Subject(subjectId)) {
    return fieldId === "usmle-step-1";
  }
  return false;
}

/**
 * Ordered weak bank subject ids for the current field — same resolution rules as
 * dashboard/library deep links (subject keys only, field-scoped, deduped).
 */
export function weakSubjectIdsForField(
  weakTopics: WeakTopicRow[],
  fieldId: string,
  bankSubjectIds: readonly string[]
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const topic of weakTopics) {
    if (topic.fieldId !== fieldId) continue;
    const slug = conceptKeyToSubjectSlug(topic.id);
    if (!isValidBankSubjectId(slug, fieldId, bankSubjectIds)) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    result.push(slug);
  }

  return result;
}

export function primaryWeakSubjectId(
  weakTopics: WeakTopicRow[],
  fieldId: string,
  bankSubjectIds: readonly string[]
): string | null {
  return weakSubjectIdsForField(weakTopics, fieldId, bankSubjectIds)[0] ?? null;
}
