import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { gatherTimedExamBankItems } from "./timed-exam-sampling";

vi.mock("@/lib/question-bank-db", () => ({
  QUESTION_BANK_SAMPLE_MAX_PULL: 500,
  sampleQuestionBankItemsForField: vi.fn(),
  shuffleBankItems: <T,>(items: T[]) => items,
  dedupeBankItemsById: <T extends { id?: string }>(items: T[]) => items,
  bankItemDedupeKey: (item: BankItem) =>
    item.id?.trim() || `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`,
}));

import { sampleQuestionBankItemsForField } from "@/lib/question-bank-db";

function item(id: string, pass: boolean): BankItem {
  return {
    id,
    subjectId: "med-surg",
    question: `Question ${id}?`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Rationale.",
    tags: pass ? ["pass"] : ["fail"],
  };
}

describe("gatherTimedExamBankItems", () => {
  it("accumulates vetted rows across multiple pulls until the limit is met", async () => {
    const mockSample = vi.mocked(sampleQuestionBankItemsForField);
    mockSample
      .mockResolvedValueOnce([
        item("1", true),
        item("2", false),
        item("3", true),
        item("4", false),
      ])
      .mockResolvedValueOnce([
        item("1", true),
        item("5", true),
        item("6", true),
        item("7", true),
      ]);

    const result = await gatherTimedExamBankItems({
      fieldId: "nursing",
      limit: 5,
      filterFn: (row) => row.tags?.includes("pass") ?? false,
      initialSampleCount: 4,
    });

    expect(result).toHaveLength(5);
    expect(mockSample).toHaveBeenCalledTimes(2);
  });
});
