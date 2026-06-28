import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  applyStemCap,
  buildRankedRow,
  pickBestPerClinicalCase,
} from "./clinical-case-dedupe";

function row(id: string, subject: string, stem: string, vignette: string, rank: number) {
  const item: BankItem = {
    id,
    subjectId: subject,
    question: stem,
    vignette,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Test",
  };
  return buildRankedRow(id, item, rank, true);
}

describe("pickBestPerClinicalCase", () => {
  it("keeps highest rank per shared vignette", () => {
    const shared = "Same patient vignette with enough length for case key matching.";
    const { keep, retire } = pickBestPerClinicalCase([
      row("a", "med-surg", "Which action first?", shared, 10),
      row("b", "med-surg", "Which action next?", shared, 50),
    ]);
    expect(keep.map((r) => r.id)).toEqual(["b"]);
    expect(retire.map((r) => r.id)).toEqual(["a"]);
  });
});

describe("applyStemCap", () => {
  it("limits rows per identical stem", () => {
    const stem = "Which action should the nurse take first?";
    const rows = Array.from({ length: 5 }, (_, i) =>
      row(`q-${i}`, "med-surg", stem, `Unique vignette number ${i} with clinical detail.`, 10 + i)
    );
    const { keep, retire } = applyStemCap(rows, 2);
    expect(keep).toHaveLength(2);
    expect(retire).toHaveLength(3);
    expect(keep.map((r) => r.id)).toEqual(["q-4", "q-3"]);
  });
});
