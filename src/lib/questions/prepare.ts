import {
  cleanOptionText,
  normalizeQuestionOptions,
  shuffleAnswerOptions,
} from "@/lib/question-format";
import { normalizeStem } from "./stem";
import { stripShiftNotes } from "./shift-notes";
import { inferStudyQuestionType } from "./ngn-map";
import {
  matrixOptionsFromLayout,
  parseBowTieLayout,
  parseMatrixLayout,
} from "./ngn-structures";
import { shufflePreservingSequentialSets } from "./sequential-sets";
import type { RawQuestionInput, StudyQuestion, StudyQuestionType } from "./types";

function toCorrectAnswers(type: StudyQuestionType, correct: string): string[] {
  if (type === "drag_drop") {
    return correct
      .split(",")
      .map((s) => cleanOptionText(s.trim()))
      .filter(Boolean);
  }
  if (
    type === "select_all" ||
    type === "ordered_response" ||
    type === "bow_tie" ||
    type === "matrix" ||
    type === "highlight"
  ) {
    const parts = correct.includes("|||")
      ? correct.split("|||")
      : correct.split(",");
    return parts.map((s) => cleanOptionText(s.trim())).filter(Boolean);
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
  } else if (type === "k_type") {
    options = options.map(cleanOptionText);
  } else if (type === "select_all") {
    options = options.map(cleanOptionText);
  } else if (type === "ordered_response" || type === "drag_drop") {
    options = options.map(cleanOptionText);
  } else if (type === "short_answer") {
    options = [];
  } else {
    const normalized = normalizeQuestionOptions(options, correctAnswer);
    const shuffled = shuffleAnswerOptions(normalized.options, normalized.correctAnswer);
    options = shuffled.options;
    correctAnswer = shuffled.correctAnswer;
  }

  let stem = q.question;
  let vignette = q.vignette?.trim();
  if (vignette) {
    vignette = stripShiftNotes(vignette);
    stem = normalizeStem(stem);
  } else {
    const normalized = normalizeStem(stem);
    if (normalized.includes("\n\n")) {
      const parts = normalized.split("\n\n");
      if (parts[0].length >= 30 && parts.length >= 2) {
        vignette = stripShiftNotes(parts[0].trim());
        stem = parts.slice(1).join("\n\n").trim();
      } else {
        stem = normalized;
      }
    } else {
      stem = normalized;
    }
  }

  return {
    id: `q-${index + 1}-${hashStem(stem)}`,
    sourceIndex: q.id ?? index + 1,
    type,
    stem,
    vignette,
    ngnFormat: q.ngnFormat ?? q.type,
    ngnPayload: q.ngnPayload,
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

  return shufflePreservingSequentialSets(prepared);
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

  if (question.type === "short_answer") {
    const sel = parseNumericAnswer(normalizedSelected[0] ?? "");
    const cor = parseNumericAnswer(normalizedCorrect[0] ?? "");
    if (sel == null || cor == null) {
      return normalizedSelected.some((s) =>
        normalizedCorrect.some((c) => s.toLowerCase() === c.toLowerCase())
      );
    }
    return Math.abs(sel - cor) < 0.11;
  }

  if (question.type === "drag_drop") {
    if (normalizedSelected.length !== normalizedCorrect.length) return false;
    return normalizedCorrect.every((c) =>
      normalizedSelected.some((s) => s.toLowerCase() === c.toLowerCase())
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

function parseNumericAnswer(raw: string): number | null {
  const n = parseFloat(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function hashStem(stem: string): string {
  let h = 0;
  for (let i = 0; i < stem.length; i++) h = (h * 31 + stem.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
