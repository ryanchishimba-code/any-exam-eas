import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
  NAPLEX_BEST_MIN_SCORE,
} from "./naplex-quality-gate";

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

const weakItem: BankItem = {
  subjectId: "pharmacology",
  question: "NAPLEX 3: Which counseling point is most important?",
  options: ["Counsel on adherence", "A", "B", "C"],
  correctAnswer: "Counsel on adherence",
  explanation: "Counseling.",
};

describe("naplex-quality-gate", () => {
  it("accepts strong curated items as best tier", () => {
    const verdict = assessNaplexItemQuality(bestItem, { source: "seed" });
    expect(verdict.score).toBeGreaterThanOrEqual(NAPLEX_BEST_MIN_SCORE);
    expect(verdict.tier).toBe("best");
    expect(isNaplexBestQuality(bestItem, { source: "seed" })).toBe(true);
  });

  it("rejects weak template items", () => {
    const verdict = assessNaplexItemQuality(weakItem);
    expect(verdict.tier).toBe("reject");
    expect(verdict.ok).toBe(false);
    expect(isNaplexBestQuality(weakItem)).toBe(false);
  });
});
