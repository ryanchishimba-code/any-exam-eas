import type { ExamQuestion, GeneratedExam } from "../../ai";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import { assessExamSessionQuality } from "@/lib/questions/finalize-exam-session";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { spreadStudyQuestions } from "@/lib/questions/spread-session-order";

export type GenerationQualityReport = {
  requested: number;
  returned: number;
  droppedIndividual: number;
  droppedTotal: number;
  issues: string[];
  passed: boolean;
};

const MIN_RETURN_RATIO = 0.75;

function isMcqLike(type: ExamQuestion["type"]): boolean {
  return !type || type === "multiple_choice" || type === "true_false";
}

/** Per-item gate before a generated exam reaches the client. */
export function examQuestionPassesGenerationGate(q: ExamQuestion): boolean {
  if (!q.question?.trim() || q.question.trim().length < 12) return false;
  if (!q.explanation?.trim() || q.explanation.trim().length < 20) return false;

  if (isMcqLike(q.type)) {
    if ((q.options?.length ?? 0) !== 4) return false;
    if (hasGenericPlaceholderOptions(q.options ?? [])) return false;
    if (!q.correctAnswer?.trim()) return false;
    if (!q.options?.some((o) => o.trim() === q.correctAnswer.trim())) return false;
  }

  return true;
}

/**
 * Drop weak items, spread for batch diversity, and validate the assembled set
 * before returning AI-generated exams to users.
 */
export function enforceGeneratedExamQuality(
  exam: GeneratedExam,
  requestedCount: number
): { exam: GeneratedExam; report: GenerationQualityReport } {
  const passing = exam.questions.filter(examQuestionPassesGenerationGate);
  const droppedIndividual = exam.questions.length - passing.length;

  const prepared = passing.map((q, i) =>
    examQuestionToStudy({ ...q, id: i, field: exam.field }, i)
  );
  const spread = spreadStudyQuestions(prepared);
  const ordered = spread
    .map((s) => passing[s.sourceIndex])
    .filter((q): q is ExamQuestion => Boolean(q));

  const target = Math.min(requestedCount, ordered.length);
  const finalQuestions = ordered.slice(0, target);
  const finalPrepared = finalQuestions.map((q, i) =>
    examQuestionToStudy({ ...q, id: i, field: exam.field }, i)
  );
  const quality = assessExamSessionQuality(finalPrepared, target);

  const blockingIssues = quality.issues.filter(
    (issue) =>
      issue === "generic_distractors" ||
      issue.startsWith("count_mismatch") ||
      (target >= 4 &&
        (issue === "adjacent_similar_options" || issue === "adjacent_similar_cases"))
  );

  const passed =
    finalQuestions.length >= Math.ceil(requestedCount * MIN_RETURN_RATIO) &&
    blockingIssues.length === 0;

  return {
    exam: { ...exam, questions: finalQuestions },
    report: {
      requested: requestedCount,
      returned: finalQuestions.length,
      droppedIndividual,
      droppedTotal: exam.questions.length - finalQuestions.length,
      issues: quality.issues,
      passed,
    },
  };
}
