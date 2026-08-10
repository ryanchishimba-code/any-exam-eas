import { describe, expect, it } from "vitest";
import {
  MIXED_SUBJECT_ID,
  QUESTION_BANK_WHEEL_PRESETS,
  availableQuestionCount,
  questionBankCountOptionsForAvailable,
  resolveWheelCountValue,
  resolveQuestionBankSessionCount,
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

  it("blocks task-area focus with non-standard selection", () => {
    const result = validateQuestionBankSession({
      subjectId: "cardio",
      questionCount: 25,
      subjectCounts: counts,
      bankStyle: "adaptive",
      taskCategory: "diagnosis",
    });
    expect(result.ok).toBe(false);
  });

  it("allows task-area focus with standard selection", () => {
    const result = validateQuestionBankSession({
      subjectId: MIXED_SUBJECT_ID,
      questionCount: 25,
      subjectCounts: counts,
      bankStyle: "standard",
      taskCategory: "diagnosis",
    });
    expect(result.ok).toBe(true);
  });

  it("limits wheel options to 25 / 50 / 75 presets within topic pool", () => {
    expect(questionBankCountOptionsForAvailable(6).map((o) => o.value)).toEqual([]);
    expect(questionBankCountOptionsForAvailable(24).map((o) => o.value)).toEqual([]);
    expect(questionBankCountOptionsForAvailable(40).map((o) => o.value)).toEqual([25]);
    expect(questionBankCountOptionsForAvailable(100).map((o) => o.value)).toEqual([25, 50, 75]);
    expect(questionBankCountOptionsForAvailable(null).map((o) => o.value)).toEqual([
      ...QUESTION_BANK_WHEEL_PRESETS,
    ]);
  });

  it("snaps wheel value to nearest allowed preset", () => {
    const options = questionBankCountOptionsForAvailable(40);
    expect(resolveWheelCountValue(75, options)).toBe(25);
    expect(resolveWheelCountValue(25, options)).toBe(25);
  });

  it("suggests Mixed topics when a thin topic cannot fill 25Q", () => {
    const result = validateQuestionBankSession({
      subjectId: "cardio",
      questionCount: 25,
      subjectCounts: { cardio: 12, pulm: 60 },
      bankStyle: "standard",
    });
    expect(result.ok).toBe(false);
    expect(result.suggestMixed).toBe(true);
    expect(result.message).toMatch(/Mixed topics/i);
  });

  it("does not suggest Mixed when already on Mixed", () => {
    const result = validateQuestionBankSession({
      subjectId: MIXED_SUBJECT_ID,
      questionCount: 25,
      subjectCounts: { cardio: 10, pulm: 10 },
      bankStyle: "standard",
    });
    expect(result.ok).toBe(false);
    expect(result.suggestMixed).toBeFalsy();
  });

  it("blocks non-wheel counts when pool is known", () => {
    const result = validateQuestionBankSession({
      subjectId: "pulm",
      questionCount: 10,
      subjectCounts: counts,
      bankStyle: "standard",
    });
    expect(result.ok).toBe(false);
  });

  it("resolves session count to wheel presets", () => {
    expect(resolveQuestionBankSessionCount(40)).toBe(25);
    expect(resolveQuestionBankSessionCount(40, 40)).toBe(25);
    expect(resolveQuestionBankSessionCount(60)).toBe(50);
  });
});
