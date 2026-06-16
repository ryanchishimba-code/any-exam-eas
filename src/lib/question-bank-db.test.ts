import { describe, expect, it } from "vitest";
import { dedupeBankItemsById, dedupeBankItemsByStem, shuffleBankItems } from "./question-bank-db";
import type { BankItem } from "./question-bank";

function item(stem: string, id = stem): BankItem {
  return {
    id,
    subjectId: "test",
    question: stem,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because.",
  };
}

describe("dedupeBankItemsByStem", () => {
  it("keeps first item per normalized stem", () => {
    const out = dedupeBankItemsByStem([
      item("Same stem?", "a"),
      item("  same stem?  ", "b"),
      item("Other", "c"),
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe("a");
    expect(out[1].id).toBe("c");
  });
});

describe("dedupeBankItemsById", () => {
  it("keeps distinct bank rows even when stems match (NGN matrix sets)", () => {
    const out = dedupeBankItemsById([
      item("Match each finding to the column.", "a"),
      item("Match each finding to the column.", "b"),
      item("Other stem", "c"),
    ]);
    expect(out).toHaveLength(3);
  });
});

describe("shuffleBankItems", () => {
  it("returns same length and elements", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffleBankItems(input);
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual(input);
  });
});
