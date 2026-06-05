import type { ExamAnswerRecord } from "./service";

/** Replace answer at same question index (idempotent updates). */
export function mergeExamAnswers(
  answers: ExamAnswerRecord[],
  answer: ExamAnswerRecord
): ExamAnswerRecord[] {
  return [
    ...answers.filter((a) => a.questionIndex !== answer.questionIndex),
    answer,
  ];
}

export function countCorrectAnswers(answers: ExamAnswerRecord[]): number {
  return answers.filter((a) => a.correct).length;
}

/** Percent score 0–100 from recorded answers. */
export function calculateExamScorePercent(
  answers: ExamAnswerRecord[],
  totalQuestions: number
): number {
  if (totalQuestions <= 0) return 0;
  const correct = countCorrectAnswers(answers);
  return Math.round((correct / totalQuestions) * 100);
}

export function buildWeakAreasFromField(
  fieldId: string,
  answers: ExamAnswerRecord[]
): { topic: string; weight: number }[] {
  const incorrect = answers.filter((a) => !a.correct).length;
  const weight = Math.max(1, incorrect);
  return [{ topic: fieldId, weight }];
}
