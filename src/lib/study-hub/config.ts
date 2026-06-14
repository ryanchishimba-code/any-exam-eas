import type { ExamSlug } from "@/lib/exams/catalog";
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
  mpje: "Pharmacy law — federal, uniform (UMPJE), and state-specific jurisprudence.",
};

/** Four board exams — derived from canonical EXAM_CATALOG. */
export const STUDY_HUB_EXAM_BANKS: StudyHubExamBank[] = EXAM_SLUGS.map((slug) => ({
  slug: slug as ExamSlug,
  label: EXAM_CATALOG[slug].shortName,
  fieldId: EXAM_CATALOG[slug].fieldId,
  description: HUB_DESCRIPTIONS[slug],
  accentClass: EXAM_CATALOG[slug].accentClass,
}));

/** Study Hub URL with MPJE picker open. */
export function studyHubMpjeHref(): string {
  return `${STUDY_HUB_PATH}?exam=mpje`;
}

export function mpjePracticeHref(options?: {
  mode?: "timed" | "bank";
  variant?: "uniform" | "state";
  stateCode?: string;
}): string {
  const qs = new URLSearchParams({
    field: "mpje",
    mode: options?.mode ?? "bank",
  });
  const variant = options?.variant ?? "state";
  qs.set("mpjeVariant", variant);
  if (variant === "state" && options?.stateCode) {
    qs.set("state", options.stateCode);
    qs.set("mpjeState", options.stateCode);
  }
  return `/study/practice?${qs.toString()}`;
}

/** Full 120-question / 2.5-hour MPJE practice exam simulator. */
export function mpjePracticeExamHref(stateCode?: string): string {
  if (!stateCode?.trim()) return "/mpje/practice-exam";
  const qs = new URLSearchParams({
    state: stateCode,
    mpjeState: stateCode,
  });
  return `/mpje/practice-exam?${qs.toString()}`;
}

export function questionBankHref(fieldId?: string): string {
  if (!fieldId) return QUESTION_BANK_PATH;
  return `${QUESTION_BANK_PATH}?field=${encodeURIComponent(fieldId)}`;
}

export function timedExamHref(fieldId?: string): string {
  if (!fieldId) return TIMED_EXAM_PATH;
  const slug = examSlugFromFieldId(fieldId);
  if (slug) return fullExamHref(slug);
  return `/study/practice?field=${encodeURIComponent(fieldId)}&mode=timed`;
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
