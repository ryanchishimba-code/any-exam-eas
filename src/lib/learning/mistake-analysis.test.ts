import { describe, expect, it } from "vitest";
import { analyzeMistake } from "./mistake-analysis";
import type { StudyQuestion } from "@/lib/questions/types";

const baseQuestion: StudyQuestion = {
  id: "q-1",
  sourceIndex: 1,
  type: "multiple_choice",
  stem: "Calculate the dose in mg/kg for a 70 kg patient.",
  options: ["A", "B", "C", "D"],
  correctAnswers: ["B"],
  explanation: "Use weight-based dosing.",
  tags: ["pharmacology"],
};

describe("analyzeMistake", () => {
  it("classifies calculation stems", () => {
    const result = analyzeMistake({
      userId: "u1",
      question: baseQuestion,
      correct: false,
      fieldId: "medicine",
      durationMs: 8000,
    });
    expect(result.category).toBe("calculation_error");
  });

  it("flags overconfidence on high confidence misses", () => {
    const result = analyzeMistake({
      userId: "u1",
      question: { ...baseQuestion, stem: "What is the first-line therapy?" },
      correct: false,
      confidence: 5,
      fieldId: "medicine",
    });
    expect(result.guessedCorrect).toBe(true);
    expect(result.category).toBe("overconfidence");
  });
});
