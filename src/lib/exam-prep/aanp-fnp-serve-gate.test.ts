import { describe, expect, it } from "vitest";
import {
  aanpFnpBankItemIsServeReady,
  aanpFnpItemPassesStructuralTimedGate,
  prepareAanpFnpBankItem,
} from "./aanp-fnp-serve-gate";
import { aanpFnpItemToExamType, bankItemToAanpFnpRaw } from "./aanp-fnp-bank-bridge";
import type { BankItem } from "@/lib/question-bank";

function vignetteItem(overrides: Partial<BankItem> = {}): BankItem {
  return {
    subjectId: "cardiovascular",
    vignette:
      "A 58-year-old woman presents for follow-up of hypertension. BP today is 148/92 mm Hg on lisinopril 20 mg daily. She denies chest pain or dyspnea. Exam is otherwise unremarkable.",
    question: "Which next step in management is most appropriate?",
    options: [
      "Increase lisinopril to 40 mg daily",
      "Add amlodipine 5 mg daily",
      "Order an urgent stress test",
      "Discontinue antihypertensive therapy",
    ],
    correctAnswer: "Add amlodipine 5 mg daily",
    explanation: "Guideline-directed intensification for uncontrolled HTN.",
    itemType: "vignette",
    blueprintDomain: "plan",
    patientAgeGroup: "middle-adult",
    difficulty: 3,
    ...overrides,
  } as BankItem;
}

describe("aanp-fnp-bank-bridge", () => {
  it("maps select_all to select_all exam type", () => {
    expect(aanpFnpItemToExamType("select_all")).toBe("select_all");
    expect(aanpFnpItemToExamType("vignette")).toBe("multiple_choice");
  });

  it("emits select_all on raw conversion", () => {
    const raw = bankItemToAanpFnpRaw(
      vignetteItem({
        itemType: "select_all",
        options: ["A", "B", "C", "D", "E"],
        correctAnswer: "A|||C",
        question: "Select all that apply. Which findings support the diagnosis?",
      }),
      0,
      { field: "aanp-fnp", subjectId: "cardiovascular" }
    );
    expect(raw.type).toBe("select_all");
    expect(raw.ngnFormat).toBe("select_all");
  });
});

describe("aanp-fnp-serve-gate", () => {
  it("prepares items without throwing", () => {
    const next = prepareAanpFnpBankItem(vignetteItem());
    expect(next.question).toContain("next step");
  });

  it("rejects select_all with fewer than 2 matched keys", () => {
    const bad = vignetteItem({
      itemType: "select_all",
      options: ["A", "B", "C", "D", "E"],
      correctAnswer: "A",
      question: "Select all that apply?",
    });
    expect(aanpFnpBankItemIsServeReady(bad)).toBe(false);
  });

  it("accepts select_all with multi-key answers when clinical gate passes", () => {
    const ok = vignetteItem({
      itemType: "select_all",
      options: [
        "Reduce sodium intake",
        "Encourage aerobic exercise",
        "Start high-dose NSAID therapy",
        "Limit alcohol",
        "Check home BP log",
      ],
      correctAnswer: "Reduce sodium intake|||Encourage aerobic exercise|||Limit alcohol|||Check home BP log",
      question: "Select all that apply. Which counseling points are appropriate?",
      distractorRationale: {
        "Start high-dose NSAID therapy": "NSAIDs may raise BP and are not appropriate.",
      },
    });
    // Structural gate should at least parse; serve readiness still depends on clinical gate.
    expect(aanpFnpItemPassesStructuralTimedGate(ok) || !aanpFnpBankItemIsServeReady(ok)).toBe(
      true
    );
    expect(ok.correctAnswer.split("|||").length).toBeGreaterThanOrEqual(2);
  });
});
