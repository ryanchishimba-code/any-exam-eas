import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "./bank-audit";
import {
  calculationContextSupportsStem,
  clinicalCounselingIntentCalcMismatchIssue,
  clinicalVignetteUnrelatedCalcIssue,
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
  itemHasFormatCoherenceIssue,
  orphanGenericCalcStemIssue,
  stemIsSelfContainedCalc,
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

  it("reclassifies next-best-step management item stored as constructed_response", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 30-year-old male presents to the emergency department with severe chest pain radiating to his left arm. An ECG shows ST-segment elevation in leads II, III, and aVF.",
      question: "What is the next best step in management?",
      options: [
        "Administer aspirin 325 mg orally.",
        "Start intravenous nitroglycerin.",
        "Perform coronary angiography.",
        "Initiate fibrinolytic therapy.",
      ],
      correctAnswer: "325",
      explanation:
        "Correct: Administer aspirin 325 mg orally. — immediate non-enteric aspirin is recommended in STEMI unless contraindicated.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    const codes = detectNaplexFormatIssues(item).map((i) => i.code);
    expect(codes).toContain("naplex_stem_format_mismatch");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.correctAnswer).toBe("Administer aspirin 325 mg orally.");
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("reclassifies constructed_response counseling item with corrupted numeric key", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 6-year-old girl presents to the pharmacy with her mother. She has a history of asthma and is currently taking albuterol as needed. The mother reports that the child has been wheezing more frequently and is using her inhaler multiple times a day. The mother asks about the appropriate dosage of montelukast for her daughter, as she has heard it can help with asthma control.",
      question:
        "Which counseling point is most important regarding the use of montelukast in this pediatric patient?",
      options: [
        "Montelukast should be taken in the morning for optimal effect.",
        "Montelukast can be used as a rescue medication during asthma attacks.",
        "Montelukast should be taken at least 1 hour before or 2 hours after meals.",
        "Montelukast is not recommended for children under 2 years of age.",
      ],
      correctAnswer: "12",
      explanation:
        "Montelukast is a leukotriene receptor antagonist used for asthma management in children. It is important to counsel the mother that montelukast should be taken at least 1 hour before or 2 hours after meals to ensure optimal absorption and effectiveness.",
      distractorRationale: {
        "Montelukast should be taken in the morning for optimal effect.":
          "Montelukast can be taken at any time of day.",
        "Montelukast can be used as a rescue medication during asthma attacks.":
          "Montelukast is a maintenance medication.",
        "Montelukast is not recommended for children under 2 years of age.":
          "Montelukast is approved for children as young as 6 months.",
      },
      itemType: "constructed_response",
      ngnPayload: {
        kind: "constructed",
        unit: "mg",
        segments: [
          {
            id: "montelukast",
            text: "Montelukast should be taken at least 1 hour before or 2 hours after meals.",
          },
        ],
      },
    };

    const codes = detectNaplexFormatIssues(item).map((i) => i.code);
    expect(codes).toContain("naplex_stem_format_mismatch");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.options).toHaveLength(4);
    expect(fixed.correctAnswer).toBe(
      "Montelukast should be taken at least 1 hour before or 2 hours after meals."
    );
    expect(fixed.ngnPayload?.kind).not.toBe("constructed");
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
    expect(
      auditBankItem(fixed, "pharmacy").issues.some((i) => i.code === "constructed_response_not_numeric")
    ).toBe(false);
  });

  it("repairs hydrocodone counseling vignette with orphan generic volume calc stem", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 55-year-old female patient with chronic pain is currently taking hydrocodone/acetaminophen for pain management. She expresses concern about the potential for addiction and is interested in exploring non-opioid alternatives. She has no history of substance abuse and is stable on her current medication.",
      question: "What is the total volume in mL? Round to one decimal place.",
      options: [
        "Initiate physical therapy and scheduled acetaminophen monotherapy",
        "Switch to extended-release oxycodone for smoother analgesia",
        "Recommend NSAID monotherapy without gastric-risk assessment",
        "Continue hydrocodone/acetaminophen and defer non-opioid discussion",
      ],
      correctAnswer: "12",
      explanation:
        "Correct: Initiate physical therapy and scheduled acetaminophen monotherapy — for stable chronic pain with opioid concern, non-opioid multimodal strategies are preferred when appropriate.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/alternative therapy/i);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("detects counseling MCQ stem paired with numeric-only dose options", () => {
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

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("flags constructed_response with generic volume stem and clinical-only vignette", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 45-year-old woman with hypertension and hyperlipidemia presents for an atorvastatin refill. She reports muscle aches. Current meds: lisinopril and metoprolol.",
      question: "Calculate the concentration in mg/mL.",
      options: [],
      correctAnswer: "20",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg/mL" },
    };

    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");
    expect(calculationContextSupportsStem(item)).toBe(false);
  });

  it("accepts self-contained tablet dispense stem without vignette calc data", () => {
    const stem =
      "How many tablets of ezetimibe should be dispensed for a 30-day supply at a dose of 10 mg daily?";
    expect(stemIsSelfContainedCalc(stem)).toBe(true);
  });

  it("rejects generic infusion-rate stem with only oral-dose vignette", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 70-year-old male with CKD stage 3 is prescribed metoprolol succinate 50 mg daily for hypertension.",
      question: "At what rate (mL/hr) should the infusion pump be set?",
      options: [],
      correctAnswer: "10",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mL/hr" },
    };

    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");
  });

  it("flags uncalculable mg/mL concentration from mcg per actuation only", () => {
    const stem =
      "Calculate the concentration in mg/mL of the salmeterol/fluticasone inhaler if it contains 250 mcg of fluticasone and 50 mcg of salmeterol per actuation in a 120-actuation canister.";
    expect(calculationContextSupportsStem({
      subjectId: "compounding-calculations",
      vignette: "A technician is reviewing product labeling.",
      question: stem,
      options: [],
      correctAnswer: "0.5",
      explanation: "Placeholder.",
      itemType: "constructed_response",
    })).toBe(false);
  });

  it("rewrites asthma exacerbation vignette with orphan concentration calc to ED MCQ", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette:
        "A 30-year-old female presents to the emergency department with an asthma exacerbation. She is currently using a salmeterol/fluticasone inhaler and has been prescribed albuterol for rescue use. Her vital signs show a heart rate of 120 bpm and oxygen saturation of 88% on room air. She has a history of anxiety and is currently taking sertraline.",
      question:
        "Calculate the concentration in mg/mL of the salmeterol/fluticasone inhaler if it contains 250 mcg of fluticasone and 50 mcg of salmeterol per actuation in a 120-actuation canister.",
      options: [],
      correctAnswer: "0.12",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg/mL" },
    };

    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/most appropriate pharmacist recommendation/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(fixed.correctAnswer).toMatch(/beta-agonist|bronchodilator/i);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites asthma follow-up poor-control vignette with uncalculable fluticasone concentration", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette:
        "A 30-year-old female patient with asthma presents to the clinic for a follow-up visit. She is currently using albuterol as a rescue inhaler and has been prescribed fluticasone/salmeterol for maintenance therapy. She reports using her albuterol inhaler more than twice a week and has frequent nighttime awakenings due to asthma symptoms.",
      question:
        "Calculate the concentration of fluticasone in mg/mL in the prescribed fluticasone/salmeterol inhaler, which contains 45 mcg of fluticasone per actuation.",
      options: [],
      correctAnswer: "0.045",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg/mL" },
    };

    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/most appropriate recommendation/i);
    expect(fixed.correctAnswer).toMatch(/step-up|prescriber|uncontrolled/i);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("retargets pediatric mg/kg vignette with mismatched concentration stem to per-dose calc", () => {
    const item: BankItem = {
      subjectId: "medication-dispensing",
      vignette:
        "A 12-year-old boy weighing 40 kg is prescribed amoxicillin for an ear infection. The recommended pediatric dosing is 20 mg/kg/day divided into two doses. He has no known drug allergies and is otherwise healthy.",
      question: "Calculate the concentration in mg/mL. Round to two decimal places.",
      options: [],
      correctAnswer: "0.5",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg/mL" },
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("constructed_response");
    expect(fixed.question).toMatch(/dose in mg for each divided dose/i);
    expect(fixed.correctAnswer).toBe("400");
    expect(fixed.ngnPayload?.unit).toBe("mg");
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites hydrocodone side-effect vignette with orphan 30-day mL volume calc (no options)", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 58-year-old female with chronic pain is prescribed hydrocodone/acetaminophen 5/325 mg every 6 hours as needed. She has a history of opioid use and is currently taking gabapentin for neuropathic pain. She reports occasional dizziness and constipation since starting the hydrocodone.",
      question: "What is the total volume in mL that should be dispensed for a 30-day supply?",
      options: [],
      correctAnswer: "120",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mL" },
    };

    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/CNS depression|constipation|acetaminophen/i);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites hydromorphone adherence vignette with orphan mL volume calc", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 55-year-old male with a history of chronic pain is prescribed hydromorphone 4 mg every 4 hours as needed. He reports that he often forgets to take his medication and sometimes takes it more frequently than prescribed. His current medications include gabapentin and ibuprofen.",
      question: "What is the total volume in mL?",
      options: [],
      correctAnswer: "90",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mL" },
    };

    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/maximum daily dose|prescriber|extra doses/i);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites COPD worsening vignette with unrelated self-contained amlodipine tablet calc", () => {
    const item: BankItem = {
      subjectId: "respiratory-rx",
      vignette:
        "A 70-year-old male with a history of hypertension and chronic obstructive pulmonary disease (COPD) presents to the pharmacy for a refill of his medications. He is currently taking lisinopril, amlodipine, and tiotropium. He reports feeling more short of breath and has a cough that worsens at night. His blood pressure is 140/85 mm Hg.",
      question:
        "How many tablets of amlodipine should be dispensed for this order if the prescription is for 30 days at a dose of 5 mg daily?",
      options: [],
      correctAnswer: "30",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "tablets" },
    };

    expect(stemIsSelfContainedCalc(item.question)).toBe(true);
    expect(calculationContextSupportsStem(item)).toBe(true);
    expect(orphanGenericCalcStemIssue(item)).toBeNull();
    expect(clinicalVignetteUnrelatedCalcIssue(item)?.codes).toContain(
      "naplex_clinical_vignette_unrelated_calc"
    );
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_calc"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/most appropriate recommendation/i);
    expect(fixed.correctAnswer).toMatch(/prescriber|exacerbation|COPD/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites sepsis renal impairment vignette with orphan preparation mg calc", () => {
    const item: BankItem = {
      subjectId: "infectious-disease-rx",
      vignette:
        "A 40-year-old female with a diagnosis of sepsis is started on piperacillin-tazobactam 4.5 g IV every 6 hours. She has a history of renal impairment with an eGFR of 40 mL/min. Her current medications include metformin and lisinopril.",
      question: "How many milligrams of drug are required for this preparation?",
      options: [],
      correctAnswer: "4500",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/medication therapy/i);
    expect(fixed.correctAnswer).toMatch(/metformin|renal|piperacillin|eGFR/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites sepsis pneumonia ceftriaxone vignette with orphan preparation mg calc", () => {
    const item: BankItem = {
      subjectId: "infectious-disease-rx",
      vignette:
        "A 60-year-old male with sepsis secondary to pneumonia is started on ceftriaxone 2 g IV every 24 hours. He has a history of renal impairment with an eGFR of 30 mL/min. His current medications include metformin and lisinopril.",
      question: "How many milligrams of drug are required for this preparation?",
      options: [],
      correctAnswer: "2000",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/medication therapy/i);
    expect(fixed.correctAnswer).toMatch(/metformin|ceftriaxone|eGFR/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites apixaban bruising refill vignette with orphan generic tablet dispense calc", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 65-year-old female with a history of atrial fibrillation and hypertension presents to the pharmacy for a refill of her apixaban. She reports experiencing some mild bruising but denies any significant bleeding. Her current medications include amlodipine and lisinopril. Her renal function is stable with a CrCl of 60 mL/min.",
      question: "How many tablets should be dispensed for this order?",
      options: [],
      correctAnswer: "60",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/bruising|bleeding|apixaban|prescriber/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(fixed.ngnPayload).toBeUndefined();
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites apixaban bleeding-risk vignette with calculable tablet dispense calc", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 72-year-old male with a history of atrial fibrillation is prescribed apixaban 5 mg twice daily. He has a CrCl of 45 mL/min and is concerned about bleeding risks. He is currently taking metoprolol and lisinopril. He has no known drug allergies.",
      question: "How many tablets of apixaban should be dispensed for a 30-day supply?",
      options: [],
      correctAnswer: "60",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(calculationContextSupportsStem(item)).toBe(true);
    expect(clinicalCounselingIntentCalcMismatchIssue(item)?.codes).toContain(
      "naplex_clinical_vignette_unrelated_calc"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/bleeding|prescriber|renal|dose/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites elderly tramadol dizziness/confusion vignette with orphan mg dose calc", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 70-year-old female patient with a history of chronic pain is prescribed tramadol 50 mg every 8 hours. During a follow-up visit, her daughter reports that the patient has been experiencing dizziness and confusion. The patient's current medications include lisinopril and atorvastatin. Her renal function is normal.",
      question: "Calculate the dose in mg. Round to the nearest whole number.",
      options: [],
      correctAnswer: "50",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/dizziness|confusion|prescriber|tramadol|CNS/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites ibuprofen/lisinopril interaction vignette with unrelated infusion rate calc", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 55-year-old woman with a history of hypertension is prescribed lisinopril and atorvastatin. She is currently taking ibuprofen for chronic knee pain. She reports no side effects but is concerned about potential interactions with her medications. Her blood pressure is well-controlled at 120/75 mm Hg.",
      question:
        "At what rate (mL/hr) should the infusion pump be set if the patient is to receive 1000 mL of IV fluids over 8 hours?",
      options: [],
      correctAnswer: "125",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mL/hr" },
    };

    expect(calculationContextSupportsStem(item)).toBe(true);
    expect(clinicalCounselingIntentCalcMismatchIssue(item)?.codes).toContain(
      "naplex_clinical_vignette_unrelated_calc"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/counseling point/i);
    expect(fixed.correctAnswer).toMatch(/ibuprofen|lisinopril|NSAID|renal|interaction/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites penicillin allergy amoxicillin vignette with orphan total volume mL options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 28-year-old female presents to the pharmacy with a prescription for amoxicillin for a suspected bacterial infection. She reports a history of a severe allergic reaction to penicillin, including hives and difficulty breathing. She is concerned about taking this medication.",
      question:
        "Select the one best response for this scenario.\nWhat is the total volume in mL? Round to one decimal place.",
      options: ["200 mL", "250 mL", "150 mL", "100 mL"],
      correctAnswer: "200 mL",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toMatch(/do not dispense|contraindication|prescriber|penicillin|amoxicillin/i);
    expect(fixed.options.every((o) => !/^\d+\s*mL$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites metformin CKD safety concern vignette with orphan mg dose calc options", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "A 65-year-old male with chronic kidney disease is prescribed metformin for type 2 diabetes. His current eGFR is 45 mL/min. He expresses concern about the safety of this medication given his renal function.",
      question:
        "Select the one best response for this scenario.\nCalculate the dose in mg. Round to the nearest whole number.",
      options: ["500 mg", "750 mg", "1000 mg", "1250 mg"],
      correctAnswer: "1000 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.correctAnswer).toMatch(/metformin|eGFR|renal|prescriber|lactic acidosis|contraindicated/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rejects tablet dispense calc when vignette has dose and frequency but no day supply", () => {
    const item: BankItem = {
      subjectId: "medication-dispensing",
      vignette:
        "A 65-year-old female presents to the pharmacy with a new prescription for amoxicillin 500 mg three times daily for a urinary tract infection (UTI). She has a history of hypertension and is currently taking lisinopril 20 mg daily. Her renal function is stable with a serum creatinine of 1.0 mg/dL. She reports no known drug allergies.",
      question: "How many tablets should be dispensed for this order?",
      options: ["42 tablets", "60 tablets", "30 tablets", "21 tablets"],
      correctAnswer: "21 tablets",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );
  });

  it("rewrites UTI amoxicillin vignette with incomplete tablet dispense calc to counseling MCQ", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 65-year-old female presents to the pharmacy with a new prescription for amoxicillin 500 mg three times daily for a urinary tract infection (UTI). She has a history of hypertension and is currently taking lisinopril 20 mg daily. Her renal function is stable with a serum creatinine of 1.0 mg/dL. She reports no known drug allergies.",
      question:
        "Select the one best response for this scenario.\nHow many tablets should be dispensed for this order?",
      options: ["42 tablets", "60 tablets", "30 tablets", "21 tablets"],
      correctAnswer: "21 tablets",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/counseling point is most important/i);
    expect(fixed.correctAnswer).toMatch(/full course|complete|day supply|lisinopril/i);
    expect(fixed.options.every((o) => !/^\d+\s*tablets?$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pregnancy topical antibiotic safety vignette with orphan mg dose calc", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 28-year-old pregnant woman is prescribed a topical antibiotic for a skin infection. She is concerned about the safety of the medication for her unborn child. Her medical history is unremarkable, and she is currently taking prenatal vitamins.",
      question:
        "Select the one best response for this scenario.\nCalculate the dose in mg. Round to the nearest whole number.",
      options: ["500 mg", "1500 mg", "2000 mg", "1000 mg"],
      correctAnswer: "1000 mg",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_stem_numeric_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/counseling point is most important/i);
    expect(fixed.correctAnswer).toMatch(/topical|systemic absorption|pregnancy|obstetric|prescriber/i);
    expect(fixed.options.every((o) => !/^\d+\s*mg$/i.test(o.trim()))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites sepsis ICU ceftriaxone-vancomycin vignette with orphan preparation mg calc", () => {
    const item: BankItem = {
      subjectId: "infectious-disease-rx",
      vignette:
        "A 70-year-old male with sepsis is being treated in the ICU. He is currently on ceftriaxone 2 g IV every 12 hours. His renal function is stable with an eGFR of 70 mL/min. The physician orders an additional dose of vancomycin 1 g IV.",
      question: "How many milligrams of drug are required for this preparation?",
      options: [],
      correctAnswer: "1000",
      explanation: "Placeholder.",
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    expect(calculationContextSupportsStem(item)).toBe(false);
    expect(orphanGenericCalcStemIssue(item)?.codes).toContain("naplex_orphan_calc_stem");

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.itemType).toBe("vignette");
    expect(fixed.question).toMatch(/medication therapy/i);
    expect(fixed.correctAnswer).toMatch(/vancomycin|therapeutic drug monitoring|trough|AUC|renal function/i);
    expect(fixed.options).toHaveLength(4);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites anaphylaxis ED vignette with unrelated screening lifestyle options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "Emergency department, Room 572. 36-year-old woman with anaphylaxis after antibiotic administration. Received IV ceftriaxone 10 minutes ago for pyelonephritis; history of penicillin allergy documented. BP 74/42 mmHg, HR 130, RR 30, SpO₂ 89% on room air. Diffuse urticaria, facial and tongue swelling, audible stridor, anxiety, diaphoresis.",
      question:
        "Select the one best response for this scenario.\nWhich finding requires immediate nursing follow-up?",
      options: [
        "Body mass index of 32",
        "Daytime fatigue",
        "Waist circumference of 42 inches",
        "Difficulty sleeping",
      ],
      correctAnswer: "Daytime fatigue",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/epinephrine|airway|ceftriaxone|allerg/i);
    expect(fixed.options.every((o) => !/body mass index|waist circumference|daytime fatigue|difficulty sleeping/i.test(o))).toBe(
      true
    );
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites anaphylaxis ED vignette with unrelated insulin administration options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 35-year-old woman with a known history of penicillin allergy presents to the emergency department in anaphylaxis after receiving IV ceftriaxone for pyelonephritis. She exhibits vital signs of BP 74/42 mmHg, HR 130, RR 30, and SpO₂ 89% on room air. The client also shows diffuse urticaria, facial and tongue swelling, audible stridor, anxiety, and diaphoresis, indicating a severe allergic reaction requiring immediate intervention.",
      question: "Which nursing action should the nurse take first to ensure client safety?",
      options: [
        "Document administration before giving the medication to save time",
        "Administer insulin lispro without verifying the client's identity or allergy history",
        "Use another client's medication if the MAR is unavailable",
        "Verify the six rights, check allergies and relevant labs, and assess BP 74/42 mmHg before administering insulin lispro",
      ],
      correctAnswer:
        "Verify the six rights, check allergies and relevant labs, and assess BP 74/42 mmHg before administering insulin lispro",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/epinephrine|airway|ceftriaxone|fluid resuscitation/i);
    expect(fixed.options.every((o) => !/insulin lispro|six rights|mar is unavailable|another client'?s medication/i.test(o))).toBe(
      true
    );
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites severe preeclampsia vignette with unrelated obstetric wellness options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "Labor and delivery unit, Room 559. A 26-year-old woman with preeclampsia with severe features is in her first pregnancy at 36 weeks gestation. She has no prenatal complications until today. Current vital signs show BP 168/104 mmHg, HR 96, RR 20, and temp 98.6°F (37°C). Urine dipstick reveals 3+ protein, and she reports epigastric pain and a headache rated 8/10. Neurological assessment shows hyperreflexia with clonus.",
      question:
        "Select the one best response for this scenario.\nWhich assessment finding should the nurse address first?",
      options: [
        "Provide information about safe weight loss during pregnancy",
        "Encourage small, frequent meals to manage nausea",
        "Refer the client to a dietitian for nutritional counseling",
        "Assess the client's hydration status",
      ],
      correctAnswer: "Assess the client's hydration status",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/magnesium|preeclampsia|seizure|delivery|blood pressure/i);
    expect(fixed.options).not.toContain("Assess the client's hydration status");
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites psychiatric suicide-risk vignette with unrelated procedure prep options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "Inpatient psychiatric unit, Room 355. 22-year-old man with major depressive disorder with suicidal ideation. Admitted after expressing plan to overdose; first psychiatric hospitalization. BP 122/78 mmHg, HR 82, RR 16. Flat affect, states 'I don't want to be here anymore,' has written a goodbye note, poor eye contact.",
      question:
        "Select the one best response for this scenario.\nWhich assessment finding should the nurse address first?",
      options: [
        "Provide information on what to expect during the procedure.",
        "Offer to discuss his anxiety further.",
        "Reassure the client that the procedure is routine.",
        "Explain the importance of the clear liquid diet.",
      ],
      correctAnswer: "Offer to discuss his anxiety further.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/suicide|observation|lethal means|prescriber|risk assessment/i);
    expect(fixed.options).not.toContain("Explain the importance of the clear liquid diet.");
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites psychiatric suicide-risk vignette with unrelated post-op medical options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "Inpatient psychiatric unit, Room 223. 22-year-old man with major depressive disorder with suicidal ideation. Admitted after expressing plan to overdose; first psychiatric hospitalization. BP 122/78 mmHg, HR 82, RR 16. Flat affect, states 'I don't want to be here anymore,' has written a goodbye note, poor eye contact.",
      question:
        "Select the one best response for this scenario.\nWhich assessment finding should the nurse address first?",
      options: [
        "Administer the prescribed pain medication.",
        "Increase the IV fluid rate.",
        "Assess the client's abdomen for distension.",
        "Encourage the client to ambulate.",
      ],
      correctAnswer: "Increase the IV fluid rate.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/suicide|observation|lethal means|prescriber|risk assessment/i);
    expect(fixed.options).not.toContain("Encourage the client to ambulate.");
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites postpartum hemorrhage vignette with unrelated respiratory follow-up options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "Labor and delivery unit, Room 278. 24-year-old woman with postpartum hemorrhage. Vaginal delivery 30 minutes ago; estimated blood loss now increasing. BP 94/60 mmHg, HR 124, RR 22. Saturated perineal pad in 5 minutes, uterus boggy above umbilicus, fundal massage minimally effective.",
      question:
        "Select the one best response for this scenario.\nWhich finding requires immediate nursing follow-up?",
      options: [
        "Notify the healthcare provider of the lethargy.",
        "Increase the oxygen flow rate.",
        "Encourage the client to take deep breaths.",
        "Prepare the client for a chest X-ray.",
      ],
      correctAnswer: "Increase the oxygen flow rate.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/uterotonic|hemorrhage|fundal massage|oxytocin|blood loss/i);
    expect(fixed.options).not.toContain("Prepare the client for a chest X-ray.");
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites postpartum hemorrhage vignette with unrelated post-delivery recovery options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 24-year-old woman, G1P1, is in the labor and delivery unit, 30 minutes postpartum following a vaginal delivery. She is experiencing postpartum hemorrhage with an estimated blood loss that is increasing. Her vital signs show a blood pressure of 94/60 mmHg, heart rate of 124 bpm, and respiratory rate of 22 breaths per minute. The client has saturated a perineal pad in 5 minutes, and the uterus is boggy above the umbilicus, with fundal massage proving minimally effective.",
      question: "Which assessment finding should the nurse address first?",
      options: [
        "Absence of flatus since surgery",
        "Anxiety about recovery",
        "Severe abdominal pain",
        "Stable vital signs",
      ],
      correctAnswer: "Severe abdominal pain",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/uterotonic|hemorrhage|fundal massage|oxytocin|blood loss/i);
    expect(
      fixed.options.every((o) => !/absence of flatus|anxiety about recovery|stable vital signs/i.test(o))
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pediatric ED prioritization vignette with unrelated colon cancer screening options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a pediatric emergency department. Room 101: 9-year-old with known asthma, RR 34, SpO₂ 88% on room air, intercostal retractions, speaking in short phrases. Room 104: 6-week-old infant, temp 102.2°F (39.0°C), lethargic, poor feeding x 24 hours, capillary refill 3 seconds. Room 107: 14-year-old forearm deformity after fall, neurovascular intact, pain 7/10, distal pulses 2+. Room 100: 4-year-old with vomiting/diarrhea 24 hours, alert, drinking small sips, HR 110, BP 98/60, no fever.",
      question:
        "Select the one best response for this scenario.\nFour clients require attention. Which client is the highest priority for the nurse to see first?",
      options: [
        "Assess the client's understanding of screening recommendations.",
        "Provide educational materials about colon cancer.",
        "Schedule the client for a colonoscopy.",
        "Discuss the risks and benefits of colonoscopy.",
      ],
      correctAnswer: "Schedule the client for a colonoscopy.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 101|asthma|spo?₂?|retractions|airway|breathing/i);
    expect(fixed.options.every((o) => !/colon cancer|colonoscopy|screening recommendations/i.test(o))).toBe(
      true
    );
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pediatric ED prioritization vignette with unrelated wound care options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a pediatric emergency department. Room 107: 9-year-old with known asthma, RR 34, SpO₂ 88% on room air, intercostal retractions, speaking in short phrases. Room 110: 6-week-old infant, temp 102.2°F (39.0°C), lethargic, poor feeding x 24 hours, capillary refill 3 seconds. Room 113: 14-year-old forearm deformity after fall, neurovascular intact, pain 7/10, distal pulses 2+. Room 106: 4-year-old with vomiting/diarrhea 24 hours, alert, drinking small sips, HR 110, BP 98/60, no fever.",
      question: "Which client should the nurse prioritize for immediate assessment?",
      options: [
        "Encourage the client to change positions every 2 hours.",
        "Apply a hydrocolloid dressing to the wound.",
        "Educate the client on proper nutrition to promote healing.",
        "Document the size and appearance of the wound.",
      ],
      correctAnswer: "Apply a hydrocolloid dressing to the wound.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 107|asthma|spo?₂?|retractions|airway|breathing/i);
    expect(
      fixed.options.every(
        (o) => !/hydrocolloid|change positions every 2 hours|proper nutrition to promote healing|size and appearance of the wound/i.test(o)
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pediatric ED prioritization vignette with unrelated ambulation options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a pediatric emergency department. Room 56: 9-year-old with known asthma, RR 34, SpO₂ 88% on room air, intercostal retractions, speaking in short phrases. Room 59: 6-week-old infant, temp 102.2°F (39.0°C), lethargic, poor feeding x 24 hours, capillary refill 3 seconds. Room 62: 14-year-old forearm deformity after fall, neurovascular intact, pain 7/10, distal pulses 2+. Room 55: 4-year-old with vomiting/diarrhea 24 hours, alert, drinking small sips, HR 110, BP 98/60, no fever.",
      question: "The nurse receives report on four assigned clients. Which client should the nurse assess first?",
      options: [
        "Assess the client’s pain level before ambulation.",
        "Provide a walker for the client to use.",
        "Encourage the client to ambulate with assistance.",
        "Educate the client about fall prevention strategies.",
      ],
      correctAnswer: "Provide a walker for the client to use.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 56|asthma|spo?₂?|retractions|airway|breathing/i);
    expect(
      fixed.options.every(
        (o) => !/walker|ambulate with assistance|fall prevention strategies|pain level before ambulation/i.test(o)
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pediatric ED prioritization vignette with unrelated medication counseling options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned to a pediatric emergency department with four clients. In Room 50, a 9-year-old with a history of asthma presents with a respiratory rate of 34 breaths per minute, an SpO₂ of 88% on room air, and intercostal retractions, speaking only in short phrases. In Room 53, a 6-week-old infant has a temperature of 102.2°F (39.0°C), is lethargic, has poor feeding for the past 24 hours, and exhibits a capillary refill time of 3 seconds. Room 56 contains a 14-year-old with a forearm deformity after a fall; neurovascular status is intact, but the client reports pain of 7/10, and distal pulses are 2+. Finally, in Room 49, a 4-year-old is experiencing vomiting and diarrhea for 24 hours, is alert, drinking small sips, with a heart rate of 110 and a blood pressure of 98/60, but has no fever.",
      question: "Which client should the nurse assess first?",
      options: [
        "Instruct the client to take the medication with food.",
        "Educate the client about potential side effects.",
        "Assess the client's renal function before administration.",
        "Ensure the client understands the importance of completing the full course of antibiotics.",
      ],
      correctAnswer: "Educate the client about potential side effects.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 50|asthma|spo?₂?|retractions|airway|breathing/i);
    expect(
      fixed.options.every(
        (o) =>
          !/take the medication with food|potential side effects|renal function before administration|full course of antibiotics/i.test(
            o
          )
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites pediatric ED prioritization vignette with unrelated chart review options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "nurse in a pediatric emergency department is assigned to four clients. Room 56 contains a 9-year-old with a history of asthma, presenting with a respiratory rate of 34 breaths per minute, oxygen saturation of 88% on room air, and intercostal retractions, speaking only in short phrases. In Room 59, a 6-week-old infant has a temperature of 102.2°F (39.0°C), is lethargic, has poor feeding for the past 24 hours, and exhibits a capillary refill time of 3 seconds. Room 62 has a 14-year-old with a forearm deformity after a fall; neurovascular status is intact, but the client reports pain at 7/10, and distal pulses are 2+. Finally, Room 55 has a 4-year-old with vomiting and diarrhea for 24 hours, who is alert, drinking small sips of fluid, has a heart rate of 110 beats per minute, and a blood pressure of 98/60 mmHg, with no fever present.",
      question:
        "Four clients require attention. Which client is the highest priority for the nurse to see first?",
      options: [
        "The client has a history of gastrointestinal bleeding.",
        "The client reports taking atorvastatin at bedtime.",
        "The client has a new prescription for lisinopril.",
        "The client is currently on a low-sodium diet.",
      ],
      correctAnswer: "The client reports taking atorvastatin at bedtime.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 56|asthma|spo?₂?|retractions|airway|breathing/i);
    expect(
      fixed.options.every(
        (o) => !/atorvastatin|lisinopril|low-sodium diet|gastrointestinal bleeding/i.test(o)
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites acute decompensated heart failure vignette with unrelated diabetic eye care options", () => {
    const item: BankItem = {
      subjectId: "cardiovascular-rx",
      vignette:
        "Medical-surgical unit, Room 276. 70-year-old woman with acute decompensated heart failure. Admitted 24 hours ago for fluid overload; receiving IV furosemide and daily weights. BP 88/54 mmHg, HR 112, RR 24, SpO₂ 91% on 2 L nasal cannula. Crackles bilaterally, 2+ pitting edema to knees, weight up 2.5 kg since yesterday, dizziness on standing.",
      question:
        "Select the one best response for this scenario.\nWhich finding requires immediate nursing follow-up?",
      options: [
        "Schedule an eye exam for the client.",
        "Document the discussion in the client's chart.",
        "Assess the client's understanding of the need for eye exams.",
        "Educate the client about diabetic retinopathy.",
      ],
      correctAnswer: "Assess the client's understanding of the need for eye exams.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/prescriber|heart failure|furosemide|volume overload|hypotension|weight gain/i);
    expect(fixed.options).not.toContain("Educate the client about diabetic retinopathy.");
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites upper GI bleed vignette with unrelated diabetes education options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 77-year-old male is admitted to the medical-surgical unit with an upper gastrointestinal bleed. His medical history includes peptic ulcer disease and chronic aspirin use. Overnight, he experienced melena, and upon assessment, his vital signs reveal a blood pressure of 90/56 mmHg, heart rate of 118 bpm, and hemoglobin level of 7.2 g/dL. The client appears pale with cool extremities, reports feeling lightheaded when repositioning, and has a capillary refill time of 3 seconds.",
      question:
        "Select the one best response for this scenario.\nWhich assessment finding should the nurse address first?",
      options: [
        "Discuss the importance of regular blood glucose monitoring.",
        "Teach the client about signs and symptoms of hypoglycemia.",
        "Instruct the client on proper injection techniques.",
        "Provide information on dietary modifications.",
      ],
      correctAnswer: "Teach the client about signs and symptoms of hypoglycemia.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/most appropriate immediate action/i);
    expect(fixed.correctAnswer).toMatch(/bleed|hemoglobin|transfusion|iv access|aspirin|resuscitation|endoscop/i);
    expect(fixed.options).not.toContain("Instruct the client on proper injection techniques.");
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites psychiatric unit prioritization vignette with unrelated minor finding options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a inpatient psychiatric unit. Room 135: 19-year-old man admitted for depression, states 'I know how I would do it,' has written goodbye note, poor eye contact. Room 132: 45-year-old man alcohol withdrawal, HR 124, tremors, diaphoresis, BP 158/98, last drink 24 hours ago. Room 138: 28-year-old woman manic episode, pacing, pressured speech, refused morning lithium, vitals stable. Room 129: 52-year-old woman voluntary admission for grief, tearful but denies SI/HI, signed safety contract.",
      question:
        "Four clients require attention. Which client is the highest priority for the nurse to see first?",
      options: [
        "Client has a headache that is relieved by acetaminophen.",
        "Client's blood pressure is 110/70 mmHg.",
        "Client reports recent nosebleeds.",
        "Client reports occasional bruising.",
      ],
      correctAnswer: "Client has a headache that is relieved by acetaminophen.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 135|suicide|goodbye|depression/i);
    expect(
      fixed.options.every(
        (o) => !/headache that is relieved by acetaminophen|blood pressure is 110\/70|nosebleeds|occasional bruising/i.test(o)
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites emergency department prioritization vignette with unrelated fire safety options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a emergency department. Room 136: 34-year-old woman received IV ceftriaxone 15 minutes ago for pyelonephritis. BP 74/42 mmHg, HR 130, RR 30, SpO₂ 89%. Diffuse urticaria, facial/tongue swelling, audible stridor. Room 139: 58-year-old man with 40 minutes of substernal pressure, diaphoresis, nausea. BP 156/92, HR 98, SpO₂ 95%. ECG pending; troponin sent. Room 134: 57-year-old man with type 2 diabetes, out of insulin 48 hours. Glucose 398 mg/dL, HR 116, RR 26, dry mucous membranes, reports nausea. Room 143: 22-year-old man voluntary psych admission for anxiety, denies suicidal plan, contract for safety, vitals stable.",
      question: "Which client should the nurse prioritize for immediate assessment?",
      options: [
        "Suggest the client to have an escape plan in case of fire.",
        "Instruct the client to place smoke detectors in every room.",
        "Encourage the client to keep flammable materials away from heat sources.",
        "Advise the client to test smoke detectors monthly.",
      ],
      correctAnswer: "Instruct the client to place smoke detectors in every room.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 136|anaphy|stridor|ceftriaxone|urticaria/i);
    expect(
      fixed.options.every(
        (o) => !/escape plan|smoke detectors|flammable materials|test smoke detectors monthly/i.test(o)
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites labor and delivery prioritization vignette with unrelated warfarin options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a labor and delivery unit. Room 51: 29-year-old G1P0 at 36 weeks, BP 168/104 mmHg, headache 8/10, epigastric pain, 3+ protein, hyperreflexia with clonus. Room 53: 26-year-old woman postpartum hour 1, saturated perineal pad in 5 minutes, uterus boggy at umbilicus, HR 118, BP 96/62. Room 56: 31-year-old woman at 38 weeks, reports decreased fetal movement x 12 hours, FHR 130 with moderate variability, no decelerations. Room 49: 24-year-old woman in active labor, cervical exam 7 cm, pain 8/10, FHR 145 with accelerations, maternal vitals stable.",
      question:
        "Select the one best response for this scenario.\nFour clients require attention. Which client is the highest priority for the nurse to see first?",
      options: [
        "Educate the client on the importance of INR monitoring.",
        "Notify the healthcare provider of the elevated INR.",
        "Instruct the client to hold the next dose of warfarin.",
        "Administer vitamin K as ordered.",
      ],
      correctAnswer: "Notify the healthcare provider of the elevated INR.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 51|preeclampsia|clonus|epigastric|magnesium/i);
    expect(fixed.options.every((o) => !/^Educate the client on the importance of INR monitoring\.?$/i.test(o.trim()))).toBe(
      true
    );
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites labor and delivery prioritization vignette with unrelated wellness options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a labor and delivery unit. Room 42: 29-year-old G1P0 at 36 weeks, BP 168/104 mmHg, headache 8/10, epigastric pain, 3+ protein, hyperreflexia with clonus. Room 44: 26-year-old woman postpartum hour 1, saturated perineal pad in 5 minutes, uterus boggy at umbilicus, HR 118, BP 96/62. Room 47: 31-year-old woman at 38 weeks, reports decreased fetal movement x 12 hours, FHR 130 with moderate variability, no decelerations. Room 40: 24-year-old woman in active labor, cervical exam 7 cm, pain 8/10, FHR 145 with accelerations, maternal vitals stable.",
      question: "The nurse receives report on four assigned clients. Which client should the nurse assess first?",
      options: [
        "Refer the client to a registered dietitian.",
        "Encourage a balanced diet rich in fruits and vegetables.",
        "Develop a personalized exercise plan.",
        "Discuss the importance of regular health screenings.",
      ],
      correctAnswer: "Refer the client to a registered dietitian.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 42|preeclampsia|clonus|epigastric/i);
    expect(
      fixed.options.every(
        (o) => !/registered dietitian|balanced diet rich in fruits|personalized exercise plan|regular health screenings/i.test(o)
      )
    ).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites med-surg prioritization vignette with unrelated flu vaccine options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "The nurse is assigned four clients on a medical-surgical unit. Room 518: A 58-year-old man, post-op day 1 from a knee replacement, is on PCA morphine. His respiratory rate is 8 breaths per minute, SpO₂ is 91% on room air, and he is somnolent but arousable with pinpoint pupils. Room 523: A 68-year-old woman with heart failure presents with hypotension (BP 88/54), tachycardia (HR 112), bilateral crackles, and SpO₂ of 91% on 2 L of nasal cannula, with a weight increase of 2 kg. Room 510: A 72-year-old man is experiencing a COPD exacerbation with a respiratory rate of 32 breaths per minute, SpO₂ of 86% on 2 L of oxygen, and is using accessory muscles to breathe while speaking in short phrases. Room 516: A 61-year-old woman has new-onset atrial fibrillation with a heart rate of 138, irregular rhythm, BP of 104/70, and is dizzy but alert while on telemetry.",
      question:
        "Select the one best response for this scenario.\nFour clients require attention. Which client is the highest priority for the nurse to see first?",
      options: [
        "Educate the client on the benefits of the flu vaccine.",
        "Administer the flu vaccine.",
        "Schedule a follow-up appointment for the vaccine.",
        "Check for any contraindications to the vaccine.",
      ],
      correctAnswer: "Administer the flu vaccine.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/highest priority.*see first/i);
    expect(fixed.correctAnswer).toMatch(/room 518|morphine|respiratory depression|naloxone|opioid|rr 8/i);
    expect(fixed.options.every((o) => !/flu vaccine|influenza vaccine/i.test(o))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });

  it("rewrites warfarin bleeding vignette with unrelated opioid and airway options", () => {
    const item: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "Medical-surgical unit, Room 378. 39-year-old man with deep vein thrombosis with anticoagulation. Started warfarin 3 days ago; INR drawn this morning. BP 126/80 mmHg, HR 88, RR 16. Unilateral calf swelling and warmth, INR 4.8, reports nosebleed and dark tarry stools.",
      scenario:
        "Medical-surgical unit, Room 378. 39-year-old man with deep vein thrombosis with anticoagulation. Started warfarin 3 days ago; INR drawn this morning. BP 126/80 mmHg, HR 88, RR 16. Unilateral calf swelling and warmth, INR 4.8, reports nosebleed and dark tarry stools.",
      question: "Which finding requires immediate nursing follow-up?",
      options: [
        "Provide supplemental oxygen via high-flow nasal cannula.",
        "Monitor vital signs every 5 minutes.",
        "Administer additional doses of naloxone.",
        "Intubate the client to secure the airway.",
      ],
      correctAnswer: "Provide supplemental oxygen via high-flow nasal cannula.",
      explanation: "Placeholder.",
      itemType: "vignette",
    };

    expect(detectNaplexFormatIssues(item).map((i) => i.code)).toContain(
      "naplex_clinical_vignette_unrelated_options"
    );

    const { item: fixed, changed } = fixNaplexFormatCoherence(item);
    expect(changed).toBe(true);
    expect(fixed.question).toMatch(/finding requires immediate nursing follow-up/i);
    expect(fixed.correctAnswer).toMatch(/inr|epistaxis|melena|bleed|tarry stool/i);
    expect(fixed.options.every((o) => !/naloxone|intubate|high-flow nasal cannula/i.test(o))).toBe(true);
    expect(fixed.options).toContain(fixed.correctAnswer);
    expect(itemHasFormatCoherenceIssue(fixed)).toBe(false);
  });
});
