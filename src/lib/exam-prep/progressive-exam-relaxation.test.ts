import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  EXACT_FILL_COMPOSE_TIER,
  USER_FACING_PROGRESSIVE_TIERS,
} from "@/lib/exam-prep/progressive-compose";
import {
  fillExamItemsToCount,
  maxGatherTierIndexForComposeTier,
  resolveComposePoolLimit,
  tierSkipsFinalUniqueness,
} from "@/lib/exam-prep/progressive-exam-relaxation";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";

function item(id: string, concept = "sepsis"): BankItem {
  return {
    id,
    subjectId: concept,
    question: `Question stem for ${id}?`,
    vignette: `Clinical vignette for ${id} with enough detail to be unique.`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Board-style rationale.",
  };
}

describe("progressive exam relaxation framework", () => {
  it("user-facing tiers include exact-fill guarantee tier", () => {
    expect(USER_FACING_PROGRESSIVE_TIERS.at(-1)?.id).toBe("exact-fill");
    expect(USER_FACING_PROGRESSIVE_TIERS.every((tier) => tier.minFillRatio === 1)).toBe(true);
  });

  it("maps compose tiers to progressively wider gather ladders", () => {
    const strict = USER_FACING_PROGRESSIVE_TIERS[0]!;
    const relaxed = USER_FACING_PROGRESSIVE_TIERS.find((tier) => tier.id === "relaxed")!;
    const exact = EXACT_FILL_COMPOSE_TIER;

    expect(maxGatherTierIndexForComposeTier("nursing", strict)).toBe(0);
    expect(maxGatherTierIndexForComposeTier("nursing", relaxed)).toBeGreaterThan(0);
    expect(maxGatherTierIndexForComposeTier("nursing", exact)).toBe(
      timedExamGatherLadderForField("nursing").length - 1
    );
  });

  it("scales compose pool limit for long exams", () => {
    expect(resolveComposePoolLimit(50)).toBeGreaterThanOrEqual(300);
    expect(resolveComposePoolLimit(100)).toBeGreaterThanOrEqual(600);
  });

  it("fillExamItemsToCount pads to exact count after uniqueness drops items", () => {
    const pool = Array.from({ length: 60 }, (_, i) => item(`q-${i}`, `concept-${i % 20}`));
    const selected = pool.slice(0, 50);
    const tier = USER_FACING_PROGRESSIVE_TIERS.find((t) => t.id === "strict")!;

    const filled = fillExamItemsToCount(selected, pool, 50, tier, 42);
    expect(filled).toHaveLength(50);
  });

  it("exact-fill tier skips final uniqueness enforcement", () => {
    expect(tierSkipsFinalUniqueness(EXACT_FILL_COMPOSE_TIER)).toBe(true);
    expect(tierSkipsFinalUniqueness(USER_FACING_PROGRESSIVE_TIERS[0]!)).toBe(false);
  });
});
