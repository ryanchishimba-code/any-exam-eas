import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNclexBankItem } from "./nclex-bank-audit";

function item(partial: Partial<BankItem>): BankItem {
  return {
    id: "test-1",
    fieldId: "nursing",
    subjectId: "med-surg",
    type: "mcq",
    difficulty: "medium",
    question: "Which action should the nurse take first?",
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
    explanation: "Because first action.",
    tags: ["test"],
    ...partial,
  };
}

describe("auditNclexBankItem", () => {
  it("flags stable delegation with unstable vitals", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "An 8-year-old boy with moderate persistent asthma is stable after initial assessment. SpO2 90%, peak flow 45% of personal best, retractions noted.",
        question: "Which task is appropriate to delegate to the UAP?",
      }),
    );
    expect(result.issues.some((i) => i.code === "stable_unstable_mismatch")).toBe(true);
  });

  it("flags delegation stem with handoff vignette", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "During shift handoff, the outgoing nurse reports a client with chest pain and diaphoresis.",
        question: "Which task is appropriate to delegate to the UAP?",
      }),
    );
    expect(result.issues.some((i) => i.code === "delegation_handoff_mismatch")).toBe(true);
  });

  it("flags pediatric age mismatch in vignette", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "Pediatric unit. An 18-year-old man with moderate persistent asthma is stable after initial assessment.",
        question: "Which action should the nurse take first?",
      }),
    );
    expect(result.issues.some((i) => i.code === "pediatric_age_mismatch")).toBe(true);
  });

  it("flags finding stem with action-only options", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "A 19-year-old man is admitted with suicidal ideation and a written goodbye note in the bedside drawer.",
        question: "Which finding requires immediate nursing follow-up?",
        options: [
          "Notify the provider immediately and reassess blood pressure",
          "Document the finding and recheck in 4 hours",
          "Delegate reassessment to UAP",
          "Reassure the client that the finding is expected",
        ],
        correctAnswer: "Notify the provider immediately and reassess blood pressure",
      })
    );
    expect(result.issues.some((i) => i.code === "stem_option_category_mismatch")).toBe(true);
  });

  it("passes a coherent delegation item", () => {
    const result = auditNclexBankItem(
      item({
        vignette:
          "A 62-year-old woman recovering from hip replacement is stable after initial assessment. She uses a walker and needs assistance with ambulation.",
        question: "Which task is appropriate to delegate to the UAP?",
        options: [
          "Assist with ambulation using a gait belt",
          "Administer PRN opioid",
          "Assess lung sounds",
          "Titrate IV fluids",
        ],
        correctAnswer: "Assist with ambulation using a gait belt",
      }),
    );
    expect(result.ok).toBe(true);
  });
});
