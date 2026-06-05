import type { ExamSlug } from "@/lib/exams/catalog";

export const STUDY_HUB_PATH = "/study-hub";
export const STUDY_HUB_PROGRESS_ID = "progress";
export const TOP_500_DRUGS_PATH = "/study/drugs300";

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
    label: "NCLEX NGN",
    fieldId: "nursing",
    description: "Nursing question bank — prioritization, safety, NGN formats, and med-surg.",
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
];

export function questionBankHref(fieldId: string): string {
  return `/study/practice?field=${encodeURIComponent(fieldId)}`;
}

export function studyHubProgressHref(): string {
  return `${STUDY_HUB_PATH}#${STUDY_HUB_PROGRESS_ID}`;
}
