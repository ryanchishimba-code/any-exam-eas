import type { ExamSlug } from "@/types/edtech";

/** User-selected exam length preset on the launcher. */
export type FullExamLengthPreset = "50" | "100" | "full";

export type FullExamSessionConfig = {
  lengthPreset: FullExamLengthPreset;
  questionCount: number;
  timed: boolean;
  timeLimitSec: number;
  adaptive: boolean;
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
  selected: string | null;
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
