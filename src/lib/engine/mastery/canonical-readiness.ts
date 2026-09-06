/**
 * Canonical practice readiness — the score users use to gauge prep.
 *
 * Trust rules (non-negotiable):
 *   1. Never claim board pass probability.
 *   2. Thin evidence cannot look “ready” (soft caps by attempt count).
 *   3. Untouched blueprint domains score 0 (not a Bayesian prior).
 *   4. Profile + per-field readiness share one formula.
 *   5. Ready/Almost/Not yet bands are separate honesty labels on roadmap stats.
 *   6. Cell coverage/competence is a Mastery/Today strip — orthogonal.
 */

export {
  computeReadinessScore,
  computeMasteryDelta,
  applyRetentionDecay,
  MASTERY_CONFIG,
} from "@/lib/learning/mastery";

export {
  READY_MIN_ATTEMPTS,
  READY_MIN_COVERAGE_PCT,
  READY_MIN_SCORE,
  ALMOST_MIN_ATTEMPTS,
  ALMOST_MIN_SCORE,
  PRACTICE_READINESS_CRITERIA,
  classifyPracticeReadinessBand,
  buildPracticeReadinessSummary,
} from "@/lib/learning/honest-readiness";
