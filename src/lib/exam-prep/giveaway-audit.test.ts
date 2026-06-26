import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditGiveawayPatterns } from "./giveaway-audit";
import { auditBankItem } from "./bank-audit";

function codes(item: BankItem): string[] {
  return auditGiveawayPatterns(item).map((i) => i.code);
}

const base: Omit<BankItem, "question" | "options" | "correctAnswer" | "explanation"> = {
  id: "x",
  subjectId: "pharmacokinetics",
  itemType: "mcq",
};

describe("auditGiveawayPatterns", () => {
  it("flags answer-in-stem + strawman + boilerplate on a templated NAPLEX selection item", () => {
    const item: BankItem = {
      ...base,
      scenario:
        "A 62-year-old woman with asthma/COPD maintenance is seen in the outpatient pharmacy. Current therapy includes Formoterol (Foradil) and other chronic medications.",
      question:
        "Which medication is the most appropriate pharmacist-recommended therapy for this presentation?",
      options: [
        "Formoterol (Foradil) — guideline-supported long-acting β2 agonist (LABA)",
        "Isosorbide mononitrate (Imdur) — no evidence for this indication",
        "Insulin detemir (Levemir) — maximum dose above labeled limits without justification",
        "Insulin glargine (Lantus) — requires no monitoring in all patients",
      ],
      correctAnswer: "Formoterol (Foradil) — guideline-supported long-acting β2 agonist (LABA)",
      explanation:
        "Therapeutic selection follows guidelines, patient-specific factors, and monitoring requirements.",
    };
    const found = codes(item);
    expect(found).toContain("answer_in_stem");
    expect(found).toContain("strawman_distractor");
    expect(found).toContain("boilerplate_explanation");
  });

  it("flags answer-in-stem on a self-referential mechanism item", () => {
    const item: BankItem = {
      ...base,
      scenario:
        "A 46-year-old woman with paroxysmal nocturnal hemoglobinuria. Current therapy includes Eculizumab (Soliris).",
      question:
        "Which mechanism of action best explains the therapeutic benefit of Eculizumab (Soliris) in this patient?",
      options: [
        "Dihydropyridine L-type calcium channel blockade causing peripheral vasodilation",
        "Angiotensin-converting enzyme inhibition preventing angiotensin II formation",
        "Eculizumab exerts its therapeutic effect through complement C5 inhibition relevant to PNH",
        "Selective serotonin reuptake inhibition increasing synaptic serotonin",
      ],
      correctAnswer:
        "Eculizumab exerts its therapeutic effect through complement C5 inhibition relevant to PNH",
      explanation:
        "The correct answer links the patient's presentation to the evidence-based mechanism of the selected agent.",
    };
    const found = codes(item);
    expect(found).toContain("answer_in_stem");
    expect(found).toContain("boilerplate_explanation");
  });

  it("does NOT flag a legitimate counseling item that names the drug", () => {
    const item: BankItem = {
      ...base,
      scenario:
        "A 65-year-old woman with asthma and hypertension presents for an albuterol refill, using it more than twice weekly with nighttime wheezing and peak flows below personal best.",
      question: "Which counseling point is most important for this patient?",
      options: [
        "Frequent rescue-inhaler use signals poor control; she should be evaluated for a controller (ICS) and proper technique reviewed.",
        "Use the albuterol inhaler before exercise to prevent symptoms.",
        "Consider switching to a long-acting beta-agonist.",
        "Stop using the albuterol inhaler if symptoms improve.",
      ],
      correctAnswer:
        "Frequent rescue-inhaler use signals poor control; she should be evaluated for a controller (ICS) and proper technique reviewed.",
      explanation:
        "Using a short-acting beta-agonist more than twice weekly indicates inadequate control per GINA; the patient needs a controller and an asthma action plan rather than more rescue therapy.",
    };
    expect(codes(item)).toHaveLength(0);
  });

  it("does NOT flag a legitimate NCLEX infection-control item", () => {
    const item: BankItem = {
      ...base,
      subjectId: "management-of-care",
      scenario:
        "78-year-old woman admitted with Clostridioides difficile infection after a course of clindamycin. Watery diarrhea, abdominal cramping, WBC 14,000/mm³.",
      question: "Which action demonstrates appropriate transmission-based precautions?",
      options: [
        "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
        "Use alcohol-based hand rub alone after caring for this client",
        "Place the client on droplet precautions only and reuse non-critical equipment between clients",
        "Keep the client in a negative-pressure airborne-isolation room",
      ],
      correctAnswer:
        "Place the client on contact precautions; use dedicated equipment and perform hand hygiene with soap and water before and after care",
      explanation:
        "C. difficile spores resist alcohol, so contact precautions with soap-and-water hand hygiene and dedicated equipment are required to prevent transmission.",
    };
    // Evaluated as a nursing item end-to-end.
    expect(auditBankItem(item, "nursing").issues.filter((i) => i.severity === "error")).toHaveLength(
      0
    );
  });
});

