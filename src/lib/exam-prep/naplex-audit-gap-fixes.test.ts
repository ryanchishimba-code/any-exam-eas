import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { auditNaplexBankItem } from "./naplex-bank-audit";
import {
  fixNaplexAuditGaps,
  mergePkCaseIntoScenario,
  NAPLEX_FOUNDATION_GAP_FIXES,
} from "./naplex-audit-gap-fixes";

describe("naplex audit gap fixes", () => {
  it("rewrites legacy foundation PK item", () => {
    const item: BankItem = {
      subjectId: "pharmacokinetics",
      question: "First-pass metabolism occurs mainly in:",
      options: ["Liver", "Kidney", "Lung only", "Skin"],
      correctAnswer: "Liver",
      explanation: "Reduces oral bioavailability.",
      tags: ["test"],
    };
    const { item: fixed } = fixNaplexAuditGaps(item, "cmqd1m10s002s1ychsrqo0soi");
    expect(fixed.vignette).toContain("oral morphine");
    expect(auditNaplexBankItem(fixed).ok).toBe(true);
  });

  it("merges PK calculation case line into scenario", () => {
    const item: BankItem = {
      subjectId: "pharmacokinetics",
      scenario: "A clinical pharmacist verifies dosing for Azelastine (Astelin) before dispensing.",
      question:
        "A 66-kg patient receives Azelastine at 3 mg/kg/day for allergic rhinitis.\n\nWhat is the total daily dose?",
      options: ["198 mg/day in divided doses", "3 mg once daily", "66 mg daily", "69 mg every 12 hours"],
      correctAnswer: "198 mg/day in divided doses",
      explanation: "Calculation rationale with enough characters to satisfy the audit gate for NAPLEX items in this test fixture.",
      tags: ["test"],
    };
    const merged = mergePkCaseIntoScenario(item);
    expect(merged?.scenario).toContain("66-kg");
    expect(merged?.question).toBe("What is the total daily dose?");
    expect(auditNaplexBankItem(merged!).issues.some((i) => i.code === "naplex_missing_clinical_data")).toBe(
      false
    );
  });

  it("covers all 25 foundation ids", () => {
    expect(Object.keys(NAPLEX_FOUNDATION_GAP_FIXES)).toHaveLength(25);
  });

  it("auto-rewrites bare legacy PK flashcard without hand-authored id map", () => {
    const item: BankItem = {
      subjectId: "pharmacokinetics",
      question: "First-pass metabolism occurs mainly in:",
      options: ["Liver", "Kidney", "Lung only", "Skin"],
      correctAnswer: "Liver",
      explanation: "Reduces oral bioavailability.",
      tags: ["test"],
    };
    const { item: fixed } = fixNaplexAuditGaps(item, "cmr31dd4e002sjs04llzlzqgk");
    expect(fixed.vignette).toContain("52-year-old");
    expect(fixed.question).toMatch(/Which organ/i);
    expect((fixed.explanation ?? "").length).toBeGreaterThanOrEqual(100);
    expect(auditNaplexBankItem(fixed).ok).toBe(true);
  });

  it("enriches sparse clinical vignette missing age and vitals", () => {
    const item: BankItem = {
      subjectId: "pharmacology",
      vignette: "Patient picking up extended-release oxycodone. State law requires consultation.",
      question: "Which opioid safety counseling is most essential?",
      options: ["Take extra doses for breakthrough pain", "Do not drive until stable", "Share with family", "Crush tablets"],
      correctAnswer: "Do not drive until stable",
      explanation:
        "Correct: Do not drive until stable — opioids cause sedation and impair reaction time; counsel on storage, disposal, and naloxone access as appropriate.",
      tags: ["test"],
    };
    const { item: fixed } = fixNaplexAuditGaps(item, "cmr31dgxr0078js04hkhi2rms");
    expect(fixed.vignette).toMatch(/52-year-old/);
    expect(auditNaplexBankItem(fixed).issues.some((i) => i.code === "naplex_missing_clinical_data")).toBe(
      false
    );
  });
});
