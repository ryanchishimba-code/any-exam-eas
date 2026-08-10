import { describe, expect, it } from "vitest";
import {
  buildSessionConfig,
  parseFullExamLengthPreset,
  resolveLengthPresetFromQuestionCount,
} from "./config";
import { EXAM_SLUGS } from "@/lib/edtech/exams";

describe("buildSessionConfig", () => {
  it("uses length wheel counts for 50/100 sprints on every board", () => {
    for (const slug of EXAM_SLUGS) {
      expect(buildSessionConfig(slug, "100", false).questionCount).toBe(100);
      expect(buildSessionConfig(slug, "100", true).adaptive).toBe(false);
      expect(buildSessionConfig(slug, "50", true).questionCount).toBe(50);
      expect(buildSessionConfig(slug, "50", true).adaptive).toBe(false);
    }
  });

  it("uses catalog full-length counts for full mocks", () => {
    expect(buildSessionConfig("nclex", "full", true).questionCount).toBe(85);
    expect(buildSessionConfig("naplex", "full", true).questionCount).toBe(225);
    expect(buildSessionConfig("pance", "full", true).questionCount).toBe(300);
    expect(buildSessionConfig("aanp-fnp", "full", true).questionCount).toBe(135);
    expect(buildSessionConfig("npte-pt", "full", true).questionCount).toBe(250);
    expect(buildSessionConfig("usmle", "full", true).questionCount).toBe(280);
    expect(
      buildSessionConfig("usmle", "full", true, { fieldId: "usmle-step-3" }).questionCount
    ).toBe(200);
  });

  it("enables adaptive mix for full-length non-NCLEX exams", () => {
    expect(buildSessionConfig("naplex", "full", true).adaptive).toBe(true);
    expect(buildSessionConfig("nclex", "full", true).adaptive).toBe(false);
  });

  it("enables NCLEX CAT adaptive when nclexCat is set", () => {
    expect(buildSessionConfig("nclex", "full", true, { nclexCat: true }).adaptive).toBe(true);
    expect(buildSessionConfig("nclex", "full", true, { nclexCat: true }).nclexCat).toBe(true);
  });

  it("prefeches CAT_MAX pool when nclexCat is set (supports early stop)", () => {
    expect(buildSessionConfig("nclex", "full", true, { nclexCat: true }).questionCount).toBe(145);
    expect(
      buildSessionConfig("nclex", "full", true, { nclexCat: true, nclexLength: "maximum" })
        .questionCount
    ).toBe(145);
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

describe("resolveLengthPresetFromQuestionCount", () => {
  it("maps sprint counts for every board", () => {
    for (const slug of EXAM_SLUGS) {
      expect(resolveLengthPresetFromQuestionCount(slug, 50)).toBe("50");
      expect(resolveLengthPresetFromQuestionCount(slug, 100)).toBe("100");
    }
  });

  it("maps full-length counts per catalog", () => {
    expect(resolveLengthPresetFromQuestionCount("naplex", 225)).toBe("full");
    expect(resolveLengthPresetFromQuestionCount("pance", 300)).toBe("full");
    expect(resolveLengthPresetFromQuestionCount("nclex", 85)).toBe("full");
    expect(resolveLengthPresetFromQuestionCount("nclex", 150, { nclexLength: "maximum" })).toBe(
      "full"
    );
  });
});
