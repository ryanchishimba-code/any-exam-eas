/**
 * Attempt and accuracy inputs shared by Dashboard and Analytics.
 *
 * The attempt total is the analytics headline: every saved answer on the
 * board’s field aliases. Readiness Proof’s sample size and Today’s “saved
 * attempts” use that same number. Recent accuracy is the roadmap’s rolling
 * window of that scan when it loaded, otherwise the headline’s all-time
 * accuracy. Open incorrect items stay the servable review queue. A 30-day
 * header stat is not this total.
 */

export function boardStudyCountsFromSources(input: {
  roadmap: {
    openIncorrectCount: number;
    recentAccuracyWindow?: { pct: number; windowAttempts: number } | null;
  } | null;
  headline: {
    totalAttempts: number;
    overallAccuracy: number | null;
  };
}): {
  totalAttempts: number;
  overallAccuracyPct: number | null;
  recentAccuracyPct: number;
  openIncorrect: number | null;
} {
  const totalAttempts = Number.isFinite(input.headline.totalAttempts)
    ? Math.max(0, Math.round(input.headline.totalAttempts))
    : 0;
  const overall = input.headline.overallAccuracy;
  const window = input.roadmap?.recentAccuracyWindow;
  return {
    totalAttempts,
    overallAccuracyPct: overall,
    recentAccuracyPct: window?.pct ?? overall ?? 0,
    openIncorrect: input.roadmap ? input.roadmap.openIncorrectCount : null,
  };
}
