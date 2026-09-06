/**
 * Official USMLE content model (NBME / FSMB).
 *
 * Encodes organ-system spine + physician tasks with published Step weight ranges.
 * Practice readiness is in-app only — never claim board-pass prediction.
 *
 * Sources (retrieved 2026-09-06):
 * - https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications
 * - https://www.usmle.org/exam-resources/step-2-ck-materials/step-2-ck-content-outline-and-specifications
 * - https://www.usmle.org/exam-resources/step-3-materials/step-3-content-outline-and-specifications
 * - https://www.usmle.org/sites/default/files/2022-01/USMLE_Content_Outline_0.pdf
 */

import type { UsmleStepLevel } from "./types";

export const USMLE_OFFICIAL_MODEL_RETRIEVED_AT = "2026-09-06";

export const USMLE_OFFICIAL_SOURCES = {
  contentOutline:
    "https://www.usmle.org/sites/default/files/2022-01/USMLE_Content_Outline_0.pdf",
  step1:
    "https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications",
  step2:
    "https://www.usmle.org/exam-resources/step-2-ck-materials/step-2-ck-content-outline-and-specifications",
  step3:
    "https://www.usmle.org/exam-resources/step-3-materials/step-3-content-outline-and-specifications",
} as const;

/** Shared organ-system IDs — one spine across Steps 1–3. */
export type UsmleOrganSystemId =
  | "human-development"
  | "blood-lymph-immune"
  | "behavioral-nervous"
  | "msk-skin"
  | "cardiovascular"
  | "respiratory-renal"
  | "gastrointestinal"
  | "reproductive-endocrine"
  | "multisystem"
  | "biostats-epi"
  | "social-sciences";

export type WeightRange = { minPct: number; maxPct: number };

export type UsmleOrganSystemDef = {
  id: UsmleOrganSystemId;
  label: string;
  shortLabel: string;
  /** Midpoint used for generation / rebalance quotas. */
  midpointPct: (step: UsmleStepLevel) => number;
  ranges: Partial<Record<UsmleStepLevel, WeightRange>>;
};

/**
 * Official Table 1 organ-system ranges (approx midpoints for slot planning).
 * Step 2 CK splits some systems differently in published tables; we map onto
 * the shared spine and document the mapping in docs/usmle-official-alignment.md.
 */
