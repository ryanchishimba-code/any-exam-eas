import { describe, expect, it } from "vitest";
import { analyzeReportedQuestion } from "./analyzer";

describe("analyzeReportedQuestion", () => {
  it("flags placeholder options and user wrong-answer reports", () => {
    const analysis = analyzeReportedQuestion(
      {
        questionKey: "test-1",
        fieldId: "usmle-step-2",
        reason: "wrong_answer",
        message: "I think B is correct based on UpToDate.",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        stemPreview: "A 45-year-old with chest pain — next step?",
      },
      null
    );

    expect(analysis.issueCodes).toContain("user_wrong_answer");
    expect(analysis.issueCodes).toContain("generic_placeholder_options");
    expect(analysis.proposedFix.changeSummary.length).toBeGreaterThan(0);
    expect(analysis.generationNotes).toContain("BATCH DIVERSITY");
  });
});
