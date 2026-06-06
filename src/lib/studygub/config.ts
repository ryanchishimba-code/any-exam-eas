import type { ExamSlug } from "@/lib/exams/catalog";

export const STUDYGUB_PATH = "/studygub";
export const TOP_500_DRUGS_PATH = "/study/drugs300";

export type StudyGubExamBank = {
  slug: ExamSlug;
  label: string;
  fieldId: string;
  description: string;
  accentClass: string;
};

/** Exam-specific question banks (no Top 500 — shared drug list is separate). */
export const STUDYGUB_EXAM_BANKS: StudyGubExamBank[] = [
  {
    slug: "nclex",
    label: "NCLEX",
    fieldId: "nursing",
    description: "Nursing question bank — prioritization, safety, pharmacology, and med-surg.",
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
