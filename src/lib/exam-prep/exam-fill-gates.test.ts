import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { timedExamGatePairForField } from "./exam-fill-gates";
import { nclexItemPassesStructuralTimedGate, nclexItemPassesTimedExamGate } from "./nclex-serve-gate";
import { usmleBankItemPassesStructuralGate } from "./usmle-clinical-gate";
import * as usmleQaEditor from "./usmle-qa-editor";

const nclexRow = (overrides: Partial<BankItem> = {}): BankItem => ({
  id: "nclex-1",
  subjectId: "med-surg",
  question:
    "A nurse is caring for a client with heart failure. Which finding should the nurse report to the provider first?",
  options: [
    "Weight gain of 2 lb in 24 hours",
    "Crackles in bilateral lung bases",
    "Fatigue after ambulating to the bathroom",
    "Dependent edema in both lower extremities",
  ],
  correctAnswer: "Crackles in bilateral lung bases",
  explanation:
    "Crackles suggest pulmonary edema from fluid overload and require immediate provider notification.",
  qaPassed: true,
  ...overrides,
});

const usmleRow = (overrides: Partial<BankItem> = {}): BankItem => ({
  id: "usmle-1",
  subjectId: "cardiology",
  question:
    "A 62-year-old man with type 2 diabetes presents with chest pressure. What is the most appropriate next step?",
  options: ["Obtain ECG", "Start aspirin", "Order troponin", "Schedule stress test"],
  correctAnswer: "Obtain ECG",
  explanation:
    "Acute chest pressure in a diabetic patient requires immediate ECG to evaluate for acute coronary syndrome.",
  clinicalVignette:
    "A 62-year-old man with type 2 diabetes, hypertension, and hyperlipidemia presents to the emergency department with 45 minutes of substernal chest pressure. He is diaphoretic. BP 148/92 mm Hg, HR 102/min, RR 18/min, SpO2 96% on room air.",
  vignette:
    "A 62-year-old man with type 2 diabetes, hypertension, and hyperlipidemia presents to the emergency department with 45 minutes of substernal chest pressure. He is diaphoretic. BP 148/92 mm Hg, HR 102/min, RR 18/min, SpO2 96% on room air.",
  qaPassed: true,
  ...overrides,
});

describe("timedExamGatePairForField", () => {
  it("uses structural gates as primary for clinical fields", () => {
    const nursing = timedExamGatePairForField("nursing");
    const aanp = timedExamGatePairForField("aanp-fnp");

    expect(nursing.strict).toBe(nclexItemPassesStructuralTimedGate);
    expect(nursing.relaxed).toBeDefined();
    expect(aanp.strict(usmleRow())).toBe(true);
    expect(aanp.relaxed).toBeDefined();
  });

  it("structural NCLEX gate accepts qaPassed rows that fail full serve audit", () => {
    const item = nclexRow();
    expect(nclexItemPassesStructuralTimedGate(item)).toBe(true);
    expect(nclexItemPassesTimedExamGate(item)).toBe(false);
  });

  it("structural USMLE gate skips editorial re-audit", () => {
    const auditSpy = vi.spyOn(usmleQaEditor, "auditUsmleQaEditor");
    const item = usmleRow();

    expect(usmleBankItemPassesStructuralGate(item, "aanp-fnp")).toBe(true);
    expect(auditSpy).not.toHaveBeenCalled();

    auditSpy.mockRestore();
  });
});
