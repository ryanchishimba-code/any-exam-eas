import { describe, expect, it, vi } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { sequentialSetId } from "@/lib/exam-prep/sitting-clusters";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import { clientNeedsTargets, clientNeedsWithinRanges } from "@/lib/exam-prep/nclex-client-needs-quota";
import {
  NCLEX_CASE_COUNT,
  NCLEX_CASE_LENGTH,
  NCLEX_MINIMUM_ITEMS,
  arrangeNclexExamItems,
  nclexCaseWindowThirds,
  nclexShapeRole,
  shapeNclexBankSitting,
  type NclexShapeItem,
} from "./nclex-exam-shape";

const CATEGORIES = NCLEX_2026_CLIENT_NEEDS.map((category) => category.id);

function bank(id: string, itemType: string, category: string, extra?: Partial<BankItem>): BankItem {
  return {
    id,
    subjectId: category,
    question: `Which action is first for ${id}?`,
    options: [`Assess ${id}`, `Wait ${id}`, `Document ${id}`, `Delegate ${id}`],
    correctAnswer: `Assess ${id}`,
    explanation: `Assess ${id} before the other steps.`,
    itemType,
    qaPassed: true,
    active: true,
    ...extra,
  } as BankItem;
}

function caseItems(setId: string): BankItem[] {
  return CATEGORIES.slice(0, NCLEX_CASE_LENGTH).map((category, index) =>
    bank(`${setId}-${index + 1}`, "case_study", category, {
      tags: ["published-ngn-catalog"],
      ngnPayload: { kind: "sequential", setId, stepIndex: index + 1 },
    })
  );
}

function knowledgePool(limit: number): BankItem[] {
  const targets = clientNeedsTargets(limit);
  if (!targets) throw new Error(`no client-needs targets for ${limit}`);
  return targets.flatMap((target) =>
    Array.from({ length: target.count + 8 }, (_, index) => bank(`know-${limit}-${target.id}-${index}`, "mcq", target.id))
  );
}

function clinicalPool(limit: number): BankItem[] {
  const bowTies = Array.from({ length: 18 }, (_, index) =>
    bank(`bow-${limit}-${index}`, "ngn_bowtie", CATEGORIES[index % CATEGORIES.length]!)
  );
  const trends = Array.from({ length: 12 }, (_, index) =>
    bank(`trend-${limit}-${index}`, "trend", CATEGORIES[(index + 3) % CATEGORIES.length]!, {
      ngnPayload: { kind: "trend", clinicalItemType: "trend" },
    })
  );
  return [...bowTies, ...trends];
}

function partialCase(setId: string): BankItem[] {
  return Array.from({ length: 5 }, (_, index) =>
    bank(`${setId}-${index + 1}`, "case_study", CATEGORIES[index % CATEGORIES.length]!, {
      tags: ["published-ngn-catalog"],
      ngnPayload: { kind: "sequential", setId, stepIndex: index + 1 },
    })
  );
}

function assertWholeCases(items: readonly BankItem[], length: number, expectedCases: number) {
  expect(items).toHaveLength(length);
  const thirds = nclexCaseWindowThirds(length);
  const groups = new Map<string, number[]>();
  items.forEach((item, index) => {
    const setId = sequentialSetId(item);
    if (!setId) return;
    const positions = groups.get(setId) ?? [];
    positions.push(index);
    groups.set(setId, positions);
  });
  expect(groups.size).toBe(expectedCases);
  const starts = [...groups.values()].map((positions) => positions[0]!).sort((left, right) => left - right);
  starts.forEach((start, index) => {
    const third = thirds[index]!;
    const positions = Array.from({ length: NCLEX_CASE_LENGTH }, (_, offset) => start + offset);
    expect(positions[0]).toBeGreaterThanOrEqual(third.start);
    expect(positions[NCLEX_CASE_LENGTH - 1]).toBeLessThan(third.end);
    expect(positions[NCLEX_CASE_LENGTH - 1]).toBeLessThan(NCLEX_MINIMUM_ITEMS);
    for (let step = 1; step < positions.length; step += 1) {
      expect(positions[step]).toBe(positions[step - 1]! + 1);
    }
    const steps = positions.map(
      (position) => (items[position]?.ngnPayload as { stepIndex?: number } | undefined)?.stepIndex
    );
    expect(steps).toEqual([1, 2, 3, 4, 5, 6]);
  });
  const earlyClinical = items.flatMap((item, index) => {
    const role = nclexShapeRole(item);
    return index < NCLEX_MINIMUM_ITEMS && (role === "bow_tie" || role === "trend") ? [index] : [];
  });
  expect(earlyClinical).toEqual([]);
  if (length <= NCLEX_MINIMUM_ITEMS) {
    expect(items.every((item) => {
      const role = nclexShapeRole(item);
      return role !== "bow_tie" && role !== "trend";
    })).toBe(true);
  }
}

