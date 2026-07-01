import { describe, expect, it } from "vitest";
import {
  buildSessionConfig,
  parseFullExamLengthPreset,
  usesCuratedPresetExam,
} from "./config";

describe("buildSessionConfig", () => {
  it("keeps 50/100 sprint counts when a curated preset is also selected", () => {
    expect(
      buildSessionConfig("nclex", "100", false, {
        presetExamNumber: 1,
        presetQuestionCount: 80,
      }).questionCount
    ).toBe(100);

    expect(
      buildSessionConfig("nclex", "50", true, {
        presetExamNumber: 1,
        presetQuestionCount: 80,
      }).questionCount
    ).toBe(50);
  });

  it("uses curated preset count only for full-length mocks", () => {
    expect(
      buildSessionConfig("nclex", "full", true, {
        presetExamNumber: 1,
        presetQuestionCount: 80,
      }).questionCount
    ).toBe(80);

    expect(
      buildSessionConfig("naplex", "full", true, {
        presetExamNumber: 2,
        presetQuestionCount: 85,
      }).questionCount
    ).toBe(85);
  });
});

describe("parseFullExamLengthPreset", () => {
  it("parses sprint and full presets", () => {
    expect(parseFullExamLengthPreset("50")).toBe("50");
    expect(parseFullExamLengthPreset("100q")).toBe("100");
    expect(parseFullExamLengthPreset("full-length")).toBe("full");
    expect(parseFullExamLengthPreset("")).toBe("50");
  });
});

describe("usesCuratedPresetExam", () => {
  it("is true only for full-length selection", () => {
    expect(usesCuratedPresetExam("full")).toBe(true);
    expect(usesCuratedPresetExam("50")).toBe(false);
    expect(usesCuratedPresetExam("100")).toBe(false);
  });
});
