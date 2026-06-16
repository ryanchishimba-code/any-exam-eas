import type { ExamDefinition, ExamSlug } from "@/types/edtech";
import { normalizeFieldId } from "@/lib/subjects/field-ids";

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
    simulatedQuestionCount: 280,
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
  pance: {
    slug: "pance",
    name: "PANCE",
    shortName: "PANCE",
    fieldId: "pance",
    description:
      "NCCPA blueprint clinical vignettes — cardiovascular, pulmonary, GI, MSK, ID, neurology, and more.",
    accentClass: "from-rose-500/15 to-pink-600/10 border-rose-200/70",
    simulatedDurationMin: 300,
    simulatedQuestionCount: 300,
  },
  "aanp-fnp": {
    slug: "aanp-fnp",
    name: "AANP FNP-C",
    shortName: "AANP FNP",
    fieldId: "aanp-fnp",
    description:
      "AANPCB blueprint primary care — Assess, Diagnose, Plan, Evaluate across the lifespan.",
    accentClass: "from-violet-500/15 to-purple-600/10 border-violet-200/70",
    simulatedDurationMin: 210,
    simulatedQuestionCount: 135,
  },
  "npte-pt": {
    slug: "npte-pt",
    name: "NPTE-PT",
    shortName: "NPTE-PT",
    fieldId: "npte-pt",
    description:
      "FSBPT blueprint clinical scenarios — MSK, neuromuscular, cardiopulmonary, modalities, safety, and professional practice.",
    accentClass: "from-cyan-500/15 to-teal-600/10 border-cyan-200/70",
    simulatedDurationMin: 300,
    simulatedQuestionCount: 250,
  },
};

export const EXAM_SLUGS = Object.keys(EXAM_CATALOG) as ExamSlug[];

export function getExam(slug: string): ExamDefinition | undefined {
  return EXAM_CATALOG[slug as ExamSlug];
}

export function isExamSlug(slug: string): slug is ExamSlug {
  return slug in EXAM_CATALOG;
}

/** Map study field id to full-exam slug (USMLE steps → usmle; legacy ids → pance). */
export function examSlugFromFieldId(fieldId: string): ExamSlug | null {
  const normalized = normalizeFieldId(fieldId);
  if (normalized.startsWith("usmle-step")) return "usmle";
  const entry = Object.values(EXAM_CATALOG).find((e) => e.fieldId === normalized);
  return entry?.slug ?? null;
}
