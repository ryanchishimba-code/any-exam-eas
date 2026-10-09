import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { finalizeAssembledSitting } from "@/lib/exam-prep/sitting-selection";
import { NCLEX_2026_CLIENT_NEEDS } from "@/lib/exam-prep/nclex/blueprint-topics-2026";
import { completeSequentialGroups } from "@/lib/full-exam/ngn-format-mix";
import {
  NCLEX_MINIMUM_ITEMS,
  nclexShapeRole,
  restoreNclexExamOrder,
} from "@/lib/full-exam/nclex-exam-shape";

type ShapeRow = {
  type: string;
  subjectId: string;
  setId: string | null;
  step: number | null;
  kind: string | null;
};

const FIXTURE = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/lib/full-exam/live-nclex-sittings.fixture.json"), "utf8")
) as { linear85: ShapeRow[]; cat150: ShapeRow[] };

function bankFromShape(row: ShapeRow, index: number, prefix: string): BankItem {
  const itemType =
    row.type === "bow_tie"
      ? "ngn_bowtie"
      : row.type === "trend"
        ? "trend"
        : row.type === "matrix"
          ? "ngn_matrix"
          : row.type === "highlight"
            ? "ngn_highlight"
            : row.type === "select_all"
              ? "select_all"
              : row.type === "fill_blank"
                ? "ngn_dropdown"
                : row.type === "unfolding_case"
                  ? "case_study"
                  : "mcq";
  return {
    id: `${prefix}-${index}`,
    subjectId: row.subjectId,
    itemType,
    question: `Which action is first for ${prefix} item ${index}?`,
    options: ["Assess", "Wait", "Document", "Delegate"],
    correctAnswer: "Assess",
    explanation: `Assess ${prefix} item ${index} before the other steps.`,
    ngnPayload: {
      kind: row.kind ?? (row.type === "bow_tie" ? "bow_tie" : "mcq"),
      ...(row.setId ? { setId: `${prefix}-${row.setId}`, stepIndex: row.step } : {}),
    },
    qaPassed: true,
    active: true,
    tags: row.setId ? ["published-ngn-catalog"] : [],
  };
}

function knowledge(id: string, category: string): BankItem {
  return {
    id,
    subjectId: category,
    question: `Which action is first for ${id}?`,
    options: [`Assess ${id}`, `Wait ${id}`, `Document ${id}`, `Delegate ${id}`],
    correctAnswer: `Assess ${id}`,
    explanation: `Assess ${id} before the other steps.`,
    itemType: "mcq",
    qaPassed: true,
    active: true,
  };
}

function sparePool(seated: readonly BankItem[]): BankItem[] {
  const fillers = NCLEX_2026_CLIENT_NEEDS.flatMap((category) =>
    Array.from({ length: 12 }, (_, index) => knowledge(`spare-${category.id}-${index}`, category.id))
  );
  return [...seated, ...fillers];
}

function assertNoOrphansOrEarlyClinical(items: readonly BankItem[], length: number) {
  expect(items).toHaveLength(length);
  const groups = completeSequentialGroups(items).filter((group) => group.length === 6);
  expect(groups).toHaveLength(3);
  const chosen = new Set(groups.flat().map((item) => item.id));
  for (const group of groups) {
    const positions = items.flatMap((item, index) => (group.some((step) => step.id === item.id) ? [index] : []));
    expect(positions).toHaveLength(6);
    for (let step = 1; step < positions.length; step += 1) {
      expect(positions[step]).toBe(positions[step - 1]! + 1);
    }
    expect(positions.every((position) => position < NCLEX_MINIMUM_ITEMS)).toBe(true);
    expect(group.map((item) => item.ngnPayload?.stepIndex)).toEqual([1, 2, 3, 4, 5, 6]);
  }
  const orphans = items.filter((item) => {
    const setId = item.ngnPayload?.setId;
    return typeof setId === "string" && setId && !chosen.has(item.id);
  });
  expect(orphans).toEqual([]);
  const earlyClinical = items.flatMap((item, index) => {
    const role = nclexShapeRole(item);
    return index < NCLEX_MINIMUM_ITEMS && (role === "bow_tie" || role === "trend") ? [index] : [];
  });
  expect(earlyClinical).toEqual([]);
}

describe("live NCLEX sittings", () => {
  it("clears orphan steps and early bow-ties from the saved 85-item exam", () => {
    const seated = FIXTURE.linear85.map((row, index) => bankFromShape(row, index, "linear"));
    const trendAt = seated.findIndex((item) => !item.ngnPayload?.setId && item.itemType === "mcq");
    seated[trendAt] = {
      ...seated[trendAt]!,
      id: "linear-trend",
      itemType: "trend",
      ngnPayload: { kind: "trend" },
    };
    const repaired = restoreNclexExamOrder(seated, sparePool(seated));
    assertNoOrphansOrEarlyClinical(repaired, 85);
  });

  it("clears orphan steps after item 85 on the saved CAT exam", () => {
    const seated = FIXTURE.cat150.map((row, index) => bankFromShape(row, index, "cat"));
    const repaired = restoreNclexExamOrder(seated, sparePool(seated));
    assertNoOrphansOrEarlyClinical(repaired, 150);
    const lateClinical = repaired.slice(NCLEX_MINIMUM_ITEMS).filter((item) => {
      const role = nclexShapeRole(item);
      return role === "bow_tie" || role === "trend";
    });
    expect(lateClinical.length).toBeGreaterThan(0);
  });

  it("does not refill an exam with steps from cases that were not chosen", () => {
    const seated = FIXTURE.linear85.map((row, index) => bankFromShape(row, index, "refill"));
    const pool = sparePool(seated);
    for (const limit of [85, 150]) {
      const sitting = finalizeAssembledSitting({
        pool: limit === 85 ? pool : [...pool, ...FIXTURE.cat150.map((row, index) => bankFromShape(row, index, "catpool"))],
        limit,
        fieldId: "nursing",
        seed: limit,
        nclexExamMode: true,
      });
      assertNoOrphansOrEarlyClinical(sitting.items, limit);
    }
  });
});
