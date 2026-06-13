import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  curateNaplexBankItem,
  triageNaplexBankItem,
  validateCuratedNaplexItem,
} from "@/lib/engine/curation";

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

const strongItem: BankItem = {
  subjectId: "pharmacology",
  question:
    "A 64-year-old man with hypertension and type 2 diabetes (BP 158/92 mmHg, creatinine 1.1 mg/dL) receives lisinopril (Zestril). Which counseling point is most essential before discharge?\n\nWhich monitoring parameter is priority?",
  options: [
    "Serum potassium and creatinine within 1–2 weeks of initiation or dose change",
    "Daily fasting blood glucose only — renal function is not relevant",
    "INR every 3 days regardless of concurrent anticoagulation",
    "No laboratory monitoring is required for ACE inhibitors",
  ],
  correctAnswer:
    "Serum potassium and creatinine within 1–2 weeks of initiation or dose change",
  explanation:
    "Correct: serum potassium and creatinine — lisinopril (Zestril) is an ACE inhibitor; renal function and hyperkalemia risk require monitoring after initiation. Why other options are incorrect: fasting glucose alone misses electrolyte/renal effects; INR is not indicated without anticoagulation; ACE inhibitors require baseline and follow-up labs per guidelines.",
};

describe("naplex-curation-engine", () => {
  it("triages weak template items as needing polish", () => {
    const triage = triageNaplexBankItem(weakTemplate);
    expect(triage.needsPolish).toBe(true);
    expect(triage.qaGateOk).toBe(false);
    expect(triage.issueCodes).toContain("weak_naplex_correct");
  });

  it("passes strong items through triage", () => {
    const triage = triageNaplexBankItem(strongItem);
    expect(triage.naplexAuditOk).toBe(true);
    expect(triage.qualityScore).toBeGreaterThan(0.5);
  });

  it("curates weak items via rule polish without AI", async () => {
    const result = await curateNaplexBankItem(weakTemplate, "pharmacology", {
      useAi: false,
      subjectLabel: "General Pharmacology",
      seed: 42,
    });

    expect(result.changed).toBe(true);
    expect(result.stage).toBe("rule_polish");
    expect(result.aiUsed).toBe(false);
    expect(result.qualityAfter).toBeGreaterThan(result.qualityBefore);
    expect(result.item.question).not.toMatch(/^NAPLEX\s+\d+:/i);
    expect(result.item.options).toContain(result.item.correctAnswer);
  });

  it("validates curated items against NAPLEX QA gates", () => {
    const weakValidation = validateCuratedNaplexItem(weakTemplate);
    expect(weakValidation.ok).toBe(false);

    const strongValidation = validateCuratedNaplexItem(strongItem);
    expect(strongValidation.ok).toBe(true);
  });

  it("returns pass stage for already-strong items", async () => {
    const result = await curateNaplexBankItem(strongItem, "pharmacology", {
      useAi: false,
    });
    expect(result.stage).toBe("pass");
    expect(result.changed).toBe(false);
  });
});