export const USMLE_ORGAN_SYSTEMS: UsmleOrganSystemDef[] = [
  {
    id: "human-development",
    label: "Human Development",
    shortLabel: "Development",
    midpointPct: (s) => (s === "step1" ? 2 : s === "step2" ? 3 : 2),
    ranges: {
      step1: { minPct: 1, maxPct: 3 },
      step2: { minPct: 2, maxPct: 4 },
      step3: { minPct: 1, maxPct: 3 },
    },
  },
  {
    id: "blood-lymph-immune",
    label: "Blood & Lymphoreticular / Immune Systems",
    shortLabel: "Heme/Immune",
    midpointPct: (s) => (s === "step1" ? 11 : s === "step2" ? 7.5 : 8),
    ranges: {
      step1: { minPct: 9, maxPct: 13 },
      step2: { minPct: 5, maxPct: 10 },
      step3: { minPct: 6, maxPct: 10 },
    },
  },
  {
    id: "behavioral-nervous",
    label: "Behavioral Health & Nervous Systems / Special Senses",
    shortLabel: "Neuro/Psych",
    midpointPct: (s) => (s === "step1" ? 12 : s === "step2" ? 12.5 : 12),
    ranges: {
      step1: { minPct: 10, maxPct: 14 },
      // Step 2: Behavioral Health 5–10 + Nervous 5–10 ≈ combined spine bucket
      step2: { minPct: 10, maxPct: 20 },
      step3: { minPct: 10, maxPct: 16 },
    },
  },
  {
    id: "msk-skin",
    label: "Musculoskeletal, Skin & Subcutaneous Tissue",
    shortLabel: "MSK/Skin",
    midpointPct: (s) => (s === "step1" ? 10 : s === "step2" ? 9 : 8),
    ranges: {
      step1: { minPct: 8, maxPct: 12 },
      step2: { minPct: 6, maxPct: 12 },
      step3: { minPct: 6, maxPct: 10 },
    },
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular System",
    shortLabel: "CV",
    midpointPct: (s) => (s === "step1" ? 9 : s === "step2" ? 9 : 10),
    ranges: {
      step1: { minPct: 7, maxPct: 11 },
      step2: { minPct: 6, maxPct: 12 },
      step3: { minPct: 8, maxPct: 12 },
    },
  },
  {
    id: "respiratory-renal",
    label: "Respiratory & Renal / Urinary Systems",
    shortLabel: "Resp/Renal",
    midpointPct: (s) => (s === "step1" ? 13 : s === "step2" ? 15 : 12),
    ranges: {
      step1: { minPct: 11, maxPct: 15 },
      // Step 2: Renal/Repro 7–13 + Respiratory 5–10 (renal portion mapped here;
      // reproductive portion maps to reproductive-endocrine)
      step2: { minPct: 10, maxPct: 18 },
      step3: { minPct: 10, maxPct: 14 },
    },
  },
  {
    id: "gastrointestinal",
    label: "Gastrointestinal System",
    shortLabel: "GI",
    midpointPct: (s) => (s === "step1" ? 8 : s === "step2" ? 7.5 : 8),
    ranges: {
      step1: { minPct: 6, maxPct: 10 },
      step2: { minPct: 5, maxPct: 10 },
      step3: { minPct: 6, maxPct: 10 },
    },
  },
  {
    id: "reproductive-endocrine",
    label: "Reproductive & Endocrine Systems",
    shortLabel: "Repro/Endo",
    midpointPct: (s) => (s === "step1" ? 14 : s === "step2" ? 10 : 10),
    ranges: {
      step1: { minPct: 12, maxPct: 16 },
      // Step 2: Endocrine 3–7 + Pregnancy 3–7 + renal/repro share
      step2: { minPct: 6, maxPct: 14 },
      step3: { minPct: 8, maxPct: 12 },
    },
  },
  {
    id: "multisystem",
    label: "Multisystem Processes & Disorders",
    shortLabel: "Multisystem",
    midpointPct: (s) => (s === "step1" ? 10 : s === "step2" ? 6 : 8),
    ranges: {
      step1: { minPct: 8, maxPct: 12 },
      step2: { minPct: 4, maxPct: 8 },
      step3: { minPct: 6, maxPct: 10 },
    },
  },
  {
    id: "biostats-epi",
    label: "Biostatistics & Epidemiology / Population Health",
    shortLabel: "Biostats",
    midpointPct: (s) => (s === "step1" ? 5 : s === "step2" ? 4 : 8),
    ranges: {
      step1: { minPct: 4, maxPct: 6 },
      step2: { minPct: 3, maxPct: 5 },
      step3: { minPct: 6, maxPct: 12 },
    },
  },
  {
    id: "social-sciences",
    label: "Social Sciences: Communication, Ethics & Systems-Based Practice",
    shortLabel: "Ethics/SBP",
    midpointPct: (s) => (s === "step1" ? 7.5 : s === "step2" ? 12.5 : 10),
    ranges: {
      step1: { minPct: 6, maxPct: 9 },
      step2: { minPct: 10, maxPct: 15 },
      step3: { minPct: 7, maxPct: 12 },
    },
  },
];

/** Normalized weights for slot allocation (sum ≈ 1). */
export function organSystemWeightsForStep(step: UsmleStepLevel): Record<UsmleOrganSystemId, number> {
  const raw = Object.fromEntries(
    USMLE_ORGAN_SYSTEMS.map((s) => [s.id, s.midpointPct(step)])
  ) as Record<UsmleOrganSystemId, number>;
  const sum = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
  const out = { ...raw };
  for (const id of Object.keys(out) as UsmleOrganSystemId[]) {
    out[id] = raw[id]! / sum;
  }
  return out;
}

export function organSystemById(id: string): UsmleOrganSystemDef | undefined {
  return USMLE_ORGAN_SYSTEMS.find((s) => s.id === id);
}

export function isUsmleOrganSystemId(id: string): id is UsmleOrganSystemId {
  return USMLE_ORGAN_SYSTEMS.some((s) => s.id === id);
}

/** Physician tasks / competencies (shared outline; Step weights differ). */
export type UsmleOfficialPhysicianTaskId =
  | "foundational-science"
  | "diagnosis"
  | "history-physical"
  | "lab-studies"
  | "prognosis"
  | "health-maintenance"
  | "pharmacotherapy"
  | "clinical-intervention"
  | "mixed-management"
  | "pbli"
  | "communication-sbp";

export type PhysicianTaskDef = {
  id: UsmleOfficialPhysicianTaskId;
  label: string;
  /** Maps to legacy generation task ids where applicable. */
  legacyIds?: string[];
  ranges: Partial<Record<UsmleStepLevel, WeightRange>>;
};

