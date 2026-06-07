import type { ExamDefinition, ExamSlug } from "@/types/edtech";

/** Static reference for the four supported exams (mirrors `exams` DB table). */
export const EXAM_CATALOG: Record<ExamSlug, ExamDefinition> = {
  nclex: {
    slug: "nclex",
    name: "NCLEX-RN",
    shortName: "NCLEX",
    fieldId: "nursing",
    description: "Clinical judgment, prioritization, and Next-Gen NCLEX formats.",
    accentClass: "from-sky-500/15 to-blue-600/10 border-sky-200/70",
    simulatedDurationMin: 180,
    simulatedQuestionCount: 85,
  },
  usmle: {
    slug: "usmle",
    name: "USMLE Step 2 CK",
    shortName: "USMLE",
    fieldId: "usmle-step-2",
    description: "Clinical vignettes, next-best-step management, and sequential sets.",
    accentClass: "from-indigo-500/15 to-violet-600/10 border-indigo-200/70",
    simulatedDurationMin: 240,
    simulatedQuestionCount: 80,
  },
  naplex: {
    slug: "naplex",
    name: "NAPLEX",
    shortName: "NAPLEX",
    fieldId: "pharmacy",
    description: "Calculations, patient cases, drug therapy, and safety.",
    accentClass: "from-emerald-500/15 to-teal-600/10 border-emerald-200/70",
    simulatedDurationMin: 360,
    simulatedQuestionCount: 225,
  },
  mpje: {
    slug: "mpje",
    name: "MPJE",
    shortName: "MPJE",
    fieldId: "mpje",
    description: "Federal and state pharmacy law, controlled substances, dispensing.",
    accentClass: "from-amber-500/15 to-orange-600/10 border-amber-200/70",
    simulatedDurationMin: 150,
    simulatedQuestionCount: 120,
  },
};

export const EXAM_SLUGS = Object.keys(EXAM_CATALOG) as ExamSlug[];

export function getExam(slug: string): ExamDefinition | undefined {
  return EXAM_CATALOG[slug as ExamSlug];
}

export function isExamSlug(slug: string): slug is ExamSlug {
  return slug in EXAM_CATALOG;
}

/** Map study field id to full-exam slug (USMLE steps → usmle). */
export function examSlugFromFieldId(fieldId: string): ExamSlug | null {
  if (fieldId.startsWith("usmle-step")) return "usmle";
  const entry = Object.values(EXAM_CATALOG).find((e) => e.fieldId === fieldId);
  return entry?.slug ?? null;
}