describe("structural coherence (NAPLEX generation bugs)", () => {
  function errorCodes(item: BankItem, fieldId: string): string[] {
    return auditBankItem(item, fieldId)
      .issues.filter((i) => i.severity === "error")
      .map((i) => i.code);
  }

  it("rejects a degenerate '.' correct answer", () => {
    const item: BankItem = {
      ...base,
      itemType: "constructed_response",
      question: "Which monitoring parameter is most critical for this patient?",
      options: [],
      correctAnswer: ".",
      explanation:
        "The most critical monitoring parameter is renal function given SGLT2 inhibitor and metformin use, which requires periodic eGFR assessment for dose safety.",
    };
    const codes = errorCodes(item, "pharmacy");
    expect(codes).toContain("degenerate_correct_answer");
  });

  it("rejects a non-numeric constructed-response (calculation) answer", () => {
    const item: BankItem = {
      ...base,
      itemType: "constructed_response",
      question: "Calculate the required daily dose for this patient.",
      options: [],
      correctAnswer: "Serum creatinine",
      explanation:
        "The daily dose is computed from the weight-based regimen and the patient's renal function as described in the vignette, then rounded to the nearest practical unit.",
    };
    expect(errorCodes(item, "pharmacy")).toContain("constructed_response_not_numeric");
  });

  it("accepts a valid numeric constructed-response answer", () => {
    const item: BankItem = {
      ...base,
      itemType: "constructed_response",
      scenario:
        "A patient requires vancomycin dosed at 15 mg/kg for a measured weight of 80 kg; round to the nearest 250 mg.",
      question: "Calculate the vancomycin dose in mg for this patient.",
      options: [],
      correctAnswer: "1250",
      explanation:
        "15 mg/kg × 80 kg = 1200 mg, rounded to the nearest 250 mg increment gives 1250 mg per dose for this patient.",
    };
    expect(errorCodes(item, "pharmacy")).not.toContain("constructed_response_not_numeric");
    expect(errorCodes(item, "pharmacy")).not.toContain("degenerate_correct_answer");
  });

  it("rejects an ordered-response item whose stem is a single-best-answer prompt", () => {
    const item: BankItem = {
      ...base,
      itemType: "ordered_response",
      scenario:
        "A 72-year-old man with heart failure and CKD on lisinopril and furosemide returns with worsening edema.",
      question: "Which medication is the best choice to manage this patient's condition?",
      options: ["Increase furosemide", "Add spironolactone", "Switch to losartan", "Add a thiazide"],
      correctAnswer: "Increase furosemide|||Add spironolactone|||Switch to losartan|||Add a thiazide",
      explanation:
        "Diuretic optimization precedes neurohormonal adjustments; the sequence reflects guideline-directed escalation for decompensated heart failure with renal impairment.",
    };
    expect(errorCodes(item, "pharmacy")).toContain("ordered_response_stem_mismatch");
  });
});
