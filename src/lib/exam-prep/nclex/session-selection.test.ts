import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  dedupeNclexItemsByClinicalCase,
  selectNclexSessionBankItems,
} from "./session-selection";
import { hasAdjacentSimilarSpread, spreadGroupKeyFromBankItem } from "@/lib/questions/spread-session-order";

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

describe("dedupeNclexItemsByClinicalCase", () => {
  it("keeps one standalone item per shared vignette cluster when stem and choices match", () => {
    const shared = "Male with crushing chest pain and diaphoresis in the ED with enough detail.";
    const stem = "Which finding requires immediate nursing follow-up?";
    const options = ["ST elevation", "Crackles", "Bradycardia", "Polyuria"];
    const pool = [
      item("a1", "med-surg", stem, shared, options),
      item("a2", "med-surg", stem, `${shared} Room 402.`, options),
      item("b1", "renal", "Best fluid?", "Oliguria after major surgery"),
    ];
    const deduped = dedupeNclexItemsByClinicalCase(pool);
    expect(deduped).toHaveLength(2);
    expect(deduped.map((row) => row.id).sort()).toEqual(["a1", "b1"]);
  });
});

describe("selectNclexSessionBankItems", () => {
  it("spreads subjects and avoids adjacent same-case items in a 25-item session", () => {
    const sharedVignette = "Shared post-op abdominal pain vignette with guarding.";
    const pool: BankItem[] = [];

    for (let i = 0; i < 40; i++) {
      pool.push(
        item(
          `med-${i}`,
          "med-surg",
          `Med-surg priority ${i}?`,
          i % 4 === 0 ? sharedVignette : `Unique med-surg case ${i}`
        )
      );
    }
    for (let i = 0; i < 40; i++) {
      pool.push(
        item(
          `pharm-${i}`,
          "pharmacology-nursing",
          `Pharm question ${i}?`,
          `Unique pharm vignette ${i}`
        )
      );
    }
    for (let i = 0; i < 20; i++) {
      pool.push(
        item(
          `psych-${i}`,
          "psychosocial",
          `Therapeutic response ${i}?`,
          `Unique psychosocial case ${i}`
        )
      );
    }

    const selected = selectNclexSessionBankItems(pool, 25, 42);
    expect(selected).toHaveLength(25);

    const subjects = new Set(selected.map((row) => row.subjectId));
    expect(subjects.size).toBeGreaterThanOrEqual(3);

    expect(
      hasAdjacentSimilarSpread(selected, spreadGroupKeyFromBankItem)
    ).toBe(false);
  });

  it("caps delegation stems in a short session", () => {
    const pool = [
      ...Array.from({ length: 12 }, (_, i) =>
        item(
          `delegate-${i}`,
          "management-of-care",
          `Which task can the nurse delegate to the UAP for client ${i}?`,
          `Med-surg unit assignment ${i}`
        )
      ),
      ...Array.from({ length: 20 }, (_, i) =>
        item(`renal-${i}`, "reduction-risk", `Lab follow-up ${i}?`, `Unique renal case ${i}`)
      ),
    ];

    const selected = selectNclexSessionBankItems(pool, 20, 99);
    const delegationCount = selected.filter((row) =>
      /delegate|UAP/i.test(`${row.vignette ?? ""} ${row.question}`)
    ).length;
    expect(delegationCount).toBeLessThanOrEqual(1);
  });
});
