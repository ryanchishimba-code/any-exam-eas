import type { LucideIcon } from "lucide-react";
import { Activity, BookOpenCheck, HeartPulse, Pill } from "lucide-react";
import type { ExamSlug } from "@/types/edtech";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";

/**
 * Visual theme per board exam for the selection screen.
 * Customize gradients/icons here — cards read from this map only.
 */
export type ExamSelectionTheme = {
  slug: ExamSlug;
  /** Benefit-focused hero copy on the card */
  tagline: string;
  /** Stat badges shown under the description */
  stats: string[];
  icon: LucideIcon;
  /** Tailwind gradient stops for card background */
  gradient: string;
  /** Hover glow + border accent */
  glow: string;
  /** Icon well + CTA button colors */
  iconBg: string;
  iconColor: string;
  ctaClass: string;
  /** Decorative orb color (animated background inside card) */
  orb: string;
};

export const EXAM_SELECTION_THEMES: Record<ExamSlug, ExamSelectionTheme> = {
  nclex: {
    slug: "nclex",
    tagline:
      "Master clinical judgment, prioritization, and Next-Gen formats with nursing-first prep.",
    stats: [`${MARKETING_QUESTION_COUNTS.nursing} Questions`, "High-Yield Topics", "Full Simulations"],
    icon: Activity,
    gradient: "from-sky-600/90 via-teal-600/85 to-cyan-700/90",
    glow: "group-hover:shadow-teal-500/25 group-hover:border-teal-300/80",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    ctaClass: "bg-white text-teal-800 hover:bg-teal-50",
    orb: "bg-cyan-300/30",
  },
  usmle: {
    slug: "usmle",
    tagline:
      "Clinical vignettes, next-best-step management, and sequential sets built for Step 2 CK.",
    stats: ["80Q Simulations", "Adaptive Bank", "Analytics"],
    icon: BookOpenCheck,
    gradient: "from-emerald-600/90 via-green-600/85 to-teal-700/90",
    glow: "group-hover:shadow-emerald-500/25 group-hover:border-emerald-300/80",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    ctaClass: "bg-white text-emerald-900 hover:bg-emerald-50",
    orb: "bg-emerald-300/25",
  },
  naplex: {
    slug: "naplex",
    tagline:
      "Calculations, patient cases, and pharmacotherapy — everything NAPLEX expects you to know.",
    stats: [`${MARKETING_QUESTION_COUNTS.pharmacy} Pharmacy Items`, "Drug Cases", "Timed Exams"],
    icon: Pill,
    gradient: "from-amber-500/90 via-orange-500/85 to-amber-600/90",
    glow: "group-hover:shadow-amber-500/30 group-hover:border-amber-300/80",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    ctaClass: "bg-white text-amber-900 hover:bg-amber-50",
    orb: "bg-orange-200/30",
  },
  pance: {
    slug: "pance",
    tagline:
      "NCCPA blueprint vignettes — cardiovascular, pulmonary, GI, MSK, ID, neurology, psychiatry, reproductive, endocrine, and more.",
    stats: ["300Q Exam Blueprint", "Roadmap Tracker", "Full Simulations"],
    icon: HeartPulse,
    gradient: "from-rose-600/90 via-pink-600/85 to-rose-700/90",
    glow: "group-hover:shadow-rose-500/25 group-hover:border-rose-300/80",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    ctaClass: "bg-white text-rose-900 hover:bg-rose-50",
    orb: "bg-rose-300/25",
  },
  "aanp-fnp": {
    slug: "aanp-fnp",
    tagline:
      "AANPCB FNP blueprint primary care — Assess, Diagnose, Plan, and Evaluate across the lifespan.",
    stats: [`${MARKETING_QUESTION_COUNTS.aanpFnp} Questions`, "Roadmap Tracker", "Full Simulations"],
    icon: HeartPulse,
    gradient: "from-violet-600/90 via-purple-600/85 to-fuchsia-700/90",
    glow: "group-hover:shadow-violet-500/25 group-hover:border-violet-300/80",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    ctaClass: "bg-white text-violet-900 hover:bg-violet-50",
    orb: "bg-violet-300/25",
  },
};
