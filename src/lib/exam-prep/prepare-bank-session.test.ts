import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";

vi.mock("./serve-qa-passed", () => ({
  serveQaPassedBankItems: vi.fn((items: BankItem[], limit: number) => items.slice(0, limit)),
}));

import { prepareBankItemsForSession } from "./prepare-bank-session";
import { serveQaPassedBankItems } from "./serve-qa-passed";

const row = (id: string): BankItem => ({
  id,
  subjectId: "med-surg",
  question: `Question ${id}?`,
  options: ["A", "B", "C", "D"],
  correctAnswer: "A",
  explanation: "Test",
});

describe("prepareBankItemsForSession", () => {
  it("skipRuntimeGate slices without re-running diverse selection", () => {
    const pool = [row("1"), row("2"), row("3"), row("4"), row("5")];
    const out = prepareBankItemsForSession({
      fieldId: "nursing",
      field: "nursing",
      items: pool,
      limit: 3,
      skipRuntimeGate: true,
    });

    expect(out).toHaveLength(3);
    expect(out.map((i) => i.id)).toEqual(["1", "2", "3"]);
    expect(serveQaPassedBankItems).not.toHaveBeenCalled();
  });

  it("topicPractice returns the full vetted pool for finalize to select from", () => {
    const pool = Array.from({ length: 30 }, (_, i) => ({
      id: String(i),
      subjectId: "pharmacology",
      question: "Which monitoring parameter is most appropriate after initiation?",
      vignette: `A 64-year-old man case ${i} with hypertension receives lisinopril.`,
      options: ["Serum potassium and creatinine within 1–2 weeks", "B", "C", "D"],
      correctAnswer: "Serum potassium and creatinine within 1–2 weeks",
      explanation:
        "Correct: serum potassium and creatinine — ACE inhibitor initiation requires renal and electrolyte monitoring within 1–2 weeks per standard guidance.",
      tags: ["physician-educator", "high-yield"],
      source: "curated",
    }));

    const out = prepareBankItemsForSession({
      fieldId: "pharmacy",
      field: "pharmacy",
      items: pool,
      limit: 25,
      topicPractice: true,
    });

    expect(out).toHaveLength(30);
    expect(new Set(out.map((i) => i.id)).size).toBe(30);
  });
});
