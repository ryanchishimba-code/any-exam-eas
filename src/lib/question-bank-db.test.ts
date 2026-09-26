import { describe, expect, it } from "vitest";
import {
  activeItemsByFormatWhere,
  dedupeBankItemsById,
  dedupeBankItemsByStem,
  shuffleBankItems,
} from "./question-bank-db";
import { NGN_ITEM_TYPES } from "@/lib/inventory/active-questions";
import type { BankItem } from "./question-bank";

function item(stem: string, id = stem): BankItem {
  return {
    id,
    subjectId: "test",
    question: stem,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    explanation: "Because.",
  };
}

describe("dedupeBankItemsByStem", () => {
  it("keeps first item per normalized stem", () => {
    const out = dedupeBankItemsByStem([
      item("Same stem?", "a"),
      item("  same stem?  ", "b"),
      item("Other", "c"),
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe("a");
    expect(out[1].id).toBe("c");
  });
});

describe("dedupeBankItemsById", () => {
  it("keeps distinct bank rows even when stems match (NGN matrix sets)", () => {
    const out = dedupeBankItemsById([
      item("Match each finding to the column.", "a"),
      item("Match each finding to the column.", "b"),
      item("Other stem", "c"),
    ]);
    expect(out).toHaveLength(3);
  });
});

describe("activeItemsByFormatWhere", () => {
  it("samples mixed NGN across the field and drops ineligible ids", () => {
    const where = activeItemsByFormatWhere({
      fieldId: "nursing",
      subjectId: "__mixed__",
      formatBucket: "ngn",
      ineligibleIds: ["broken-ngn", "  "],
    });
    const clauses = Array.isArray(where.AND) ? where.AND : [];
    expect(clauses[0]).toMatchObject({ fieldId: "nursing", active: true, qaPassed: true });
    expect(clauses[0]).not.toHaveProperty("subjectId");
    expect(clauses[1]).toMatchObject({
      OR: expect.arrayContaining([
        { itemType: { equals: "select_all", mode: "insensitive" } },
      ]),
    });
    const listed = (clauses[1] as { OR: { itemType: { equals: string } }[] }).OR.map(
      (clause) => clause.itemType.equals
    );
    expect(listed).toEqual([...NGN_ITEM_TYPES]);
    expect(clauses[2]).toEqual({ id: { notIn: ["broken-ngn"] } });
  });

  it("keeps a single topic on case sets and omits an empty ineligible list", () => {
    const where = activeItemsByFormatWhere({
      fieldId: "usmle-step-3",
      subjectId: "ccs",
      formatBucket: "case",
    });
    const clauses = Array.isArray(where.AND) ? where.AND : [];
    expect(clauses).toHaveLength(2);
    expect(clauses[0]).toMatchObject({
      fieldId: "usmle-step-3",
      subjectId: "ccs",
      active: true,
      qaPassed: true,
    });
    expect(clauses[1]).toMatchObject({
      OR: expect.arrayContaining([
        { itemType: { equals: "case_study", mode: "insensitive" } },
        { itemType: { equals: "ccs_prompt", mode: "insensitive" } },
      ]),
    });
  });
});

describe("shuffleBankItems", () => {
  it("returns same length and elements", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffleBankItems(input);
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual(input);
  });
});
