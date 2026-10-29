import type { ExamDefinition, ExamSlug } from "@/types/edtech";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { isUsmleFieldId, USMLE_COMBINED_TARGET, USMLE_STEPS } from "@/lib/exam-prep/usmle/steps";

/** Static reference for supported exams (mirrors `exams` DB table). */
export const EXAM_CATALOG: Record<ExamSlug, ExamDefinition> = {
  nclex: {
    slug: "nclex",
    name: "NCLEX-RN",
    shortName: "NCLEX",
    fieldId: "nursing",
    description: "Clinical judgment, prioritization, and Next-Gen NCLEX formats.",
    accentClass: "from-sky-500/15 to-blue-600/10 border-sky-200/70",
    simulatedDurationMin: 300,
    simulatedQuestionCount: 85,
  },
  usmle: {
    slug: "usmle",
    name: "USMLE Step 1 · Step 2 CK · Step 3",
    shortName: "USMLE",
    fieldId: "usmle-step-2",
    description:
      "Full USMLE coverage — Step 1 basic sciences, Step 2 CK clinical vignettes, and Step 3 CCS-style cases.",
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

/** Map study field id to full-exam slug (all USMLE steps → usmle). */
export function examSlugFromFieldId(fieldId: string): ExamSlug | null {
  const normalized = normalizeFieldId(fieldId);
  if (isUsmleFieldId(normalized)) return "usmle";
  const entry = Object.values(EXAM_CATALOG).find((e) => e.fieldId === normalized);
  return entry?.slug ?? null;
}

/**
 * All study field ids that belong to an exam. USMLE spans its three step fields;
 * every other exam maps to a single field. Used to scope per-exam analytics.
 */
export function examFieldIds(examSlug: ExamSlug): string[] {
  if (examSlug === "usmle") return USMLE_STEPS.map((s) => s.fieldId);
  return [EXAM_CATALOG[examSlug].fieldId];
}

export { USMLE_STEPS, USMLE_COMBINED_TARGET };
