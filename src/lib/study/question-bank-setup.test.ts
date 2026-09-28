import { describe, expect, it } from "vitest";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import { questionBankEmptyLaunch } from "./remediation-launch";
import {
  MIXED_SUBJECT_ID,
  MIXED_TOPIC_STYLE_MESSAGE,
  QUESTION_BANK_WHEEL_PRESETS,
  availablePoolForQuestionBankStyle,
  availableQuestionCount,
  bankStyleHonorsLaunchStyle,
  deliberateFormatForLaunch,
  effectiveQuestionBankStyle,
  preferredQuestionBankStyleParam,
  questionBankCountOptionsForAvailable,
  questionBankStyleAllowed,
  questionBankStyleFromSources,
  resolveQuestionBankStyleAndFormat,
  stylePreservedForPracticeUrl,
  questionBankCountChoices,
  resolveWheelCountValue,
  studyModeForQuestionBankLaunch,
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
    expect(result.message).toBe(MIXED_TOPIC_STYLE_MESSAGE);
    expect(result.message).toMatch(/Review incorrect/);
    expect(result.message).toMatch(/Today/);
  });

  it("allows review incorrect and today on mixed topics", () => {
    for (const bankStyle of ["review_incorrect", "today", "standard"] as const) {
      expect(
        validateQuestionBankSession({
          subjectId: MIXED_SUBJECT_ID,
          questionCount: 25,
          subjectCounts: counts,
          bankStyle,
        }).ok
      ).toBe(true);
      expect(questionBankStyleAllowed(bankStyle, { subjectId: MIXED_SUBJECT_ID })).toBe(true);
    }
    expect(questionBankStyleAllowed("adaptive", { subjectId: MIXED_SUBJECT_ID })).toBe(false);
    expect(questionBankStyleAllowed("weak_areas", { subjectId: MIXED_SUBJECT_ID })).toBe(false);
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

  it("keeps a retest count of 5 on the wheel, in the preview, and on start", () => {
    const presets = questionBankCountOptionsForAvailable(100);
    const choices = questionBankCountChoices({ questionCount: 5, options: presets });
    expect(choices.count).toBe(5);
    expect(choices.options.map((option) => option.value)).toEqual([5, 25, 50, 75]);
    expect(choices.options.find((option) => option.value === 5)?.description).toBe("Focused session");
  });

  it("snaps a non-retest count so the wheel and the session agree", () => {
    const options = questionBankCountOptionsForAvailable(40);
    const choices = questionBankCountChoices({ questionCount: 75, options });
    expect(choices.count).toBe(25);
    expect(choices.options.map((option) => option.value)).toEqual([25]);
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

  it("keeps a daily set on mixed topics and does not let a remembered style replace it", () => {
    expect(preferredQuestionBankStyleParam("adaptive", "daily_set")).toBe("daily_set");
    expect(
      resolveQuestionBankStyleAndFormat({
        styleParam: "daily_set",
        formatParam: "ngn",
        persistedStyle: "adaptive",
        persistedFormat: "ngn",
      })
    ).toEqual({ style: "daily_set", format: "all" });
    expect(
      stylePreservedForPracticeUrl({
        stateStyle: "adaptive",
        browserStyle: "daily_set",
      })
    ).toBe("daily_set");
    expect(bankStyleHonorsLaunchStyle("adaptive", "daily_set")).toBe(false);
    expect(deliberateFormatForLaunch("daily_set", "ngn")).toBeNull();
    expect(
      validateQuestionBankSession({
        subjectId: MIXED_SUBJECT_ID,
        questionCount: 25,
        subjectCounts: counts,
        bankStyle: "daily_set",
      }).ok
    ).toBe(true);
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

  it("labels a review-incorrect launch separately from Adaptive and keeps weak areas", () => {
    expect(
      studyModeForQuestionBankLaunch({
        isTimedExam: false,
        bankStyle: "review_incorrect",
        pace: "untimed",
      })
    ).toBe("review_incorrect");
    expect(
      studyModeForQuestionBankLaunch({
        isTimedExam: false,
        bankStyle: "weak_areas",
        pace: "untimed",
      })
    ).toBe("weak_area");
    expect(
      studyModeForQuestionBankLaunch({
        isTimedExam: false,
        bankStyle: "adaptive",
        pace: "untimed",
      })
    ).toBe("adaptive");
    expect(
      studyModeForQuestionBankLaunch({
        isTimedExam: false,
        bankStyle: "standard",
        pace: "timed",
      })
    ).toBe("timed");
    expect(
      studyModeForQuestionBankLaunch({
        isTimedExam: true,
        bankStyle: "review_incorrect",
        pace: "untimed",
      })
    ).toBe("timed");
  });
});

describe("effective question-bank style", () => {
  const boards = [...EXAM_FIELD_IDS, ...USMLE_FIELD_IDS];

  it("moves adaptive and weak areas to Standard on mixed topics and keeps styles the backend can run", () => {
    expect(effectiveQuestionBankStyle("adaptive", { subjectId: MIXED_SUBJECT_ID })).toBe("standard");
    expect(effectiveQuestionBankStyle("weak_areas", { subjectId: MIXED_SUBJECT_ID })).toBe("standard");
    expect(effectiveQuestionBankStyle("standard", { subjectId: MIXED_SUBJECT_ID })).toBe("standard");
    expect(effectiveQuestionBankStyle("review_incorrect", { subjectId: MIXED_SUBJECT_ID })).toBe(
      "review_incorrect"
    );
    expect(effectiveQuestionBankStyle("today", { subjectId: MIXED_SUBJECT_ID })).toBe("today");
    expect(effectiveQuestionBankStyle("daily_set", { subjectId: MIXED_SUBJECT_ID })).toBe("daily_set");
  });

  it("keeps a valid style when mixed topics changes back to one topic", () => {
    for (const fieldId of boards) {
      const topic = getSubjectsForFieldId(fieldId)[0]?.id;
      expect(topic, fieldId).toBeTruthy();
      expect(effectiveQuestionBankStyle("standard", { subjectId: topic })).toBe("standard");
      expect(effectiveQuestionBankStyle("review_incorrect", { subjectId: topic })).toBe(
        "review_incorrect"
      );
      expect(effectiveQuestionBankStyle("adaptive", { subjectId: topic })).toBe("adaptive");
      expect(effectiveQuestionBankStyle("weak_areas", { subjectId: topic })).toBe("weak_areas");
      expect(effectiveQuestionBankStyle("today", { subjectId: topic })).toBe("today");
    }
  });

  it("uses the same mixed-topic rule on every board", () => {
    for (const fieldId of boards) {
      const topic = getSubjectsForFieldId(fieldId)[0]!.id;
      expect(effectiveQuestionBankStyle("adaptive", { subjectId: MIXED_SUBJECT_ID })).toBe("standard");
      expect(effectiveQuestionBankStyle("weak_areas", { subjectId: MIXED_SUBJECT_ID })).toBe("standard");
      expect(effectiveQuestionBankStyle("review_incorrect", { subjectId: MIXED_SUBJECT_ID })).toBe(
        "review_incorrect"
      );
      expect(questionBankStyleAllowed("adaptive", { subjectId: topic })).toBe(true);
      expect(questionBankStyleAllowed("adaptive", { subjectId: MIXED_SUBJECT_ID })).toBe(false);
    }
  });

  it("applies the topic rule on load, deep links, and restored preferences", () => {
    expect(
      questionBankStyleFromSources({
        styleParam: null,
        persistedStyle: "adaptive",
        subjectId: MIXED_SUBJECT_ID,
      })
    ).toBe("standard");
    expect(
      questionBankStyleFromSources({
        styleParam: null,
        subjectId: MIXED_SUBJECT_ID,
        fallbackStyle: "adaptive",
      })
    ).toBe("standard");
    expect(
      questionBankStyleFromSources({
        styleParam: "adaptive",
        subjectId: MIXED_SUBJECT_ID,
        persistedStyle: "adaptive",
      })
    ).toBe("standard");
    expect(
      questionBankStyleFromSources({
        styleParam: "weak_areas",
        subjectId: MIXED_SUBJECT_ID,
        persistedStyle: "adaptive",
      })
    ).toBe("standard");
    expect(
      questionBankStyleFromSources({
        styleParam: "review_incorrect",
        subjectId: MIXED_SUBJECT_ID,
        persistedStyle: "adaptive",
      })
    ).toBe("review_incorrect");
    expect(
      questionBankStyleFromSources({
        styleParam: "daily_set",
        formatParam: "ngn",
        subjectId: MIXED_SUBJECT_ID,
        persistedStyle: "adaptive",
      })
    ).toBe("daily_set");
    expect(
      questionBankStyleFromSources({
        styleParam: "weak_areas",
        persistedStyle: "adaptive",
        subjectId: "management-of-care",
      })
    ).toBe("weak_areas");
    expect(
      questionBankStyleFromSources({
        styleParam: "adaptive",
        subjectId: "pharmacokinetics",
      })
    ).toBe("adaptive");
  });

  it("forces Standard for a blueprint area and for NGN or case sets", () => {
    expect(
      effectiveQuestionBankStyle("review_incorrect", {
        subjectId: "cardiovascular",
        blueprintArea: true,
      })
    ).toBe("standard");
    expect(
      effectiveQuestionBankStyle("adaptive", {
        subjectId: "management-of-care",
        practiceFormat: "ngn",
      })
    ).toBe("standard");
    expect(
      effectiveQuestionBankStyle("weak_areas", {
        subjectId: "management-of-care",
        practiceFormat: "case",
      })
    ).toBe("weak_areas");
    expect(
      effectiveQuestionBankStyle("weak_areas", {
        subjectId: MIXED_SUBJECT_ID,
        practiceFormat: "ngn",
      })
    ).toBe("standard");
  });

  it("sizes the preview pool from the style the session will run", () => {
    const nclex = { "management-of-care": 4000, "safety-infection": 1489 };
    const naplex = { pharmacokinetics: 800, pharmacology: 1200 };
    expect(
      availablePoolForQuestionBankStyle({
        style: "standard",
        subjectId: MIXED_SUBJECT_ID,
        topicCounts: nclex,
        openRemediationCount: 12,
      })
    ).toBe(5489);
    expect(
      availablePoolForQuestionBankStyle({
        style: "adaptive",
        subjectId: "management-of-care",
        topicCounts: nclex,
      })
    ).toBe(4000);
    expect(
      availablePoolForQuestionBankStyle({
        style: "review_incorrect",
        subjectId: MIXED_SUBJECT_ID,
        topicCounts: nclex,
        openRemediationCount: 12,
      })
    ).toBe(12);
    expect(
      availablePoolForQuestionBankStyle({
        style: "review_incorrect",
        subjectId: MIXED_SUBJECT_ID,
        topicCounts: naplex,
      })
    ).toBeNull();
    expect(
      availablePoolForQuestionBankStyle({
        style: "review_incorrect",
        subjectId: "pharmacokinetics",
        topicCounts: naplex,
        openRemediationCount: 12,
      })
    ).toBe(800);
    expect(
      availablePoolForQuestionBankStyle({
        style: "standard",
        subjectId: MIXED_SUBJECT_ID,
        topicCounts: naplex,
      })
    ).toBe(2000);
    expect(
      availablePoolForQuestionBankStyle({
        style: "today",
        subjectId: MIXED_SUBJECT_ID,
        topicCounts: nclex,
      })
    ).toBeNull();
    expect(
      availablePoolForQuestionBankStyle({
        style: "daily_set",
        subjectId: "cardiovascular",
        topicCounts: { cardiovascular: 90 },
      })
    ).toBeNull();
  });
});
