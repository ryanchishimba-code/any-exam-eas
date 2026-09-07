import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { gatherTimedExamBankItems } from "./timed-exam-sampling";

vi.mock("@/lib/exam-prep/gather-progressive-bank-pool", () => ({
  gatherProgressiveBankPool: vi.fn(),
}));

vi.mock("@/lib/exam-prep/usmle/progressive-exam-fill", () => ({
  gatherUsmleTimedExamBankItems: vi.fn(),
}));

import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { gatherUsmleTimedExamBankItems } from "@/lib/exam-prep/usmle/progressive-exam-fill";

function item(id: string): BankItem {
  return {
    id,
    subjectId: "med-surg",
    question: `Question ${id}?`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Rationale long enough for board serve quality checks.",
    tags: ["pass"],
  };
}

describe("gatherTimedExamBankItems", () => {
  it("uses progressive pool with full ladder for non-USMLE fields", async () => {
    const mockGather = vi.mocked(gatherProgressiveBankPool);
    mockGather.mockResolvedValue([
      item("1"),
      item("2"),
      item("3"),
      item("4"),
      item("5"),
    ]);

    const result = await gatherTimedExamBankItems({
      fieldId: "nursing",
      limit: 5,
      filterFn: () => true,
      initialSampleCount: 4,
    });

    expect(result).toHaveLength(5);
    expect(mockGather).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldId: "nursing",
        limit: 5,
        maxTierIndex: expect.any(Number),
      })
    );
    const call = mockGather.mock.calls[0]![0]!;
    expect(call.maxTierIndex).toBeGreaterThan(0);
  });

  it("delegates USMLE fields to progressive USMLE gather", async () => {
    const mockUsmle = vi.mocked(gatherUsmleTimedExamBankItems);
    mockUsmle.mockResolvedValue([item("u1"), item("u2"), item("u3")]);

    const result = await gatherTimedExamBankItems({
      fieldId: "usmle-step-2",
      limit: 3,
      filterFn: () => true,
      initialSampleCount: 4,
    });

    expect(result).toHaveLength(3);
    expect(mockUsmle).toHaveBeenCalled();
  });
});
