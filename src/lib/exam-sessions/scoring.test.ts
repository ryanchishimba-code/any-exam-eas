import { describe, expect, it } from "vitest";
import {
  calculateExamScorePercent,
  countCorrectAnswers,
  countScoredExamAnswers,
  mergeExamAnswers,
} from "./scoring";
import type { ExamAnswerRecord } from "./service";

function answer(
  index: number,
  correct: boolean,
  selected = "A"
): ExamAnswerRecord {
  return {
    questionIndex: index,
    selected,
    correct,
    answeredAt: new Date().toISOString(),
  };
}

describe("mergeExamAnswers", () => {
  it("appends new answer", () => {
    const merged = mergeExamAnswers([], answer(0, true));
    expect(merged).toHaveLength(1);
  });

  it("replaces answer at same index", () => {
    const first = mergeExamAnswers([], answer(0, false, "wrong"));
    const second = mergeExamAnswers(first, answer(0, true, "right"));
    expect(second).toHaveLength(1);
    expect(second[0].correct).toBe(true);
    expect(second[0].selected).toBe("right");
  });
});

describe("calculateExamScorePercent", () => {
  it("returns 0 for empty exam", () => {
    expect(calculateExamScorePercent([], 10)).toBe(0);
  });

  it("computes 50% for half correct", () => {
    const answers = [answer(0, true), answer(1, false)];
    expect(calculateExamScorePercent(answers, 2)).toBe(50);
  });

  it("uses totalQuestions as denominator not answer count", () => {
    const answers = [answer(0, true)];
    expect(calculateExamScorePercent(answers, 4)).toBe(25);
  });

  it("rounds to nearest percent", () => {
    const answers = [answer(0, true), answer(1, true), answer(2, false)];
    expect(calculateExamScorePercent(answers, 3)).toBe(67);
  });
});

describe("countCorrectAnswers", () => {
  it("counts only correct flags", () => {
    expect(
      countCorrectAnswers([answer(0, true), answer(1, false), answer(2, true)])
    ).toBe(2);
  });
});

describe("countScoredExamAnswers", () => {
  it("counts scored rows and skips blanks", () => {
    expect(countScoredExamAnswers(null)).toBeNull();
    expect(
      countScoredExamAnswers([
        { questionIndex: 0, questionId: "a", selected: "A", correct: true, answeredAt: "" },
        { questionIndex: 1, questionId: "b", selected: "  ", correct: false, answeredAt: "" },
        { questionIndex: 2, questionId: "a", selected: "C", correct: false, answeredAt: "" },
        { questionIndex: 3, selected: "D", correct: true, answeredAt: "" },
      ])
    ).toBe(2);
  });
});
