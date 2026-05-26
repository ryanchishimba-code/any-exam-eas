import type { ExamQuestion } from "@/lib/ai";

/** Supported presentation types (extensible). */
export type StudyQuestionType =
  | "multiple_choice"
  | "true_false"
  | "select_all"
  | "short_answer";

export type StudyMode = "practice" | "rapid" | "timed";

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export type StudyQuestion = {
  id: string;
  sourceIndex: number;
  type: StudyQuestionType;
  stem: string;
  options: string[];
  correctAnswers: string[];
  explanation: string;
  solutionSteps?: string[];
  tags?: string[];
  highYield?: boolean;
  field?: string;
  subjectId?: string;
  bankItemId?: string;
  difficulty?: string;
};

export type SessionAnswer = {
  selected: string[];
  revealed: boolean;
  correct: boolean | null;
  confidence?: ConfidenceLevel;
  durationMs?: number;
};

export type StudySessionState = {
  sessionId: string;
  mode: StudyMode;
  field: string;
  subjectId?: string;
  sourceType: "exam" | "bank" | "quilt";
  sourceId?: string;
  order: string[];
  currentIndex: number;
  answers: Record<string, SessionAnswer>;
  startedAt: string;
  updatedAt: string;
  timedSecondsPerQuestion?: number;
};

export type SessionSummary = {
  total: number;
  answered: number;
  correct: number;
  accuracy: number;
  avgConfidence: number | null;
  avgDurationMs: number | null;
};

export type RawQuestionInput = ExamQuestion & {
  bankItemId?: string;
  field?: string;
  subjectId?: string;
};
