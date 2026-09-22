import { describe, expect, it } from "vitest";
import {
  draftsFromSession,
  partitionNewSessionAttempts,
  sessionReceiptLinks,
  summarizeAttemptDrafts,
} from "./session-attempt-plan";

describe("session attempt plan", () => {
  it("includes revealed answers even when confidence was skipped", () => {
    const drafts = draftsFromSession(
      {
        answers: {
          "1": { revealed: true, correct: false, selected: ["A"] },
          "2": { revealed: true, correct: true, selected: ["B"], confidence: 4 },
          "3": { revealed: false, correct: null, selected: ["C"] },
        },
      },
      [
        {
          id: "1",
          bankItemId: "bank-1",
          subjectId: "management-of-care",
          stem: "First stem",
          type: "multiple_choice",
        },
        {
          id: "2",
          bankItemId: "bank-2",
          subjectId: "management-of-care",
          stem: "Second stem",
        },
        {
          id: "3",
          bankItemId: "bank-3",
          subjectId: "management-of-care",
          stem: "Unanswered",
        },
      ]
    );

    expect(drafts.map((draft) => draft.questionKey)).toEqual(["bank-1", "bank-2"]);
    expect(drafts[0]?.confidence).toBeUndefined();
    expect(drafts[0]?.correct).toBe(false);
  });

  it("counts each answered item once and keeps accuracy on a duplicate end", () => {
    const drafts = Array.from({ length: 20 }, (_, index) => ({
      questionKey: `q${index}`,
      subjectId: "management-of-care",
      correct: index < 12,
    }));

    const first = partitionNewSessionAttempts([], drafts);
    expect(first.fresh).toHaveLength(20);
    expect(first.alreadySaved).toBe(0);
    expect(summarizeAttemptDrafts(first.fresh)).toMatchObject({
      answered: 20,
      correct: 12,
      accuracy: 60,
    });
    expect(summarizeAttemptDrafts(first.fresh).weakTopics[0]?.id).toBe(
      "subject:management-of-care"
    );

    const second = partitionNewSessionAttempts(
      first.fresh.map((draft) => draft.questionKey),
      drafts
    );
    expect(second.fresh).toHaveLength(0);
    expect(second.alreadySaved).toBe(20);
    expect(summarizeAttemptDrafts(second.fresh).answered).toBe(0);
  });

  it("links the receipt at the same field analytics reads", () => {
    expect(sessionReceiptLinks("nursing", "management-of-care")).toEqual({
      reviewIncorrectHref:
        "/question-bank?mode=bank&field=nursing&style=review_incorrect&count=25&pace=untimed&subjectId=management-of-care",
      analyticsHref: "/analytics",
    });
  });
});
