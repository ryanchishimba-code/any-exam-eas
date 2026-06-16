import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "./bank-audit";

function item(partial: Partial<BankItem> & Pick<BankItem, "question" | "options" | "correctAnswer" | "explanation">): BankItem {
  return {
    subjectId: "med-surg",
    ...partial,
  };
}

describe("auditBankItem", () => {
  it("flags priority hypoxemia with BP-only correct answer", () => {
    const report = auditBankItem(
      item({
        scenario:
          "Medical-surgical unit, Room 307. A 69-year-old man with COPD exacerbation. BP 148/86 mmHg, HR 104, RR 32, SpO₂ 86% on 2 L nasal cannula. Use of accessory muscles, speaking in short phrases.",
        question: "Which assessment finding should the nurse address first?",
        options: [
          "Notify the provider immediately and reassess bp 148/86 mmhg; prepare for urgent intervention related to use of accessory muscles",
          "Delegate reassessment to UAP without RN follow-up on abnormal data",
          "Document the finding and recheck at the next routine vital sign round in 4 hours",
          "Reassure the client that the finding is expected and requires no further action",
        ],
        correctAnswer:
          "Notify the provider immediately and reassess bp 148/86 mmhg; prepare for urgent intervention related to use of accessory muscles",
        explanation:
          "Hypoxemia and increased work of breathing require immediate respiratory intervention; reassess oxygen delivery and notify the provider.",
      }),
      "nursing"
    );
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.code === "priority_hypoxemia_mismatch")).toBe(true);
  });

  it("does not flag deictic stem when the vignette is embedded in the question", () => {
    const report = auditBankItem(
      item({
        question:
          "A 58-year-old man presents to the emergency department with crushing substernal chest pain for 45 minutes. Vital signs: BP 156/92 mmHg, HR 98, RR 18, SpO₂ 96% on room air. ECG shows ST elevation in leads II, III, aVF; troponin I 2.8 ng/mL.\n\nWhich pathophysiologic process is most likely responsible for these findings?",
        options: [
          "Acute coronary thrombosis with transmural ischemia",
          "Pericardial inflammation causing diffuse ST elevation",
          "Pulmonary embolism causing right heart strain",
          "Coronary vasospasm without plaque rupture",
        ],
        correctAnswer: "Acute coronary thrombosis with transmural ischemia",
        explanation:
          "Inferior ST elevations with elevated troponin indicate transmural ischemia from acute coronary occlusion in the RCA territory.",
      }),
      "usmle-step-1"
    );
    expect(report.issues.some((i) => i.code === "orphan_deictic_stem")).toBe(false);
    expect(report.ok).toBe(true);
  });

  it("flags generic placeholder answer choices", () => {
    const report = auditBankItem(
      item({
        question: "Which pathophysiologic process is most likely responsible for these findings?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "An explanation long enough to pass the minimum length check for audits.",
      }),
      "usmle-step-1"
    );
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.code === "generic_placeholder_options")).toBe(true);
  });

  it("still flags deictic stem with no vignette anywhere", () => {
    const report = auditBankItem(
      item({
        question: "Which pathophysiologic process is most likely responsible for these findings?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "An explanation long enough to pass the minimum length check for audits.",
      }),
      "usmle-step-1"
    );
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.code === "orphan_deictic_stem")).toBe(true);
  });

  it("accepts K-type items with seven combined-response options", () => {
    const report = auditBankItem(
      item({
        itemType: "k_type",
        question: "Regarding DSCSA product tracing at a retail pharmacy, which statements are correct?",
        options: [
          "I only",
          "II only",
          "III only",
          "I and II only",
          "I and III only",
          "II and III only",
          "All of the above",
        ] as unknown as BankItem["options"],
        correctAnswer: "I and III only",
        explanation: "Statements I and III reflect DSCSA tracing requirements; II is incorrect.",
      }),
      "pance"
    );
    expect(report.issues.some((i) => i.code === "invalid_option_count")).toBe(false);
    expect(report.ok).toBe(true);
  });

  it("accepts select-all items with |||-joined correct answers", () => {
    const report = auditBankItem(
      item({
        itemType: "select_all",
        question: "Which steps are required after a significant theft of C-II stock? Select all that apply.",
        options: [
          "File DEA Form 106",
          "Notify local law enforcement as required",
          "Update perpetual inventory and investigate root cause",
          "Resume dispensing C-II without documentation to avoid backlog",
          "Notify the state board of pharmacy if required",
        ] as unknown as BankItem["options"],
        correctAnswer:
          "File DEA Form 106|||Notify local law enforcement as required|||Update perpetual inventory and investigate root cause|||Notify the state board of pharmacy if required",
        explanation: "DEA Form 106, law enforcement and board notification, and inventory reconciliation are required.",
      }),
      "pance"
    );
    expect(report.issues.some((i) => i.severity === "error")).toBe(false);
    expect(report.ok).toBe(true);
  });

  it("rejects select-all items whose answers do not match options", () => {
    const report = auditBankItem(
      item({
        itemType: "select_all",
        question: "Which records should be available during a routine board inspection? Select all that apply.",
        options: [
          "Prescription files",
          "Perpetual inventory",
          "Master formulation records",
          "Employee credit reports",
        ] as unknown as BankItem["options"],
        correctAnswer: "Prescription files|||Truncated answer that matches nothi",
        explanation: "Only board-relevant records are required to be produced during inspection.",
      }),
      "pance"
    );
    expect(report.issues.some((i) => i.code === "correct_not_in_options")).toBe(true);
    expect(report.ok).toBe(false);
  });

  it("passes valid four-option MCQ", () => {
    const report = auditBankItem(
      item({
        vignette:
          "A 72-year-old woman (BP 118/70 mmHg, creatinine 1.0 mg/dL) takes lisinopril for hypertension.",
        question: "Which lab value best indicates dehydration among the following results?",
        options: ["Sodium 142 mEq/L", "BUN 28 mg/dL", "Potassium 4.0 mEq/L", "Creatinine 0.9 mg/dL"],
        correctAnswer: "BUN 28 mg/dL",
        explanation:
          "Correct: BUN 28 mg/dL — an elevated BUN relative to creatinine supports prerenal azotemia/dehydration in this clinical context.",
      }),
      "pharmacy"
    );
    expect(report.ok).toBe(true);
  });
});
