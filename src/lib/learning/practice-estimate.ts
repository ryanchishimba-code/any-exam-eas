/**
 * Practice estimate from saved answers.
 * The same read on Readiness and Analytics. Never a pass prediction.
 */

import { outlineCoveragePct } from "@/lib/learning/practice-measure";

export const PRACTICE_ESTIMATE_LABEL = "A practice measure, not a pass prediction.";

export const PRACTICE_ESTIMATE_EXPLANATION =
  "This is practice history: accuracy, how much of the outline you have answered, and how many misses you have retried. It is not the readiness baseline. The baseline is the separate check, and it stays unset until you start one.";

export type PracticeAreaLevelName = "on_track" | "getting_close" | "not_yet" | "insufficient";

export type PracticeAreaLevel = {
  id: string;
  label: string;
  level: PracticeAreaLevelName;
  detail: string;
};

/** Per-area level from saved practice. Not a pass prediction. */
export function practiceAreaLevels(
  topics: Array<{ id: string; label: string; attempts: number; accuracyPct: number | null }>
): PracticeAreaLevel[] {
  return topics
    .filter((topic) => topic.attempts > 0)
    .map((topic) => {
      const accuracy = topic.accuracyPct == null ? 0 : Math.round(topic.accuracyPct);
      const level: PracticeAreaLevelName =
        topic.attempts < 2
          ? "insufficient"
          : accuracy >= 70
            ? "on_track"
            : accuracy >= 50
              ? "getting_close"
              : "not_yet";
      const levelLabel =
        level === "on_track"
          ? "On track"
          : level === "getting_close"
            ? "Getting close"
            : level === "not_yet"
              ? "Not yet"
              : "Not enough data yet";
      return {
        id: topic.id,
        label: topic.label,
        level,
        detail: `${levelLabel} · ${topic.attempts} answer${topic.attempts === 1 ? "" : "s"} · ${accuracy}%`,
      };
    });
}

export type ExamAreaScore = {
  topic: string;
  correct: number;
  total: number;
  pct: number;
};

/** Domain scores from one submitted exam's stored answers. */
export function examAreaScoresFromAnswers(answers: unknown): ExamAreaScore[] {
  if (!Array.isArray(answers)) return [];
  const totals = new Map<string, { correct: number; total: number }>();
  for (const row of answers) {
    if (!row || typeof row !== "object") continue;
    const selected = (row as { selected?: unknown }).selected;
    const chosen = typeof selected === "string" ? selected.trim() : Array.isArray(selected) ? selected.join("") : "";
    if (!chosen) continue;
    const topic = (row as { topicCategory?: unknown }).topicCategory;
    const label = typeof topic === "string" && topic.trim() ? topic.trim() : "General";
    const bucket = totals.get(label) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if ((row as { correct?: unknown }).correct === true) bucket.correct += 1;
    totals.set(label, bucket);
  }
  return [...totals.entries()]
    .map(([topic, bucket]) => ({
      topic,
      correct: bucket.correct,
      total: bucket.total,
      pct: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct || b.total - a.total);
}

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

export type OutlineDepthDomain = {
  seen: number;
  available: number;
  weightPct: number;
};

/**
 * One outline-depth percent for Dashboard, Analytics, and Readiness.
 * Delegates to outlineCoveragePct so every surface uses that function.
 */
export function outlineDepthPct(domains: OutlineDepthDomain[]): number {
  return outlineCoveragePct(
    domains.map((domain) => ({
      blueprintWeightPct: domain.weightPct,
      answerCredit: domain.seen,
      denominator: domain.available,
    }))
  );
}

/** Board overall accuracy: correct answers ÷ saved attempts. */
export function overallAccuracyPct(correct: number, attempts: number): number | null {
  if (attempts <= 0) return null;
  return Math.round((Math.max(0, correct) / attempts) * 100);
}

/** Reviewed-miss rate. Unknown open count stays 0 so it cannot invent a perfect score. */
export function remediationRatePct(openIncorrect: number | null, attempts: number): number {
  if (attempts <= 0 || openIncorrect == null) return 0;
  const ratio = Math.min(1, Math.max(0, openIncorrect) / attempts);
  return Math.round((1 - ratio) * 100);
}

export type RoadmapPracticeSource = {
  totalAttempts: number;
  openIncorrectCount: number | null;
  topics: Array<{
    attempts: number;
    correct: number;
    pushesCompleted: number;
    pushesAvailable: number;
    blueprintWeightPct: number;
  }>;
};

/** Same accuracy, outline depth, remediation, and estimate on every surface. */
export function sharedPracticeRead(roadmap: RoadmapPracticeSource) {
  const topicAttempts = roadmap.topics.reduce((sum, topic) => sum + Math.max(0, topic.attempts), 0);
  const attempts = topicAttempts > 0 ? topicAttempts : Math.max(0, roadmap.totalAttempts);
  const correct = roadmap.topics.reduce((sum, topic) => sum + Math.max(0, topic.correct), 0);
  const accuracyPct = overallAccuracyPct(correct, attempts);
  const depth = outlineDepthPct(
    roadmap.topics.map((topic) => ({
      seen: topic.pushesCompleted,
      available: topic.pushesAvailable,
      weightPct: topic.blueprintWeightPct,
    }))
  );
  const remediationPct = remediationRatePct(roadmap.openIncorrectCount, attempts);
  return {
    accuracyPct,
    outlineDepthPct: depth,
    remediationPct,
    estimate: practiceEstimateFromHistory({
      attempts,
      accuracyPct: accuracyPct ?? 0,
      coveragePct: depth,
      remediationPct,
    }),
  };
}
