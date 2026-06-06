import type { ExamQuestion } from "@/lib/ai";

/** Supported presentation types (extensible). */
export type StudyQuestionType =
  | "multiple_choice"
  | "true_false"
  | "select_all"
  | "short_answer"
  | "matching"
  | "ordered_response"
  | "fill_blank"
  | "calculation"
  | "image_interpretation"
  | "chart_table"
  | "clinical_reasoning"
  | "bow_tie"
  | "matrix"
  | "highlight"
  | "unfolding_case"
  | "k_type"
  | "drag_drop";

export type StudyMode =
  | "practice"
  | "rapid"
  | "timed"
  | "adaptive"
  | "tutor"
  | "weak_area"
  | "mock"
  | "cat";

/** Rich explanation payload for tutor mode & review. */
export type QuestionExplanation = {
  summary: string;
  whyCorrect: string;
  whyIncorrect?: Record<string, string>;
  keyTakeaways?: string[];
  pearls?: string[];
  relatedConcepts?: string[];
  difficultyLabel?: string;
};

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export type StudyQuestion = {
  id: string;
  sourceIndex: number;
  type: StudyQuestionType;
  stem: string;
  /** Case vignette shown above the stem (NGN / clinical items). */
  vignette?: string;
  ngnFormat?: string;
  ngnPayload?: Record<string, unknown>;
  caseStep?: number;
  options: string[];
  correctAnswers: string[];
  explanation: string;
  explanationDetail?: QuestionExplanation;
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  references?: string[];
  solutionSteps?: string[];
  markedForReview?: boolean;
  imageUrl?: string;
  chartData?: Record<string, unknown>;
  tags?: string[];
  highYield?: boolean;
  field?: string;
  subjectId?: string;
  bankItemId?: string;
  difficulty?: string;
  qualityScore?: number;
};

export type SessionAnswer = {
  selected: string[];
  revealed: boolean;
  correct: boolean | null;
  confidence?: ConfidenceLevel;
  durationMs?: number;
};

export type AdaptiveSessionMeta = {
  sessionRationale?: string;
  questionReasoning?: Record<string, string>;
  recommendedDifficulty?: string;
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
  adaptiveMeta?: AdaptiveSessionMeta;
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
