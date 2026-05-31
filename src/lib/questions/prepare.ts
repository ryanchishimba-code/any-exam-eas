import {
  cleanOptionText,
  normalizeQuestionOptions,
  shuffleAnswerOptions,
} from "@/lib/question-format";
import { normalizeStem } from "./stem";
import { inferStudyQuestionType } from "./ngn-map";
import {
  matrixOptionsFromLayout,
  parseBowTieLayout,
  parseMatrixLayout,
} from "./ngn-structures";
import type { RawQuestionInput, StudyQuestion, StudyQuestionType } from "./types";

function toCorrectAnswers(type: StudyQuestionType, correct: string): string[] {
  if (
    type === "select_all" ||
    type === "ordered_response" ||
    type === "bow_tie" ||
    type === "matrix" ||
    type === "highlight"
  ) {
    return correct
      .split(",")
      .map((s) => cleanOptionText(s.trim()))
      .filter(Boolean);
  }
  return [cleanOptionText(correct)];
}

function buildExplanationDetail(q: RawQuestionInput) {
  if (!q.distractorRationale && !q.clinicalReasoning) return undefined;
  return {
    summary: q.explanation?.trim() ?? "",
    whyCorrect: q.explanation?.trim() ?? "",
    whyIncorrect: q.distractorRationale,
    pearls: q.references,
  };
}

export function examQuestionToStudy(
  q: RawQuestionInput,
  index: number
): StudyQuestion {
  const type = inferStudyQuestionType(q);
  let options = q.options ?? [];
  let correctAnswer = q.correctAnswer;

  if (type === "true_false") {
    options = ["True", "False"];
    const c = cleanOptionText(correctAnswer).toLowerCase();
    correctAnswer = c.startsWith("t") ? "True" : "False";
  } else if (type === "bow_tie") {
    const layout = parseBowTieLayout(q);
    options = [...layout.actions, ...layout.monitors];
  } else if (type === "matrix") {
    const layout = parseMatrixLayout(q);
    options = matrixOptionsFromLayout(layout);
  } else if (type === "highlight") {
    options = toCorrectAnswers(type, correctAnswer);
  } else if (type !== "ordered_response" && type !== "select_all") {
    const normalized = normalizeQuestionOptions(options, correctAnswer);
    const shuffled = shuffleAnswerOptions(normalized.options, normalized.correctAnswer);
    options = shuffled.options;
    correctAnswer = shuffled.correctAnswer;
  } else if (type === "select_all") {
    options = options.map(cleanOptionText);
  } else if (type === "ordered_response") {
    options = options.map(cleanOptionText);
  }

  const stem = normalizeStem(q.question);
  let vignette = q.vignette?.trim();
  if (!vignette && q.vignette === undefined && stem.includes("\n\n")) {
    const parts = stem.split("\n\n");
    if (parts[0].length > 80) {
      vignette = parts[0];
    }
  }

  return {
    id: `q-${index + 1}-${hashStem(stem)}`,
    sourceIndex: q.id ?? index + 1,
    type,
    stem,
    vignette,
    ngnFormat: q.ngnFormat ?? q.type,
    caseStep: q.caseStep,
    options,
    correctAnswers: toCorrectAnswers(type, correctAnswer),
    explanation: q.explanation?.trim() ?? "",
    explanationDetail: buildExplanationDetail(q),
    clinicalReasoning: q.clinicalReasoning,
    distractorRationale: q.distractorRationale,
    references: q.references,
    solutionSteps: q.solutionSteps,
    tags: q.tags,
    highYield: q.highYield,
    field: q.field,
    subjectId: q.subjectId,
    bankItemId: q.bankItemId,
    qualityScore: q.qualityScore,
    difficulty: q.difficultyLabel?.toLowerCase(),
    chartData: q.chartData,
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

  if (question.type === "ordered_response") {
    if (normalizedSelected.length !== normalizedCorrect.length) return false;
    return normalizedSelected.every(
      (s, i) => s.toLowerCase() === normalizedCorrect[i]?.toLowerCase()
    );
  }

  if (
    question.type === "select_all" ||
    question.type === "bow_tie" ||
    question.type === "matrix" ||
    question.type === "highlight"
  ) {
    if (normalizedSelected.length !== normalizedCorrect.length) return false;
    return normalizedCorrect.every((c) =>
      normalizedSelected.some((s) => s.toLowerCase() === c.toLowerCase())
    );
  }

  return normalizedSelected.some((s) =>
    normalizedCorrect.some((c) => s.toLowerCase() === c.toLowerCase())
  );
}

function hashStem(stem: string): string {
  let h = 0;
  for (let i = 0; i < stem.length; i++) h = (h * 31 + stem.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
