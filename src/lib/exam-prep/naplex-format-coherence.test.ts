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
});
