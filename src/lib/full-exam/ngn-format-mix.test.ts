import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  countFormatsInSelection,
  planNgnFormatTargets,
  selectWithNgnFormatMix,
} from "./ngn-format-mix";
import { getExamBlueprint } from "@/lib/engine/blueprints";

function item(id: string, itemType: string): BankItem {
  return {
    id,
    subjectId: "physiological-adaptation",
    question: `Q ${id}`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because",
    itemType,
  } as BankItem;
}

describe("planNgnFormatTargets", () => {
  it("allocates NCLEX NGN slots for a 50-item exam", () => {
    const bp = getExamBlueprint("nursing")!;
    const targets = planNgnFormatTargets(50, bp);
    const total = targets.reduce((n, t) => n + t.count, 0);
    // ~30% of 50 ≈ 15 NGN slots
    expect(total).toBeGreaterThanOrEqual(12);
    expect(total).toBeLessThanOrEqual(18);
    expect(targets.some((t) => t.format === "bow_tie")).toBe(true);
    expect(targets.some((t) => t.format === "select_all")).toBe(true);
  });
});

describe("selectWithNgnFormatMix", () => {
  it("pulls NGN formats instead of all vignettes when inventory exists", () => {
    const pool: BankItem[] = [];
    for (let i = 0; i < 40; i++) pool.push(item(`v${i}`, "vignette"));
    for (let i = 0; i < 8; i++) pool.push(item(`b${i}`, "ngn_bowtie"));
    for (let i = 0; i < 6; i++) pool.push(item(`s${i}`, "select_all"));
    for (let i = 0; i < 5; i++) pool.push(item(`m${i}`, "ngn_matrix"));
    for (let i = 0; i < 4; i++) pool.push(item(`o${i}`, "ordered_response"));
    for (let i = 0; i < 4; i++) pool.push(item(`c${i}`, "case_study"));

    const picked = selectWithNgnFormatMix(pool, 50, "nursing", 42);
    expect(picked).toHaveLength(50);
    const counts = countFormatsInSelection(picked);
    expect((counts.ngn_bowtie ?? 0) + (counts.bow_tie ?? 0)).toBeGreaterThanOrEqual(2);
    expect(counts.select_all ?? 0).toBeGreaterThanOrEqual(2);
    expect((counts.ngn_matrix ?? 0) + (counts.matrix ?? 0)).toBeGreaterThanOrEqual(1);
    expect(counts.vignette ?? 0).toBeLessThan(45);
  });

  it("falls back when NGN inventory is thin", () => {
    const pool = Array.from({ length: 20 }, (_, i) => item(`v${i}`, "vignette"));
    const picked = selectWithNgnFormatMix(pool, 10, "nursing", 7);
    expect(picked).toHaveLength(10);
    expect(picked.every((p) => p.itemType === "vignette")).toBe(true);
  });

  it("is a no-op for fields without ngnMix", () => {
    const pool = [
      item("a", "vignette"),
      item("b", "select_all"),
      item("c", "vignette"),
    ];
    const picked = selectWithNgnFormatMix(pool, 2, "pharmacy", 1);
    expect(picked.map((p) => p.id)).toEqual(["a", "b"]);
  });
});
