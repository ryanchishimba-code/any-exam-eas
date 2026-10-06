import { examQuestionToStudy } from "./prepare";
import type { RawQuestionInput, StudyQuestion } from "./types";

/**
 * Map already-prepared API questions without changing session order or option order.
 * Lives apart from finalize-exam-session so the full-exam client does not import
 * the question-bank database module (and the Neon driver behind it).
 */
export function mapApiQuestionsToStudy(
  raw: RawQuestionInput[],
  opts?: { shuffleOptions?: boolean; shuffleSeed?: number }
): StudyQuestion[] {
  return raw.map((q, i) => examQuestionToStudy(q, i, opts));
}
