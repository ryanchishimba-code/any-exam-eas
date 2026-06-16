import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { serveQaPassedBankItems } from "./serve-qa-passed";

const item = (q: string, id?: string): BankItem => ({
  id,
  subjectId: "med-surg",
  question: q,
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Test",
});

describe("serveQaPassedBankItems", () => {
  it("dedupes by id and stem", () => {
    const out = serveQaPassedBankItems(
      [item("Same stem?", "a"), item("Same stem?", "b"), item("Other?")],
      5
    );
    expect(out).toHaveLength(3);
  });

  it("respects limit", () => {
    const out = serveQaPassedBankItems([item("One"), item("Two"), item("Three")], 2);
    expect(out).toHaveLength(2);
  });
});
