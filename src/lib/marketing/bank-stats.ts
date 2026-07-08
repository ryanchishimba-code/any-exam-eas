import { MIN_QUESTIONS_PER_SUBJECT } from "@/lib/bulk-question-generator";
import { TOP_500_COUNT } from "@/lib/drugs300/catalog";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { NCLEX_PUBLISHED_SERVE_TOTAL, NCLEX_TARGET_TOTAL } from "@/lib/exam-prep/nclex/types";
import { NAPLEX_TARGET_TOTAL } from "@/lib/exam-prep/naplex/types";
import { AANP_FNP_TARGET_TOTAL } from "@/lib/exam-prep/aanp-fnp/types";
import { NPTE_PT_TARGET_TOTAL } from "@/lib/exam-prep/npte-pt/types";
import { PANCE_TARGET_TOTAL } from "@/lib/exam-prep/pance/types";
import { USMLE_COMBINED_TARGET, USMLE_PUBLISHED_BANK_TOTAL } from "@/lib/exam-prep/usmle/steps";

/** FDA Drugs@FDA reference count — keep in sync with public/data/fda-approved-drugs.json. */
export const FDA_REFERENCE_DRUGS_COUNT = 2723;

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
 * Offline fallback floor per field when live DB counts are unavailable.
 * Prefer `displayQuestionCountForField()` / `getQuestionBankCounts()` for UI.
 * These are serve-ready floors (not aspirational targets) so SSR/static paint
 * matches the live marketing API total.
 */
export function publishedQuestionCountForField(fieldId: string): number {
  if (fieldId === "usmle-step-2" || fieldId === "usmle") return USMLE_PUBLISHED_BANK_TOTAL;
  if (fieldId === "nursing") return NCLEX_PUBLISHED_SERVE_TOTAL;
  if (fieldId === "pharmacy") return 7_595;
  if (fieldId === "pance") return 2_801;
  if (fieldId === "aanp-fnp") return 4_781;
  if (fieldId === "npte-pt") return 4_240;
  return targetQuestionCountForField(fieldId);
}

export function formatMarketingQuestionCount(count: number): string {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+`;
  }
  return count > 0 ? `${count}+` : "—";
}

/** Exact serve-ready count for landing and marketing (e.g. 6,380). */
export function formatExactServeReadyCount(count: number): string {
  if (count <= 0) return "—";
  return count.toLocaleString("en-US");
}

export function formatExactServeReadyQuestions(count: number): string {
  const label = formatExactServeReadyCount(count);
  return label === "—" ? "— questions" : `${label} serve-ready questions`;
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
 * Keep this in sync with live serve-ready counts from `/api/marketing/bank-counts`
 * so the static hero never flashes a higher offline floor then drops after hydrate.
 * Never set it to the aspirational `TOTAL_QUESTION_BANK_TARGET`.
 */
export const PUBLISHED_QUESTION_BANK_TOTAL = 43_009;

/** Offline fallback when live DB counts are unavailable — exact serve-ready floors. */
/** Offline fallback labels — use live counts from `/api/marketing/bank-counts` in UI. */
export const FALLBACK_QUESTION_COUNTS = {
  total: formatExactServeReadyCount(PUBLISHED_QUESTION_BANK_TOTAL),
  nursing: formatExactServeReadyCount(publishedQuestionCountForField("nursing")),
  usmle: formatExactServeReadyCount(USMLE_PUBLISHED_BANK_TOTAL),
  pharmacy: formatExactServeReadyCount(publishedQuestionCountForField("pharmacy")),
  pance: formatExactServeReadyCount(publishedQuestionCountForField("pance")),
  aanpFnp: formatExactServeReadyCount(publishedQuestionCountForField("aanp-fnp")),
  nptePt: formatExactServeReadyCount(publishedQuestionCountForField("npte-pt")),
} as const;

/** @deprecated Use FALLBACK_QUESTION_COUNTS or live bank-counts API. */
export const MARKETING_QUESTION_COUNTS = FALLBACK_QUESTION_COUNTS;

export const TOP_500_DRUGS_COUNT = TOP_500_COUNT;

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
