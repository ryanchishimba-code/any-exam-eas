import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect, prepareQuestionsForSession } from "./prepare";
import type { RawQuestionInput } from "./types";

const sample: RawQuestionInput = {
  id: 1,
  type: "multiple_choice",
  question: "Case: Which ion drives the Na/K pump?",
  options: ["Sodium", "Potassium", "Calcium", "Chloride"],
  correctAnswer: "Sodium",
  explanation: "ATPase pumps 3 Na+ out for 2 K+ in.",
};

describe("examQuestionToStudy", () => {
  it("normalizes stem and shuffles options while preserving correct answer", () => {
    const q = examQuestionToStudy(sample, 0);
    expect(q.stem).not.toMatch(/^case:/i);
    expect(q.options).toHaveLength(4);
    expect(q.correctAnswers).toHaveLength(1);
    const correct = q.correctAnswers[0];
    expect(q.options).toContain(correct);
  });
});

describe("isAnswerCorrect", () => {
  it("matches answers case-insensitively", () => {
    const q = examQuestionToStudy(sample, 0);
    const correct = q.correctAnswers[0];
    expect(isAnswerCorrect(q, [correct])).toBe(true);
    expect(isAnswerCorrect(q, ["wrong"])).toBe(false);
  });
});

describe("prepareQuestionsForSession", () => {
  it("can preserve order when shuffleOrder is false", () => {
    const items = [sample, { ...sample, id: 2, question: "Second question?" }];
    const ordered = prepareQuestionsForSession(items, { shuffleOrder: false });
    expect(ordered).toHaveLength(2);
    expect(ordered[0].sourceIndex).toBe(1);
    expect(ordered[1].sourceIndex).toBe(2);
  });
});
