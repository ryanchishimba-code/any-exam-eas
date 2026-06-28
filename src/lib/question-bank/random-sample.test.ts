import { describe, expect, it, vi } from "vitest";
import { pickRandomStartId, sampleQuestionBankRows } from "./random-sample";

const mockRows = [
  { id: "a1", question: "Q1" },
  { id: "b2", question: "Q2" },
  { id: "c3", question: "Q3" },
  { id: "d4", question: "Q4" },
  { id: "e5", question: "Q5" },
];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      count: vi.fn(async () => mockRows.length),
      findFirst: vi.fn(async ({ skip }: { skip?: number }) => mockRows[skip ?? 0] ?? null),
      findMany: vi.fn(
        async ({
          where,
          take,
        }: {
          where: { AND?: Array<{ id?: { gte?: string; lt?: string } }> };
          take?: number;
        }) => {
          const and = where.AND ?? [];
          const gte = and.find((c) => c.id?.gte)?.id?.gte;
          const lt = and.find((c) => c.id?.lt)?.id?.lt;
          let pool = mockRows;
          if (gte) pool = pool.filter((r) => r.id >= gte);
          if (lt) pool = pool.filter((r) => r.id < lt);
          return pool.slice(0, take ?? pool.length);
        }
      ),
    },
  },
}));

describe("random-sample", () => {
  it("returns all rows when pool is smaller than pull", async () => {
    const rows = await sampleQuestionBankRows({
      where: { fieldId: "aanp-fnp", active: true, qaPassed: true },
      pull: 10,
      total: mockRows.length,
    });
    expect(rows).toHaveLength(mockRows.length);
  });

  it("wraps around when window does not fill pull", async () => {
    const rows = await sampleQuestionBankRows({
      where: { fieldId: "aanp-fnp", active: true, qaPassed: true },
      pull: 4,
      total: mockRows.length,
    });
    expect(rows.length).toBe(4);
  });

  it("pickRandomStartId returns an id from the pool", async () => {
    const id = await pickRandomStartId(
      { fieldId: "aanp-fnp", active: true, qaPassed: true },
      mockRows.length
    );
    expect(id).toBeTruthy();
    expect(mockRows.some((r) => r.id === id)).toBe(true);
  });
});
