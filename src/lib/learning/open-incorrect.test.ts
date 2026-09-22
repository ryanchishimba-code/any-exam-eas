import { describe, expect, it } from "vitest";
import { countOpenIncorrectItems } from "./open-incorrect";

describe("countOpenIncorrectItems", () => {
  it("counts a miss that has never been answered correctly", () => {
    expect(
      countOpenIncorrectItems([
        { bankItemId: "q1", questionKey: "q1", correct: false },
        { bankItemId: "q2", questionKey: "q2", correct: true },
      ])
    ).toBe(1);
  });

  it("clears an item once any correct attempt is saved", () => {
    expect(
      countOpenIncorrectItems([
        { bankItemId: "q1", questionKey: "q1", correct: false },
        { bankItemId: "q1", questionKey: "q1", correct: true },
      ])
    ).toBe(0);
  });

  it("ignores ephemeral numeric keys that are not bank ids", () => {
    expect(
      countOpenIncorrectItems([{ questionKey: "42", correct: false }])
    ).toBe(0);
  });
});
