import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import {
  normalizeUsmleBankItemFields,
  prepareUsmleItemsForSession,
  splitUsmleBankItem,
  usmleBankItemHasClinicalScenario,
  usmleBankItemIsServeReady,
} from "./usmle-clinical-gate";

const richCombined: BankItem = {
  subjectId: "cardiology",
  question: `A 58-year-old man presents to the emergency department with crushing chest pain for 45 minutes. He has hypertension and smokes. BP 148/92 mm Hg, HR 96/min, diaphoretic. ECG shows ST elevation in leads II, III, and aVF.

Which of the following is the most appropriate next step in management?`,
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "STEMI inferior wall — activate cath lab and reperfusion pathway.",
};

const bareStem: BankItem = {
  subjectId: "cardiology",
  question: "Which mechanism best explains diuretic resistance?",
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Loop diuretic adaptation requires longer teaching rationale.",
};

const examReadyRich: BankItem = {
  ...richCombined,
  explanation:
    "STEMI inferior wall — activate cath lab and reperfusion. Option B is wrong because nitrates without reperfusion delay definitive care. Option C is wrong because heparin alone does not restore flow. Option D is wrong because observation misses time-sensitive reperfusion.",
  tags: ["physician-educator", "clinical-vignette", "cardiology"],
};

describe("usmle-clinical-gate", () => {
  it("splits combined vignette + stem from question text", () => {
    const split = splitUsmleBankItem(richCombined);
    expect(split.vignette).toMatch(/58-year-old man/i);
    expect(split.stem).toMatch(/most appropriate next step/i);
  });

  it("accepts rich clinical scenarios and rejects bare stems", () => {
    expect(usmleBankItemHasClinicalScenario(richCombined)).toBe(true);
    expect(usmleBankItemHasClinicalScenario(bareStem)).toBe(false);
  });

  it("normalizes bank items into separate vignette and stem fields", () => {
    const normalized = normalizeUsmleBankItemFields(richCombined);
    expect(normalized.vignette).toBeTruthy();
    expect(normalized.question).not.toMatch(/58-year-old man/);
  });

  it("maps normalized items to exam questions with vignette block", () => {
    const exam = bankItemToUsmleExam(normalizeUsmleBankItemFields(richCombined), 0);
    expect(exam.vignette).toMatch(/58-year-old/i);
    expect(exam.question).toMatch(/next step/i);
  });

  it("requires exam-ready QA for all served items", () => {
    expect(usmleBankItemIsServeReady(bareStem, "usmle-step-2")).toBe(false);
    expect(usmleBankItemIsServeReady(examReadyRich, "usmle-step-2")).toBe(true);
  });

  it("filters stale qaPassed rows that fail runtime clinical audit", () => {
    const prepared = prepareUsmleItemsForSession({
      items: [bareStem, examReadyRich],
      fieldId: "usmle-step-2",
      field: "usmle-step-2",
      limit: 2,
    });

    expect(prepared).toHaveLength(1);
    expect(prepared[0]!.question).toBe(examReadyRich.question);
  });
});
