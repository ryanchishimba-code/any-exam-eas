import { describe, expect, it } from "vitest";
import {
  CROSS_EXAM_COMPARISON,
  CROSS_EXAM_SUMMARY,
} from "./cross-exam-comparison";

describe("cross-exam comparison", () => {
  it("covers all six AnyExamEasy board exams", () => {
    expect(CROSS_EXAM_COMPARISON).toHaveLength(6);
    const ids = CROSS_EXAM_COMPARISON.map((row) => row.id);
    expect(ids).toContain("npte-pt");
    expect(ids).toContain("nclex");
    expect(ids).toContain("usmle");
  });

  it("lists NPTE-PT as 250 questions with FSBPT blueprint axis", () => {
    const npte = CROSS_EXAM_COMPARISON.find((row) => row.id === "npte-pt");
    expect(npte?.questions).toContain("250");
    expect(npte?.blueprintAxis).toMatch(/FSBPT/i);
    expect(npte?.keyDifferentiator).toMatch(/MSK|neuro/i);
  });

  it("provides marketing summary for landing copy", () => {
    expect(CROSS_EXAM_SUMMARY.examCount).toBe(6);
    expect(CROSS_EXAM_SUMMARY.sharedPlatform).toContain("subscription");
  });

  it("each exam has prep href and accent color", () => {
    for (const row of CROSS_EXAM_COMPARISON) {
      expect(row.prepHref).toMatch(/^\//);
      expect(row.accent).toBeTruthy();
      expect(row.duration.length).toBeGreaterThan(0);
    }
  });
});
