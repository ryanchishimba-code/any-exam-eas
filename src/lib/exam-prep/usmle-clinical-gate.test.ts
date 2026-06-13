import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import {
  normalizeUsmleBankItemFields,
  prepareUsmleItemsForSession,
  splitUsmleBankItem,
  usmleBankItemHasClinicalScenario,
} from "./usmle-clinical-gate";

const richCombined: BankItem = {
  subjectId: "cardiology",
  question: `A 58-year-old man presents to the emergency department with crushing chest pain for 45 minutes. He has hypertension and smokes. BP 148/92 mm Hg, HR 96/min, diaphoretic. ECG shows ST elevation in leads II, III, and aVF.

Which of the following is the most appropriate next step in management?`,
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "STEMI inferior wall — activate cath lab.",
};

const bareStem: BankItem = {
  subjectId: "cardiology",
  question: "Which mechanism best explains diuretic resistance?",
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Loop diuretic adaptation.",
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

  it("filters weak items and repairs polishable ones in session prep", () => {
    const prepared = prepareUsmleItemsForSession({
      items: [bareStem, richCombined],
      fieldId: "usmle-step-2",
      field: "usmle-step-2",
      limit: 2,
    });

    expect(prepared.length).toBeGreaterThan(0);
    for (const item of prepared) {
      expect(usmleBankItemHasClinicalScenario(item)).toBe(true);
    }
  });
});
