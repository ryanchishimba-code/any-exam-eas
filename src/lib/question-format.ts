import type { ExamQuestion } from "./ai";

const OPTION_PREFIX = /^[A-Da-d][.)]\s*/;

/** Strip leading "A) " so UI can render Quizlet-style labels */
export function cleanOptionText(option: string): string {
  return option.replace(OPTION_PREFIX, "").trim();
}

export function normalizeQuestionOptions(
  options: string[],
  correctAnswer: string
): { options: string[]; correctAnswer: string } {
  const cleaned = options.map(cleanOptionText).filter(Boolean);
  const seen = new Set<string>();
  const unique = cleaned.filter((o) => {
    const key = o.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  while (unique.length < 4) {
    unique.push(`Alternative ${unique.length + 1}`);
  }

  const four = unique.slice(0, 4);
  const correctClean = cleanOptionText(correctAnswer);
  const correct = four.find((o) => o.toLowerCase() === correctClean.toLowerCase()) ?? four[0];

  return { options: four, correctAnswer: correct };
}

/** Randomize option order so the correct answer is not always A */
export function shuffleAnswerOptions(
  options: string[],
  correctAnswer: string
): { options: string[]; correctAnswer: string } {
  const { options: four, correctAnswer: correct } = normalizeQuestionOptions(
    options,
    correctAnswer
  );

  const shuffled = [...four];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return { options: shuffled, correctAnswer: correct };
}

/** Strip a leading "Question:" / "Question N:" prefix from stems (UI shows question number separately). */
export function formatQuestionLabel(question: string): string {
  return question
    .trim()
    .replace(/^question\s*\d*\s*:\s*/i, "")
    .trim();
}

export function formatChoiceLabel(index: number, text: string): string {
  const letter = String.fromCharCode(65 + index);
  const body = cleanOptionText(text);
  return `${letter}) ${body}`;
}

export function getSolutionSteps(question: ExamQuestion): string[] {
  if (question.solutionSteps?.length) {
    return question.solutionSteps.filter((s) => s.trim().length > 0);
  }

  const text = question.explanation.trim();
  const numbered = text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  if (numbered.length >= 2) return numbered;

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  return sentences.length > 0 ? sentences : [text];
}

export function toQuizletStyleQuestion(q: ExamQuestion): ExamQuestion {
  const { options, correctAnswer } = shuffleAnswerOptions(
    q.options ?? [],
    q.correctAnswer
  );
  return {
    ...q,
    question: formatQuestionLabel(q.question),
    options,
    correctAnswer,
  };
}
