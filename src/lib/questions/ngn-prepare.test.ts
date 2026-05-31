import { describe, expect, it } from "vitest";
import { examQuestionToStudy, isAnswerCorrect } from "./prepare";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";

describe("NGN question preparation", () => {
  it("prepares bow-tie with action and monitor pools", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[0], 0);
    expect(q.type).toBe("bow_tie");
    expect(q.options.length).toBeGreaterThan(4);
    expect(q.correctAnswers).toHaveLength(3);
  });

  it("grades bow-tie selections", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[0], 0);
    expect(isAnswerCorrect(q, q.correctAnswers)).toBe(true);
    expect(isAnswerCorrect(q, [q.correctAnswers[0]])).toBe(false);
  });

  it("prepares matrix with cell keys", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[1], 0);
    expect(q.type).toBe("matrix");
    expect(q.options[0]).toContain("|||");
    expect(isAnswerCorrect(q, q.correctAnswers)).toBe(true);
  });

  it("prepares unfolding case as MCQ step", () => {
    const q = examQuestionToStudy(NGN_DEMO_QUESTIONS[2], 0);
    expect(q.type).toBe("unfolding_case");
    expect(q.caseStep).toBe(1);
    expect(isAnswerCorrect(q, [q.correctAnswers[0]])).toBe(true);
  });
});
