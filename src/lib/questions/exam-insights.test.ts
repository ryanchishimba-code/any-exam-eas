import { describe, expect, it } from "vitest";
import { buildFullExamInsights } from "@/lib/questions/exam-insights";
import type { FullExamResultsAnalysis } from "@/types/full-exam";

const analysis = {
  sessionConfig: {
    lengthPreset: "50",
    questionCount: 50,
    timed: true,
    timeLimitSec: 3600,
    adaptive: false,
  },
  timeUsedSec: 120,
  topicBreakdown: [],
  questionIds: ["a"],
  questionSnapshots: [],
  summary: "Completed simulation.",
} as FullExamResultsAnalysis;

describe("full exam insights copy", () => {
  it("keeps a high score in the practice band", () => {
    const insights = buildFullExamInsights(
      "nclex",
      90,
      analysis,
      [{ questionIndex: 0, selected: "A", correct: true, answeredAt: "2026-09-23T00:00:00.000Z" }]
    );
    expect(insights.headline).toBe("Strong practice band");
    expect(`${insights.headline} ${insights.subline}`).not.toMatch(
      /you will pass|guaranteed pass|board-ready/i
    );
  });

  it("does not call an early-ended practice CAT complete", () => {
    const insights = buildFullExamInsights(
      "nclex",
      0,
      {
        ...analysis,
        summary: "Session ended early. Your saved answers were scored.",
        catOutcome: {
          questionNumber: 12,
          ability: 0,
          difficulty: "medium",
          correctCount: 0,
          incorrectCount: 0,
          isComplete: false,
          stopReason: undefined,
          practiceBand: { label: "Building practice band", hint: "Keep drilling." },
        },
      },
      [],
      { endedEarly: true }
    );
    expect(insights.headline).toBe("Practice CAT ended early — focus weak areas");
    expect(insights.headline).not.toMatch(/complete/i);
  });
});
