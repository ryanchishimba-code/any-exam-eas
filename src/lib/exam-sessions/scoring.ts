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

/**
 * Scored rows in a session answer log. Blank selections do not count.
 * Null when the column is not an array, so callers can tell "no log" from "empty log".
 */
export function countScoredExamAnswers(raw: unknown): number | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  let count = 0;
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Partial<ExamAnswerRecord>;
    const selected = typeof rec.selected === "string" ? rec.selected.trim() : "";
    if (!selected) continue;
    const questionId = typeof rec.questionId === "string" ? rec.questionId.trim() : "";
    const index =
      typeof rec.questionIndex === "number" && Number.isFinite(rec.questionIndex)
        ? String(rec.questionIndex)
        : String(count);
    const key = questionId || `index:${index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    count += 1;
  }
  return count;
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
