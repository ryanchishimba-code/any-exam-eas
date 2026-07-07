/**
 * Expert-tier rationale schema — UWorld-caliber depth + PharmD nursing lens.
 * Persisted in `QuestionBankItem.generationMeta.expertRationale` (JSON).
 */
import type { StructuredRationale } from "../prompts/rationale-generation";
import type { VisualRationaleBlock } from "./visual-rationale-types";

export type LayeredDepth = {
  basic: string;
  intermediate: string;
  advanced: string;
};

export type VisualCue = {
  label: string;
  description: string;
};

export type CrossReference = {
  exam: string;
  topic: string;
  note: string;
};

/** Full expert payload — superset of StructuredRationale. */
export type ExpertStructuredRationale = StructuredRationale & {
  /** CJMM-style numbered reasoning steps (3–6). */
  stepByStepReasoning: string[];
  clinicalPearl: string;
  /** PharmD lens — omit or empty string when not medication-related. */
  pharmacologyTieIn?: string;
  highYieldFacts: string[];
  commonPitfalls: string[];
  nextStepInCare?: string;
  testTakingTip: string;
  realWorldApplication: string;
  layeredDepth?: LayeredDepth;
  visualCues?: VisualCue[];
  /** Structured lab tables, comparison charts, and care algorithms for UI rendering. */
  visualBlocks?: VisualRationaleBlock[];
  crossReferences?: CrossReference[];
};

export const EXPERT_RATIONALE_META_KEY = "expertRationale" as const;
export const EXPERT_RATIONALE_VERSION = "nclex-expert-v1" as const;

export function readExpertRationaleFromMeta(
  meta: unknown
): ExpertStructuredRationale | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const expert = (meta as Record<string, unknown>)[EXPERT_RATIONALE_META_KEY];
  if (!expert || typeof expert !== "object") return undefined;
  const e = expert as ExpertStructuredRationale;
  if (!e.whyCorrect?.headline || !e.keyTakeaway) return undefined;
  return e;
}
