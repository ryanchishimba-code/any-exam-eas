/**
 * Readiness check scoring. Tune these constants. Do not invent a pass probability.
 *
 * The bands describe performance on this fixed check. They are not a predicted
 * chance of passing a licensure exam. We do not have outcome data to calibrate
 * against, so the product never shows a percent-to-pass or a "probability of passing".
 *
 * Length
 * - 24 items for every board. Short enough to finish in one sitting, long enough
 *   to put at least 2 items in each area when the blueprint has 12 areas or fewer
 *   (NCLEX has 8, NAPLEX has 5). Wider blueprints (NPTE) still cover every area
 *   with at least 1 item, and areas under the evidence minimum stay unlabeled.
 *
 * Area level (answered items in that area on this check)
 * - Fewer than MIN_EVIDENCE answers → "Not enough data yet"
 * - Accuracy >= ON_TRACK_MIN (70%) → "On track"
 * - Accuracy >= GETTING_CLOSE_MIN (50%) and below 70% → "Getting close"
 * - Accuracy below 50% → "Not yet"
 * Boundaries are inclusive: 70% is On track, 50% is Getting close.
 *
 * Overall band
 * - "Not enough data yet" when no area has a level, or fewer than half the areas do.
 * - "On track" when every area has a level, none are "Not yet", and at least 75%
 *   of areas are On track.
 * - "Getting close" when every area has a level and none are "Not yet", but fewer
 *   than 75% are On track.
 * - "Not yet" when at least half the areas have a level and any scored area is Not yet.
 * The student-facing line is the overall band plus, when useful, up to two
 * weakest areas to practice next. It is not "on track in N of M areas."
 * Per-area levels use the current tags and stay provisional.
 *
 * Retake
 * - Suggested 14 days after the latest completed check (inside the 1–2 week window).
 * - A student can retake sooner. The suggestion is a nudge, not a lock.
 * - Assembly avoids items from the most recent completed check when the bank allows.
 *
 * Offer
 * - Skipping the baseline hides the invite for 7 days, then shows it again.
 * - The quiet link stays on the dashboard the whole time.
 *
 * Item eligibility
 * - One function: readinessItemIsEligible in eligibility.ts.
 * - Standard single-answer MCQ only. SATA, NGN, K-type, true/false, select-all
 *   stems, QA-gate failures, flagged, pending, item-QA codes, and retired rows
 *   stay out. The row must also pass assessStudentEligibility. A short area is
 *   not padded.
 * - Set requireApprovedReview to require reviewStatus "approved".
 */

export const READINESS_CHECK_LENGTH = 24;

/** Answered items required in one area before that area receives a level. */
export const READINESS_MIN_EVIDENCE = 2;

/** Inclusive accuracy floor for "On track". */
export const READINESS_ON_TRACK_MIN = 0.7;

/** Inclusive accuracy floor for "Getting close". Below this, the level is "Not yet". */
export const READINESS_GETTING_CLOSE_MIN = 0.5;

/** Share of blueprint areas that must be On track for an overall On track band. */
export const READINESS_OVERALL_ON_TRACK_SHARE = 0.75;

/** Days after a completed check before we suggest another one. */
export const READINESS_RETAKE_SUGGEST_DAYS = 14;

/** Days a skipped baseline invite stays quiet before it is offered again. */
export const READINESS_OFFER_RESHOW_DAYS = 7;

/** Days a "Haven't taken it" answer keeps the dashboard prompt quiet. */
export const READINESS_OUTCOME_SNOOZE_DAYS = 7;

/** A check shorter than this is not started. The bank for that board is too thin. */
export const READINESS_MIN_CHECK_ITEMS = 8;

/** Area copy when the clean bank cannot supply the evidence minimum. */
export const READINESS_THIN_AREA_LABEL = "Not enough clean questions in this area yet";

export const READINESS_LEVEL_LABEL = {
  not_yet: "Not yet",
  getting_close: "Getting close",
  on_track: "On track",
  insufficient: "Not enough data yet",
} as const;

export type ReadinessLevel = keyof typeof READINESS_LEVEL_LABEL;

export const EXAM_OUTCOME_RESULT = {
  passed: "passed",
  not_yet: "not_yet",
  not_taken: "not_taken",
} as const;

export type ExamOutcomeResult = (typeof EXAM_OUTCOME_RESULT)[keyof typeof EXAM_OUTCOME_RESULT];

const LEVEL_RANK: Record<ReadinessLevel, number> = {
  insufficient: 0,
  not_yet: 1,
  getting_close: 2,
  on_track: 3,
};

export function readinessLevelRank(level: ReadinessLevel): number {
  return LEVEL_RANK[level];
}
