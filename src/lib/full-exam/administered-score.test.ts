import { describe, expect, it } from "vitest";
import {
  administeredQuestionCount,
  practiceResultsTotals,
  practiceScorePercent,
} from "@/lib/full-exam/administered-score";

describe("full exam score denominator", () => {
  it("scores a CAT confidence stop over items delivered, not the 150 pool", () => {
    const administered = administeredQuestionCount({
      plannedCount: 150,
      snapshotCount: 91,
      answers: Array.from({ length: 91 }, (_, questionIndex) => ({ questionIndex })),
    });
    expect(administered).toBe(91);
    expect(practiceScorePercent(80, administered)).toBe(88);
    expect(practiceScorePercent(80, 150)).toBe(53);
  });

  it("scores a second CAT stop the same way", () => {
    const administered = administeredQuestionCount({
      plannedCount: 150,
      snapshotCount: 87,
      answers: Array.from({ length: 87 }, (_, questionIndex) => ({ questionIndex })),
    });
    expect(practiceScorePercent(78, administered)).toBe(90);
    expect(practiceScorePercent(78, 150)).toBe(52);
  });

  it("scores a fully completed form over every item", () => {
    const administered = administeredQuestionCount({
      plannedCount: 150,
      snapshotCount: 150,
      answers: Array.from({ length: 150 }, (_, questionIndex) => ({ questionIndex })),
    });
    expect(administered).toBe(150);
    expect(practiceScorePercent(120, administered)).toBe(80);
  });

  it("scores an early-ended fixed form over items the student answered", () => {
    const answers = Array.from({ length: 86 }, (_, questionIndex) => ({
      questionIndex,
      selected: questionIndex < 74 ? "250" : "0",
    }));
    const totals = practiceResultsTotals({ delivered: 225, answers, cat: false });
    expect(totals).toMatchObject({ delivered: 225, answered: 86, denominator: 86 });
    expect(practiceScorePercent(74, totals.denominator)).toBe(86);
    expect(practiceScorePercent(74, totals.delivered)).toBe(33);
  });

  it("scores a CAT the student stopped before the engine did over items they were given", () => {
    const administered = administeredQuestionCount({
      plannedCount: 150,
      snapshotCount: 40,
      answers: Array.from({ length: 40 }, (_, questionIndex) => ({ questionIndex })),
    });
    expect(administered).toBe(40);
    expect(practiceScorePercent(30, administered)).toBe(75);
    expect(practiceScorePercent(30, 150)).toBe(20);
  });
});
