import { MIN_QUESTIONS_PER_SUBJECT } from "@/lib/bulk-question-generator";
import { TOP_500_COUNT } from "@/lib/drugs300/catalog";
import type { FdaDrugReferenceDocument } from "@/lib/drugs300/schema";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { NCLEX_TARGET_TOTAL } from "@/lib/exam-prep/nclex/types";
import { NAPLEX_TARGET_TOTAL } from "@/lib/exam-prep/naplex/types";
import { AANP_FNP_TARGET_TOTAL } from "@/lib/exam-prep/aanp-fnp/types";
import { NPTE_PT_TARGET_TOTAL } from "@/lib/exam-prep/npte-pt/types";
import { PANCE_TARGET_TOTAL } from "@/lib/exam-prep/pance/types";
import { USMLE_COMBINED_TARGET, USMLE_PUBLISHED_BANK_TOTAL } from "@/lib/exam-prep/usmle/steps";
import fdaReferenceDocument from "../../../public/data/fda-approved-drugs.json";

/** Design target per field after bank sync (subjects × minimum items each). */
export function targetQuestionCountForField(fieldId: string): number {
  if (fieldId === "aanp-fnp") return AANP_FNP_TARGET_TOTAL;
  if (fieldId === "pance") return PANCE_TARGET_TOTAL;
  if (fieldId === "npte-pt") return NPTE_PT_TARGET_TOTAL;
  if (fieldId === "nursing") return NCLEX_TARGET_TOTAL;
  if (fieldId === "pharmacy") return NAPLEX_TARGET_TOTAL;
  if (fieldId === "usmle-step-2" || fieldId === "usmle") return USMLE_COMBINED_TARGET;
  return getSubjectsForFieldId(fieldId).length * MIN_QUESTIONS_PER_SUBJECT;
}

/**
 * User-facing published bank size per field — reflects the curated serve bank
 * (post quality-trim), never the aspirational generation target. Use for any
 * count shown to users (labels, nav stats, showcase).
 */
export function publishedQuestionCountForField(fieldId: string): number {
  if (fieldId === "usmle-step-2" || fieldId === "usmle") return USMLE_PUBLISHED_BANK_TOTAL;
  if (fieldId === "nursing") return NCLEX_TARGET_TOTAL;
  if (fieldId === "pharmacy") return NAPLEX_TARGET_TOTAL;
  if (fieldId === "pance") return PANCE_TARGET_TOTAL;
  if (fieldId === "aanp-fnp") return AANP_FNP_TARGET_TOTAL;
  if (fieldId === "npte-pt") return NPTE_PT_TARGET_TOTAL;
  return targetQuestionCountForField(fieldId);
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
 * Curated, QA-gated published bank size — the single source of truth for every
 * user-facing total (hero, exam wheel, stats band, share, checkout).
 *
 * This intentionally reflects the curated serve bank, NOT the raw live DB row
 * count (which still includes pre-curation bulk). Keep it ≤ the sum of the
 * per-field published counts and never set it to the aspirational
 * `TOTAL_QUESTION_BANK_TARGET`, which counts questions we still plan to add.
 */
export const PUBLISHED_QUESTION_BANK_TOTAL = 38_000;

/** User-facing counts derived from the live served bank — never the aspirational target. */
export const MARKETING_QUESTION_COUNTS = {
  total: formatMarketingQuestionCount(PUBLISHED_QUESTION_BANK_TOTAL),
  nursing: formatMarketingQuestionCount(fieldTargets.nursing),
  usmle: formatMarketingQuestionCount(USMLE_PUBLISHED_BANK_TOTAL),
  pharmacy: formatMarketingQuestionCount(fieldTargets.pharmacy),
  pance: formatMarketingQuestionCount(fieldTargets.pance),
  aanpFnp: formatMarketingQuestionCount(fieldTargets["aanp-fnp"]),
  nptePt: formatMarketingQuestionCount(fieldTargets["npte-pt"]),
} as const;

export const TOP_500_DRUGS_COUNT = TOP_500_COUNT;

export const FDA_REFERENCE_DRUGS_COUNT = (fdaReferenceDocument as FdaDrugReferenceDocument).count;

/** User-facing deck name — product is branded Top 500; catalog count tracks curated cards. */
export const DRUGS_DECK_MARKETING_TITLE = `Top ${TOP_500_DRUGS_COUNT} Drugs`;

export function formatMarketingDrugCount(count: number): string {
  return formatMarketingQuestionCount(count);
}

export function drugsDeckFeatureLine(): string {
  return `${TOP_500_DRUGS_COUNT} flashcards + ${formatMarketingDrugCount(FDA_REFERENCE_DRUGS_COUNT)} FDA reference search`;
}

export function drugsDeckShortDetail(): string {
  return `${TOP_500_DRUGS_COUNT} curated flashcards with mnemonics, pearls, and spaced repetition — plus searchable FDA Drugs@FDA reference.`;
}

export function top500DrugsLabel(): string {
  return `${TOP_500_DRUGS_COUNT} high-yield drugs`;
}

export function questionBankLabelForField(fieldId: string): string {
  return `${formatMarketingQuestionCount(publishedQuestionCountForField(fieldId))} board-style items`;
}
