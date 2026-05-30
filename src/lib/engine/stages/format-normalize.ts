import type { ExamQuestion, GeneratedExam } from "@/lib/ai";
import { normalizeQuestionOptions, toQuizletStyleQuestion } from "@/lib/question-format";

const NGN_TYPES = new Set([
  "select_all",
  "bow_tie",
  "matrix",
  "unfolding_case",
  "highlight",
  "ordered_response",
  "drag_drop",
]);

/** Preserve NGN formats; normalize MCQ; enrich explanation structure. */
export function normalizeGeneratedExam(
  exam: GeneratedExam,
  targetCount: number,
  requireSolutionSteps: boolean
): GeneratedExam {
  const questions = exam.questions.slice(0, targetCount).map((q, idx) =>
    normalizeOneQuestion(q, idx, requireSolutionSteps)
  );
  return { ...exam, questions };
}

function normalizeOneQuestion(
  q: ExamQuestion,
  idx: number,
  requireSolutionSteps: boolean
): ExamQuestion {
  const type = q.type ?? "multiple_choice";
  const stem = buildStem(q);

  if (NGN_TYPES.has(type)) {
    const options = q.options ?? [];
    return {
      ...q,
      id: idx + 1,
      type,
      question: stem,
      options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? "",
      clinicalReasoning: q.clinicalReasoning ?? deriveClinicalReasoning(q),
      distractorRationale: q.distractorRationale ?? {},
      references: q.references ?? [],
      tags: q.tags ?? [],
      highYield: q.highYield ?? true,
    };
  }

  const { options, correctAnswer } = normalizeQuestionOptions(
    q.options ?? [],
    q.correctAnswer
  );

  const base = toQuizletStyleQuestion({
    ...q,
    id: idx + 1,
    type: "multiple_choice",
    question: stem,
    options,
    correctAnswer,
    highYield: q.highYield ?? true,
  });

  const normalized: ExamQuestion = {
    ...q,
    ...base,
    type: "multiple_choice",
    vignette: q.vignette,
    clinicalReasoning: q.clinicalReasoning ?? deriveClinicalReasoning(q),
    distractorRationale: q.distractorRationale ?? {},
    references: q.references ?? [],
  };

  if (requireSolutionSteps && (!normalized.solutionSteps || normalized.solutionSteps.length === 0)) {
    normalized.solutionSteps = normalized.explanation
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5)
      .slice(0, 5);
  }

  return normalized;
}

function buildStem(q: ExamQuestion): string {
  if (q.vignette && !q.question.includes(q.vignette.slice(0, 40))) {
    return `${q.vignette.trim()}\n\n${q.question.trim()}`;
  }
  return q.question;
}

function deriveClinicalReasoning(q: ExamQuestion): string {
  if (q.clinicalReasoning) return q.clinicalReasoning;
  if (q.explanation.length > 80) {
    return `Clinical reasoning: ${q.explanation.slice(0, 240)}`;
  }
  return "";
}
