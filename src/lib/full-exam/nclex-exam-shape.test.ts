import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import {
  CJ_STANDALONE_CHANCE,
  NCLEX_CASE_COUNT,
  NCLEX_CASE_LENGTH,
  NCLEX_MINIMUM_ITEMS,
  arrangeNclexExamItems,
  caseStartsInThird,
  chooseExamCases,
  nclexMinimumThirds,
  shapeNclexBankSitting,
  type NclexShapeItem,
} from "./nclex-exam-shape";

function knowledge(id: string): NclexShapeItem {
  return { id, role: "knowledge" };
}

function clinical(id: string, role: "bow_tie" | "trend"): NclexShapeItem {
  return { id, role };
}

function caseGroup(setId: string): NclexShapeItem[] {
  return Array.from({ length: NCLEX_CASE_LENGTH }, (_, index) => ({
    id: `${setId}-s${index + 1}`,
    role: "case" as const,
    setId,
    step: index + 1,
  }));
}

function positionsOf(items: NclexShapeItem[], setId: string): number[] {
  return items.flatMap((item, index) => (item.setId === setId ? [index] : []));
}

describe("NCLEX exam-mode placement", () => {
  const thirds = nclexMinimumThirds();

  it("puts one 6-step case in each third, all before item 86", () => {
    const cases = ["A", "B", "C"].map(caseGroup);
    const arranged = arrangeNclexExamItems({
      cases,
      knowledge: Array.from({ length: 200 }, (_, index) => knowledge(`k${index}`)),
      bowTies: Array.from({ length: 20 }, (_, index) => clinical(`b${index}`, "bow_tie")),
      trends: Array.from({ length: 20 }, (_, index) => clinical(`t${index}`, "trend")),
      length: 150,
      seed: 11,
    });
    expect(arranged).not.toBeNull();
    if (!arranged) return;
    expect(arranged).toHaveLength(150);
    const caseIds = new Set(arranged.filter((item) => item.role === "case").map((item) => item.setId));
    expect(caseIds.size).toBe(NCLEX_CASE_COUNT);
    for (const [index, setId] of ["A", "B", "C"].entries()) {
      const positions = positionsOf(arranged, setId);
      expect(positions).toHaveLength(NCLEX_CASE_LENGTH);
      expect(positions.every((position) => position < NCLEX_MINIMUM_ITEMS)).toBe(true);
      expect(positions[0]).toBeGreaterThanOrEqual(thirds[index]!.start);
      expect(positions[positions.length - 1]).toBeLessThan(thirds[index]!.end);
      expect(positions.map((position) => arranged[position]!.step)).toEqual([1, 2, 3, 4, 5, 6]);
      for (let step = 1; step < positions.length; step += 1) {
        expect(positions[step]).toBe(positions[step - 1]! + 1);
      }
    }
    expect(arranged.slice(NCLEX_MINIMUM_ITEMS).every((item) => item.role !== "case")).toBe(true);
  });

  it("keeps bow-tie and trend items after item 85, near a 10% share", () => {
    const rates: number[] = [];
    for (let seed = 1; seed <= 40; seed += 1) {
      const arranged = arrangeNclexExamItems({
        cases: ["A", "B", "C"].map(caseGroup),
        knowledge: Array.from({ length: 400 }, (_, index) => knowledge(`k${seed}-${index}`)),
        bowTies: Array.from({ length: 40 }, (_, index) => clinical(`b${seed}-${index}`, "bow_tie")),
        trends: Array.from({ length: 40 }, (_, index) => clinical(`t${seed}-${index}`, "trend")),
        length: 150,
        seed,
      });
      expect(arranged).not.toBeNull();
      if (!arranged) return;
      const early = arranged.slice(0, NCLEX_MINIMUM_ITEMS);
      expect(early.every((item) => item.role !== "bow_tie" && item.role !== "trend")).toBe(true);
      const later = arranged.slice(NCLEX_MINIMUM_ITEMS);
      const clinicalCount = later.filter((item) => item.role === "bow_tie" || item.role === "trend").length;
      rates.push(clinicalCount / later.length);
    }
    const mean = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    expect(mean).toBeGreaterThan(CJ_STANDALONE_CHANCE - 0.04);
    expect(mean).toBeLessThan(CJ_STANDALONE_CHANCE + 0.04);
  });

  it("puts a minimum-length exam's cases before item 86 and serves no bow-tie", () => {
    const arranged = arrangeNclexExamItems({
      cases: ["A", "B", "C"].map(caseGroup),
      knowledge: Array.from({ length: 80 }, (_, index) => knowledge(`k${index}`)),
      bowTies: [clinical("b1", "bow_tie")],
      trends: [clinical("t1", "trend")],
      length: 85,
      seed: 4,
    });
    expect(arranged).toHaveLength(85);
    expect(arranged!.filter((item) => item.role === "case")).toHaveLength(18);
    expect(arranged!.some((item) => item.role === "bow_tie" || item.role === "trend")).toBe(false);
    expect(arranged!.every((item, index) => item.role !== "case" || index < 85)).toBe(true);
  });

  it("chooses unseen cases before seen ones", () => {
    const groups = ["A", "B", "C", "D", "E"].map((id) => ({ id }));
    const chosen = chooseExamCases(groups, (group) => group.id, new Map([["A", 20], ["B", 5]]), "seed");
    expect(chosen.map((group) => group.id).slice(0, 3).sort()).toEqual(["C", "D", "E"]);
  });

  it("fits every case start inside its third and before item 86", () => {
    for (const third of thirds) {
      const starts = caseStartsInThird(third);
      expect(starts.length).toBeGreaterThan(0);
      for (const start of starts) {
        expect(start).toBeGreaterThanOrEqual(third.start);
        expect(start + NCLEX_CASE_LENGTH).toBeLessThanOrEqual(third.end);
        expect(start + NCLEX_CASE_LENGTH).toBeLessThanOrEqual(NCLEX_MINIMUM_ITEMS);
      }
    }
  });
});

