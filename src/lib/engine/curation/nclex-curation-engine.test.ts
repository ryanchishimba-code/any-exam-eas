import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  triageNclexBankItem,
  validateCuratedBankItem,
} from "@/lib/engine/curation/nclex-curation-engine";

function item(partial: Partial<BankItem>): BankItem {
  return {
    subjectId: "med-surg",
    question: "Which action should the nurse take first?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because A is correct for this scenario with adequate detail.",
    ...partial,
  };
}

describe("nclex-curation-engine", () => {
  it("flags weak prioritization templates for polish", () => {
    const triage = triageNclexBankItem(
      item({
        question:
          "NCLEX 12: Four clients are assigned. Which client should be assessed first?",
        options: [
          "Unstable airway, breathing, or circulation related to prioritization",
          "Stable client requesting discharge teaching only",
          "Client with scheduled routine screening in 2 weeks",
          "Client with chronic stable pain rated 2/10",
        ],
        correctAnswer: "Unstable airway, breathing, or circulation related to prioritization",
      })
    );
    expect(triage.needsPolish).toBe(true);
    expect(triage.qualityScore).toBeLessThan(0.55);
  });

  it("passes validation for coherent curated-style item", () => {
    const good = item({
      vignette:
        "Medical-surgical unit. A 68-year-old woman with sepsis. BP 88/54, HR 118, lactate 3.8, altered mental status.",
      question: "Which action should the nurse take first?",
      options: [
        "Obtain blood cultures then administer antibiotics per protocol",
        "Insert urinary catheter for culture",
        "Apply oxygen at 4 L/min only",
        "Administer IV bolus without notifying provider",
      ],
      correctAnswer: "Obtain blood cultures then administer antibiotics per protocol",
      explanation:
        "Sepsis with organ dysfunction requires cultures before antibiotics when it will not delay treatment. Clinical Judgment: recognize shock cues, prioritize infection control.",
    });
    const validation = validateCuratedBankItem(good, 0.62);
    expect(validation.ok).toBe(true);
    expect(validation.score).toBeGreaterThan(0.62);
  });

  it("rejects correctAnswer not in options", () => {
    const bad = item({
      vignette: "A 40-year-old client with asthma and wheezing.",
      options: ["Notify provider", "Document finding", "Delegate to UAP", "Reassure client"],
      correctAnswer: "Administer bronchodilator per protocol",
    });
    const validation = validateCuratedBankItem(bad, 0.5);
    expect(validation.ok).toBe(false);
    expect(validation.issues.some((i) => i.includes("correctAnswer"))).toBe(true);
  });

  it("flags editorial warn codes for polish", () => {
    const triage = triageNclexBankItem(
      item({
        vignette:
          "Medical-surgical unit. A 68-year-old woman with sepsis. BP 88/54, HR 118, lactate 3.8, altered mental status.",
        question:
          "Medical-surgical unit. A 68-year-old woman with sepsis. BP 88/54, HR 118, lactate 3.8, altered mental status. Which action should the nurse take first?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
      })
    );
    expect(triage.needsPolish).toBe(true);
    expect(triage.editorialWarnCodes).toContain("duplicate_vignette_in_stem");
  });
});
