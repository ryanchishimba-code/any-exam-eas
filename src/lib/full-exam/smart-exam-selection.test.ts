import { describe, expect, it } from "vitest";
import { preferUnseenBankItems, preferPremiumBankItems } from "./smart-exam-selection";
import type { BankItem } from "@/lib/question-bank";

function item(id: string): BankItem {
  return {
    id,
    subjectId: "pharmacology",
    question: `Q ${id}`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because",
  } as BankItem;
}

describe("preferUnseenBankItems", () => {
  it("prefers unseen items then tops up from seen", () => {
    const pool = [item("a"), item("b"), item("c"), item("d")];
    const exclude = new Set(["a", "b"]);
    const { items, excludeSeenApplied } = preferUnseenBankItems(pool, exclude, 3);
    expect(items.map((i) => i.id)).toEqual(["c", "d", "a"]);
    expect(excludeSeenApplied).toBe(true);
  });

  it("returns full slice when nothing to exclude", () => {
    const pool = [item("a"), item("b")];
    const { items, excludeSeenApplied } = preferUnseenBankItems(pool, new Set(), 2);
    expect(items).toHaveLength(2);
    expect(excludeSeenApplied).toBe(false);
  });

  it("dedupes by id", () => {
    const pool = [item("a"), item("a"), item("b")];
    const { items } = preferUnseenBankItems(pool, undefined, 2);
    expect(items.map((i) => i.id)).toEqual(["a", "b"]);
  });
});

describe("preferPremiumBankItems", () => {
  it("ranks expert + NGN ahead of plain vignettes", () => {
    const pool = [
      { ...item("v"), itemType: "vignette" },
      { ...item("e"), itemType: "vignette", expertRationale: { whyCorrect: { headline: "x".repeat(24) } } as never },
      { ...item("n"), itemType: "ngn_bowtie" },
    ];
    const ranked = preferPremiumBankItems(pool as never);
    expect(ranked.map((i) => i.id)).toEqual(["e", "n", "v"]);
  });
});
