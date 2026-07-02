/**
 * Side-by-side comparison of all six AnyExamEasy board exams.
 * Used on the toolkit page and landing marketing sections.
 */
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { examMarketingPath } from "@/lib/seo/exam-config";

export type CrossExamComparisonRow = {
  id: string;
  exam: string;
  subtitle: string;
  accent: string;
  prepHref: string;
  questions: string;
  duration: string;
  format: string;
  primaryFocus: string;
  blueprintAxis: string;
  keyDifferentiator: string;
  officialBoard: string;
};

export const CROSS_EXAM_COMPARISON: CrossExamComparisonRow[] = [
  {
    id: "usmle",
    exam: "USMLE",
    subtitle: "Step 1 · Step 2 CK · Step 3",
    accent: EXAM_ACCENTS.usmle,
    prepHref: examMarketingPath("usmle"),
    questions: "Step 1: ~280 | Step 2 CK: ~316 | Step 3: ~412 MCQs + CCS",
    duration: "8–9 hours per step; Step 3 is two days",
    format: "Single-best-answer MCQs; Step 3 adds CCS cases",
    primaryFocus: "Medical knowledge — basic sciences through unsupervised practice",
    blueprintAxis: "Organ systems + clinical disciplines (Step 1); patient care (Step 2/3)",
    keyDifferentiator: "Multi-step licensure path with CCS management simulations",
    officialBoard: "FSMB / NBME",
  },
  {
    id: "nclex",
    exam: "NCLEX-RN",
    subtitle: "Registered Nurse Licensure",
    accent: EXAM_ACCENTS.nclex,
    prepHref: examMarketingPath("nclex"),
    questions: "85–150 items (includes NGN case studies)",
    duration: "Up to 5 hours",
    format: "Computer-adaptive; NGN clinical judgment formats",
    primaryFocus: "Clinical judgment, safe care, client needs across the lifespan",
    blueprintAxis: "Client Needs categories + NGN item types",
    keyDifferentiator: "Adaptive length with Next Gen NCLEX case studies & bow-tie items",
    officialBoard: "NCSBN",
  },
  {
    id: "naplex",
    exam: "NAPLEX",
    subtitle: "Pharmacist Licensure",
    accent: EXAM_ACCENTS.naplex,
    prepHref: examMarketingPath("naplex"),
    questions: "225 (200 scored + 25 pretest)",
    duration: "6 hours",
    format: "Single-best-answer MCQs",
    primaryFocus: "Safe pharmacy practice — calculations, therapeutics, treatment planning",
    blueprintAxis: "Five NABP content domains (treatment planning ~40%)",
    keyDifferentiator: "Heavy calculations, PK/PD, and guideline-based pharmacotherapy",
    officialBoard: "NABP",
  },
  {
    id: "pance",
    exam: "PANCE",
    subtitle: "Physician Assistant Certification",
    accent: EXAM_ACCENTS.pance,
    prepHref: examMarketingPath("pance"),
    questions: "300 MCQs",
    duration: "5 hours",
    format: "Single-best-answer clinical vignettes",
    primaryFocus: "Entry-level PA competency — diagnosis, pharmacotherapy, intervention",
    blueprintAxis: "14 organ systems × 8 task areas (NCCPA 2026)",
    keyDifferentiator: "Integrated pharmacology across organ systems; task-area rotation",
    officialBoard: "NCCPA",
  },
  {
    id: "aanp-fnp",
    exam: "AANP FNP",
    subtitle: "Family Nurse Practitioner Certification",
    accent: EXAM_ACCENTS.aanpFnp,
    prepHref: examMarketingPath("aanp-fnp"),
    questions: "150 (135 scored + 15 pretest)",
    duration: "3 hours",
    format: "Single-best-answer primary care vignettes",
    primaryFocus: "Primary care across lifespan — assess, diagnose, plan, evaluate",
    blueprintAxis: "AANPCB cognitive domains + 12 body-system modules",
    keyDifferentiator: "Outpatient primary care; pediatrics & geriatrics emphasis",
    officialBoard: "AANPCB",
  },
  {
    id: "npte-pt",
    exam: "NPTE-PT",
    subtitle: "Physical Therapist Licensure",
    accent: EXAM_ACCENTS.nptePt,
    prepHref: examMarketingPath("npte-pt"),
    questions: "250 (180 scored + 70 pretest)",
    duration: "5 hours",
    format: "Single-best-answer clinical vignettes",
    primaryFocus: "Entry-level PT — examination, evaluation, intervention, safety",
    blueprintAxis: "14 body systems × 3 process task areas (FSBPT 2026)",
    keyDifferentiator: "MSK + neuro dominate (~52%); red flags & special tests heavily tested",
    officialBoard: "FSBPT",
  },
];

/** Summary stats for marketing hero copy. */
export const CROSS_EXAM_SUMMARY = {
  examCount: CROSS_EXAM_COMPARISON.length,
  totalQuestionFormats: "Single-best-answer MCQs across all six exams",
  sharedPlatform: "One subscription — QA-gated banks, roadmaps, and full-length simulations",
} as const;
