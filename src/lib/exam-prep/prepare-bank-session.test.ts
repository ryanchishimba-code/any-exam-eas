import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";

vi.mock("./serve-qa-passed", () => ({
  serveQaPassedBankItems: vi.fn((items: BankItem[], limit: number) => items.slice(0, limit)),
}));

import { prepareBankItemsForSession } from "./prepare-bank-session";
import { serveQaPassedBankItems } from "./serve-qa-passed";

const row = (id: string): BankItem => ({
  id,
  subjectId: "med-surg",
  question: `Question ${id}?`,
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Test",
});

describe("prepareBankItemsForSession", () => {
  it("skipRuntimeGate slices without re-running diverse selection", () => {
    const pool = [row("1"), row("2"), row("3"), row("4"), row("5")];
    const out = prepareBankItemsForSession({
      fieldId: "nursing",
      field: "nursing",
      items: pool,
      limit: 3,
      skipRuntimeGate: true,
    });

    expect(out).toHaveLength(3);
    expect(out.map((i) => i.id)).toEqual(["1", "2", "3"]);
    expect(serveQaPassedBankItems).not.toHaveBeenCalled();
  });
});
