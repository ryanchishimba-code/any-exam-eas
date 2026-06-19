/**
 * NAPLEX full-length practice exam generation (2026 blueprint).
 */
import type { QuestionSlot } from "@/lib/engine/blueprints";

export const NAPLEX_FULL_EXAM_VERSION = "gpt-4o-mini-naplex-full-exam-v1";

/** Default questions per full-length NAPLEX practice exam. */
export const NAPLEX_FULL_EXAM_DEFAULT_COUNT = 80;

/** Curated serve bank size after quality trim. */
export const NAPLEX_TARGET_TOTAL = 6500;

/** Items per OpenAI call — satisfies batch-of-10 diversity rules. */
export const NAPLEX_GENERATION_CHUNK_SIZE = 10;

/** Parallel chunk requests per wave. */
export const NAPLEX_GENERATION_CONCURRENCY = 6;

export type NaplexBlueprintAreaId =
  | "naplex-2026-pharmacotherapy"
  | "naplex-2026-patient-centered-care"
  | "naplex-2026-pharmacist-tasks"
  | "naplex-2026-medication-dispensing"
  | "naplex-2026-drug-information"
  | "naplex-2026-health-wellness";

export type NaplexQuestionFormat =
  | "mcq"
  | "select_all"
  | "ordered_response"
  | "highlight"
  | "constructed_response";

export type NaplexGenerationSlot = QuestionSlot & {
  slotIndex: number;
  subjectId: string;
  blueprintArea: NaplexBlueprintAreaId;
  blueprintTopic: string;
  difficulty: number;
  stemFormat: string;
  questionFormat: NaplexQuestionFormat;
};

export type NaplexGenerationMeta = {
  batchId: string;
  examNumber: number;
  slotIndex: number;
  model: string;
  pipelineVersion: string;
  qcScore?: number;
  qcTier?: string;
  generatedAt: string;
};

export type NaplexFullExamBundle = {
  examNumber: number;
  title: string;
  questionCount: number;
  blueprintSummary: Record<string, number>;
  formatSummary: Record<string, number>;
  items: import("@/lib/question-bank").BankItem[];
  qaReport: {
    accepted: number;
    rejected: number;
    allPassed: boolean;
    issues: string[];
  };
};

export type NaplexGenerationResult = {
  exams: NaplexFullExamBundle[];
  batchId: string;
  totalAccepted: number;
  totalRejected: number;
};
