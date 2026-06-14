import { describe, expect, it } from "vitest";
import { MPJE_QUESTION_BANK, filterMpjeBestSeeds } from "@/lib/mpje/seed-questions";
import {
  getHealthBankItems,
  getHealthBankSubjectIds,
} from "@/lib/health-sciences-question-bank";
import { collectSeedQuestionRows } from "@/lib/question-bank-seed";
import { isMpjeBestQuality } from "@/lib/exam-prep/mpje-quality-gate";

describe("MPJE_QUESTION_BANK", () => {
  it("ships only A+ best-tier questions in the active bank", () => {
    const total = Object.values(MPJE_QUESTION_BANK).reduce((n, items) => n + items.length, 0);
    expect(total).toBeGreaterThanOrEqual(18);
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    expect(all.every((q) => isMpjeBestQuality(q, { source: "seed" }))).toBe(true);
  });

  it("includes Oklahoma state practice act questions", () => {
    const okItems = Object.values(MPJE_QUESTION_BANK)
      .flat()
      .filter((q) => q.tags?.includes("oklahoma") || q.stateCode === "OK");
    expect(okItems.length).toBeGreaterThan(0);
  });

  it("each item has valid options and correct answer encoding", () => {
    for (const items of Object.values(MPJE_QUESTION_BANK)) {
      for (const item of items) {
        expect(item.options.length).toBeGreaterThanOrEqual(4);
        if (item.itemType === "select_all") {
          const parts = item.correctAnswer.split("|||");
          for (const p of parts) expect(item.options).toContain(p);
        } else if (item.itemType === "k_type") {
          expect(item.options).toHaveLength(7);
          expect(item.options).toContain(item.correctAnswer);
        } else {
          expect(item.options).toContain(item.correctAnswer);
        }
      }
    }
  });

  it("filterMpjeBestSeeds is idempotent on the active bank", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    expect(filterMpjeBestSeeds(all)).toHaveLength(all.length);
  });
});

describe("HEALTH_QUESTION_BANK mpje", () => {
  it("registers mpje field for seed collection", () => {
    const ids = getHealthBankSubjectIds("mpje");
    expect(ids.length).toBeGreaterThan(0);
    expect(getHealthBankItems("mpje", "state-practice-act").length).toBeGreaterThan(0);
  });

  it("collectSeedQuestionRows includes only best-tier mpje rows in the bank", () => {
    const mpjeRows = collectSeedQuestionRows().filter((r) => r.fieldId === "mpje");
    expect(mpjeRows.length).toBeGreaterThanOrEqual(18);
    expect(mpjeRows.every((r) => isMpjeBestQuality(r.item, { source: "seed" }))).toBe(true);
  });
});
