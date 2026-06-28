import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  clinicalCaseKey,
  dedupeItemsByClinicalCase,
  selectDiverseSessionBankItems,
} from "./diverse-session-selection";
import { hasAdjacentSimilarSpread, spreadGroupKeyFromBankItem } from "@/lib/questions/spread-session-order";
import { selectSpreadBankItems } from "@/lib/questions/spread-session-order";

function item(
  id: string,
  subjectId: string,
  question: string,
  vignette: string,
  options: string[] = ["A", "B", "C", "D"]
): BankItem {
  return {
    id,
    subjectId,
    question,
    vignette,
    options,
    correctAnswer: options[0] ?? "A",
    explanation: "Test rationale with enough length for board review.",
  };
}

describe("dedupeItemsByClinicalCase", () => {
  it("keeps one standalone item per shared vignette cluster", () => {
    const shared = "Male with crushing chest pain and diaphoresis in the ED.";
    const pool = [
      item("a1", "med-surg", "Which action first?", shared),
      item("a2", "med-surg", "Which medication next?", shared),
      item("b1", "renal", "Best fluid?", "Oliguria after major surgery"),
    ];
    const deduped = dedupeItemsByClinicalCase(pool);
    expect(deduped).toHaveLength(2);
    expect(deduped.map((row) => row.id).sort()).toEqual(["a1", "b1"]);
  });
});

describe("selectDiverseSessionBankItems", () => {
  it("reduces adjacent similar cases vs legacy shuffle for clustered pools", () => {
    const sharedVignette = "Shared post-op abdominal pain vignette with guarding.";
    const pool: BankItem[] = [];

    for (let i = 0; i < 30; i++) {
      pool.push(
        item(
          `card-${i}`,
          "cardiology",
          `Cardiology priority ${i}?`,
          i % 3 === 0 ? sharedVignette : `Unique cardiology case ${i}`
        )
      );
    }
    for (let i = 0; i < 30; i++) {
      pool.push(
        item(
          `renal-${i}`,
          "nephrology",
          `Renal question ${i}?`,
          `Unique renal vignette ${i}`
        )
      );
    }

    const legacy = selectSpreadBankItems(pool, 20);
    const diverse = selectDiverseSessionBankItems(pool, 20, { seed: 42 });

    expect(diverse).toHaveLength(20);
    expect(new Set(diverse.map((row) => row.subjectId)).size).toBeGreaterThanOrEqual(2);

    const legacyAdjacent = hasAdjacentSimilarSpread(legacy, spreadGroupKeyFromBankItem);
    const diverseAdjacent = hasAdjacentSimilarSpread(diverse, spreadGroupKeyFromBankItem);
    if (legacyAdjacent) {
      expect(diverseAdjacent).toBe(false);
    }
  });

  it("prefers unique stems within a session when the pool allows", () => {
    const stemA = "Which action should the nurse take first?";
    const stemB = "Which finding should the nurse report immediately?";
    const pool = [
      ...Array.from({ length: 8 }, (_, i) =>
        item(`a-${i}`, "med-surg", stemA, `Unique med-surg vignette ${i}`)
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        item(`b-${i}`, "pharmacology-nursing", stemB, `Unique pharm vignette ${i}`)
      ),
    ];
    const diverse = selectDiverseSessionBankItems(pool, 6, { seed: 7 });
    const stems = new Set(diverse.map((row) => row.question.trim().toLowerCase()));
    expect(stems.size).toBe(2);
  });
});
