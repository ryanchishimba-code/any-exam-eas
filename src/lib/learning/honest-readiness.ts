/**
 * Honest practice-readiness product labels for Study Hub.
 * Never claims board pass probability — only in-app practice criteria.
 */

import type { ExamRoadmapData, RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import { PROGRESS_METRICS_DISCLAIMER } from "@/lib/site";

export type PracticeReadinessBandKey = "ready" | "almost" | "not_yet";

export type PracticeReadinessBandLabel = "Ready" | "Almost" | "Not yet";

export type PracticeReadinessSummary = {
  bandKey: PracticeReadinessBandKey;
  bandLabel: PracticeReadinessBandLabel;
  /** One-line why for the hero. */
  reason: string;
  /** Written criteria — shown as footnotes, not marketing. */
  criteria: string[];
  /** Blueprint categories for Client Needs / domain bars. */
  categoryBars: Array<{
    categoryId: string;
    label: string;
    blueprintWeightPct: number;
    readinessScore: number;
    readinessLabel: string;
    readinessKey: RoadmapTopicRow["readinessKey"];
    practiceHref: string;
  }>;
  overallScore: number;
  overallCoveragePct: number;
  totalAttempts: number;
  disclaimer: string;
};

/** Minimum attempts before “Ready” is allowed (avoids tiny-sample green). */
export const READY_MIN_ATTEMPTS = 25;

/** Minimum blueprint-weighted bank coverage for “Ready”. */
export const READY_MIN_COVERAGE_PCT = 25;

/** Overall practice score floor for “Ready”. */
export const READY_MIN_SCORE = 80;

/** Overall practice score floor for “Almost”. */
export const ALMOST_MIN_SCORE = 65;

/** Minimum attempts before “Almost” (vs cold-start Not yet). */
export const ALMOST_MIN_ATTEMPTS = 10;

export const PRACTICE_READINESS_CRITERIA: string[] = [
  `Ready: practice score ≥${READY_MIN_SCORE}%, ≥${READY_MIN_ATTEMPTS} answers, ≥${READY_MIN_COVERAGE_PCT}% bank coverage, and no high-weight domain still Needs More Work.`,
  `Almost: practice score ≥${ALMOST_MIN_SCORE}% with ≥${ALMOST_MIN_ATTEMPTS} answers — keep drilling weak domains.`,
  "Not yet: below those bars, or not enough practice yet to classify.",
  "These bands reflect practice on this platform only — not a predictor of board results.",
];

function highWeightWeakCount(topics: RoadmapTopicRow[]): number {
  return topics.filter(
    (t) => t.blueprintWeightPct >= 10 && t.readinessKey === "needs_more_work"
  ).length;
}

/**
 * Map blueprint-weighted roadmap stats → Ready / Almost / Not yet.
 * Pure function for unit tests and UI.
 */
export function classifyPracticeReadinessBand(input: {
  overallScore: number;
  overallCoveragePct: number;
  totalAttempts: number;
  topics: RoadmapTopicRow[];
}): { key: PracticeReadinessBandKey; label: PracticeReadinessBandLabel; reason: string } {
  const { overallScore, overallCoveragePct, totalAttempts, topics } = input;
  const weakHeavy = highWeightWeakCount(topics);

  if (
    totalAttempts >= READY_MIN_ATTEMPTS &&
    overallScore >= READY_MIN_SCORE &&
    overallCoveragePct >= READY_MIN_COVERAGE_PCT &&
    weakHeavy === 0
  ) {
    return {
      key: "ready",
      label: "Ready",
      reason:
        "Practice criteria met across blueprint domains — keep timed mocks to stay sharp.",
    };
  }

  if (totalAttempts >= ALMOST_MIN_ATTEMPTS && overallScore >= ALMOST_MIN_SCORE) {
    return {
      key: "almost",
      label: "Almost",
      reason:
        weakHeavy > 0
          ? "Close — prioritize high-weight domains still marked Needs More Work."
          : "Close — build coverage and consistency in weaker domains.",
    };
  }

  if (totalAttempts === 0) {
    return {
      key: "not_yet",
      label: "Not yet",
      reason: "Start a short practice set so we can score blueprint domains.",
    };
  }

  return {
    key: "not_yet",
    label: "Not yet",
    reason:
      totalAttempts < ALMOST_MIN_ATTEMPTS
        ? `Need about ${ALMOST_MIN_ATTEMPTS - totalAttempts} more answers before Almost.`
        : "Practice score or coverage is below the Almost bar — focus weak domains.",
  };
}

export function buildPracticeReadinessSummary(
  roadmap: ExamRoadmapData
): PracticeReadinessSummary {
  const band = classifyPracticeReadinessBand({
    overallScore: roadmap.overallReadiness,
    overallCoveragePct: roadmap.overallPushCoveragePct,
    totalAttempts: roadmap.totalAttempts,
    topics: roadmap.topics,
  });

  const categoryBars = roadmap.topics.map((t) => ({
    categoryId: t.categoryId,
    label: t.label,
    blueprintWeightPct: t.blueprintWeightPct,
    readinessScore: t.readinessScore,
    readinessLabel: t.readinessLabel,
    readinessKey: t.readinessKey,
    practiceHref: t.practiceHref,
  }));

  return {
    bandKey: band.key,
    bandLabel: band.label,
    reason: band.reason,
    criteria: PRACTICE_READINESS_CRITERIA,
    categoryBars,
    overallScore: roadmap.overallReadiness,
    overallCoveragePct: roadmap.overallPushCoveragePct,
    totalAttempts: roadmap.totalAttempts,
    disclaimer: PROGRESS_METRICS_DISCLAIMER,
  };
}
