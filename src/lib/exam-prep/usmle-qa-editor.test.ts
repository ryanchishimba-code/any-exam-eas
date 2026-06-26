import { describe, expect, it } from "vitest";
import { auditUsmleQaEditor, summarizeUsmleQaBatch } from "./usmle-qa-editor";
import type { BankItem } from "@/lib/question-bank";

const strongItem: BankItem = {
  subjectId: "nephrology",
  vignette: `A 68-year-old man with type 2 diabetes and hypertension is brought from a skilled nursing facility because he has been sleepier than usual for two days. He missed two dialysis sessions last week. On arrival he is oriented only to person. Blood pressure 102/58 mm Hg, pulse 58/min. Laboratory studies show K⁺ 6.8 mEq/L, creatinine 4.1 mg/dL. ECG: peaked T waves, widened QRS.`,
  question: "Which of the following is the most appropriate immediate management?",
  options: [
    "Intravenous calcium gluconate",
    "Oral sodium polystyrene sulfonate",
    "Intravenous furosemide alone",
    "Emergent hemodialysis without stabilization",
  ],
  correctAnswer: "Intravenous calcium gluconate",
  explanation:
    "Life-threatening hyperkalemia with ECG changes requires IV calcium first for myocardial membrane stabilization. Incorrect: PSP alone is too slow for emergency; furosemide alone inadequate with oliguria; dialysis is needed but not before stabilization. Key finding: K⁺ 6.8 with peaked T waves.",
  tags: ["physician-educator", "hyperkalemia"],
  difficulty: 4,
};

describe("usmle-qa-editor", () => {
  it("scores strong physician-educator vignettes highly", () => {
    const report = auditUsmleQaEditor(strongItem, {
      fieldId: "usmle-step-2",
      source: "seed",
      itemId: "test-1",
      difficulty: 4,
    });
    expect(report.overallScore).toBeGreaterThanOrEqual(7.5);
    expect(report.scores.vignetteQuality).toBeGreaterThanOrEqual(7);
    expect(report.examReady || report.overallScore >= 7).toBe(true);
  });

  it("allows Step 1 foundation recall items without a separated vignette", () => {
    const recall: BankItem = {
      subjectId: "biochemistry",
      question: "Von Gierke disease involves deficiency of:?",
      options: [
        "Von Gierke disease (GSD I)",
        "Pompe disease",
        "McArdle disease",
        "Tay-Sachs disease",
      ],
      correctAnswer: "Von Gierke disease (GSD I)",
      explanation:
        "G6Pase deficiency impairs gluconeogenesis and glycogenolysis, causing severe fasting hypoglycemia. Key concept: Von Gierke disease (GSD I).",
      tags: ["seed"],
      source: "seed",
    };
    const report = auditUsmleQaEditor(recall, {
      fieldId: "usmle-step-1",
      source: "seed",
      itemId: "recall-1",
    });
    expect(report.issues.some((i) => i.code === "missing_vignette" && i.severity === "error")).toBe(false);
  });

  it("flags thin items without vignettes", () => {
    const weak: BankItem = {
      subjectId: "pathology",
      question: "What is the mechanism?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Because A is correct.",
      tags: ["generated"],
    };
    const report = auditUsmleQaEditor(weak, { fieldId: "usmle-step-1", source: "bulk-bank" });
    expect(report.overallScore).toBeLessThan(6);
    expect(report.issues.some((i) => i.code === "missing_vignette")).toBe(true);
  });

  it("summarizes batch averages", () => {
    const a = auditUsmleQaEditor(strongItem, { fieldId: "usmle-step-2", source: "seed" });
    const b = auditUsmleQaEditor(
      { ...strongItem, vignette: undefined, question: "Which diagnosis?" },
      { fieldId: "usmle-step-2", source: "polished" }
    );
    const summary = summarizeUsmleQaBatch([a, b]);
    expect(summary.total).toBe(2);
    expect(summary.averageOverall).toBeGreaterThan(0);
    expect(summary.topIssueCodes.length).toBeGreaterThan(0);
  });
});
