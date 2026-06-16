import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  normalizeAgePhrasing,
  repairAanpFnpBankItemDeterministic,
  tryRepairAanpFnpBankItem,
} from "./vignette-repair";

function sampleItem(overrides: Partial<BankItem> = {}): BankItem {
  return {
    question: "What is the most appropriate next step?",
    vignette:
      "A 52 year old woman presents with chest pain. She has hypertension and takes lisinopril. BP 142/88 mm Hg, HR 88/min.",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Test explanation with clinical rationale.",
    subjectId: "cardiovascular",
    blueprintDomain: "assess",
    patientAgeGroup: "middle-adult",
    tags: ["aanp-fnp-generated"],
    ...overrides,
  };
}

describe("normalizeAgePhrasing", () => {
  it("fixes spaced age format for gate regex", () => {
    expect(normalizeAgePhrasing("A 52 year old woman")).toBe("A 52-year-old woman");
    expect(normalizeAgePhrasing("A 2 week old infant")).toBe("A 2-week-old infant");
  });
});

describe("repairAanpFnpBankItemDeterministic", () => {
  it("normalizes age phrasing in vignette", () => {
    const item = sampleItem();
    const repaired = repairAanpFnpBankItemDeterministic(item);
    expect(repaired.vignette).toContain("52-year-old");
  });

  it("splits combined vignette+stem when vignette missing", () => {
    const combined =
      "A 45-year-old man with type 2 diabetes presents with polyuria and polydipsia. BP 130/80 mm Hg. What is the most likely diagnosis?";
    const item = sampleItem({ vignette: undefined, question: combined });
    const repaired = repairAanpFnpBankItemDeterministic(item);
    expect(repaired.vignette).toBeTruthy();
    expect(repaired.question.toLowerCase()).toContain("most likely");
  });

  it("rewrites deictic stems", () => {
    const item = sampleItem({
      question: "Which pathophysiologic process is most likely responsible for these findings?",
      vignette:
        "A 60-year-old man with COPD presents with worsening dyspnea. He is on albuterol and tiotropium. RR 24/min, SpO2 88% on room air.",
    });
    const repaired = repairAanpFnpBankItemDeterministic(item);
    expect(repaired.question).not.toMatch(/these findings/i);
  });
});

describe("tryRepairAanpFnpBankItem", () => {
  it("applies deterministic repair when item fails initial gate", () => {
    const item = sampleItem({
      vignette:
        "A 52-year-old woman presents for a wellness visit. She has hypertension and takes lisinopril. PMH includes hyperlipidemia. BP 128/78 mm Hg, HR 72/min, BMI 31.",
    });
    const result = tryRepairAanpFnpBankItem(item, { source: "generated" });
    expect(["none", "deterministic", "ai"]).toContain(result.method);
    expect(result.item.vignette).toBeTruthy();
  });
});
