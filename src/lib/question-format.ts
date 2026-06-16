import type { ExamQuestion } from "./ai";
import { normalizeStem } from "./questions/stem";

const OPTION_PREFIX = /^[A-Da-d][.)]\s*/;

/** Strip leading "A) " so UI can render Quizlet-style labels */
export function cleanOptionText(option: string): string {
  return option.replace(OPTION_PREFIX, "").trim();
}

function normOptionKey(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Parse select-all / SATA stored answers without splitting on commas inside option text.
 * Prefers whole-option match, then `|||`, then comma-separated lists where every part matches an option.
 */
export function parseSelectAllCorrectAnswers(
  options: string[],
  correctAnswer: string
): string[] {
  const trimmed = correctAnswer.trim();
  if (!trimmed) return [];

  const normalizedOptions = options.map(cleanOptionText);
  const wholeIdx = normalizedOptions.findIndex((o) => normOptionKey(o) === normOptionKey(trimmed));
  if (wholeIdx >= 0) return [normalizedOptions[wholeIdx]!];

  if (trimmed.includes("|||")) {
    return trimmed
      .split("|||")
      .map((s) => cleanOptionText(s.trim()))
      .filter(Boolean);
  }

  const optionKeys = new Set(normalizedOptions.map(normOptionKey));
  const commaParts = trimmed
    .split(",")
    .map((s) => cleanOptionText(s.trim()))
    .filter(Boolean);
  if (commaParts.length >= 2 && commaParts.every((p) => optionKeys.has(normOptionKey(p)))) {
    return commaParts;
  }

  return [cleanOptionText(trimmed)].filter(Boolean);
}

export function selectAllAnswersMatchOptions(options: string[], correctAnswer: string): boolean {
  const parts = parseSelectAllCorrectAnswers(options, correctAnswer);
  if (parts.length === 0) return false;
  const optionKeys = new Set(options.map((o) => normOptionKey(o)));
  return parts.every((p) => optionKeys.has(normOptionKey(p)));
}

const CLINICAL_DISTRACTOR_FALLBACKS = [
  "Defer the next step until additional diagnostic data are available",
  "Treat a secondary finding while overlooking the primary problem",
  "Select therapy that is contraindicated in this clinical context",
  "Recommend observation alone without addressing the leading diagnosis",
  "Choose an intervention appropriate for a different stage of disease",
];

/** Replace weak or missing distractors with board-style plausible wrong answers. */
export function synthesizeClinicalDistractors(
  existing: string[],
  correctAnswer: string,
  needed: number
): string[] {
  const used = new Set(existing.map(normOptionKey));
  used.add(normOptionKey(correctAnswer));
  const out: string[] = [];

  for (const candidate of CLINICAL_DISTRACTOR_FALLBACKS) {
    if (out.length >= needed) break;
    const key = normOptionKey(candidate);
    if (!used.has(key)) {
      out.push(candidate);
      used.add(key);
    }
  }

  let n = 1;
  while (out.length < needed) {
    const candidate = `Pursue a management path that does not match the presenting syndrome (${n})`;
    const key = normOptionKey(candidate);
    if (!used.has(key)) {
      out.push(candidate);
      used.add(key);
    }
    n++;
  }

  return out;
}

export function hasGenericPlaceholderOptions(options: string[]): boolean {
  return options.some((o) => {
    const text = cleanOptionText(o).trim();
    if (/^alternative \d+$/i.test(text)) return true;
    if (/^option [a-d]$/i.test(text)) return true;
    if (/^choice [a-d]$/i.test(text)) return true;
    if (/^answer [a-d]$/i.test(text)) return true;
    if (/placeholder/i.test(text) && text.length < 48) return true;
    return false;
  });
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

  const correctClean = cleanOptionText(correctAnswer);

  if (unique.length < 4) {
    unique.push(
      ...synthesizeClinicalDistractors(unique, correctClean, 4 - unique.length)
    );
  }

  const four = unique.slice(0, 4);
  let correct = four.find((o) => o.toLowerCase() === correctClean.toLowerCase());

  if (!correct && correctClean) {
    const replaceIdx = four.findIndex((o) =>
      /^(alternative \d+|defer the next step|treat a secondary|select therapy|recommend observation|choose an intervention|pursue a management)/i.test(
        o
      )
    );
    if (replaceIdx >= 0) {
      four[replaceIdx] = correctClean;
    } else {
      four[four.length - 1] = correctClean;
    }
    correct = correctClean;
  }

  return { options: four, correctAnswer: correct ?? correctClean };
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
  return normalizeStem(question);
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
