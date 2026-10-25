import { describe, expect, it } from "vitest";
import { buildStudyCompletionResult } from "./compute-study-completion";
import {
  formatCountMore,
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

function allMetMetrics() {
  return {
    liveBankCount: 100,
    distinctBankItemsAttempted: 100,
    fastAttemptsExcluded: 0,
    fullLengthExamsCompleted: 10,
    readinessChecksCompleted: 1,
    quickBitesCompleted: 5,
    quickBitesTotal: 5,
    studyGuideChaptersCompleted: 10,
    studyGuideChaptersTotal: 10,
  };
}

describe("formatCountMore", () => {
  it("uses singular phrasing for one remaining", () => {
    expect(formatCountMore(1, "full-length exam", "full-length exams")).toBe(
      "1 more full-length exam"
    );
    expect(formatCountMore(1, "readiness check", "readiness checks")).toBe("1 more readiness check");
    expect(formatCountMore(1, "Quick Bite", "Quick Bites")).toBe("1 more Quick Bite");
    expect(formatCountMore(1, "study guide chapter", "study guide chapters")).toBe(
      "1 more study guide chapter"
    );
    expect(formatCountMore(1, "unique question", "unique questions")).toBe("1 more unique question");
  });

  it("uses plural phrasing for two or more remaining", () => {
    expect(formatCountMore(2, "full-length exam", "full-length exams")).toBe(
      "2 more full-length exams"
    );
    expect(formatCountMore(2, "Quick Bite", "Quick Bites")).toBe("2 more Quick Bites");
  });
});

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
      target: 10,
      met: false,
    });
  });
});

describe("studyProgressMicrocopy", () => {
  it("uses the defined progress bands", () => {
    expect(studyProgressMicrocopy(0)).toBe("Great start!");
    expect(studyProgressMicrocopy(24)).toBe("Great start!");
    expect(studyProgressMicrocopy(25)).toBe("Nice momentum!");
    expect(studyProgressMicrocopy(49)).toBe("Nice momentum!");
    expect(studyProgressMicrocopy(50)).toBe("Halfway there!");
    expect(studyProgressMicrocopy(74)).toBe("Halfway there!");
    expect(studyProgressMicrocopy(75)).toBe("Almost there!");
    expect(studyProgressMicrocopy(99)).toBe("Almost there!");
    expect(studyProgressMicrocopy(100)).toBe("All done. Nice work!");
    expect(studyProgressMicrocopy(55)).not.toMatch(/pass/i);
  });
});

describe("studyProgressNextStep", () => {
  it("prioritizes unanswered unique questions with singular copy", () => {
    const data = buildStudyCompletionResult("nclex", {
      ...baseMetrics,
      distinctBankItemsAttempted: 849,
      liveBankCount: 1000,
    });
    const step = studyProgressNextStep(data);
    expect(step.href).toContain("question-bank");
    expect(step.label).toBe("Next: answer 1 more unique question →");
  });

  it("pluralizes full-length exams when more than one remain", () => {
    const data = buildStudyCompletionResult("nclex", {
      ...baseMetrics,
      distinctBankItemsAttempted: 850,
      quickBitesCompleted: 10,
      quickBitesTotal: 10,
      studyGuideChaptersCompleted: 20,
      studyGuideChaptersTotal: 20,
      fullLengthExamsCompleted: 1,
    });
    const step = studyProgressNextStep(data);
    expect(step.label).toBe("Next: complete 9 more full-length exams →");
  });

  it("links Quick Bites on the dashboard for NAPLEX with singular copy", () => {
    const data = buildStudyCompletionResult("naplex", {
      ...baseMetrics,
      distinctBankItemsAttempted: 900,
      quickBitesCompleted: 9,
      quickBitesTotal: 10,
    });
    const step = studyProgressNextStep(data);
    expect(step.label).toBe("Next: finish 1 more Quick Bite →");
    expect(step.href).toContain("#video-quick-bites-pharmacy");
  });

  it("uses Today’s plan when every pillar is met", () => {
    const data = buildStudyCompletionResult("nclex", allMetMetrics());
    const step = studyProgressNextStep(data);
    expect(step.label).toBe("Next: keep going in Today’s plan →");
  });
});
