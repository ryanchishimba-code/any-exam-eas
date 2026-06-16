import { MIN_QUESTIONS_PER_SUBJECT } from "@/lib/bulk-question-generator";
import { TOP_500_COUNT } from "@/lib/drugs300/catalog";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { AANP_FNP_TARGET_TOTAL } from "@/lib/exam-prep/aanp-fnp/types";
import { NPTE_PT_TARGET_TOTAL } from "@/lib/exam-prep/npte-pt/types";
import { PANCE_TARGET_TOTAL } from "@/lib/exam-prep/pance/types";

/** Design target per field after bank sync (subjects × minimum items each). */
export function targetQuestionCountForField(fieldId: string): number {
  if (fieldId === "aanp-fnp") return AANP_FNP_TARGET_TOTAL;
  if (fieldId === "pance") return PANCE_TARGET_TOTAL;
  if (fieldId === "npte-pt") return NPTE_PT_TARGET_TOTAL;
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

/**
 * Conservative floor for the live served bank used in static marketing copy.
 *
 * The homepage hero shows the live DB served total, so any hard-coded label must
 * stay at or below that number to avoid overstating the bank. Keep this ≤ the real
 * `totals.served` count (currently ~52.6K) — never set it to the aspirational
 * `TOTAL_QUESTION_BANK_TARGET`, which counts questions we still plan to add.
 */
export const PUBLISHED_QUESTION_BANK_TOTAL = 50_000;

/** User-facing counts derived from the live served bank — never the aspirational target. */
export const MARKETING_QUESTION_COUNTS = {
  total: formatMarketingQuestionCount(PUBLISHED_QUESTION_BANK_TOTAL),
  nursing: formatMarketingQuestionCount(fieldTargets.nursing),
  usmle: formatMarketingQuestionCount(fieldTargets["usmle-step-2"]),
  pharmacy: formatMarketingQuestionCount(fieldTargets.pharmacy),
  pance: formatMarketingQuestionCount(fieldTargets.pance),
  aanpFnp: formatMarketingQuestionCount(fieldTargets["aanp-fnp"]),
  nptePt: formatMarketingQuestionCount(fieldTargets["npte-pt"]),
} as const;

export const TOP_500_DRUGS_COUNT = TOP_500_COUNT;

export function questionBankLabelForField(fieldId: string): string {
  return `${formatMarketingQuestionCount(targetQuestionCountForField(fieldId))} board-style items`;
}

export function top500DrugsLabel(): string {
  return `${TOP_500_DRUGS_COUNT} high-yield drugs`;
}
