import type { ExamQuestion } from "../../ai";

type OptionObject = { text?: string; isCorrect?: boolean };

/** Normalize AI output when options are [{ text, isCorrect }] instead of string[]. */
export function normalizeQuestionFromAi(raw: ExamQuestion & { options?: unknown }): ExamQuestion {
  const opts = raw.options;
  if (!Array.isArray(opts) || opts.length === 0) {
    return raw;
  }

  const first = opts[0];
  if (typeof first === "string") {
    return raw;
  }

  const objects = opts as OptionObject[];
  const options = objects.map((o) => (o.text ?? "").trim()).filter(Boolean);
  const marked = objects.find((o) => o.isCorrect === true);
  const correctAnswer = marked?.text?.trim() ?? raw.correctAnswer;

  return {
    ...raw,
    options,
    correctAnswer,
  };
}

export function normalizeExamQuestionsFromAi(
  questions: (ExamQuestion & { options?: unknown })[]
): ExamQuestion[] {
  return questions.map(normalizeQuestionFromAi);
}
