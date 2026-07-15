/**
 * NCLEX-RN full-length practice exam generation (2026 test plan).
 */
import type { QuestionSlot } from "@/lib/engine/blueprints";

export const NCLEX_FULL_EXAM_VERSION = "gpt-4o-nclex-full-exam-v2";

/** Default OpenAI model for NCLEX generation (override with NCLEX_GENERATION_MODEL). */
export const NCLEX_GENERATION_MODEL = "gpt-4o";

/** Target best-tier serve bank after curation. */
export const NCLEX_BEST_TARGET_TOTAL = 6000;

export function resolveNclexGenerationModel(): string {
  const raw = process.env.NCLEX_GENERATION_MODEL?.trim();
  return raw || NCLEX_GENERATION_MODEL;
}

/** Aspirational NCLEX generation target (includes pre-curation backlog). */
export const NCLEX_TARGET_TOTAL = 7000;

/** Published serve-ready NCLEX floor for marketing when live counts are unavailable. */
export const NCLEX_PUBLISHED_SERVE_TOTAL = 6304;

/** Default questions per full-length practice exam (NCLEX minimum pass range). */
export const NCLEX_FULL_EXAM_DEFAULT_COUNT = 80;

/** Serve-ready NGN format targets (2026 test plan: ~18 case-study + ~10% stand-alone CJ). */
export const NCLEX_NGN_SERVE_TARGETS: Record<string, number> = {
  select_all: 500,
  ngn_bowtie: 150,
  ngn_matrix: 100,
  ordered_response: 75,
  ngn_highlight: 50,
  case_study: 180,
};

/** Items per OpenAI call — satisfies batch-of-10 diversity rules. */
export const NCLEX_GENERATION_CHUNK_SIZE = 10;

/** Parallel chunk requests per wave. */
export const NCLEX_GENERATION_CONCURRENCY = 6;

export type NclexClientNeedsId =
  | "management-of-care"
  | "safety-infection"
  | "health-promotion"
  | "psychosocial"
  | "basic-care-comfort"
  | "pharmacology-nursing"
  | "reduction-risk"
  | "physiological-adaptation";

export type NclexGenerationSlot = QuestionSlot & {
  slotIndex: number;
  subjectId: NclexClientNeedsId;
  blueprintTopic: string;
  difficulty: number;
  stemFormat: string;
  /** NGN case study group — 6 linked items share the same id. */
  caseGroupId?: string;
  caseStep?: number;
  /** High-yield topic emphasis for this exam (ordered first). */
  highYieldFirst?: boolean;
};

export type NclexGenerationMeta = {
  batchId: string;
  examNumber: number;
  slotIndex: number;
  model: string;
  pipelineVersion: string;
  qcScore?: number;
  qcTier?: string;
  generatedAt: string;
};

export type NclexFullExamBundle = {
  examNumber: number;
  title: string;
  questionCount: number;
  blueprintSummary: Record<string, number>;
  /** Actual subjectId mix from selected bank rows. */
  actualSubjectMix?: Record<string, number>;
  caseStudyGroups: { caseGroupId: string; itemCount: number; topic: string }[];
  items: import("@/lib/question-bank").BankItem[];
  qaReport: {
    accepted: number;
    rejected: number;
    allPassed: boolean;
    issues: string[];
  };
};

export type NclexGenerationResult = {
  exams: NclexFullExamBundle[];
  batchId: string;
  totalAccepted: number;
  totalRejected: number;
};
