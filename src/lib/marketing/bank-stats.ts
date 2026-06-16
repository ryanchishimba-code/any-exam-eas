import { MIN_QUESTIONS_PER_SUBJECT } from "@/lib/bulk-question-generator";
import { TOP_500_COUNT } from "@/lib/drugs300/catalog";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { AANP_FNP_TARGET_TOTAL } from "@/lib/exam-prep/aanp-fnp/types";
import { PANCE_TARGET_TOTAL } from "@/lib/exam-prep/pance/types";

/** Design target per field after bank sync (subjects × minimum items each). */
export function targetQuestionCountForField(fieldId: string): number {
  if (fieldId === "aanp-fnp") return AANP_FNP_TARGET_TOTAL;
  if (fieldId === "pance") return PANCE_TARGET_TOTAL;
  return getSubjectsForFieldId(fieldId).length * MIN_QUESTIONS_PER_SUBJECT;
}

export function formatMarketingQuestionCount(count: number): string {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+`;
  }
  return count > 0 ? `${count}+` : "—";
}

const fieldTargets = Object.fromEntries(
  EXAM_FIELD_IDS.map((fieldId) => [fieldId, targetQuestionCountForField(fieldId)])
) as Record<ExamFieldId, number>;

export const QUESTION_BANK_TARGETS = fieldTargets;

export const TOTAL_QUESTION_BANK_TARGET = EXAM_FIELD_IDS.reduce(
  (sum, fieldId) => sum + fieldTargets[fieldId],
  0
);

/** User-facing counts derived from sync targets — not hard-coded marketing figures. */
export const MARKETING_QUESTION_COUNTS = {
  total: formatMarketingQuestionCount(TOTAL_QUESTION_BANK_TARGET),
  nursing: formatMarketingQuestionCount(fieldTargets.nursing),
  usmle: formatMarketingQuestionCount(fieldTargets["usmle-step-2"]),
  pharmacy: formatMarketingQuestionCount(fieldTargets.pharmacy),
  pance: formatMarketingQuestionCount(fieldTargets.pance),
  aanpFnp: formatMarketingQuestionCount(fieldTargets["aanp-fnp"]),
} as const;

export const TOP_500_DRUGS_COUNT = TOP_500_COUNT;

export function questionBankLabelForField(fieldId: string): string {
  return `${formatMarketingQuestionCount(targetQuestionCountForField(fieldId))} board-style items`;
}

export function top500DrugsLabel(): string {
  return `${TOP_500_DRUGS_COUNT} high-yield drugs`;
}
