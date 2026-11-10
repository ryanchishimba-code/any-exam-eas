import { examSimAnsweredCount } from "@/lib/learning/full-exam-pass-path";

/**
 * A finished full-length sitting.
 * NCLEX CAT stores the prefetch pool (150) on questionCount and the
 * administered length on analysis.answeredCount. A confidence stop at 87
 * is a full exam. A fixed form counts when its planned length meets the
 * board minimum.
 */
export function qualifiesAsFullLengthExam(
  session: { questionCount: number; analysis?: unknown },
  minimumQuestions: number
): boolean {
  const minimum = Math.max(0, Math.floor(minimumQuestions) || 0);
  if (minimum <= 0) return false;
  const administered = examSimAnsweredCount(session.analysis) ?? session.questionCount;
  return administered >= minimum;
}
