import {
  cleanOptionText,
  normalizeQuestionOptions,
  parseSelectAllCorrectAnswers,
  shuffleAnswerOptions,
} from "@/lib/question-format";
import { normalizeStem } from "./stem";
import {
  resolveNclexStem,
  splitVagueCombinedQuestion,
  stripLeadingShiftNoteBlock,
  stripShiftNotes,
} from "./shift-notes";
import { inferStudyQuestionType } from "./ngn-map";
import {
  matrixOptionsFromLayout,
  parseBowTieLayout,
  parseMatrixLayout,
} from "./ngn-structures";
import { shufflePreservingSequentialSets } from "./sequential-sets";
import {
  hasAdjacentSimilarOptions,
  optionsFromStudyQuestion,
} from "./session-quality";
import { hasAdjacentSimilarSpread, spreadGroupKeyFromStudyQuestion, spreadStudyQuestions } from "./spread-session-order";
import type { RawQuestionInput, StudyQuestion, StudyQuestionType } from "./types";

function toCorrectAnswers(type: StudyQuestionType, correct: string, options: string[] = []): string[] {
  if (type === "drag_drop") {
    return correct
      .split(",")
      .map((s) => cleanOptionText(s.trim()))
      .filter(Boolean);
  }
  if (type === "select_all") {
    return parseSelectAllCorrectAnswers(options, correct);
  }
  if (
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
  index: number,
  opts?: { shuffleOptions?: boolean }
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
    if (opts?.shuffleOptions === false) {
      options = normalized.options;
      correctAnswer = normalized.correctAnswer;
    } else {
      const shuffled = shuffleAnswerOptions(normalized.options, normalized.correctAnswer);
      options = shuffled.options;
      correctAnswer = shuffled.correctAnswer;
    }
  }

  let stem = stripLeadingShiftNoteBlock(q.question);
  let vignette = q.vignette?.trim();
  if (vignette) {
    vignette = stripShiftNotes(vignette);
    stem = normalizeStem(resolveNclexStem(stem, options));
  } else {
    const split = splitVagueCombinedQuestion(stem);
    if (split.vignette) {
      vignette = split.vignette;
      stem = normalizeStem(split.stem);
    } else {
      const normalized = normalizeStem(stem);
      if (normalized.includes("\n\n")) {
        const parts = normalized.split("\n\n");
        if (parts[0].length >= 30 && parts.length >= 2) {
          vignette = stripShiftNotes(parts[0].trim());
          stem = normalizeStem(resolveNclexStem(parts.slice(1).join("\n\n").trim(), options));
        } else {
          stem = normalizeStem(resolveNclexStem(normalized, options));
        }
      } else {
        stem = normalizeStem(resolveNclexStem(normalized, options));
      }
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
    correctAnswers: toCorrectAnswers(type, correctAnswer, options),
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

  for (let attempt = 0; attempt < 4; attempt++) {
    const spread = spreadStudyQuestions(shufflePreservingSequentialSets(prepared));
    if (
      spread.length <= 1 ||
      (!hasAdjacentSimilarSpread(spread, spreadGroupKeyFromStudyQuestion) &&
        !hasAdjacentSimilarOptions(spread, optionsFromStudyQuestion))
    ) {
      return spread;
    }
  }

  return spreadStudyQuestions(shufflePreservingSequentialSets(prepared));
}

const NGN_EXAM_TYPES = new Set<StudyQuestionType>([
  "bow_tie",
  "matrix",
  "highlight",
  "select_all",
  "ordered_response",
  "unfolding_case",
  "short_answer",
  "drag_drop",
  "calculation",
  "fill_blank",
]);

function joinCorrectAnswers(type: StudyQuestionType, answers: string[]): string {
  if (answers.length === 0) return "";
  if (type === "select_all" && answers.length > 1) return answers.join(",");
  return answers.join(",");
}

/** Map prepared study rows to API ExamQuestion — use after shuffle; never index into a parallel raw[]. */
export function studyQuestionsToExamQuestions(prepared: StudyQuestion[]): import("@/lib/ai").ExamQuestion[] {
  return prepared.map((p, i) => {
    const isSelectAll = p.type === "select_all";
    const isMulti =
      isSelectAll ||
      p.type === "matrix" ||
      p.type === "bow_tie" ||
      p.type === "ordered_response";

    const type: import("@/lib/ai").ExamQuestion["type"] = NGN_EXAM_TYPES.has(p.type)
      ? (p.type as import("@/lib/ai").ExamQuestion["type"])
      : p.type === "true_false"
        ? "true_false"
        : "multiple_choice";

    return {
      id: i + 1,
      type,
      question: p.stem,
      options: p.options,
      correctAnswer: isMulti
        ? joinCorrectAnswers(p.type, p.correctAnswers)
        : (p.correctAnswers[0] ?? ""),
      explanation: p.explanation,
      solutionSteps: p.solutionSteps,
      tags: p.tags,
      highYield: p.highYield,
      vignette: p.vignette,
      clinicalReasoning: p.clinicalReasoning,
      distractorRationale: p.distractorRationale,
      references: p.references,
      ngnFormat: p.ngnFormat,
      ngnPayload: p.ngnPayload,
      chartData: p.chartData,
      caseStep: p.caseStep,
      qualityScore: p.qualityScore,
    };
  });
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
