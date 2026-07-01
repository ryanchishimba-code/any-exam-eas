import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  applyStemCap,
  buildRankedRow,
  clinicalCaseKey,
  pickBestPerClinicalCase,
  pickBestPerSessionDedupeKey,
  sessionDedupeKey,
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

describe("NCLEX polish template dedupe", () => {
  const dkaStem = "Which finding requires immediate nursing follow-up?";
  const dkaOptions = [
    "fruity breath odor",
    "deep rapid (Kussmaul) respirations and Glucose 412 mg/dL",
    "dry mucous membranes",
    "reports polyuria and nausea",
  ];

  function dkaClone(id: string, room: number, age: number, vignetteSuffix = ""): BankItem {
    return {
      id,
      subjectId: "med-surg",
      question: dkaStem,
      vignette: `Emergency department, Room ${room}. ${age}-year-old man with type 2 diabetes with hyperglycemia. Long-standing type 2 diabetes; ran out of insulin 2 days ago. BP 138/84 mmHg, HR 118, RR 28 deep and labored, temp 99.1°F (37.3°C). Glucose 412 mg/dL, deep rapid (Kussmaul) respirations, fruity breath odor, dry mucous membranes, reports polyuria and nausea.${vignetteSuffix}`,
      options: dkaOptions,
      correctAnswer: "deep rapid (Kussmaul) respirations and Glucose 412 mg/dL",
      explanation: "Kussmaul respirations with severe hyperglycemia suggest DKA and require immediate follow-up.",
    };
  }

  it("collapses CJMM DKA polish clones that differ only by room and age", () => {
    const keys = [
      clinicalCaseKey(dkaClone("a", 548, 56)),
      clinicalCaseKey(dkaClone("b", 312, 54)),
      clinicalCaseKey(dkaClone("c", 401, 55)),
    ];
    expect(new Set(keys).size).toBe(1);
  });

  it("collapses identical answer sets on template stems even when vignettes differ", () => {
    const keys = [
      sessionDedupeKey(dkaClone("a", 548, 56)),
      sessionDedupeKey(dkaClone("b", 312, 54, " Additional chart note.")),
      sessionDedupeKey(dkaClone("c", 401, 55)),
    ];
    expect(new Set(keys).size).toBe(1);
  });

  it("keeps only the best-ranked DKA polish clone", () => {
    const { keep, retire } = pickBestPerSessionDedupeKey([
      buildRankedRow("low", dkaClone("low", 548, 56), 10, true),
      buildRankedRow("best", dkaClone("best", 312, 54), 90, true),
    ]);
    expect(keep.map((r) => r.id)).toEqual(["best"]);
    expect(retire.map((r) => r.id)).toEqual(["low"]);
  });
});
