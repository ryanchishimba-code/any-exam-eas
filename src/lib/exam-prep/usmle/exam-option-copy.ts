import type { UsmleStepLevel } from "./types";

/**
 * Client-safe USMLE labels. The live count lookup lives in `exam-options.ts`
 * and must not be imported from a client component.
 */
export type ExamDifficulty = "Foundational" | "Clinical" | "Advanced";

/** Short, user-facing exam-type token per step (Step 2 is "CK"). */
export const USMLE_EXAM_TYPE_LABEL: Record<UsmleStepLevel, string> = {
  step1: "Step 1",
  step2: "Step 2 CK",
  step3: "Step 3",
};

/** Compact clinical descriptor shown under each wheel option. */
export const USMLE_EXAM_TYPE_TAGLINE: Record<UsmleStepLevel, string> = {
  step1: "Foundational Sciences",
  step2: "Clinical Knowledge",
  step3: "Advanced Management",
};
