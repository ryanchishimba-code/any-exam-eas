import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import type { ExamSlug } from "@/types/edtech";

/** Map exam slug → practice field id. Safe for client bundles (no prisma). */
export function fieldIdForExamSlug(examSlug: ExamSlug): string {
  return EXAM_CATALOG[examSlug].fieldId;
}

export function examSlugForFieldId(fieldId: string): ExamSlug | null {
  return examSlugFromFieldId(fieldId);
}

/** True when a study field id belongs to the user's selected exam. */
export function fieldMatchesExamSlug(fieldId: string, examSlug: ExamSlug): boolean {
  const normalized = normalizeFieldId(fieldId);
  if (examSlug === "usmle") return isUsmleFieldId(normalized);
  return fieldIdForExamSlug(examSlug) === normalized;
}
