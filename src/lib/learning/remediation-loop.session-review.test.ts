import { describe, expect, it } from "vitest";
import { missedIdsForExamSession, reviewIncorrectHref } from "./remediation-loop";

describe("exam-scoped review incorrect", () => {
  it("links a results page to that sitting and lists only its misses", () => {
    const href = reviewIncorrectHref("nursing", null, 11, "cmuw952wefn5yavdl");
    expect(href).toContain("examSessionId=cmuw952wefn5yavdl");
    expect(href).toContain("count=11");
    expect(href).toContain("style=review_incorrect");

    const ids = missedIdsForExamSession(
      [
        { questionIndex: 0, questionId: "miss-1", correct: false },
        { questionIndex: 1, questionId: "hit-1", correct: true },
        { questionIndex: 2, questionId: "miss-2", correct: false },
        { questionIndex: 3, correct: false },
        { questionIndex: 4, questionId: "miss-1", correct: false },
      ],
      ["pre-0", "pre-1", "pre-2", "pre-3", "pre-4"]
    );
    expect(ids).toEqual(["pre-0", "pre-2", "pre-3", "pre-4"]);
  });

  it("prefers the prefetched id at the index when a sibling shares the same stem family", () => {
    const ids = missedIdsForExamSession(
      [{ questionIndex: 1, questionId: "metoprolol-sibling-wrong", correct: false }],
      ["naplex-metoprolol-a", "naplex-metoprolol-b"]
    );
    expect(ids).toEqual(["naplex-metoprolol-b"]);
  });
});
