/** Shared exam size options (all disciplines). */
export const QUESTION_COUNT_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 45, 50] as const;

export type QuestionCount = (typeof QUESTION_COUNT_OPTIONS)[number];

export function isValidQuestionCount(n: number): n is QuestionCount {
  return (QUESTION_COUNT_OPTIONS as readonly number[]).includes(n);
}
