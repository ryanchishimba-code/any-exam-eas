import type { LucideIcon } from "lucide-react";
import { Activity, Beaker, Pill, Scale, Stethoscope } from "lucide-react";

export type ExamSlug = "nclex" | "usmle" | "naplex" | "mpje" | "top500";

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
    questionBankLabel: "130K+ nursing items",
  },
  {
    slug: "usmle",
    title: "USMLE Prep",
    subtitle: "Clinical vignettes with mechanism-first rationales.",
    fieldId: "usmle-step-2",
    icon: Stethoscope,
    accentClass: "from-indigo-500/20 to-violet-600/10 border-indigo-200/60",
    questionBankLabel: "30K+ medicine items",
  },
  {
    slug: "naplex",
    title: "NAPLEX Prep",
    subtitle: "Calculations, patient cases, and pharmacotherapy mastery.",
    fieldId: "pharmacy",
    icon: Pill,
    accentClass: "from-emerald-500/20 to-teal-600/10 border-emerald-200/60",
    questionBankLabel: "24K+ pharmacy items",
  },
  {
    slug: "mpje",
    title: "MPJE Prep",
    subtitle: "Federal law, uniform MPJE (UMPJE), and state-specific jurisprudence.",
    fieldId: "mpje",
    icon: Scale,
    accentClass: "from-amber-500/20 to-orange-600/10 border-amber-200/60",
    questionBankLabel: "Pharmacy law & regulations",
  },
  {
    slug: "top500",
    title: "Top 500 Prep",
    subtitle: "High-yield drug flashcards with spaced repetition.",
    fieldId: "drugs300",
    icon: Beaker,
    accentClass: "from-amber-500/20 to-orange-600/10 border-amber-200/60",
    questionBankLabel: "300 essential drugs",
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
