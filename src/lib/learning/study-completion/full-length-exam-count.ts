import { examSimAnsweredCount } from "@/lib/learning/full-exam-pass-path";

/**
 * A finished full-length sitting.
 * NCLEX CAT stores the prefetch pool (150) on questionCount and the
 * administered length on analysis.answeredCount. A confidence stop at 87
 * is a full exam. A fixed form counts when its planned length meets the
 * board minimum.
 */
/**
 * A completed full-length AANP FNP exam counts toward the Readiness checks
 * pillar. The recorded check still counts. Other boards keep the check table.
 */
export function readinessChecksFromPractice(input: {
  examSlug: string;
  recordedChecks: number;
  fullLengthExamsCompleted: number;
}): number {
  const recorded = Math.max(0, Math.floor(input.recordedChecks) || 0);
  if (input.examSlug === "aanp-fnp" && input.fullLengthExamsCompleted > 0) {
    return Math.max(recorded, 1);
  }
  return recorded;
}

export function qualifiesAsFullLengthExam(
  session: { questionCount: number; analysis?: unknown },
  minimumQuestions: number
): boolean {
  const minimum = Math.max(0, Math.floor(minimumQuestions) || 0);
  if (minimum <= 0) return false;
  const administered = examSimAnsweredCount(session.analysis) ?? session.questionCount;
  return administered >= minimum;
}
