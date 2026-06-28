import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "./bank-audit";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
  itemHasFormatCoherenceIssue,
} from "./naplex-format-coherence";

const base: BankItem = {
  subjectId: "cardiovascular-rx",
  scenario:
    "A 40-year-old male with a history of hypertension presents to the emergency department with severe headache and blurred vision. His blood pressure is 210/120 mmHg. He is currently taking amlodipine and lisinopril. A CT scan of the head shows no acute intracranial pathology.",
  question: "Which finding requires immediate follow-up?",
  options: [],
  correctAnswer: ".",
  explanation: "Placeholder.",
  itemType: "constructed_response",
  ngnPayload: { kind: "constructed", unit: "mg" },
};

describe("naplex format coherence", () => {
  it("detects constructed_response with MCQ lead-in and non-numeric answer", () => {
    const codes = detectNaplexFormatIssues(base).map((i) => i.code);
    expect(codes).toContain("naplex_stem_format_mismatch");
  });

  it("rewrites hypertensive emergency mismatch to scorable MCQ", () => {
    const { item: fixed, changed } = fixNaplexFormatCoherence(base);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
    expect(
      auditBankItem(fixed, "pharmacy").issues.some((i) => i.code === "constructed_response_not_numeric")
    ).toBe(false);
  });

  it("reclassifies constructed_response with four MCQ options", () => {
    const item: BankItem = {
      ...base,
      scenario: "A 58-year-old man with HFrEF (EF 30%) is not on guideline-directed therapy.",
      question: "Which medication classes are included in HFrEF guideline-directed medical therapy?",
      options: [
        "ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i",
        "CCB-first therapy alone",
        "Thiazolidinediones as foundation",
        "Alpha agonists as first-line",
      ],
      correctAnswer: "ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i",
      explanation:
        "Correct: ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2i — contemporary heart failure guidelines recommend these pillars. CCB-first, thiazolidinediones, and alpha agonists are not foundational HFrEF GDMT.",
    };
    const { item: fixed } = fixNaplexFormatCoherence(item);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.correctAnswer).toBe(item.options[0]);
  });

  it("reclassifies MCQ with calc stem and numeric answer to constructed_response", () => {
    const item: BankItem = {
      subjectId: "compounding-calculations",
      scenario: "Order: prepare 250 mL IV bag to infuse over 4 hours.",
      question: "At what rate (mL/hr) should the nurse set the infusion pump? Round to the nearest whole number.",
      options: ["50 mL/hr", "63 mL/hr", "75 mL/hr", "100 mL/hr"],
      correctAnswer: "63",
      explanation:
        "250 mL ÷ 4 h = 62.5 mL/hr, rounded to 63 mL/hr per pump programming. Other rates miscalculate volume over time.",
      itemType: "vignette",
    };
    const { item: fixed } = fixNaplexFormatCoherence(item);
    expect(fixed.itemType).toBe("constructed_response");
    expect(fixed.correctAnswer).toBe("63");
    expect(fixed.options).toHaveLength(0);
  });
});
