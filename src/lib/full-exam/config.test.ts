import { describe, expect, it } from "vitest";
import { buildSessionConfig, parseFullExamLengthPreset } from "./config";

describe("buildSessionConfig", () => {
  it("uses length wheel counts for 50/100 sprints", () => {
    expect(buildSessionConfig("nclex", "100", false).questionCount).toBe(100);
    expect(buildSessionConfig("nclex", "50", true).questionCount).toBe(50);
    expect(buildSessionConfig("naplex", "100", true).questionCount).toBe(100);
    expect(buildSessionConfig("naplex", "50", true).questionCount).toBe(50);
  });

  it("uses catalog full-length counts for full mocks", () => {
    expect(buildSessionConfig("nclex", "full", true).questionCount).toBe(85);
    expect(buildSessionConfig("naplex", "full", true).questionCount).toBe(225);
    expect(buildSessionConfig("pance", "full", true).questionCount).toBe(300);
  });

  it("enables adaptive mix for full-length non-NCLEX exams", () => {
    expect(buildSessionConfig("naplex", "full", true).adaptive).toBe(true);
    expect(buildSessionConfig("nclex", "full", true).adaptive).toBe(false);
  });

  it("enables NCLEX CAT adaptive when nclexCat is set", () => {
    expect(buildSessionConfig("nclex", "full", true, { nclexCat: true }).adaptive).toBe(true);
    expect(buildSessionConfig("nclex", "full", true, { nclexCat: true }).nclexCat).toBe(true);
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
