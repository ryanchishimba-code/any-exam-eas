import type { ExamQuestion } from "@/lib/ai";
import {
  cleanOptionText,
  normalizeQuestionOptions,
  shuffleAnswerOptions,
} from "@/lib/question-format";
import { normalizeStem } from "./stem";
import type { RawQuestionInput, StudyQuestion, StudyQuestionType } from "./types";

function inferType(q: ExamQuestion): StudyQuestionType {
  if (q.type === "true_false") return "true_false";
  if (q.type === "short_answer") return "short_answer";
  return "multiple_choice";
}

function toCorrectAnswers(type: StudyQuestionType, correct: string): string[] {
  if (type === "select_all") {
    return correct.split(",").map((s) => cleanOptionText(s.trim())).filter(Boolean);
  }
  return [cleanOptionText(correct)];
}

export function examQuestionToStudy(
  q: RawQuestionInput,
  index: number
): StudyQuestion {
  const type = inferType(q);
  let options = q.options ?? [];
  let correctAnswer = q.correctAnswer;

  if (type === "true_false") {
    options = ["True", "False"];
    const c = cleanOptionText(correctAnswer).toLowerCase();
    correctAnswer = c.startsWith("t") ? "True" : "False";
  } else {
    const normalized = normalizeQuestionOptions(options, correctAnswer);
    const shuffled = shuffleAnswerOptions(normalized.options, normalized.correctAnswer);
    options = shuffled.options;
    correctAnswer = shuffled.correctAnswer;
  }

  const stem = normalizeStem(q.question);

  return {
    id: `q-${index + 1}-${hashStem(stem)}`,
    sourceIndex: q.id ?? index + 1,
    type,
    stem,
    options,
    correctAnswers: toCorrectAnswers(type, correctAnswer),
    explanation: q.explanation?.trim() ?? "",
    solutionSteps: q.solutionSteps,
    tags: q.tags,
    highYield: q.highYield,
    field: q.field,
    subjectId: q.subjectId,
    bankItemId: q.bankItemId,
  };
}

export function prepareQuestionsForSession(
  raw: RawQuestionInput[],
  opts?: { shuffleOrder?: boolean }
): StudyQuestion[] {
  const prepared = raw.map((q, i) => examQuestionToStudy(q, i));

  if (opts?.shuffleOrder === false) return prepared;

  const shuffled = [...prepared];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isAnswerCorrect(
  question: StudyQuestion,
  selected: string[]
): boolean {
  if (selected.length === 0) return false;
  const normalizedSelected = selected.map(cleanOptionText);
  const normalizedCorrect = question.correctAnswers.map(cleanOptionText);

  if (question.type === "select_all") {
    if (normalizedSelected.length !== normalizedCorrect.length) return false;
    return normalizedCorrect.every((c) =>
      normalizedSelected.some((s) => s.toLowerCase() === c.toLowerCase())
    );
  }

  return (
    normalizedSelected.some((s) =>
      normalizedCorrect.some((c) => s.toLowerCase() === c.toLowerCase())
    )
  );
}

function hashStem(stem: string): string {
  let h = 0;
  for (let i = 0; i < stem.length; i++) {
    h = (h << 5) - h + stem.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36).slice(0, 8);
}
