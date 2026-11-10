/**
 * Practice estimate from saved answers.
 * The same read on Readiness and Analytics. Never a pass prediction.
 */

export const PRACTICE_ESTIMATE_LABEL = "A practice measure, not a pass prediction.";

export const PRACTICE_ESTIMATE_EXPLANATION =
  "The baseline measures accuracy, how much of the outline you have answered, and how many misses you have retried. Each practice set updates those three counts.";

export type PracticeEstimateLevel = "early" | "building" | "steady";

export type PracticeEstimate = {
  label: typeof PRACTICE_ESTIMATE_LABEL;
  level: PracticeEstimateLevel;
  levelLabel: string;
  summary: string;
  explanation: string;
};

export function practiceEstimateFromHistory(input: {
  attempts: number;
  accuracyPct: number;
  coveragePct: number;
  remediationPct: number;
}): PracticeEstimate | null {
  const attempts = Math.max(0, Math.round(input.attempts) || 0);
  if (attempts <= 0) return null;

  const accuracy = clampPct(input.accuracyPct);
  const coverage = clampPct(input.coveragePct);
  const remediation = clampPct(input.remediationPct);
  const level: PracticeEstimateLevel =
    attempts >= 40 && accuracy >= 70 && coverage >= 25 && remediation >= 50
      ? "steady"
      : attempts >= 10
        ? "building"
        : "early";

  const levelLabel = level === "steady" ? "Steady practice" : level === "building" ? "Building" : "Early practice";
  const summary =
    level === "steady"
      ? `Accuracy ${accuracy}%, outline ${coverage}%, review ${remediation}%.`
      : level === "building"
        ? `Accuracy ${accuracy}%, outline ${coverage}%, review ${remediation}%. More practice still moves this.`
        : `Accuracy ${accuracy}% from ${attempts} answer${attempts === 1 ? "" : "s"}. More answers will sharpen this read.`;

  return {
    label: PRACTICE_ESTIMATE_LABEL,
    level,
    levelLabel,
    summary,
    explanation: PRACTICE_ESTIMATE_EXPLANATION,
  };
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
