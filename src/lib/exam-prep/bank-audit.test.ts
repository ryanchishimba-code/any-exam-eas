import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "./bank-audit";

function item(partial: Partial<BankItem> & Pick<BankItem, "question" | "options" | "correctAnswer" | "explanation">): BankItem {
  return {
    subjectId: "med-surg",
    ...partial,
  };
}

describe("auditBankItem", () => {
  it("flags priority hypoxemia with BP-only correct answer", () => {
    const report = auditBankItem(
      item({
        scenario:
          "Medical-surgical unit, Room 307. A 69-year-old man with COPD exacerbation. BP 148/86 mmHg, HR 104, RR 32, SpO₂ 86% on 2 L nasal cannula. Use of accessory muscles, speaking in short phrases.",
        question: "Which assessment finding should the nurse address first?",
        options: [
          "Notify the provider immediately and reassess bp 148/86 mmhg; prepare for urgent intervention related to use of accessory muscles",
          "Delegate reassessment to UAP without RN follow-up on abnormal data",
          "Document the finding and recheck at the next routine vital sign round in 4 hours",
          "Reassure the client that the finding is expected and requires no further action",
        ],
        correctAnswer:
          "Notify the provider immediately and reassess bp 148/86 mmhg; prepare for urgent intervention related to use of accessory muscles",
        explanation:
          "Hypoxemia and increased work of breathing require immediate respiratory intervention; reassess oxygen delivery and notify the provider.",
      }),
      "nursing"
    );
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.code === "priority_hypoxemia_mismatch")).toBe(true);
  });

  it("passes valid four-option MCQ", () => {
    const report = auditBankItem(
      item({
        question: "Which lab value best indicates dehydration in this client?",
        options: ["Sodium 142 mEq/L", "BUN 28 mg/dL", "Potassium 4.0 mEq/L", "Creatinine 0.9 mg/dL"],
        correctAnswer: "BUN 28 mg/dL",
        explanation: "Elevated BUN with clinical context supports dehydration assessment among these choices.",
      }),
      "pharmacy"
    );
    expect(report.ok).toBe(true);
  });
});
