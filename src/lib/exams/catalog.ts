import type { LucideIcon } from "lucide-react";
import { Activity, Beaker, Bone, HeartPulse, Pill, Stethoscope } from "lucide-react";
import {
  MARKETING_QUESTION_COUNTS,
  questionBankLabelForField,
  top500DrugsLabel,
} from "@/lib/marketing/bank-stats";

export type ExamSlug = "nclex" | "usmle" | "naplex" | "pance" | "aanp-fnp" | "npte-pt" | "top500";

/** Serializable hub metadata (safe for server → client props). */
export type ExamHubMeta = {
  slug: ExamSlug;
  title: string;
  subtitle: string;
  fieldId: string;
  accentClass: string;
  questionBankLabel: string;
};

export type ExamHubConfig = ExamHubMeta & {
  icon: LucideIcon;
};

export const EXAM_HUBS: ExamHubConfig[] = [
  {
    slug: "nclex",
    title: "NCLEX",
    subtitle: "Clinical judgment, NGN formats, and high-yield nursing scenarios.",
    fieldId: "nursing",
    icon: Activity,
    accentClass: "from-sky-500/20 to-blue-600/10 border-sky-200/60",
    questionBankLabel: questionBankLabelForField("nursing"),
  },
  {
    slug: "usmle",
    title: "USMLE Prep",
    subtitle: "Step 1 basic sciences, Step 2 CK clinical vignettes, and Step 3 CCS-style cases.",
    fieldId: "usmle-step-2",
    icon: Stethoscope,
    accentClass: "from-indigo-500/20 to-violet-600/10 border-indigo-200/60",
    questionBankLabel: questionBankLabelForField("usmle-step-2"),
  },
  {
    slug: "naplex",
    title: "NAPLEX Prep",
    subtitle: "Calculations, patient cases, and pharmacotherapy mastery.",
    fieldId: "pharmacy",
    icon: Pill,
    accentClass: "from-emerald-500/20 to-teal-600/10 border-emerald-200/60",
    questionBankLabel: questionBankLabelForField("pharmacy"),
  },
  {
    slug: "pance",
    title: "PANCE Prep",
    subtitle: "NCCPA 2026 blueprint — clinical vignettes across 14 knowledge areas and 8 task areas.",
    fieldId: "pance",
    icon: HeartPulse,
    accentClass: "from-rose-500/20 to-pink-600/10 border-rose-200/60",
    questionBankLabel: questionBankLabelForField("pance"),
  },
  {
    slug: "aanp-fnp",
    title: "AANP FNP",
    subtitle: "AANPCB FNP blueprint · primary care vignettes across the lifespan.",
    fieldId: "aanp-fnp",
    icon: HeartPulse,
    accentClass: "from-violet-500/20 to-purple-600/10 border-violet-200/60",
    questionBankLabel: questionBankLabelForField("aanp-fnp"),
  },
  {
    slug: "npte-pt",
    title: "NPTE-PT",
    subtitle: "FSBPT blueprint · musculoskeletal, neuromuscular, cardiopulmonary, and PT practice systems.",
    fieldId: "npte-pt",
    icon: Bone,
    accentClass: "from-cyan-500/20 to-teal-600/10 border-cyan-200/60",
    questionBankLabel: questionBankLabelForField("npte-pt"),
  },
  {
    slug: "top500",
    title: "Top 500 Prep",
    subtitle: "High-yield drug flashcards with spaced repetition.",
    fieldId: "drugs300",
    icon: Beaker,
    accentClass: "from-amber-500/20 to-orange-600/10 border-amber-200/60",
    questionBankLabel: top500DrugsLabel(),
  },
];

export function getExamHub(slug: string): ExamHubConfig | undefined {
  return EXAM_HUBS.find((e) => e.slug === slug);
}

export function examSlugToFieldId(slug: ExamSlug): string {
  return getExamHub(slug)?.fieldId ?? slug;
}

export function toExamHubMeta(hub: ExamHubConfig): ExamHubMeta {
  const { slug, title, subtitle, fieldId, accentClass, questionBankLabel } = hub;
  return { slug, title, subtitle, fieldId, accentClass, questionBankLabel };
}