describe("NCLEX case shape for every sitting length", () => {
  it("places one whole case in each third of a 50-item window and serves no bow-tie", () => {
    const cases = ["A", "B", "C"].map((setId) =>
      Array.from({ length: NCLEX_CASE_LENGTH }, (_, index) => ({
        id: `${setId}-${index + 1}`,
        role: "case" as const,
        setId,
        step: index + 1,
      }))
    );
    const arranged = arrangeNclexExamItems({
      cases,
      knowledge: Array.from({ length: 80 }, (_, index) => ({ id: `k${index}`, role: "knowledge" as const })),
      bowTies: Array.from({ length: 15 }, (_, index) => ({ id: `b${index}`, role: "bow_tie" as const })),
      trends: Array.from({ length: 10 }, (_, index) => ({ id: `t${index}`, role: "trend" as const })),
      length: 50,
      seed: 50,
    });
    expect(arranged).not.toBeNull();
    if (!arranged) return;
    const asBank = arranged.map(
      (item) =>
        ({
          id: item.id,
          ngnPayload: item.setId ? { setId: item.setId, stepIndex: item.step, kind: "sequential" } : undefined,
          itemType: item.role === "bow_tie" ? "ngn_bowtie" : item.role === "trend" ? "trend" : "mcq",
        }) as BankItem
    );
    assertWholeCases(asBank, 50, NCLEX_CASE_COUNT);
    expect(arranged.every((item) => item.role !== "bow_tie" && item.role !== "trend")).toBe(true);
  });

  it.each([50, 85, 100, 150])("keeps a %i-item nursing sitting inside the case rules and client-needs ranges", (limit) => {
    const pool = [
      ...["case-a", "case-b", "case-c", "case-d"].flatMap(caseItems),
      ...partialCase("partial-case"),
      bank("stray-step-1", "case_study", CATEGORIES[0]!, {
        tags: ["published-ngn-catalog"],
        ngnPayload: { kind: "sequential", setId: "stray-step", stepIndex: 1 },
      }),
      ...knowledgePool(limit),
      ...clinicalPool(limit),
    ];
    const sitting = finalizeAssembledSitting({
      pool,
      limit,
      fieldId: "nursing",
      seed: limit,
      nclexCaseShape: true,
      nclexExamMode: false,
    });
    assertWholeCases(sitting.items, limit, NCLEX_CASE_COUNT);
    expect(clientNeedsWithinRanges(sitting.items)).toBe(true);
    const used = new Set(sitting.items.flatMap((item) => {
      const setId = sequentialSetId(item);
      return setId ? [setId] : [];
    }));
    expect([...used].every((setId) => setId.startsWith("case-"))).toBe(true);
    expect(used.has("partial-case")).toBe(false);
    expect(used.has("stray-step")).toBe(false);
    expect(sitting.items.some((item) => item.id?.startsWith("partial-case"))).toBe(false);
    expect(sitting.items.some((item) => item.id === "stray-step-1")).toBe(false);
  });

  it("serves fewer whole cases when the pool cannot supply three, and logs it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const limit = 50;
      const pool = [
        ...caseItems("only-case"),
        ...partialCase("partial-case"),
        ...knowledgePool(limit),
        ...clinicalPool(limit),
      ];
      const sitting = finalizeAssembledSitting({
        pool,
        limit,
        fieldId: "nursing",
        seed: 4,
        nclexCaseShape: true,
      });
      assertWholeCases(sitting.items, limit, 1);
      expect(sitting.items.every((item) => sequentialSetId(item) !== "partial-case")).toBe(true);
      expect(clientNeedsWithinRanges(sitting.items)).toBe(true);
      expect(warn).toHaveBeenCalledWith(
        "[nclex-case-shape] short case supply; serving fewer whole cases",
        expect.objectContaining({ wanted: NCLEX_CASE_COUNT, available: 1, limit })
      );
    } finally {
      warn.mockRestore();
    }
  });

  it("keeps a 100-item case inside the first 85 items, one case in each of those thirds", () => {
    const knowledge: NclexShapeItem[] = Array.from({ length: 120 }, (_, index) => ({
      id: `k${index}`,
      role: "knowledge",
    }));
    const arranged = arrangeNclexExamItems({
      cases: ["A", "B", "C"].map((setId) =>
        Array.from({ length: NCLEX_CASE_LENGTH }, (_, index) => ({
          id: `${setId}-${index + 1}`,
          role: "case" as const,
          setId,
          step: index + 1,
        }))
      ),
      knowledge,
      bowTies: Array.from({ length: 20 }, (_, index) => ({ id: `b${index}`, role: "bow_tie" as const })),
      trends: Array.from({ length: 12 }, (_, index) => ({ id: `t${index}`, role: "trend" as const })),
      length: 100,
      seed: 100,
    });
    expect(arranged).toHaveLength(100);
    const thirds = nclexCaseWindowThirds(100);
    expect(thirds).toEqual(nclexCaseWindowThirds(85));
    const caseItemsInOrder = arranged!.filter((item) => item.role === "case");
    expect(caseItemsInOrder).toHaveLength(NCLEX_CASE_COUNT * NCLEX_CASE_LENGTH);
    expect(arranged!.slice(0, NCLEX_MINIMUM_ITEMS).some((item) => item.role === "bow_tie" || item.role === "trend")).toBe(
      false
    );
    for (const setId of ["A", "B", "C"]) {
      const positions = arranged!.flatMap((item, index) => (item.setId === setId ? [index] : []));
      expect(positions).toHaveLength(NCLEX_CASE_LENGTH);
      expect(positions[positions.length - 1]).toBeLessThan(NCLEX_MINIMUM_ITEMS);
      const third = thirds.find((span) => positions[0]! >= span.start && positions[0]! < span.end);
      expect(third).toBeTruthy();
      expect(positions[positions.length - 1]).toBeLessThan(third!.end);
    }
  });
});
