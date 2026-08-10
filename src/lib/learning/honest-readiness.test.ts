import { describe, expect, it } from "vitest";
import type { ExamRoadmapData, RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import {
  ALMOST_MIN_ATTEMPTS,
  READY_MIN_ATTEMPTS,
  READY_MIN_COVERAGE_PCT,
  READY_MIN_SCORE,
  buildPracticeReadinessSummary,
  classifyPracticeReadinessBand,
} from "./honest-readiness";

function topic(
  partial: Partial<RoadmapTopicRow> & Pick<RoadmapTopicRow, "categoryId" | "label">
): RoadmapTopicRow {
  return {
    blueprintWeightPct: 15,
    readinessScore: 70,
    readinessKey: "needs_review",
    readinessLabel: "Needs Review",
    attempts: 10,
    correct: 7,
    accuracy: 0.7,
    pushesCompleted: 10,
    pushesAvailable: 40,
    pushCoveragePct: 25,
    highYieldTopics: [],
    practiceHref: "/question-bank",
    ...partial,
  };
}

describe("classifyPracticeReadinessBand", () => {
  it("returns Not yet with zero attempts", () => {
    const result = classifyPracticeReadinessBand({
      overallScore: 90,
      overallCoveragePct: 50,
      totalAttempts: 0,
      topics: [],
    });
    expect(result).toEqual({
      key: "not_yet",
      label: "Not yet",
      reason: expect.stringContaining("Start a short practice"),
    });
  });

  it("returns Almost when score and attempts clear the mid bar", () => {
    const result = classifyPracticeReadinessBand({
      overallScore: 70,
      overallCoveragePct: 20,
      totalAttempts: ALMOST_MIN_ATTEMPTS,
      topics: [topic({ categoryId: "a", label: "A" })],
    });
    expect(result.key).toBe("almost");
    expect(result.label).toBe("Almost");
  });

  it("returns Ready when score, attempts, coverage, and weak domains clear", () => {
    const result = classifyPracticeReadinessBand({
      overallScore: READY_MIN_SCORE,
      overallCoveragePct: READY_MIN_COVERAGE_PCT,
      totalAttempts: READY_MIN_ATTEMPTS,
      topics: [
        topic({
          categoryId: "a",
          label: "A",
          readinessKey: "strong",
          readinessLabel: "Strong",
          readinessScore: 85,
          blueprintWeightPct: 20,
        }),
      ],
    });
    expect(result.key).toBe("ready");
    expect(result.label).toBe("Ready");
  });

  it("blocks Ready when a high-weight domain still Needs More Work", () => {
    const result = classifyPracticeReadinessBand({
      overallScore: 88,
      overallCoveragePct: 40,
      totalAttempts: 40,
      topics: [
        topic({
          categoryId: "weak",
          label: "Weak heavy",
          blueprintWeightPct: 18,
          readinessKey: "needs_more_work",
          readinessLabel: "Needs More Work",
          readinessScore: 40,
        }),
      ],
    });
    expect(result.key).toBe("almost");
    expect(result.reason).toMatch(/Needs More Work/i);
  });
});

describe("buildPracticeReadinessSummary", () => {
  it("maps roadmap topics into bars and includes honesty disclaimer", () => {
    const roadmap = {
      examSlug: "nclex",
      examName: "NCLEX",
      fieldId: "nursing",
      blueprintSource: "test",
      overallReadiness: 72,
      overallPushCoveragePct: 30,
      pushesCompleted: 50,
      pushesAvailable: 200,
      passFocusMessage: "Focus pharm",
      topics: [
        topic({
          categoryId: "pharmacology",
          label: "Pharmacological Therapies",
          blueprintWeightPct: 15,
        }),
      ],
      priorityTopics: [],
      totalAttempts: 20,
      launch: { hasRetake: false, canContinue: false, weakFocusAreas: [] },
    } satisfies ExamRoadmapData;

    const summary = buildPracticeReadinessSummary(roadmap);
    expect(summary.bandKey).toBe("almost");
    expect(summary.categoryBars).toHaveLength(1);
    expect(summary.categoryBars[0]?.label).toBe("Pharmacological Therapies");
    expect(summary.disclaimer).toMatch(/do not predict/i);
    expect(summary.criteria.length).toBeGreaterThanOrEqual(3);
  });
});
