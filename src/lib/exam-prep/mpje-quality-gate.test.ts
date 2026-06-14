import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { MPJE_QUESTION_BANK, filterMpjeBestSeeds } from "@/lib/mpje/seed-questions";
import {
  assessMpjeItemQuality,
  isMpjeBestQuality,
} from "./mpje-quality-gate";

describe("mpje-quality-gate", () => {
  it("physician-educator batch items are all best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_01) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
      expect(verdict.score).toBeGreaterThanOrEqual(8.5);
    }
  });

  it("active MPJE_QUESTION_BANK only contains best-tier seeds", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    expect(all.length).toBeGreaterThan(0);
    for (const item of all) {
      expect(isMpjeBestQuality(item, { source: "seed" })).toBe(true);
    }
  });

  it("rejects bare recall stems without patient scenarios", () => {
    const recall: BankItem = {
      subjectId: "controlled-substances",
      question: "Federal law (DEA) permits how many refills on a Schedule II (C-II) prescription?",
      options: [
        "No refills — a new prescription is required",
        "Up to five refills within six months",
        "Unlimited refills if the patient requests them",
        "Three refills within one year",
      ],
      correctAnswer: "No refills — a new prescription is required",
      explanation: "Schedule II controlled substances cannot be refilled under federal law.",
    };
    const verdict = assessMpjeItemQuality(recall);
    expect(verdict.tier).toBe("reject");
    expect(verdict.score).toBeLessThan(6.5);
  });

  it("filterMpjeBestSeeds drops sub-threshold items", () => {
    const mixed = [
      ...filterMpjeBestSeeds(Object.values(MPJE_QUESTION_BANK).flat()),
      {
        subjectId: "uniform-mpje",
        question: "Under typical uniform MPJE patterns, a valid prescription must generally include which element?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        explanation: "Too short for A+ bar.",
      } satisfies BankItem,
    ];
    const filtered = filterMpjeBestSeeds(mixed);
    expect(filtered.length).toBe(Object.values(MPJE_QUESTION_BANK).flat().length);
  });
});
