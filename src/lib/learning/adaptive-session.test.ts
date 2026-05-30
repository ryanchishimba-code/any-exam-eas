import { describe, expect, it } from "vitest";
import {
  computeOverallAccuracy,
  questionTopicKey,
  recommendDifficulty,
  selectAdaptiveQuestions,
  type TopicPerformance,
} from "./adaptive-session";
import type { StudyQuestion } from "@/lib/questions/types";

function q(
  id: string,
  topic: string,
  difficulty?: string
): StudyQuestion {
  return {
    id,
    sourceIndex: 1,
    type: "multiple_choice",
    stem: `Question about ${topic}`,
    options: ["A", "B", "C", "D"],
    correctAnswers: ["A"],
    explanation: "Because.",
    tags: [topic],
    bankItemId: id,
    difficulty,
  };
}

describe("selectAdaptiveQuestions", () => {
  const pool = [
    ...Array.from({ length: 5 }, (_, i) => q(`cardio-${i}`, "cardiology")),
    ...Array.from({ length: 5 }, (_, i) => q(`renal-${i}`, "renal")),
    ...Array.from({ length: 5 }, (_, i) => q(`pulm-${i}`, "pulmonary")),
  ];

  const performance: TopicPerformance[] = [
    { topic: "cardiology", attempts: 10, accuracy: 0.4 },
    { topic: "renal", attempts: 8, accuracy: 0.9 },
    { topic: "pulmonary", attempts: 0, accuracy: 0 },
  ];

  it("allocates more questions to weak topics", () => {
    const result = selectAdaptiveQuestions({
      questions: pool,
      topicPerformance: performance,
      currentDifficulty: "medium",
      count: 9,
    });

    const cardioCount = result.questions.filter(
      (x) => questionTopicKey(x) === "cardiology"
    ).length;
    const renalCount = result.questions.filter(
      (x) => questionTopicKey(x) === "renal"
    ).length;

    expect(cardioCount).toBeGreaterThan(renalCount);
    expect(result.questions).toHaveLength(9);
  });

  it("increases difficulty when accuracy is high", () => {
    const highPerf: TopicPerformance[] = [
      { topic: "cardiology", attempts: 10, accuracy: 0.92 },
      { topic: "renal", attempts: 10, accuracy: 0.88 },
    ];
    const result = selectAdaptiveQuestions({
      questions: pool,
      topicPerformance: highPerf,
      currentDifficulty: "medium",
      count: 6,
    });
    expect(result.recommendedDifficulty).toBe("hard");
  });

  it("decreases difficulty when accuracy is low", () => {
    const lowPerf: TopicPerformance[] = [
      { topic: "cardiology", attempts: 10, accuracy: 0.3 },
      { topic: "renal", attempts: 10, accuracy: 0.35 },
    ];
    const result = selectAdaptiveQuestions({
      questions: pool,
      topicPerformance: lowPerf,
      currentDifficulty: "medium",
      count: 6,
    });
    expect(result.recommendedDifficulty).toBe("easy");
  });

  it("includes multiple topics for balance", () => {
    const result = selectAdaptiveQuestions({
      questions: pool,
      topicPerformance: performance,
      currentDifficulty: "medium",
      count: 9,
    });
    const topics = new Set(result.questions.map(questionTopicKey));
    expect(topics.size).toBeGreaterThanOrEqual(2);
  });
});

describe("computeOverallAccuracy", () => {
  it("returns weighted average", () => {
    const acc = computeOverallAccuracy([
      { topic: "a", attempts: 10, accuracy: 0.8 },
      { topic: "b", attempts: 10, accuracy: 0.6 },
    ]);
    expect(acc).toBeCloseTo(0.7);
  });
});

describe("recommendDifficulty", () => {
  it("holds medium in mid range", () => {
    expect(recommendDifficulty("medium", 0.65)).toBe("medium");
  });
});
