import { describe, expect, it } from "vitest";
import {
  FULL_EXAM_RESULTS_COMPLETE_TITLE,
  FULL_EXAM_RESULTS_ENDED_EARLY_TITLE,
  FULL_EXAM_RESULTS_INCOMPLETE_TITLE,
  countUnansweredExamItems,
  fullExamResultsTitle,
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
