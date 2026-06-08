import { describe, expect, it } from "vitest";
import { EXAM_MODES, getExamMode, clampQuestionBankCount, parseQuestionBankPace } from "./modes";
import {
  getExamQuestionCount,
  getExamQuestionCountBySlug,
  getTimedExamQuestionCount,
  resolveTimedExamLimit,
} from "./exam-lengths";

describe("exam modes", () => {
  it("exposes only timed exam and question bank", () => {
    const ids = EXAM_MODES.map((m) => m.id);
    expect(ids).toEqual(["timed", "bank"]);
    expect(ids).not.toContain("tutor");
    expect(ids).not.toContain("research");
    expect(ids).not.toContain("final");
  });

  it("maps timed mode to timed study session", () => {
    const timed = getExamMode("timed");
    expect(timed?.studyMode).toBe("timed");
    expect(timed?.sessionMode).toBe("timed");
  });

  it("maps bank mode to practice study session", () => {
    const bank = getExamMode("bank");
    expect(bank?.studyMode).toBe("practice");
    expect(bank?.sessionMode).toBe("bank");
  });

  it("returns undefined for unknown mode", () => {
    expect(getExamMode("invalid" as "timed")).toBeUndefined();
  });

  it("clamps question bank counts between 5 and 100", () => {
    expect(clampQuestionBankCount(3)).toBe(5);
    expect(clampQuestionBankCount(25)).toBe(25);
    expect(clampQuestionBankCount(150)).toBe(100);
    expect(clampQuestionBankCount(Number.NaN)).toBe(25);
  });

  it("parses question bank pace", () => {
    expect(parseQuestionBankPace("timed")).toBe("timed");
    expect(parseQuestionBankPace("untimed")).toBe("untimed");
    expect(parseQuestionBankPace(null)).toBe("untimed");
  });
});

describe("exam lengths", () => {
  it("uses NCLEX 85 minimum and 150 maximum for timed exam", () => {
    expect(getTimedExamQuestionCount("nursing")).toBe(85);
    expect(getTimedExamQuestionCount("nursing", { nclexLength: "maximum" })).toBe(150);
    expect(getExamQuestionCount("nursing", "timed")).toBe(85);
    expect(resolveTimedExamLimit("nursing", undefined, "maximum")).toBe(150);
    expect(resolveTimedExamLimit("nursing", 85)).toBe(85);
    expect(resolveTimedExamLimit("nursing", 150)).toBe(150);
    expect(resolveTimedExamLimit("nursing", 99)).toBe(85);
    expect(resolveTimedExamLimit("nursing", 50)).toBe(50);
    expect(resolveTimedExamLimit("nursing", 100)).toBe(100);
  });

  it("honors sprint presets for non-NCLEX boards", () => {
    expect(resolveTimedExamLimit("usmle-step-2", 50)).toBe(50);
    expect(resolveTimedExamLimit("usmle-step-2", 100)).toBe(100);
    expect(resolveTimedExamLimit("usmle-step-2", 280)).toBe(280);
    expect(resolveTimedExamLimit("pharmacy", 50)).toBe(50);
    expect(resolveTimedExamLimit("mpje", 100)).toBe(100);
    expect(resolveTimedExamLimit("mpje", 99)).toBe(120);
  });

  it("uses 280 for USMLE, 225 for NAPLEX, and 120 for MPJE", () => {
    expect(getTimedExamQuestionCount("usmle-step-1")).toBe(280);
    expect(getTimedExamQuestionCount("pharmacy")).toBe(225);
    expect(getTimedExamQuestionCount("mpje")).toBe(120);
    expect(getExamQuestionCountBySlug("usmle")).toBe(280);
    expect(getExamQuestionCountBySlug("naplex")).toBe(225);
    expect(getExamQuestionCountBySlug("mpje")).toBe(120);
    expect(getExamQuestionCountBySlug("nclex", "maximum")).toBe(150);
  });
});
