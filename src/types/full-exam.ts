import type { ExamSlug } from "@/types/edtech";

/** User-selected exam length preset on the launcher. */
export type FullExamLengthPreset = "50" | "100" | "full";

export type FullExamSessionConfig = {
  lengthPreset: FullExamLengthPreset;
  questionCount: number;
  timed: boolean;
  timeLimitSec: number;
  adaptive: boolean;
  /** NCLEX minimum (85) vs maximum (150) CAT-style length. */
  nclexLength?: "minimum" | "maximum";
  /** Curated full-length practice exam (1–100). When set, serves fixed preset items. */
  presetExamNumber?: number;
  /** Blueprint category ids/labels to focus — omit for full board topic mix. */
  focusAreas?: string[];
};

export type FullExamQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topicCategory?: string;
};

export type FullExamAnswerState = {
  selected: string[];
  eliminated: string[];
  flagged: boolean;
  notes: string;
};

export type FullExamTopicBreakdown = {
  topic: string;
  correct: number;
  total: number;
  pct: number;
};

export type FullExamQuestionSnapshot = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topicCategory?: string;
};

export type FullExamResultsAnalysis = {
  sessionConfig: FullExamSessionConfig;
  timeUsedSec: number;
  topicBreakdown: FullExamTopicBreakdown[];
  questionIds: string[];
  questionSnapshots: FullExamQuestionSnapshot[];
  summary: string;
};

export type FullExamSlug = ExamSlug;
