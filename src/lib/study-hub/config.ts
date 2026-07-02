import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS, examSlugFromFieldId } from "@/lib/edtech/exams";
import { fullExamHref, ROUTES } from "@/lib/routes";

export const STUDY_HUB_PATH = "/dashboard";
export const DASHBOARD_PATH = "/dashboard";
export const STUDY_HUB_PROGRESS_ID = "progress";
export const TOP_500_DRUGS_PATH = "/study/drugs300";
export const ANATOMY_EXPLORER_PATH = ROUTES.anatomy;

export const TIMED_EXAM_PATH = "/full-exam";
export const QUESTION_BANK_PATH = "/question-bank";

export type StudyHubExamBank = {
  slug: ExamSlug;
  label: string;
  fieldId: string;
  description: string;
  accentClass: string;
};

const HUB_DESCRIPTIONS: Record<(typeof EXAM_SLUGS)[number], string> = {
  nclex: "Nursing question bank — prioritization, safety, and med-surg.",
  usmle: "Clinical vignettes with mechanism-first rationales.",
  naplex: "Pharmacy calculations, cases, and pharmacotherapy.",
  pance: "Physician assistant clinical vignettes — NCCPA 2026 blueprint across 14 knowledge areas and 8 task areas.",
  "aanp-fnp": "Family nurse practitioner vignettes — AANPCB Assess, Diagnose, Plan, Evaluate across the lifespan.",
  "npte-pt": "Physical therapy clinical scenarios — FSBPT musculoskeletal, neuromuscular, cardiopulmonary, and practice systems.",
};

/** Four board exams — derived from canonical EXAM_CATALOG. */
export const STUDY_HUB_EXAM_BANKS: StudyHubExamBank[] = EXAM_SLUGS.map((slug) => ({
  slug,
  label: EXAM_CATALOG[slug].shortName,
  fieldId: EXAM_CATALOG[slug].fieldId,
  description: HUB_DESCRIPTIONS[slug],
  accentClass: EXAM_CATALOG[slug].accentClass,
}));

export function questionBankHref(fieldId?: string): string {
  if (!fieldId) return QUESTION_BANK_PATH;
  return `${QUESTION_BANK_PATH}?field=${encodeURIComponent(fieldId)}`;
}

export function timedExamHref(fieldId?: string): string {
  if (!fieldId) return TIMED_EXAM_PATH;
  const slug = examSlugFromFieldId(fieldId);
  if (slug) return fullExamHref(slug);
  return TIMED_EXAM_PATH;
}

export function examModeHref(
  fieldId: string,
  mode: "timed" | "bank"
): string {
  return mode === "timed" ? timedExamHref(fieldId) : questionBankHref(fieldId);
}

export function studyHubProgressHref(): string {
  return ROUTES.analytics;
}

/** @deprecated MPJE removed — use PANCE question bank. */
export function studyHubMpjeHref(): string {
  return `${STUDY_HUB_PATH}?exam=pance`;
}

/** @deprecated MPJE removed — use questionBankHref("pance"). */
export function mpjePracticeHref(_options?: {
  mode?: "timed" | "bank";
  variant?: "uniform" | "state";
  stateCode?: string;
}): string {
  return questionBankHref("pance");
}

/** @deprecated MPJE removed — redirects to PANCE full exam. */
export function mpjePracticeExamHref(_stateCode?: string): string {
  return "/full-exam/pance?mode=full&autostart=1";
}
