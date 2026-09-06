/** USMLE Step 1, Step 2 CK, and Step 3 — field ids, exam metadata, and routing helpers. */

import type { UsmleStepLevel } from "./types";

export const USMLE_FIELD_IDS = [
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
] as const;

export type UsmleFieldId = (typeof USMLE_FIELD_IDS)[number];

export type UsmleStepDefinition = {
  level: UsmleStepLevel;
  fieldId: UsmleFieldId;
  name: string;
  shortName: string;
  description: string;
  /** Design target for bank generation. */
  targetQuestions: number;
  simulatedQuestionCount: number;
  simulatedDurationMin: number;
  /** Minimum editorial QA score (0–10) for non-curated items at serve time. */
  serveMinQaScore: number;
};

export const USMLE_STEPS: UsmleStepDefinition[] = [
  {
    level: "step1",
    fieldId: "usmle-step-1",
    name: "USMLE Step 1",
    shortName: "Step 1",
    description:
      "Basic sciences — anatomy, physiology, pathology, pharmacology, biochemistry, and microbiology.",
    targetQuestions: 12_000,
    simulatedQuestionCount: 280,
    simulatedDurationMin: 420,
    serveMinQaScore: 8,
  },
  {
    level: "step2",
    fieldId: "usmle-step-2",
    name: "USMLE Step 2 CK",
    shortName: "Step 2 CK",
    description:
      "Clinical vignettes — diagnosis, next-best-step management, and sequential item sets.",
    targetQuestions: 18_000,
    simulatedQuestionCount: 280,
    simulatedDurationMin: 240,
    serveMinQaScore: 8,
  },
  {
    level: "step3",
    fieldId: "usmle-step-3",
    name: "USMLE Step 3",
    shortName: "Step 3",
    description:
      "Day 1 MCQs plus biostatistics, ethics, abstracts, pharmaceutical ads, and CCS-style cases.",
    targetQuestions: 18_000,
    simulatedQuestionCount: 200,
    simulatedDurationMin: 240,
    serveMinQaScore: 8,
  },
];

export const USMLE_FIELD_ALIASES: Record<string, UsmleFieldId> = {
  "usmle-step-1": "usmle-step-1",
  "usmle-step1": "usmle-step-1",
  "step-1": "usmle-step-1",
  step1: "usmle-step-1",
  "usmle-step-2": "usmle-step-2",
  "usmle-step-2-ck": "usmle-step-2",
  "usmle-step2": "usmle-step-2",
  "step-2": "usmle-step-2",
  step2: "usmle-step-2",
  "usmle-step-3": "usmle-step-3",
  "usmle-step3": "usmle-step-3",
  "step-3": "usmle-step-3",
  step3: "usmle-step-3",
  /** Generic USMLE links default to Step 2 CK when no step is specified. */
  usmle: "usmle-step-2",
  medicine: "usmle-step-2",
};

export const USMLE_COMBINED_TARGET = USMLE_STEPS.reduce((sum, s) => sum + s.targetQuestions, 0);

/**
 * Curated serve bank after the quality trim — the top items kept across all three
 * steps. User-facing counts use this (not the aspirational generation target).
 */
export const USMLE_PUBLISHED_BANK_TOTAL = 17_488;

export function isUsmleFieldId(fieldId: string): fieldId is UsmleFieldId {
  return (USMLE_FIELD_IDS as readonly string[]).includes(fieldId);
}

export function resolveUsmleFieldId(fieldId: string): UsmleFieldId | null {
  const normalized = fieldId.toLowerCase().replace(/\s+/g, "-");
  return USMLE_FIELD_ALIASES[normalized] ?? (isUsmleFieldId(normalized) ? normalized : null);
}

export function usmleFieldIdToStepLevel(fieldId: string): UsmleStepLevel | null {
  const resolved = resolveUsmleFieldId(fieldId);
  if (!resolved) return null;
  return USMLE_STEPS.find((s) => s.fieldId === resolved)?.level ?? null;
}

export function usmleStepDefinition(fieldId: string): UsmleStepDefinition | undefined {
  const resolved = resolveUsmleFieldId(fieldId);
  if (!resolved) return undefined;
  return USMLE_STEPS.find((s) => s.fieldId === resolved);
}

export function defaultUsmleFieldId(): UsmleFieldId {
  return "usmle-step-2";
}

/** Per-step editorial QA floor for non-curated bank items. */
export function usmleServeMinQaScore(fieldId: string): number | null {
  const step = usmleStepDefinition(fieldId);
  return step?.serveMinQaScore ?? null;
}

/** Step 3 item types that do not require a clinical vignette for serve. */
export const USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES = new Set([
  "abstract",
  "drug_ad",
  "biostats",
  "ethics",
  "ccs_prompt",
]);
