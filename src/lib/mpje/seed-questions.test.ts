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

  it("includes K-type and SATA variety in v2 seeds", () => {
    const all = Object.values(MPJE_QUESTION_BANK).flat();
    const kType = all.filter((q) => q.itemType === "k_type");
    const sata = all.filter((q) => q.itemType === "select_all");
    expect(kType.length).toBeGreaterThanOrEqual(15);
    expect(sata.length).toBeGreaterThanOrEqual(5);
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
