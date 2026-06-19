/**
 * NCCPA PANCE Content Blueprint (effective January 2025).
 * Source: https://www.nccpa.net/pance-content-blueprint/
 */

export const PANCE_BLUEPRINT_SOURCE =
  "NCCPA PANCE Content Blueprint (effective January 2025)";

/** Official target for the curated + AI-generated PANCE bank. */
export const PANCE_TARGET_TOTAL = 6700;

/** Recommended seed count per medical content category before bulk AI generation. */
export const PANCE_SEED_TARGET_PER_CATEGORY = 250;

/** Default AI batch size for generation runs. */
export const PANCE_GENERATION_BATCH_SIZE = 500;

/** Items generated per OpenAI call (must satisfy batch-of-10 diversity rules). */
export const PANCE_GENERATION_CHUNK_SIZE = 10;

/** Parallel OpenAI chunk requests per wave (override via PANCE_GENERATION_CONCURRENCY). */
export const PANCE_GENERATION_CONCURRENCY = 8;

export const PANCE_GENERATION_VERSION = "gpt-4o-mini-pance-v1";

export type PanceReviewStatus = "pending" | "approved" | "flagged" | "rejected";

export type PanceTaskCategoryId =
  | "history-physical"
  | "diagnosis"
  | "labs"
  | "prevention"
  | "intervention"
  | "pharmacotherapy"
  | "foundational"
  | "professional";

export type PanceContentCategoryId =
  | "cardiovascular"
  | "pulmonary"
  | "gastrointestinal"
  | "musculoskeletal"
  | "infectious-diseases"
  | "neurologic"
  | "psychiatry"
  | "reproductive"
  | "endocrine"
  | "eent"
  | "hematologic"
  | "renal"
  | "dermatologic"
  | "genitourinary"
  | "professional-practice";

export type PanceGenerationSlot = {
  contentCategory: PanceContentCategoryId;
  taskCategory: PanceTaskCategoryId;
  blueprintTopic: string;
  difficulty: number;
  /** Pediatric or surgical presentation when clinically appropriate. */
  presentationHint?: "adult" | "pediatric" | "surgical" | "primary-care";
};

export type PanceGenerationMeta = {
  batchId: string;
  slotIndex: number;
  model: string;
  pipelineVersion: string;
  blueprintAligned: boolean;
  difficultyRating?: number;
  qcScore?: number;
  qcFlags?: string[];
  seedExemplarIds?: string[];
  generatedAt: string;
};

export type PanceQuotaRow = {
  contentCategory: PanceContentCategoryId;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

export type PanceTaskQuotaRow = {
  taskCategory: PanceTaskCategoryId;
  label: string;
  weight: number;
  targetCount: number;
};
