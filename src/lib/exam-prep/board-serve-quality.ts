/**
 * Shared minimum bar for board-style questions at generation, ingest, and session serve.
 * Mirrors NBME/NCLEX expectations: substantive stem, teaching rationale, four plausible MCQ options.
 */
import type { ExamQuestion } from "@/lib/ai";
import { hasGenericPlaceholderOptions } from "@/lib/question-format";
import type { StudyQuestion } from "@/lib/questions/types";
import type { RawQuestionInput } from "@/lib/questions/types";

export const BOARD_SERVE_MIN_STEM_CHARS = 12;
export const BOARD_SERVE_MIN_EXPLANATION_CHARS = 40;
export const BOARD_SERVE_MCQ_OPTION_COUNT = 4;

/** Slightly lower structural bar when strict pool cannot fill a timed exam. */
export const BOARD_EXAM_FILL_MIN_STEM_CHARS = 10;
export const BOARD_EXAM_FILL_MIN_EXPLANATION_CHARS = 28;

const MCQ_LIKE = new Set([
  "multiple_choice",
  "true_false",
  "k_type",
  "select_all",
  "sata",
]);

function isMcqLike(type: string | undefined): boolean {
  return !type || MCQ_LIKE.has(type);
}

function mcqOptionsMeetBoardBar(
  options: string[] | undefined,
  correctAnswer: string | undefined,
  type: string | undefined
): boolean {
  if (!isMcqLike(type)) return true;

  const opts = options ?? [];
  if (type === "multiple_choice" || !type || type === "true_false") {
    if (opts.length < BOARD_SERVE_MCQ_OPTION_COUNT) return false;
  }
  if (opts.length > 0 && hasGenericPlaceholderOptions(opts)) return false;

  const answer = correctAnswer?.trim();
  if (answer && opts.length > 0 && (type === "multiple_choice" || !type || type === "true_false")) {
    if (!opts.some((o) => o.trim() === answer)) return false;
  }

  return true;
}

/** Structural board bar for raw/API question payloads. */
export function rawQuestionMeetsBoardBar(q: RawQuestionInput): boolean {
  return rawQuestionMeetsBoardBarWithThresholds(q, {
    minStem: BOARD_SERVE_MIN_STEM_CHARS,
    minExplanation: BOARD_SERVE_MIN_EXPLANATION_CHARS,
  });
}

/** Lower structural bar when strict filtering cannot fill a timed exam. */
export function rawQuestionMeetsRelaxedBoardBar(q: RawQuestionInput): boolean {
  return rawQuestionMeetsBoardBarWithThresholds(q, {
    minStem: BOARD_EXAM_FILL_MIN_STEM_CHARS,
    minExplanation: BOARD_EXAM_FILL_MIN_EXPLANATION_CHARS,
  });
}

/** Minimal structural bar — last tier before unfiltered fill. */
export function rawQuestionMeetsMinimalBoardBar(q: RawQuestionInput): boolean {
  return rawQuestionMeetsBoardBarWithThresholds(q, {
    minStem: 8,
    minExplanation: 16,
  });
}

function rawQuestionMeetsBoardBarWithThresholds(
  q: RawQuestionInput,
  thresholds: { minStem: number; minExplanation: number }
): boolean {
  const stem = q.question?.trim() ?? "";
  if (stem.length < thresholds.minStem) return false;

  const explanation = q.explanation?.trim() ?? "";
  if (explanation.length < thresholds.minExplanation) return false;

  return mcqOptionsMeetBoardBar(q.options, q.correctAnswer, q.type);
}

/** Structural board bar for generated exam rows (pre-ingest). */
export function examQuestionMeetsBoardBar(q: ExamQuestion): boolean {
  return rawQuestionMeetsBoardBar(q);
}

/** Structural board bar for client-facing study questions. */
export function studyQuestionMeetsBoardBar(q: StudyQuestion): boolean {
  const stem = q.stem?.trim() ?? "";
  if (stem.length < BOARD_SERVE_MIN_STEM_CHARS) return false;

  const explanation = q.explanation?.trim() ?? "";
  if (explanation.length < BOARD_SERVE_MIN_EXPLANATION_CHARS) return false;

  if (isMcqLike(q.type) && q.options.length > 0) {
    if (
      (q.type === "multiple_choice" || q.type === "k_type") &&
      q.options.length < BOARD_SERVE_MCQ_OPTION_COUNT
    ) {
      return false;
    }
    if (hasGenericPlaceholderOptions(q.options)) return false;
    if (
      q.type === "multiple_choice" &&
      q.correctAnswers.length > 0 &&
      !q.correctAnswers.some((c) => q.options.includes(c))
    ) {
      return false;
    }
  }

  return true;
}
