/** Real MPJE exam parameters (NABP). */
export const MPJE_PRACTICE_EXAM_QUESTION_COUNT = 120;
export const MPJE_PRACTICE_EXAM_SCORED_COUNT = 100;
export const MPJE_PRACTICE_EXAM_PRETEST_COUNT = 20;
export const MPJE_PRACTICE_EXAM_TIME_MINUTES = 150;
export const MPJE_PRACTICE_EXAM_TIME_SECONDS =
  MPJE_PRACTICE_EXAM_TIME_MINUTES * 60;
export const MPJE_PRACTICE_EXAM_PASSING_PERCENT = 75;

export const MPJE_TIMER_WARN_MINUTES = [30, 10, 5] as const;

export type MpjeExamDifficulty = "easy" | "medium" | "hard";

export type MpjePracticeExamQuestion = {
  id: string;
  subjectId: string;
  subjectLabel: string;
  difficulty: MpjeExamDifficulty;
  isPretest: boolean;
  itemType: string;
  scenario: string | null;
  statements?: string[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  stateCode: string | null;
};

export type MpjePracticeExamQuestionPublic = Omit<
  MpjePracticeExamQuestion,
  "correctAnswer" | "explanation"
>;
