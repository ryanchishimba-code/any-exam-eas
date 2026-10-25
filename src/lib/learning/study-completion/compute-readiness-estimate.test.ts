import { describe, expect, it } from "vitest";
import {
  bandForReadinessScore,
  buildReadinessEstimateFromSignals,
} from "./compute-readiness-estimate";

describe("buildReadinessEstimateFromSignals", () => {
  it("requires a minimum unique question count", () => {
    const result = buildReadinessEstimateFromSignals({
      uniqueQuestionCount: 40,
      minUniqueQuestions: 100,
      practiceAccuracyPercent: 80,
      fullLengthScorePercent: 70,
      readinessCheckScore: 88,
      areaAccuracies: [],
      blueprint: undefined,
    });
    expect(result).toMatchObject({
      status: "insufficient_data",
      message: "Answer more questions to see your estimate.",
    });
  });

  it("returns score, band, and disclaimer when data is sufficient", () => {
    const result = buildReadinessEstimateFromSignals({
      uniqueQuestionCount: 200,
      minUniqueQuestions: 100,
      practiceAccuracyPercent: 82,
      fullLengthScorePercent: 78,
      readinessCheckScore: 88,
      areaAccuracies: [
        { areaId: "a", label: "Alpha", answered: 10, correct: 4 },
        { areaId: "b", label: "Beta", answered: 8, correct: 7 },
      ],
      blueprint: undefined,
    });
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    expect(result.score).toBeGreaterThan(0);
    expect(result.disclaimer).toContain("Not a prediction");
    expect(result.weakSpots[0]?.label).toBe("Alpha");
  });
});

describe("bandForReadinessScore", () => {
  it("maps score ranges to bands", () => {
    expect(bandForReadinessScore(40)).toBe("Building");
    expect(bandForReadinessScore(60)).toBe("Getting close");
    expect(bandForReadinessScore(80)).toBe("On track");
  });
});
