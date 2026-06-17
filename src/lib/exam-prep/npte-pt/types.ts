/**
 * FSBPT NPTE-PT Test Content Outline (effective January 2024).
 * Source: https://www.fsbpt.org/FreeResources/NPTEDevelopment.aspx
 */

export const NPTE_PT_BLUEPRINT_SOURCE =
  "FSBPT NPTE-PT Test Content Outline (effective January 2024)";

/** Official target for the curated + AI-generated NPTE-PT bank. */
export const NPTE_PT_TARGET_TOTAL = 6000;

/** Recommended seed count per body-system category before bulk AI generation. */
export const NPTE_PT_SEED_TARGET_PER_CATEGORY = 200;

export const NPTE_PT_GENERATION_BATCH_SIZE = 500;
export const NPTE_PT_GENERATION_CHUNK_SIZE = 25;
export const NPTE_PT_GENERATION_CONCURRENCY = 10;
export const NPTE_PT_GENERATION_VERSION = "gpt-4o-mini-npte-pt-v1";

/** Minimum QC score for generated items to be approved / inserted with qaPassed. */
export const NPTE_PT_MIN_QC_SCORE = 7;

export type NptePtReviewStatus = "pending" | "approved" | "flagged" | "rejected";

/** FSBPT process categories (examination, evaluation/Dx/prognosis, interventions). */
export type NptePtTaskCategoryId =
  | "examination"
  | "evaluation-diagnosis-prognosis"
  | "interventions";

export type NptePtContentCategoryId =
  | "cardiovascular-pulmonary"
  | "musculoskeletal"
  | "neuromuscular-nervous"
  | "integumentary"
  | "metabolic-endocrine"
  | "gastrointestinal"
  | "genitourinary"
  | "lymphatic"
  | "system-interactions"
  | "equipment-devices"
  | "therapeutic-modalities"
  | "safety-protection"
  | "professional-responsibilities"
  | "research-evidence";

export type NptePtGenerationSlot = {
  contentCategory: NptePtContentCategoryId;
  taskCategory: NptePtTaskCategoryId;
  blueprintTopic: string;
  difficulty: number;
  presentationHint?: "adult" | "pediatric" | "geriatric" | "acute-care" | "outpatient";
};

export type NptePtGenerationMeta = {
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

export type NptePtQuotaRow = {
  contentCategory: NptePtContentCategoryId;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

export type NptePtTaskQuotaRow = {
  taskCategory: NptePtTaskCategoryId;
  label: string;
  weight: number;
  targetCount: number;
};

/** Curated full-length NPTE-PT practice exam bundle (composed from QA-passed bank). */
export const NPTE_PT_FULL_EXAM_VERSION = "npte-pt-compose-full-exam-v1";

/** Scaled practice length until the bank supports full 250-Q exams. */
export const NPTE_PT_FULL_EXAM_DEFAULT_COUNT = 80;

export type NptePtFullExamBundle = {
  examNumber: number;
  title: string;
  questionCount: number;
  blueprintSummary: Record<string, number>;
  taskSummary?: Record<string, number>;
  actualSubjectMix?: Record<string, number>;
  items: import("@/lib/question-bank").BankItem[];
  qaReport: {
    accepted: number;
    rejected: number;
    allPassed: boolean;
    issues: string[];
  };
};
