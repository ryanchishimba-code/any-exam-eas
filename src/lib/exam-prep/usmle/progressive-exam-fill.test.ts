import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import type { RawQuestionInput } from "@/lib/questions/types";
import {
  finalizeUsmleExamSessionQuestions,
  gatherUsmleTimedExamBankItems,
} from "./progressive-exam-fill";

function bankItem(id: string, overrides: Partial<BankItem> = {}): BankItem {
  return {
    id,
    subjectId: "cardiology",
    question: `A 45-year-old man presents with chest pain. What is the diagnosis for case ${id}?`,
    vignette: `A 45-year-old man presents with substernal chest pain radiating to the left arm for case ${id}.`,
    options: ["STEMI", "Pericarditis", "Aortic dissection", "Pulmonary embolism"],
    correctAnswer: "STEMI",
    explanation:
      "Board-style rationale explaining why STEMI is correct for this presentation and why alternatives are less likely.",
    ...overrides,
  };
}

function rawInput(id: string, overrides: Partial<RawQuestionInput> = {}): RawQuestionInput {
  return {
    id,
    bankItemId: id,
    type: "multiple_choice",
    question: `Question stem for ${id}?`,
    vignette: `Clinical vignette detail for ${id} with enough context to distinguish cases.`,
    options: [`A-${id}`, `B-${id}`, `C-${id}`, `D-${id}`],
    correctAnswer: `A-${id}`,
    explanation:
      "Detailed explanation with board-style clinical teaching rationale for the correct answer.",
    subjectId: "cardiology",
    ...overrides,
  };
}

describe("finalizeUsmleExamSessionQuestions", () => {
  it("fills the requested count via progressive relaxation", () => {
    const pool = Array.from({ length: 300 }, (_, i) => rawInput(`q-${i}`));
    const { prepared, quality } = finalizeUsmleExamSessionQuestions(pool, 280);
    expect(prepared).toHaveLength(280);
    expect(quality.ok).toBe(true);
    expect(quality.returned).toBe(280);
  });

  it("relaxes dedupe for short exams when clinical-case keys collide", () => {
    const sharedVignette = "Shared inpatient ward vignette with progressive dyspnea.";
    const pool = Array.from({ length: 60 }, (_, i) =>
      rawInput(`short-${i}`, {
        vignette: sharedVignette,
        question: `Different lead-in ${i}?`,
      })
    );
    const { prepared, quality } = finalizeUsmleExamSessionQuestions(pool, 50);
    expect(prepared).toHaveLength(50);
    expect(quality.ok).toBe(true);
  });
});

describe("gatherUsmleTimedExamBankItems", () => {
  it("exports progressive gather for integration", () => {
    expect(typeof gatherUsmleTimedExamBankItems).toBe("function");
    expect(typeof bankItem("x").question).toBe("string");
  });
});
