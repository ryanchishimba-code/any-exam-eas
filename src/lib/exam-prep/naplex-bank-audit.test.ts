import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNaplexBankItem } from "./naplex-bank-audit";

function item(partial: Partial<BankItem>): BankItem {
  return {
    subjectId: "pharmacology",
    question: "Which monitoring parameter is most appropriate?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation:
      "Correct: serum potassium — ACE inhibitors require renal and electrolyte monitoring after initiation per guidelines.",
    tags: ["test"],
    ...partial,
  };
}

describe("auditNaplexBankItem", () => {
  it("flags weak template correct answers", () => {
    const result = auditNaplexBankItem(
      item({
        correctAnswer: "Counsel on adherence, adverse effects, and monitoring for cardiovascular pharmacotherapy",
      })
    );
    expect(result.issues.some((i) => i.code === "weak_naplex_correct")).toBe(true);
  });

  it("flags legacy NAPLEX prefix stems", () => {
    const result = auditNaplexBankItem(
      item({
        question: "NAPLEX 12: Which counseling point is most important?",
      })
    );
    expect(result.issues.some((i) => i.code === "naplex_numbered_prefix")).toBe(true);
  });

  it("accepts polished NAPLEX lead-ins (Which … most essential / standard applies)", () => {
    expect(
      auditNaplexBankItem(
        item({
          question: "Which counseling point is most essential before the patient leaves the pharmacy?",
        })
      ).issues.some((i) => i.code === "naplex_stem_lead_in")
    ).toBe(false);

    expect(
      auditNaplexBankItem(
        item({
          question: "Which professional practice standard applies before dispensing?",
        })
      ).issues.some((i) => i.code === "naplex_stem_lead_in")
    ).toBe(false);
  });

  it("passes a strong pharmacy item", () => {
    const result = auditNaplexBankItem(
      item({
        vignette:
          "A 64-year-old man with hypertension (BP 158/92 mmHg, creatinine 1.1 mg/dL) receives lisinopril.",
        question: "Which monitoring parameter is most appropriate after initiation?",
        options: [
          "Serum potassium and creatinine within 1–2 weeks",
          "Daily fasting glucose only",
          "INR every 3 days",
          "No laboratory monitoring",
        ],
        correctAnswer: "Serum potassium and creatinine within 1–2 weeks",
        explanation:
          "Correct: serum potassium and creatinine — lisinopril is an ACE inhibitor; renal function and hyperkalemia risk require monitoring after initiation per guidelines.",
      })
    );
    expect(result.ok).toBe(true);
  });
});
