import { describe, expect, it } from "vitest";
import { questionBankEmptyLaunch } from "./remediation-launch";
import {
  MIXED_SUBJECT_ID,
  QUESTION_BANK_WHEEL_PRESETS,
  availableQuestionCount,
  bankStyleHonorsLaunchStyle,
  deliberateFormatForLaunch,
  preferredQuestionBankStyleParam,
  questionBankCountOptionsForAvailable,
  resolveQuestionBankStyleAndFormat,
  stylePreservedForPracticeUrl,
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

  it("allows short retest counts when the pool can fill them", () => {
    const result = validateQuestionBankSession({
      subjectId: "pulm",
      questionCount: 10,
      subjectCounts: counts,
      bankStyle: "standard",
    });
    expect(result.ok).toBe(true);
  });

  it("blocks non-wheel non-retest counts when pool is known", () => {
    const result = validateQuestionBankSession({
      subjectId: "pulm",
      questionCount: 15,
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

  it("preserves closed-loop retest session counts", () => {
    expect(resolveQuestionBankSessionCount(5, 40)).toBe(5);
    expect(resolveQuestionBankSessionCount(10, 40)).toBe(10);
    expect(resolveQuestionBankSessionCount(5, 3)).toBe(25); // pool too small → wheel
  });

  it("keeps a weak-areas deep link when a remembered NGN format would otherwise snap to Standard", () => {
    // Positive eligibility skips the empty notice and reaches this setup.
    expect(questionBankEmptyLaunch("weak_areas", 2)).toBeNull();
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "weak_areas",
        formatParam: null,
        persistedStyle: "standard",
        persistedFormat: "ngn",
      })
    ).toEqual({ style: "weak_areas", format: "all" });
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "weak_areas",
        formatParam: "ngn",
        persistedFormat: "case",
      })
    ).toEqual({ style: "weak_areas", format: "all" });
    // Launch stays a weak-area set, not an NGN/case fetch.
    expect(deliberateFormatForLaunch("weak_areas", "ngn")).toBeNull();
    expect(deliberateFormatForLaunch("weak_areas", "case")).toBeNull();
    expect(deliberateFormatForLaunch("weak_areas", "all")).toBeNull();
  });

  it("URL weak_areas and review_incorrect beat a remembered Adaptive style", () => {
    expect(
      preferredQuestionBankStyleParam("adaptive", "weak_areas")
    ).toBe("weak_areas");
    expect(
      preferredQuestionBankStyleParam("adaptive", "review_incorrect")
    ).toBe("review_incorrect");
    // Address bar already rewritten to Adaptive, hook still has the deep link.
    expect(preferredQuestionBankStyleParam("weak_areas", "adaptive")).toBe("weak_areas");
    expect(preferredQuestionBankStyleParam(null, "weak_areas")).toBe("weak_areas");
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "weak_areas",
        formatParam: null,
        persistedStyle: "adaptive",
        persistedFormat: "all",
      })
    ).toEqual({ style: "weak_areas", format: "all" });
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "review_incorrect",
        formatParam: null,
        persistedStyle: "adaptive",
        persistedFormat: "ngn",
      })
    ).toEqual({ style: "review_incorrect", format: "all" });
    expect(
      stylePreservedForPracticeUrl({
        stateStyle: "adaptive",
        browserStyle: "weak_areas",
      })
    ).toBe("weak_areas");
    expect(
      stylePreservedForPracticeUrl({
        stateStyle: "adaptive",
        browserStyle: "review_incorrect",
      })
    ).toBe("review_incorrect");
    expect(
      stylePreservedForPracticeUrl({
        stateStyle: "adaptive",
        overrideStyle: "standard",
        browserStyle: "weak_areas",
      })
    ).toBe("standard");
    // Hydrated Weak areas must not be copied back out as Adaptive.
    expect(
      stylePreservedForPracticeUrl({
        stateStyle: "weak_areas",
        browserStyle: "adaptive",
      })
    ).toBe("weak_areas");
    expect(bankStyleHonorsLaunchStyle("adaptive", "weak_areas")).toBe(false);
    expect(bankStyleHonorsLaunchStyle("weak_areas", "weak_areas")).toBe(true);
    expect(bankStyleHonorsLaunchStyle("adaptive", "review_incorrect")).toBe(false);
    expect(bankStyleHonorsLaunchStyle("review_incorrect", "review_incorrect")).toBe(true);
    expect(bankStyleHonorsLaunchStyle("adaptive", null)).toBe(true);
    expect(deliberateFormatForLaunch("review_incorrect", "ngn")).toBeNull();
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "review_incorrect",
        formatParam: "ngn",
        persistedStyle: "adaptive",
      })
    ).toEqual({ style: "review_incorrect", format: "all" });
    expect(questionBankEmptyLaunch("weak_areas", 0)).toBe("weak_areas");
  });

  it("leaves today and a remembered NGN set on their existing format rule when the URL has no remediation style", () => {
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "today",
        formatParam: null,
        persistedFormat: "case",
      })
    ).toEqual({ style: "today", format: "case" });
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: null,
        formatParam: null,
        persistedStyle: "standard",
        persistedFormat: "ngn",
      })
    ).toEqual({ style: "standard", format: "ngn" });
    expect(deliberateFormatForLaunch("standard", "ngn")).toBe("ngn");
    expect(deliberateFormatForLaunch("adaptive", "case")).toBe("case");
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: null,
        formatParam: null,
      })
    ).toEqual({ style: null, format: null });
  });
});
