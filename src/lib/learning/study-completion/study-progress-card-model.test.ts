import { describe, expect, it } from "vitest";
import { buildStudyCompletionResult } from "./compute-study-completion";
import {
  studyProgressCardRows,
  studyProgressMicrocopy,
  studyProgressNextStep,
} from "./study-progress-card-model";

const baseMetrics = {
  liveBankCount: 1000,
  distinctBankItemsAttempted: 50,
  fastAttemptsExcluded: 0,
  fullLengthExamsCompleted: 3,
  readinessChecksCompleted: 0,
  quickBitesCompleted: 2,
  quickBitesTotal: 10,
  studyGuideChaptersCompleted: 1,
  studyGuideChaptersTotal: 20,
};

describe("studyProgressCardRows", () => {
  it("orders rows and caps displayed done at the target", () => {
    const data = buildStudyCompletionResult("nclex", baseMetrics);
    const rows = studyProgressCardRows(data);
    expect(rows.map((row) => row.id)).toEqual([
      "unique_question_coverage",
      "full_length_exams",
      "quick_bites",
      "study_guide_chapters",
      "readiness_checks",
    ]);
    expect(rows.find((row) => row.id === "full_length_exams")).toMatchObject({
      done: 3,
      target: 3,
      met: true,
    });
  });
});

describe("studyProgressMicrocopy", () => {
  it("returns upbeat lines without exam promises", () => {
    expect(studyProgressMicrocopy(5)).toBe("Great start!");
    expect(studyProgressMicrocopy(55)).toBe("Halfway there!");
    expect(studyProgressMicrocopy(92)).toBe("Almost there!");
    expect(studyProgressMicrocopy(55)).not.toMatch(/pass/i);
  });
});

describe("studyProgressNextStep", () => {
  it("prioritizes unanswered unique questions", () => {
    const data = buildStudyCompletionResult("nclex", baseMetrics);
    const step = studyProgressNextStep(data);
    expect(step.href).toContain("question-bank");
    expect(step.label).toMatch(/unique questions/i);
  });

  it("links Quick Bites on the dashboard for NAPLEX", () => {
    const data = buildStudyCompletionResult("naplex", {
      ...baseMetrics,
      distinctBankItemsAttempted: 900,
      quickBitesCompleted: 1,
    });
    const step = studyProgressNextStep(data);
    expect(step.label).toMatch(/Quick Bites/i);
    expect(step.href).toContain("#video-quick-bites-pharmacy");
  });
});
