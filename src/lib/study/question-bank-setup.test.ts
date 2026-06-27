import { describe, expect, it } from "vitest";
import {
  MIXED_SUBJECT_ID,
  availableQuestionCount,
  validateQuestionBankSession,
} from "./question-bank-setup";

describe("question-bank-setup", () => {
  const counts = { cardio: 40, pulm: 60 };

  it("sums all topics for mixed selection", () => {
    expect(availableQuestionCount(MIXED_SUBJECT_ID, counts)).toBe(100);
  });

  it("returns per-topic count", () => {
    expect(availableQuestionCount("cardio", counts)).toBe(40);
  });

  it("treats empty counts as unknown (not zero)", () => {
    expect(availableQuestionCount("cardio", {})).toBeNull();
    expect(availableQuestionCount("cardio", null)).toBeNull();
  });

  it("allows session when counts are unknown", () => {
    const result = validateQuestionBankSession({
      subjectId: "cardio",
      questionCount: 25,
      subjectCounts: {},
      bankStyle: "standard",
    });
    expect(result.ok).toBe(true);
  });

  it("blocks when count exceeds pool", () => {
    const result = validateQuestionBankSession({
      subjectId: "cardio",
      questionCount: 50,
      subjectCounts: counts,
      bankStyle: "standard",
    });
    expect(result.ok).toBe(false);
    expect(result.maxAvailable).toBe(40);
  });

  it("allows valid standard session", () => {
    const result = validateQuestionBankSession({
      subjectId: "cardio",
      questionCount: 25,
      subjectCounts: counts,
      bankStyle: "standard",
    });
    expect(result.ok).toBe(true);
  });

  it("blocks adaptive with mixed topics", () => {
    const result = validateQuestionBankSession({
      subjectId: MIXED_SUBJECT_ID,
      questionCount: 25,
      subjectCounts: counts,
      bankStyle: "adaptive",
    });
    expect(result.ok).toBe(false);
  });
});
