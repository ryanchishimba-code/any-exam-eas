import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  appendUsmleDistractorRationales,
  enrichNaplexClinicalContext,
  moveCriteriaIntoVignette,
  normalizeUsmleActionStem,
} from "./qa-warn-fixes";
import { auditUsmleQaEditor } from "./usmle-qa-editor";

describe("qa-warn-fixes", () => {
  it("normalizes Step 3 template action stem", () => {
    const item: BankItem = {
      subjectId: "internal-medicine",
      question: "Which action should be taken next in this patient's care?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Explanation with enough length for audit purposes here.",
      vignette: "A 66-year-old woman presents with dyspnea.",
    };
    const fixed = normalizeUsmleActionStem(item);
    expect(fixed?.question).toContain("next best step");
  });

  it("accepts normalized action stem in USMLE QA lead-in check", () => {
    const item: BankItem = {
      subjectId: "internal-medicine",
      question: "Which action should be taken next in this patient's care?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation:
        "Correct answer is Option A because it addresses the acute issue. Other options are less appropriate in this scenario.",
      vignette:
        "A 66-year-old woman presents to the inpatient ward with progressive dyspnea and orthopnea over 3 days. Ischemic cardiomyopathy, EF 30%, on furosemide 40 mg daily.",
    };
    const before = auditUsmleQaEditor(item, {
      fieldId: "usmle-step-2",
      source: "polished",
      itemId: "test",
    });
    expect(before.issues.some((i) => i.code === "stem_lead_in")).toBe(false);
  });

  it("enriches NAPLEX vignette missing clinical anchors", () => {
    const item: BankItem = {
      subjectId: "formulary",
      question: "Which action should the pharmacist take first?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Explanation with drug-specific rationale and counseling points for the patient.",
      vignette:
        "A pharmacist reviews a formulary request for a new medication for a patient with chronic pain.",
    };
    const fixed = enrichNaplexClinicalContext(item, "test-id-123");
    expect(fixed?.vignette).toMatch(/\d{1,3}[- ]year[- ]old/i);
    expect(fixed?.vignette).toMatch(/BP|mm Hg/i);
  });

  it("appends distractor rationale section", () => {
    const item: BankItem = {
      subjectId: "biochemistry",
      question: "Which defect?",
      options: ["G6PD deficiency", "Spectrin defect", "Wilson disease", "Alpha-1 antitrypsin"],
      correctAnswer: "G6PD deficiency",
      explanation:
        "Oxidant stress triggers hemolysis in G6PD deficiency. Spectrin defects cause hereditary spherocytosis instead.",
      vignette: "A 22-year-old develops dark urine after eating fava beans.",
    };
    const fixed = appendUsmleDistractorRationales(item);
    expect(fixed?.explanation).toMatch(/Why other options are incorrect/i);
  });

  it("moves criteria sentences into vignette", () => {
    const item: BankItem = {
      subjectId: "obgyn",
      question: "Which of the following is the most appropriate next step in management?",
      options: ["Methotrexate", "Surgery", "Observe", "Rhogam"],
      correctAnswer: "Methotrexate",
      explanation:
        "Stable patient with unruptured ectopic pregnancy, β-hCG below common protocol thresholds, mass under 3.5 cm — criteria often met for systemic methotrexate.",
      vignette: "A 28-year-old woman at 6 weeks gestation has pelvic pain and a positive pregnancy test.",
    };
    const fixed = moveCriteriaIntoVignette(item);
    expect(fixed?.vignette).toMatch(/β-hCG|criteria|threshold/i);
  });
});
