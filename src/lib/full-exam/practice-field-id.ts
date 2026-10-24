import { fieldIdForExamSlug } from "@/lib/edtech/exam-field-ids";
import { isPracticeFieldId, normalizeFieldId } from "@/lib/subjects/field-ids";
import type { ExamSlug } from "@/types/edtech";

/** Bank field for a finished full-exam sitting (USMLE step-aware). */
export function practiceFieldIdForExamSession(
  session: { fieldId?: string | null },
  examSlug: ExamSlug
): string {
  const stored = session.fieldId?.trim();
  if (stored && isPracticeFieldId(stored)) return normalizeFieldId(stored);
  return fieldIdForExamSlug(examSlug);
}
