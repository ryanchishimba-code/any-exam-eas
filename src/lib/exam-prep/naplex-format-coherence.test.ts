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
});
