import { describe, expect, it } from "vitest";
import { proposeDifficultyChanges, proposedDifficulty } from "./difficulty-calibration";

describe("proposedDifficulty", () => {
  it("leaves thin samples unchanged and bands the rest", () => {
    expect(proposedDifficulty(18, 19)).toBeNull();
    expect(proposedDifficulty(18, 20)).toBe(1);
    expect(proposedDifficulty(14, 20)).toBe(2);
    expect(proposedDifficulty(10, 20)).toBe(3);
    expect(proposedDifficulty(6, 20)).toBe(4);
    expect(proposedDifficulty(2, 20)).toBe(5);
  });

  it("proposes a change only when the band differs", () => {
    expect(
      proposeDifficultyChanges([
        { id: "easy", difficulty: 5, answered: 40, correct: 36 },
        { id: "same", difficulty: 3, answered: 40, correct: 20 },
      ])
    ).toEqual([
      { id: "easy", from: 5, to: 1, answered: 40, correct: 36 },
    ]);
  });
});
