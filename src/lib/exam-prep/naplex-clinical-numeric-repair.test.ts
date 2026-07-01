import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
  itemHasFormatCoherenceIssue,
} from "./naplex-format-coherence";
import { repairClinicalNumericMismatch } from "./naplex-clinical-numeric-repair";

describe("naplex clinical numeric repair", () => {
  it("rewrites albuterol counseling vignette with dose-only options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 10-year-old boy with asthma is prescribed albuterol for acute wheezing episodes. His mother asks about the proper dosing and how to use the inhaler correctly.",
      question: "Which counseling point is most important?",
      options: ["2 mg", "4 mg", "6 mg", "8 mg"],
      correctAnswer: "4 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/.test(o))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("reclassifies tablet-count items to a dispense calculation stem", () => {
    const item: BankItem = {
      subjectId: "medication-dispensing",
      vignette:
        "A 65-year-old female presents to the pharmacy with a prescription for amoxicillin 500 mg three times daily for 10 days for community-acquired pneumonia.",
      question: "Which laboratory value warrants a therapeutic change?",
      options: ["20 tablets", "30 tablets", "40 tablets", "50 tablets"],
      correctAnswer: "30 tablets",
      explanation:
        "The correct answer is 30 tablets. The prescribed dose is 500 mg three times daily for 10 days, which totals 15,000 mg.",
      itemType: "vignette",
    };

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/tablets should be dispensed/i);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("integrates with fixNaplexFormatCoherence", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 10-year-old boy with asthma is prescribed albuterol for acute wheezing episodes. His mother asks about the proper dosing and how to use the inhaler correctly.",
      question: "Which counseling point is most important?",
      options: ["2 mg", "4 mg", "6 mg", "8 mg"],
      correctAnswer: "4 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    const { item: fixed } = fixNaplexFormatCoherence(item);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });
});
