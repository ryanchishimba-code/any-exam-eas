import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { bankItemPassesIngestGate } from "./bank-ingest-gate";

function item(
  partial: Partial<BankItem> & Pick<BankItem, "question" | "options" | "correctAnswer" | "explanation">
): BankItem {
  return { subjectId: "cardiology", ...partial };
}

describe("bankItemPassesIngestGate", () => {
  it("rejects generic placeholder answer choices", () => {
    expect(
      bankItemPassesIngestGate(
        "usmle-step-2",
        item({
          question:
            "A 58-year-old man with crushing substernal chest pain and ST elevation in inferior leads. Which diagnosis is most likely?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "Inferior ST elevation with chest pain indicates acute inferior MI.",
          vignette:
            "A 58-year-old man presents with crushing substernal chest pain for 45 minutes. BP 156/92, HR 98.",
        }),
        "seed"
      )
    ).toBe(false);
  });

  it("rejects items that fail shared editorial audit", () => {
    expect(
      bankItemPassesIngestGate(
        "usmle-step-2",
        item({
          question: "Too short?",
          options: ["One", "Two", "Three", "Four"],
          correctAnswer: "One",
          explanation: "Short.",
        }),
        "seed"
      )
    ).toBe(false);
  });
});
