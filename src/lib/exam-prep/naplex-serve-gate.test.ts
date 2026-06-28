import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  isNaplexCuratedItem,
  curatedSampleTarget,
} from "@/lib/question-bank/naplex-curated";
import {
  naplexBankItemIsServeReady,
  prepareNaplexBankItem,
  prepareNaplexItemsForSession,
} from "@/lib/exam-prep/naplex-serve-gate";

const weakTemplate: BankItem = {
  subjectId: "pharmacology",
  question:
    "NAPLEX 12: Which counseling point is most important for ACE inhibitor used in cardiovascular pharmacotherapy?",
  options: [
    "Counsel on adherence, adverse effects, and monitoring for cardiovascular pharmacotherapy",
    "Stop therapy without informing the prescriber if any question arises",
    "Share medication with family members with similar symptoms",
    "Skip monitoring labs in all patients",
  ],
  correctAnswer:
    "Counsel on adherence, adverse effects, and monitoring for cardiovascular pharmacotherapy",
  explanation: "Patient counseling (NAPLEX hints).",
};

const bestItem: BankItem = {
  subjectId: "pharmacology",
  vignette:
    "A 64-year-old man with hypertension (BP 158/92 mmHg, creatinine 1.1 mg/dL) receives lisinopril (Zestril).",
  question: "Which monitoring parameter is most appropriate after initiation?",
  options: [
    "Serum potassium and creatinine within 1–2 weeks",
    "Daily fasting glucose only",
    "INR every 3 days",
    "No laboratory monitoring",
  ],
  correctAnswer: "Serum potassium and creatinine within 1–2 weeks",
  explanation:
    "Correct: serum potassium and creatinine — lisinopril is an ACE inhibitor; renal function and hyperkalemia risk require monitoring after initiation. Why other options are incorrect: fasting glucose alone misses electrolyte effects.",
  tags: ["physician-educator", "high-yield"],
};

describe("naplex-curated", () => {
  it("detects curated sources and tags", () => {
    expect(isNaplexCuratedItem({ tags: ["physician-educator"], source: "seed" })).toBe(true);
    expect(isNaplexCuratedItem({ tags: ["naplex-polished"], source: "polished" })).toBe(true);
    expect(isNaplexCuratedItem({ tags: ["bulk-bank"], source: "generated" })).toBe(false);
  });

  it("prioritizes curated items in practice pulls", () => {
    expect(curatedSampleTarget(10, 20)).toBe(9);
    expect(curatedSampleTarget(10, 2)).toBe(2);
    expect(curatedSampleTarget(10, 0)).toBe(0);
  });
});

describe("naplex-serve-gate", () => {
  it("rejects weak template items", () => {
    expect(naplexBankItemIsServeReady(weakTemplate)).toBe(false);
  });

  it("accepts best-tier curated items", () => {
    expect(naplexBankItemIsServeReady(bestItem)).toBe(true);
    const prepared = prepareNaplexItemsForSession({
      items: [bestItem],
      fieldId: "pharmacy",
      field: "pharmacy",
      limit: 1,
    });
    expect(prepared).toHaveLength(1);
  });

  it("filters weak templates before session spread", () => {
    const prepared = prepareNaplexItemsForSession({
      items: [weakTemplate, bestItem],
      fieldId: "pharmacy",
      field: "pharmacy",
      limit: 2,
    });
    expect(prepared).toHaveLength(1);
    expect(prepared[0]!.question).toBe(bestItem.question);
  });

  it("repairs constructed_response items mislabeled as numeric counseling MCQs", () => {
    const broken: BankItem = {
      subjectId: "patient-counseling",
      vignette:
        "A 6-year-old girl with asthma uses albuterol multiple times daily. The mother asks about montelukast dosing.",
      question: "Which counseling point is most important regarding montelukast in this pediatric patient?",
      options: [
        "Montelukast should be taken in the morning for optimal effect.",
        "Montelukast can be used as a rescue medication during asthma attacks.",
        "Montelukast should be taken at least 1 hour before or 2 hours after meals.",
        "Montelukast is not recommended for children under 2 years of age.",
      ],
      correctAnswer: "12",
      explanation:
        "It is important to counsel the mother that montelukast should be taken at least 1 hour before or 2 hours after meals.",
      distractorRationale: {
        "Montelukast should be taken in the morning for optimal effect.": "Any time of day is acceptable.",
        "Montelukast can be used as a rescue medication during asthma attacks.": "Maintenance only.",
        "Montelukast is not recommended for children under 2 years of age.": "Approved from 6 months.",
      },
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit: "mg" },
    };

    const prepared = prepareNaplexBankItem(broken);
    expect(prepared.itemType).toBe("vignette");
    expect(prepared.options).toHaveLength(4);
    expect(prepared.correctAnswer).toBe(
      "Montelukast should be taken at least 1 hour before or 2 hours after meals."
    );
  });
});