export const USMLE_PHYSICIAN_TASKS: PhysicianTaskDef[] = [
  {
    id: "foundational-science",
    label: "Medical Knowledge: Applying Foundational Science Concepts",
    legacyIds: ["interpretation"],
    ranges: {
      step1: { minPct: 60, maxPct: 70 },
      step2: { minPct: 10, maxPct: 20 },
      step3: { minPct: 11, maxPct: 12 },
    },
  },
  {
    id: "diagnosis",
    label: "Patient Care: Diagnosis",
    legacyIds: ["diagnosis"],
    ranges: {
      step1: { minPct: 20, maxPct: 25 },
      step2: { minPct: 35, maxPct: 45 },
      step3: { minPct: 33, maxPct: 36 },
    },
  },
  {
    id: "history-physical",
    label: "History / Physical Examination",
    ranges: {
      step3: { minPct: 5, maxPct: 9 },
    },
  },
  {
    id: "lab-studies",
    label: "Laboratory / Diagnostic Studies",
    legacyIds: ["interpretation"],
    ranges: {
      step3: { minPct: 9, maxPct: 12 },
    },
  },
  {
    id: "prognosis",
    label: "Prognosis / Outcome",
    ranges: {
      step3: { minPct: 8, maxPct: 11 },
    },
  },
  {
    id: "health-maintenance",
    label: "Health Maintenance / Disease Prevention",
    legacyIds: ["health-maintenance"],
    ranges: {
      step2: { minPct: 8, maxPct: 15 },
      step3: { minPct: 6, maxPct: 11 },
    },
  },
  {
    id: "pharmacotherapy",
    label: "Pharmacotherapy",
    legacyIds: ["pharmacotherapy"],
    ranges: {
      step2: { minPct: 10, maxPct: 20 },
      step3: { minPct: 9, maxPct: 13 },
    },
  },
  {
    id: "clinical-intervention",
    label: "Clinical Interventions",
    legacyIds: ["clinical-intervention"],
    ranges: {
      step2: { minPct: 10, maxPct: 20 },
      step3: { minPct: 5, maxPct: 9 },
    },
  },
  {
    id: "mixed-management",
    label: "Mixed Management",
    ranges: {
      step3: { minPct: 6, maxPct: 11 },
    },
  },
  {
    id: "pbli",
    label: "Practice-based Learning & Improvement",
    ranges: {
      step1: { minPct: 4, maxPct: 6 },
      step2: { minPct: 3, maxPct: 8 },
      step3: { minPct: 11, maxPct: 13 },
    },
  },
  {
    id: "communication-sbp",
    label: "Communication, Professionalism & Systems-based Practice",
    legacyIds: ["communication", "professionalism"],
    ranges: {
      step1: { minPct: 6, maxPct: 9 },
      step2: { minPct: 8, maxPct: 15 },
      step3: { minPct: 7, maxPct: 9 },
    },
  },
];

/** Step 1 secondary discipline ranges (totals >100% — integrative). */
export const USMLE_STEP1_DISCIPLINE_RANGES: Record<string, WeightRange> = {
  pathology: { minPct: 45, maxPct: 55 },
  physiology: { minPct: 30, maxPct: 40 },
  nutrition: { minPct: 15, maxPct: 20 },
  "gross-anatomy-embryology": { minPct: 10, maxPct: 20 },
  microbiology: { minPct: 10, maxPct: 20 },
  pharmacology: { minPct: 10, maxPct: 20 },
  "behavioral-sciences": { minPct: 10, maxPct: 15 },
  biochemistry: { minPct: 5, maxPct: 15 },
  "histology-cell-biology": { minPct: 5, maxPct: 15 },
  immunology: { minPct: 5, maxPct: 15 },
  genetics: { minPct: 5, maxPct: 10 },
};

/** Step 2 CK clinical science ranges (totals >100%). */
export const USMLE_STEP2_CLINICAL_SCIENCE_RANGES: Record<string, WeightRange> = {
  medicine: { minPct: 55, maxPct: 65 },
  pediatrics: { minPct: 17, maxPct: 27 },
  "obstetrics-gynecology": { minPct: 10, maxPct: 20 },
  psychiatry: { minPct: 10, maxPct: 15 },
  surgery: { minPct: 5, maxPct: 15 },
};

export const USMLE_STEP3_NOTES = {
  day1: "Foundations of Independent Practice — biostats, ethics/SBP, foundational science application",
  day2: "Advanced Clinical Medicine — diagnosis + management emphasis; CCS cases cover diagnosis/management tasks",
  ccsProxy:
    "v1 uses management-sequencing MCQs and CCS-style formats; full Primum CCS simulator is out of scope",
} as const;

export function midpointOfRange(range: WeightRange): number {
  return (range.minPct + range.maxPct) / 2;
}

export function sourceNoteForStep(step: UsmleStepLevel): string {
  const url =
    step === "step1"
      ? USMLE_OFFICIAL_SOURCES.step1
      : step === "step2"
        ? USMLE_OFFICIAL_SOURCES.step2
        : USMLE_OFFICIAL_SOURCES.step3;
  return `USMLE official content outline (retrieved ${USMLE_OFFICIAL_MODEL_RETRIEVED_AT}) — ${url}`;
}