describe("shapeNclexBankSitting", () => {
  function bank(id: string, itemType: string, extra?: Partial<BankItem>): BankItem {
    return {
      id,
      subjectId: "physiological-adaptation",
      question: `Question ${id}`,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Because",
      itemType,
      ...extra,
    } as BankItem;
  }

  function caseItems(setId: string): BankItem[] {
    return Array.from({ length: 6 }, (_, index) =>
      bank(`${setId}-${index + 1}`, "case_study", {
        ngnPayload: { kind: "sequential", setId, stepIndex: index + 1 },
      })
    );
  }

  it("serves three unseen cases from the bank pool and keeps steps together", () => {
    const cases = ["seen", "old", "fresh-a", "fresh-b", "fresh-c"].flatMap(caseItems);
    const knowledge = Array.from({ length: 140 }, (_, index) => bank(`mcq-${index}`, "vignette"));
    const bowTies = Array.from({ length: 8 }, (_, index) => bank(`bow-${index}`, "ngn_bowtie"));
    const trends = Array.from({ length: 6 }, (_, index) =>
      bank(`trend-${index}`, "mcq", { ngnPayload: { clinicalItemType: "trend" } })
    );
    const shaped = shapeNclexBankSitting({
      pool: [...cases, ...knowledge, ...bowTies, ...trends],
      limit: 85,
      seed: 9,
      caseLastAttemptedAt: new Map([
        ["seen", 50],
        ["old", 10],
      ]),
    });
    expect(shaped).not.toBeNull();
    if (!shaped) return;
    const setAt = (index: number) => {
      const payload = shaped[index]?.ngnPayload as { setId?: string; stepIndex?: number } | undefined;
      return payload?.setId ? { setId: payload.setId, step: payload.stepIndex } : null;
    };
    const used = new Set<string>();
    for (let index = 0; index < shaped.length; index += 1) {
      const here = setAt(index);
      if (!here) continue;
      used.add(here.setId);
      const steps = [0, 1, 2, 3, 4, 5].map((offset) => setAt(index + offset));
      expect(steps.map((step) => step?.setId)).toEqual(Array(6).fill(here.setId));
      expect(steps.map((step) => step?.step)).toEqual([1, 2, 3, 4, 5, 6]);
      index += 5;
    }
    expect([...used].sort()).toEqual(["fresh-a", "fresh-b", "fresh-c"]);
    expect(shaped.every((item) => item.itemType !== "ngn_bowtie")).toBe(true);
    expect(shaped.every((item) => (item.ngnPayload as { clinicalItemType?: string } | undefined)?.clinicalItemType !== "trend")).toBe(true);
  });
});
