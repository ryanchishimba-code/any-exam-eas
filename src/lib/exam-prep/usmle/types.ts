/**
 * USMLE full-length block-style practice exam generation (2026 blueprint).
 */
import type { QuestionSlot } from "@/lib/engine/blueprints";

export const USMLE_FULL_EXAM_VERSION = "gpt-4o-mini-usmle-full-exam-v1";

/** Default questions per block-style USMLE practice exam (75–85 range). */
export const USMLE_FULL_EXAM_DEFAULT_COUNT = 80;

/** Items per OpenAI call — satisfies batch-of-10 diversity rules. */
export const USMLE_GENERATION_CHUNK_SIZE = 10;

/** Parallel chunk requests per wave. */
export const USMLE_GENERATION_CONCURRENCY = 6;

/** Max per-slot regeneration attempts when QA fails. */
export const USMLE_SLOT_MAX_RETRIES = 4;

export type UsmleStepLevel = "step1" | "step2" | "step3";

export type UsmlePhysicianTaskId =
  | "diagnosis"
  | "health-maintenance"
  | "clinical-intervention"
  | "pharmacotherapy"
  | "interpretation"
  | "communication"
  | "professionalism";

export type UsmleQuestionFormat =
  | "vignette"
  | "mcq"
  | "lab_interpretation"
  | "image_based"
  | "sequential"
  | "biostats"
  | "ethics";

export type UsmleGenerationSlot = QuestionSlot & {
  slotIndex: number;
  stepLevel: UsmleStepLevel;
  subjectId: string;
  blueprintSystem: string;
  blueprintTopic: string;
  physicianTask: UsmlePhysicianTaskId;
  difficulty: number;
  stemFormat: string;
  questionFormat: UsmleQuestionFormat;
};

export type UsmleGenerationMeta = {
  batchId: string;
  examNumber: number;
  slotIndex: number;
  stepLevel: UsmleStepLevel;
  model: string;
  pipelineVersion: string;
  qcScore?: number;
  generatedAt: string;
};

export type UsmleFullExamBundle = {
  examNumber: number;
  title: string;
  stepLevel: UsmleStepLevel;
  questionCount: number;
  blueprintSummary: Record<string, number>;
  formatSummary: Record<string, number>;
  taskSummary: Record<string, number>;
  items: import("@/lib/question-bank").BankItem[];
  qaReport: {
    accepted: number;
    rejected: number;
    allPassed: boolean;
    issues: string[];
  };
};

export type UsmleGenerationResult = {
  exams: UsmleFullExamBundle[];
  batchId: string;
  totalAccepted: number;
  totalRejected: number;
};
