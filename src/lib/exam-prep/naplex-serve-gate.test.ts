import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  isNaplexCuratedItem,
  curatedSampleTarget,
} from "@/lib/question-bank/naplex-curated";
import {
  naplexBankItemIsServeReady,
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
});
