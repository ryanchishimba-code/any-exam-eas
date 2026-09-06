import type { MistakeCategory } from "./types";

/** Mastery update weights — tunable without schema changes. */
export const MASTERY_CONFIG = {
  correctGain: 8,
  incorrectLoss: 12,
  highConfidenceMissPenalty: 4,
  retentionDecayPerDay: 0.02,
  readinessWeights: {
    accuracy: 0.45,
    retention: 0.25,
    confidenceReliability: 0.2,
    coverage: 0.1,
  },
  /**
   * Evidence gates so early practice cannot look “exam ready.”
   * Aligns with honest-readiness Almost/Ready attempt floors.
   */
  readinessEvidence: {
    almostMinAttempts: 10,
    readyMinAttempts: 25,
    softCapBeforeAlmost: 55,
    softCapBeforeReady: 74,
  },
} as const;

export function computeMasteryDelta(params: {
  currentScore: number;
  correct: boolean;
  confidence?: number;
  mistakeCategory?: MistakeCategory;
}): {
  masteryScore: number;
  retentionStrength: number;
  confidenceReliability: number;
} {
  let delta = params.correct
    ? MASTERY_CONFIG.correctGain
    : -MASTERY_CONFIG.incorrectLoss;

  if (
    !params.correct &&
    params.confidence != null &&
    params.confidence >= 4
  ) {
    delta -= MASTERY_CONFIG.highConfidenceMissPenalty;
  }

  if (params.mistakeCategory === "memorization_gap" && !params.correct) {
    delta -= 2;
  }

  const masteryScore = clamp(params.currentScore + delta, 0, 100);

  const retentionStrength = params.correct
    ? clamp(params.currentScore * 0.3 + 15, 0, 100)
    : clamp(params.currentScore * 0.5, 0, 100);

  const confidenceReliability = params.confidence
    ? params.correct
      ? clamp(50 + params.confidence * 8, 0, 100)
      : clamp(100 - params.confidence * 12, 0, 100)
    : 50;

  return { masteryScore, retentionStrength, confidenceReliability };
}

export function computeReadinessScore(
  masteries: {
    masteryScore: number;
    retentionStrength: number;
    confidenceReliability?: number;
    attempts: number;
  }[]
): number {
  if (masteries.length === 0) return 0;

  const withAttempts = masteries.filter((m) => m.attempts > 0);
  if (withAttempts.length === 0) return 0;

  const totalAttempts = withAttempts.reduce((s, m) => s + m.attempts, 0);
  const avgMastery =
    withAttempts.reduce((s, m) => s + m.masteryScore, 0) / withAttempts.length;
  const avgRetention =
    withAttempts.reduce((s, m) => s + m.retentionStrength, 0) / withAttempts.length;
  const avgConfidence =
    withAttempts.reduce(
      (s, m) => s + (m.confidenceReliability ?? avgMastery),
      0
    ) / withAttempts.length;
  // Coverage from attempt mass (not “one try × many concepts”).
  const coverage = Math.min(100, totalAttempts * 2);

  const w = MASTERY_CONFIG.readinessWeights;
  let score =
    avgMastery * w.accuracy +
    avgRetention * w.retention +
    avgConfidence * w.confidenceReliability +
    coverage * w.coverage;

  const ev = MASTERY_CONFIG.readinessEvidence;
  if (totalAttempts < ev.almostMinAttempts) {
    score = Math.min(score, ev.softCapBeforeAlmost);
  } else if (totalAttempts < ev.readyMinAttempts) {
    score = Math.min(score, ev.softCapBeforeReady);
  }

  return Math.round(clamp(score, 0, 100));
}

export function applyRetentionDecay(
  masteryScore: number,
  lastAttemptAt: Date | null,
  now = new Date()
): number {
  if (!lastAttemptAt) return masteryScore;
  const days = (now.getTime() - lastAttemptAt.getTime()) / (1000 * 60 * 60 * 24);
  if (days < 1) return masteryScore;
  const decay = days * MASTERY_CONFIG.retentionDecayPerDay * 100;
  return clamp(masteryScore - decay, 0, 100);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
