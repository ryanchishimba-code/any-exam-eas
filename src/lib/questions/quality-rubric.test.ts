import { describe, expect, it } from "vitest";
import { BENCHMARK_QUESTIONS, getBenchmarkRatings } from "./benchmark-samples";
import { rateQuestionQuality } from "./quality-rubric";

describe("quality-rubric", () => {
  it("rates benchmark questions as board-ready", () => {
    for (const item of BENCHMARK_QUESTIONS) {
      const rating = rateQuestionQuality(item);
      expect(rating.overall).toBeGreaterThanOrEqual(7);
      expect(rating.needsImprovement).toBe(false);
    }
  });

  it("flags weak placeholder distractors", () => {
    const rating = rateQuestionQuality({
      question: "Test?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "Short.",
    });
    expect(rating.overall).toBeLessThan(7);
    expect(rating.weakCriteria).toContain("distractorQuality");
  });

  it("benchmark ratings helper returns all samples", () => {
    expect(getBenchmarkRatings()).toHaveLength(BENCHMARK_QUESTIONS.length);
  });
});
