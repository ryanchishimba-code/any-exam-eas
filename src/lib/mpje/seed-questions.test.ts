import { describe, expect, it } from "vitest";
import { MPJE_QUESTION_BANK } from "@/lib/mpje/seed-questions";
import {
  getHealthBankItems,
  getHealthBankSubjectIds,
} from "@/lib/health-sciences-question-bank";
import { collectSeedQuestionRows } from "@/lib/question-bank-seed";

describe("MPJE_QUESTION_BANK", () => {
  it("includes at least 50 questions across subjects and states", () => {
    const total = Object.values(MPJE_QUESTION_BANK).reduce((n, items) => n + items.length, 0);
    expect(total).toBeGreaterThanOrEqual(50);
  });

  it("includes Oklahoma state practice act questions", () => {
    const okItems = MPJE_QUESTION_BANK["state-practice-act"] ?? [];
    expect(okItems.some((q) => q.tags?.includes("oklahoma"))).toBe(true);
  });

  it("each item has four options and a valid correct answer", () => {
    for (const items of Object.values(MPJE_QUESTION_BANK)) {
      for (const item of items) {
        expect(item.options).toHaveLength(4);
        expect(item.options).toContain(item.correctAnswer);
      }
    }
  });
});

describe("HEALTH_QUESTION_BANK mpje", () => {
  it("registers mpje field for seed collection", () => {
    const ids = getHealthBankSubjectIds("mpje");
    expect(ids.length).toBeGreaterThan(0);
    expect(getHealthBankItems("mpje", "state-practice-act").length).toBeGreaterThan(0);
  });

  it("collectSeedQuestionRows includes mpje rows", () => {
    const mpjeRows = collectSeedQuestionRows().filter((r) => r.fieldId === "mpje");
    expect(mpjeRows.length).toBeGreaterThanOrEqual(50);
  });
});
