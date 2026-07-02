import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  calculationContextSupportsStem,
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

  it("rewrites buprenorphine OUD pain vignette with clinical stem and mL-only options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 40-year-old male with a history of opioid use disorder is seeking treatment for pain management. He is currently on buprenorphine/naloxone for opioid dependence. He reports moderate pain from a recent injury but is concerned about the risk of relapse.",
      question: "Which recommendation is most appropriate for this patient?",
      options: ["120 mL", "30 mL", "60 mL", "90 mL"],
      correctAnswer: "60 mL",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(fixed.correctAnswer).toMatch(/non-opioid|buprenorphine prescriber|relapse/i);
    expect(fixed.options.every((o) => !/^\d+\s*mL\.?$/i.test(o.trim()))).toBe(true);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("rewrites fluticasone/salmeterol poor-control refill with mg/mL-only options", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette:
        "A 25-year-old male with asthma presents to the pharmacy for a refill of his fluticasone/salmeterol inhaler. He mentions he has been using it more frequently than prescribed and still experiences nighttime symptoms. He is concerned about his asthma control.",
      question: "Which recommendation is most appropriate for this patient?",
      options: ["0.75 mg/mL", "0.50 mg/mL", "1.00 mg/mL", "0.25 mg/mL"],
      correctAnswer: "0.50 mg/mL",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toMatch(/step-up|prescriber|controller inhaler|nocturnal/i);
    expect(fixed.options.every((o) => !/mg\/mL/i.test(o))).toBe(true);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("rewrites well-controlled asthma monitoring vignette with mg/mL-only options", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette:
        "A 35-year-old male with asthma presents for a follow-up visit. He is currently using a rescue inhaler (albuterol) and a daily inhaled corticosteroid (fluticasone). His asthma symptoms are well controlled, but he is interested in knowing how to better manage his condition and prevent future exacerbations.",
      question: "Which monitoring parameter is most critical?",
      options: ["0.5 mg/mL", "5 mg/mL", "1 mg/mL", "2 mg/mL"],
      correctAnswer: "1 mg/mL",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/monitoring parameter/i);
    expect(fixed.correctAnswer).toMatch(/rescue inhaler|peak expiratory flow|peak flow/i);
    expect(fixed.options.every((o) => !/^\d+(?:\.\d+)?\s*mg\/mL$/i.test(o.trim()))).toBe(true);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("rewrites diabetes hypertension follow-up with generic calc stem and mg-only options", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 60-year-old male with a history of hypertension and diabetes is prescribed lisinopril and metformin. He is scheduled for a routine follow-up visit. The patient inquires about the need for any additional medications or adjustments to his current regimen. His blood pressure is 130/80 mm Hg and his HbA1c is 7.5%.",
      question:
        "Select the one best response for this scenario.\nCalculate the dose in mg. Round to the nearest whole number.",
      options: ["100 mg", "50 mg", "200 mg", "150 mg"],
      correctAnswer: "100 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate recommendation/i);
    expect(fixed.correctAnswer).toMatch(/adherence|continue current therapy|prescriber/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites hyperkalemia spironolactone vignette with orphan mL/hr infusion calc options", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 70-year-old male with a history of hypertension and chronic kidney disease is prescribed spironolactone 25 mg daily. He reports dizziness and fatigue. His current medications include lisinopril and metoprolol. His serum potassium level is 5.5 mEq/L.",
      question:
        "Select the one best response for this scenario.\nAt what rate (mL/hr) should the infusion pump be set? Round to the nearest whole number.",
      options: ["100 mL/hr", "50 mL/hr", "125 mL/hr", "75 mL/hr"],
      correctAnswer: "100 mL/hr",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate recommendation/i);
    expect(fixed.correctAnswer).toMatch(/spironolactone|potassium|prescriber|hyperkalemia/i);
    expect(fixed.options.every((o) => !/mL\/hr/i.test(o))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites hydrocortisone vs hydrocodone allergy counseling with generic mg calc options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 25-year-old woman presents to the pharmacy with a prescription for a compounded topical cream containing hydrocortisone. She mentions that she is allergic to hydrocodone and asks if it is safe to use this cream. Her medical history is otherwise unremarkable.",
      question:
        "Select the one best response for this scenario.\nCalculate the dose in mg. Round to the nearest whole number.",
      options: ["75 mg", "100 mg", "25 mg", "50 mg"],
      correctAnswer: "75 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/corticosteroid|not an opioid|hydrocortisone/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites sepsis CKD piperacillin-tazobactam vignette with orphan total daily dose mg options", () => {
    const item: BankItem = {
      subjectId: "infectious-disease-rx",
      vignette:
        "A 68-year-old male with sepsis is being treated with piperacillin-tazobactam. He has a history of diabetes and chronic kidney disease. His current lab results show elevated creatinine and decreased urine output. The healthcare team is considering adjusting his antibiotic therapy.",
      question:
        "Select the one best response for this scenario.\nCalculate the total daily dose in mg. Round to the nearest whole number.",
      options: ["4000 mg", "5000 mg", "3000 mg", "6000 mg"],
      correctAnswer: "4000 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/medication therapy/i);
    expect(fixed.correctAnswer).toMatch(/renal dose adjustment|piperacillin|kidney function|prescriber/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites heart failure orthostatic hypotension vignette with orphan total volume mL options", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 75-year-old female with a history of heart failure and chronic kidney disease is prescribed furosemide. She reports feeling dizzy and lightheaded upon standing. Her current medications include lisinopril and metoprolol. Her blood pressure is 90/60 mm Hg.",
      question:
        "Select the one best response for this scenario.\nWhat is the total volume in mL? Round to one decimal place.",
      options: ["1000 mL", "750 mL", "500 mL", "250 mL"],
      correctAnswer: "500 mL",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate recommendation/i);
    expect(fixed.correctAnswer).toMatch(/orthostatic|furosemide|prescriber|position changes/i);
    expect(fixed.options.every((o) => !/^\d+\s*mL$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pediatric asthma rescue overuse with orphan mg calc options and no weight", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette:
        "A 12-year-old boy with asthma is prescribed albuterol for acute asthma exacerbations. His mother reports that he has been using the inhaler more frequently and is concerned about his worsening symptoms. She asks about the appropriate dose for his age and weight.",
      question:
        "Select the one best response for this scenario.\nCalculate the dose in mg. Round to the nearest whole number.",
      options: ["8 mg", "2 mg", "4 mg", "6 mg"],
      correctAnswer: "4 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toMatch(/poor asthma control|controller|prescriber|rescue inhaler/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites UTI amoxicillin vignette with tablet-count options and no day supply", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 65-year-old female presents to the pharmacy with a new prescription for amoxicillin 500 mg three times daily for a urinary tract infection (UTI). She has a history of hypertension and is currently taking lisinopril 20 mg daily. Her renal function is stable with a serum creatinine of 1.0 mg/dL. She reports no known drug allergies.",
      question: "How many tablets should be dispensed for this order?",
      options: ["42 tablets", "60 tablets", "30 tablets", "21 tablets"],
      correctAnswer: "21 tablets",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/counseling point is most important/i);
    expect(fixed.correctAnswer).toMatch(/full course|complete|day supply|lisinopril/i);
    expect(fixed.options.every((o) => !/^\d+\s*tablets?$/i.test(o.trim()))).toBe(true);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("rewrites pregnancy topical antibiotic safety vignette with mg dose calc options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 28-year-old pregnant woman is prescribed a topical antibiotic for a skin infection. She is concerned about the safety of the medication for her unborn child. Her medical history is unremarkable, and she is currently taking prenatal vitamins.",
      question: "Calculate the dose in mg. Round to the nearest whole number.",
      options: ["500 mg", "1500 mg", "2000 mg", "1000 mg"],
      correctAnswer: "1000 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);

    const { item: fixed, changed } = repairClinicalNumericMismatch(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/counseling point is most important/i);
    expect(fixed.correctAnswer).toMatch(/topical|systemic absorption|pregnancy|obstetric|prescriber/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(detectNaplexFormatIssues(fixed).map((i) => i.code)).not.toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });
});
