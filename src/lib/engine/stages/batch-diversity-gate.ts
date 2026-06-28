import type { ExamQuestion, GeneratedExam } from "../../ai";
import { examQuestionMeetsBoardBar } from "@/lib/exam-prep/board-serve-quality";
import { assessExamSessionQuality } from "@/lib/questions/finalize-exam-session";
import { examQuestionToStudy } from "@/lib/questions/prepare";

export type GenerationQualityReport = {
  requested: number;
  returned: number;
  droppedIndividual: number;
  droppedTotal: number;
  issues: string[];
  passed: boolean;
};

const MIN_RETURN_RATIO = 0.75;

/** Per-item gate before a generated exam reaches the client. */
export function examQuestionPassesGenerationGate(q: ExamQuestion): boolean {
  return examQuestionMeetsBoardBar(q);
}

/**
 * Drop weak items and validate the assembled set before returning AI-generated exams.
 */
export function enforceGeneratedExamQuality(
  exam: GeneratedExam,
  requestedCount: number
): { exam: GeneratedExam; report: GenerationQualityReport } {
  const passing = exam.questions.filter(examQuestionPassesGenerationGate);
  const droppedIndividual = exam.questions.length - passing.length;

  const target = Math.min(requestedCount, passing.length);
  const finalQuestions = passing.slice(0, target);
  const finalPrepared = finalQuestions.map((q, i) =>
    examQuestionToStudy({ ...q, id: i, field: exam.field }, i)
  );
  const quality = assessExamSessionQuality(finalPrepared, target);

  const blockingIssues = quality.issues.filter(
    (issue) =>
      issue === "generic_distractors" ||
      issue === "below_board_bar" ||
      issue === "similarity_violation" ||
      issue.startsWith("count_mismatch")
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
