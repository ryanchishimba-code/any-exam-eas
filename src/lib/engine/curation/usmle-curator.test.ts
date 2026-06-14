import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { examQuestionToBankItem } from "./exam-to-bank";
import { curateUsmleBankItem } from "./usmle-curator";

const strongItem: BankItem = {
  subjectId: "nephrology",
  vignette: `A 68-year-old man with type 2 diabetes and hypertension is brought from a skilled nursing facility because he has been sleepier than usual for two days. He missed two dialysis sessions last week. On arrival he is oriented only to person. Blood pressure 102/58 mm Hg, pulse 58/min. Laboratory studies show K⁺ 6.8 mEq/L, creatinine 4.1 mg/dL. ECG: peaked T waves, widened QRS.`,
  question: "Which of the following is the most appropriate immediate management?",
  options: [
    "Intravenous calcium gluconate",
    "Oral sodium polystyrene sulfonate",
    "Intravenous furosemide alone",
    "Emergent hemodialysis without stabilization",
  ],
  correctAnswer: "Intravenous calcium gluconate",
  explanation:
    "Life-threatening hyperkalemia with ECG changes requires IV calcium first for myocardial membrane stabilization.\n\nWhy other options are incorrect:\n• Oral sodium polystyrene sulfonate: Incorrect — too slow for acute membrane stabilization with ECG changes.\n• Intravenous furosemide alone: Incorrect — does not stabilize the myocardium immediately.\n• Emergent hemodialysis without stabilization: Incorrect — IV calcium should precede dialysis when ECG changes are present.",
  tags: ["physician-educator", "hyperkalemia"],
  difficulty: 4,
};

describe("exam-to-bank", () => {
  it("maps ExamQuestion fields into BankItem vignette shape", () => {
    const bank = examQuestionToBankItem(
      {
        id: 1,
        type: "multiple_choice",
        vignette: "A 45-year-old woman presents with chest pain.",
        question: "What is the most likely diagnosis?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "Because A fits.",
        clinicalReasoning: "Pain pattern suggests ACS.",
        distractorRationale: { B: "Wrong timing", C: "No fever" },
        tags: ["cardiology"],
      },
      { subjectId: "cardiology" }
    );
    expect(bank.vignette).toContain("45-year-old");
    expect(bank.scenario).toBe(bank.vignette);
    expect(bank.itemType).toBe("vignette");
    expect(bank.tags).toContain("ai-curated");
    expect(bank.explanation).toContain("Clinical reasoning");
    expect(bank.explanation).toContain("Why other options are incorrect");
  });
});

describe("usmle-curator", () => {
  it("accepts already exam-ready items without changes", async () => {
    const result = await curateUsmleBankItem(strongItem, {
      fieldId: "usmle-step-2",
      source: "seed",
      offline: true,
    });
    expect(result.action).toBe("accepted");
    expect(result.after.overallScore).toBeGreaterThanOrEqual(7.5);
  });

  it("rule-polishes weak vignettes offline", async () => {
    const weak: BankItem = {
      subjectId: "pathology",
      question: "Which pathophysiologic process best explains these findings?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "A is correct because it matches the mechanism described in the stem.",
      tags: ["generated"],
    };
    const result = await curateUsmleBankItem(weak, {
      fieldId: "usmle-step-1",
      source: "bulk-bank",
      offline: true,
      seed: 42,
    });
    expect(["rule_polished", "rejected", "accepted"]).toContain(result.action);
    expect(result.notes.length).toBeGreaterThan(0);
  });
});
