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
  it("keeps one standalone item per shared vignette cluster when stem and choices match", () => {
    const shared = "Male with crushing chest pain and diaphoresis in the ED with enough detail.";
    const stem = "Which finding requires immediate nursing follow-up?";
    const options = ["ST elevation", "Crackles", "Bradycardia", "Polyuria"];
    const pool = [
      item("a1", "med-surg", stem, shared, options),
      item("a2", "med-surg", stem, `${shared} Room 402.`, options),
      item("b1", "renal", "Best fluid?", "Oliguria after major surgery"),
    ];
    const deduped = dedupeItemsByClinicalCase(pool);
    expect(deduped).toHaveLength(2);
    expect(deduped.map((row) => row.id).sort()).toEqual(["a1", "b1"]);
  });

  it("collapses template NCLEX items with identical answer sets", () => {
    const stem = "Which finding requires immediate nursing follow-up?";
    const options = [
      "fruity breath odor",
      "deep rapid (Kussmaul) respirations and Glucose 412 mg/dL",
      "dry mucous membranes",
      "reports polyuria and nausea",
    ];
    const pool = [
      item("a", "med-surg", stem, "Emergency department, Room 548. DKA vignette with enough detail.", options),
      item("b", "med-surg", stem, "Emergency department, Room 312. Different room same DKA template.", options),
      item("c", "med-surg", "Which intervention first?", "Unique COPD vignette with wheezing.", ["A", "B", "C", "D"]),
    ];
    const deduped = dedupeItemsByClinicalCase(pool);
    expect(deduped.map((row) => row.id).sort()).toEqual(["a", "c"]);
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
        item(
          `a-${i}`,
          "med-surg",
          stemA,
          `Unique med-surg vignette ${i} with enough clinical detail.`,
          [`Option A${i}`, `Option B${i}`, `Option C${i}`, `Option D${i}`]
        )
      ),
      ...Array.from({ length: 8 }, (_, i) =>
        item(
          `b-${i}`,
          "pharmacology-nursing",
          stemB,
          `Unique pharm vignette ${i} with enough clinical detail.`,
          [`Option A${i}`, `Option B${i}`, `Option C${i}`, `Option D${i}`]
        )
      ),
    ];
    const diverse = selectDiverseSessionBankItems(pool, 6, { seed: 7 });
    const stems = new Set(diverse.map((row) => row.question.trim().toLowerCase()));
    expect(stems.size).toBe(2);
  });
});
