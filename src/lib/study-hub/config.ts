import type { ExamSlug } from "@/lib/exams/catalog";

export const STUDY_HUB_PATH = "/study-hub";
export const STUDY_HUB_PROGRESS_ID = "progress";
export const TOP_500_DRUGS_PATH = "/study/drugs300";

export const TIMED_EXAM_PATH = "/study/practice?mode=timed";
export const QUESTION_BANK_PATH = "/study/practice?mode=bank";

export type StudyHubExamBank = {
  slug: ExamSlug;
  label: string;
  fieldId: string;
  description: string;
  accentClass: string;
};

export const STUDY_HUB_EXAM_BANKS: StudyHubExamBank[] = [
  {
    slug: "nclex",
    label: "NCLEX",
    fieldId: "nursing",
    description: "Nursing question bank — prioritization, safety, and med-surg.",
    accentClass: "from-sky-500/20 to-blue-600/10 border-sky-200/60",
  },
  {
    slug: "usmle",
    label: "USMLE",
    fieldId: "usmle-step-1",
    description: "Step 1 & Step 2 CK vignettes with mechanism-first rationales.",
    accentClass: "from-indigo-500/20 to-violet-600/10 border-indigo-200/60",
  },
  {
    slug: "naplex",
    label: "NAPLEX",
    fieldId: "pharmacy",
    description: "Pharmacy calculations, cases, and pharmacotherapy.",
    accentClass: "from-emerald-500/20 to-teal-600/10 border-emerald-200/60",
  },
  {
    slug: "mpje",
    label: "MPJE",
    fieldId: "mpje",
    description: "Pharmacy law — federal, uniform (UMPJE), and state-specific jurisprudence.",
    accentClass: "from-amber-500/20 to-orange-600/10 border-amber-200/60",
  },
];

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
  if (options?.variant) qs.set("mpjeVariant", options.variant);
  if (options?.stateCode) qs.set("mpjeState", options.stateCode);
  return `/study/practice?${qs.toString()}`;
}

export function questionBankHref(fieldId?: string): string {
  if (!fieldId) return QUESTION_BANK_PATH;
  return `/study/practice?field=${encodeURIComponent(fieldId)}&mode=bank`;
}

export function timedExamHref(fieldId?: string): string {
  if (!fieldId) return TIMED_EXAM_PATH;
  return `/study/practice?field=${encodeURIComponent(fieldId)}&mode=timed`;
}

export function examModeHref(
  fieldId: string,
  mode: "timed" | "bank"
): string {
  return mode === "timed" ? timedExamHref(fieldId) : questionBankHref(fieldId);
}

export function studyHubProgressHref(): string {
  return `${STUDY_HUB_PATH}#${STUDY_HUB_PROGRESS_ID}`;
}
