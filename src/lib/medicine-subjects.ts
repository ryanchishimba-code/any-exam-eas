/**
 * @deprecated Import from @/lib/subjects/shared/question-counts instead.
 * Re-exports kept for existing UI/API imports.
 */
export {
  QUESTION_COUNT_OPTIONS,
  isValidQuestionCount,
  type QuestionCount,
} from "./subjects/shared/question-counts";

import { getSubjectsForFieldId } from "./subjects/registry";
/** @deprecated Use getSubjectsForField("Medicine") or medicine module subjects */
export type MedicineSubjectArea = {
  id: string;
  label: string;
  topicPlaceholder: string;
  examHints: string;
};

export const MEDICINE_SUBJECT_AREAS: MedicineSubjectArea[] =
  getSubjectsForFieldId("usmle-step-2").map((s) => ({
    id: s.id,
    label: s.label,
    topicPlaceholder: s.focusPlaceholder,
    examHints: s.examHints,
  }));

export function getMedicineSubject(idOrLabel: string): MedicineSubjectArea | undefined {
  return MEDICINE_SUBJECT_AREAS.find(
    (s) =>
      s.id === idOrLabel ||
      s.label.toLowerCase() === idOrLabel.toLowerCase()
  );
}

export function buildMedicineTopic(
  subjectAreaId: string,
  specificFocus?: string
): string {
  const subject = getMedicineSubject(subjectAreaId);
  const base = subject?.label ?? subjectAreaId;
  const focus = specificFocus?.trim();
  return focus ? `${base} — ${focus}` : base;
}
