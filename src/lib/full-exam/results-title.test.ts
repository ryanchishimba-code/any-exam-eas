import { describe, expect, it } from "vitest";
import {
  FULL_EXAM_RESULTS_COMPLETE_TITLE,
  FULL_EXAM_RESULTS_ENDED_EARLY_TITLE,
  FULL_EXAM_RESULTS_INCOMPLETE_TITLE,
  countUnansweredExamItems,
  fullExamResultsTitle,
  resolveFullExamResultsTitle,
  summarySaysEndedEarly,
} from "@/lib/full-exam/results-title";

describe("full exam results title", () => {
  it("does not call an early-ended simulation complete", () => {
    expect(
      fullExamResultsTitle({
        endedEarly: true,
        unanswered: 50,
      })
    ).toBe(FULL_EXAM_RESULTS_ENDED_EARLY_TITLE);
    expect(FULL_EXAM_RESULTS_ENDED_EARLY_TITLE).not.toMatch(/complete/i);
  });

  it("keeps Exam complete when every item was answered and submitted", () => {
    expect(fullExamResultsTitle({ endedEarly: false, unanswered: 0 })).toBe(
      FULL_EXAM_RESULTS_COMPLETE_TITLE
    );
  });

  it("labels a submitted set with blanks as an incomplete simulation", () => {
    expect(fullExamResultsTitle({ endedEarly: false, unanswered: 3 })).toBe(
      FULL_EXAM_RESULTS_INCOMPLETE_TITLE
    );
  });

  it("trusts the early-end summary when status is completed and the log looks finished", () => {
    const summary = "Session ended early. Your saved answers were scored.";
    expect(summarySaysEndedEarly(summary)).toBe(true);
    expect(
      fullExamResultsTitle({
        endedEarly: false,
        unanswered: 0,
        summary,
      })
    ).toBe(FULL_EXAM_RESULTS_ENDED_EARLY_TITLE);
    expect(summarySaysEndedEarly("Completed NCLEX-RN simulation.")).toBe(false);
  });

  it("uses the early summary for a 0-of-50 sprint even when endedEarly is false", () => {
    const summary = "Session ended early. Your saved answers were scored.";
    const title = resolveFullExamResultsTitle({
      endedEarly: false,
      analysisEndedEarly: false,
      summary,
      answeredCount: 0,
      questionCount: 50,
      answers: [],
    });
    expect(title).toBe(FULL_EXAM_RESULTS_ENDED_EARLY_TITLE);
    expect(title === FULL_EXAM_RESULTS_COMPLETE_TITLE && summarySaysEndedEarly(summary)).toBe(
      false
    );
  });

  it("counts blank and missing selections as unanswered", () => {
    expect(
      countUnansweredExamItems(4, [
        { questionIndex: 0, selected: "A" },
        { questionIndex: 1, selected: "  " },
        { questionIndex: 2, selected: "" },
      ])
    ).toBe(3);
  });
});
