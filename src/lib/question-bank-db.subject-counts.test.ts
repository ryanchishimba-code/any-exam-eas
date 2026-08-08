import { describe, expect, it, vi } from "vitest";

/**
 * Trust-contract tests for per-topic question counts.
 *
 * The product promise is: the number shown next to a topic equals the pool that
 * topic actually serves. We enforce that by having both the per-subject count
 * (`countActiveSubjectQuestions`) and the bulk map (`getSubjectServedCounts`)
 * build their `where` from the SAME serve filter used by sampling. These tests
 * run those functions against an in-memory dataset with a faithful `where`
 * matcher and assert:
 *   1. counts include ONLY active + qaPassed rows (filter purity),
 *   2. the bulk map equals the per-subject count for every subject (consistency),
 *   3. legacy USMLE Step 3 rows filed under usmle-step-2 are excluded from Step 2 CK,
 *   4. a different field/subject never leaks into a topic's count.
 */

type Row = {
  fieldId: string;
  subjectId: string;
  active: boolean;
  qaPassed: boolean;
  stepLevel: string | null;
};

const { DATA, matchWhere, neonSql } = vi.hoisted(() => {
  const DATA: Array<{
    fieldId: string;
    subjectId: string;
    active: boolean;
    qaPassed: boolean;
    stepLevel: string | null;
  }> = [
    // usmle-step-2 / cardiology
    { fieldId: "usmle-step-2", subjectId: "cardiology", active: true, qaPassed: true, stepLevel: null },
    { fieldId: "usmle-step-2", subjectId: "cardiology", active: true, qaPassed: true, stepLevel: "step2" },
    { fieldId: "usmle-step-2", subjectId: "cardiology", active: true, qaPassed: false, stepLevel: null }, // unvetted → excluded
    { fieldId: "usmle-step-2", subjectId: "cardiology", active: false, qaPassed: true, stepLevel: null }, // inactive → excluded
    { fieldId: "usmle-step-2", subjectId: "cardiology", active: true, qaPassed: true, stepLevel: "step3" }, // legacy Step 3 → excluded
    // usmle-step-2 / neurology
    { fieldId: "usmle-step-2", subjectId: "neurology", active: true, qaPassed: true, stepLevel: null },
    { fieldId: "usmle-step-2", subjectId: "neurology", active: true, qaPassed: true, stepLevel: "step3" }, // excluded
    // different field — must never leak into usmle-step-2 counts
    { fieldId: "nursing", subjectId: "cardiology", active: true, qaPassed: true, stepLevel: null },
    { fieldId: "nursing", subjectId: "med-surg", active: true, qaPassed: true, stepLevel: null },
    { fieldId: "nursing", subjectId: "med-surg", active: true, qaPassed: false, stepLevel: null }, // excluded
  ];

  // Minimal Prisma `where` matcher covering the exact predicate shapes the serve
  // filter produces: scalar equality, { not }, null, and nested AND/OR.
  function matchWhere(row: Record<string, unknown>, where: Record<string, unknown>): boolean {
    return Object.entries(where).every(([key, cond]) => {
      if (key === "AND") return (cond as Record<string, unknown>[]).every((c) => matchWhere(row, c));
      if (key === "OR") return (cond as Record<string, unknown>[]).some((c) => matchWhere(row, c));
      const value = row[key];
      if (cond === null) return value === null || value === undefined;
      if (cond && typeof cond === "object" && "not" in cond) {
        return value !== (cond as { not: unknown }).not;
      }
      return value === cond;
    });
  }

  /** Mimic Neon HTTP bulk count for the SQL shapes used by getSubjectServedCounts. */
  async function neonSql(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<Array<{ subjectId: string; count: number }>> {
    const fieldId = String(values[0] ?? "");
    const sqlText = strings.join("?");
    const excludeStep3 = sqlText.includes("step3");
    const groups = new Map<string, number>();
    for (const r of DATA) {
      if (r.fieldId !== fieldId || !r.active || !r.qaPassed) continue;
      if (excludeStep3 && r.stepLevel === "step3") continue;
      groups.set(r.subjectId, (groups.get(r.subjectId) ?? 0) + 1);
    }
    return [...groups.entries()].map(([subjectId, count]) => ({ subjectId, count }));
  }

  return { DATA, matchWhere, neonSql };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      count: vi.fn(async ({ where }: { where: Record<string, unknown> }) =>
        DATA.filter((r) => matchWhere(r as unknown as Record<string, unknown>, where)).length
      ),
      groupBy: vi.fn(
        async ({ by, where }: { by: string[]; where: Record<string, unknown> }) => {
          const key = by[0];
          const groups = new Map<string, number>();
          for (const r of DATA.filter((x) =>
            matchWhere(x as unknown as Record<string, unknown>, where)
          )) {
            const k = (r as unknown as Record<string, string>)[key];
            groups.set(k, (groups.get(k) ?? 0) + 1);
          }
          return [...groups.entries()].map(([k, n]) => ({ [key]: k, _count: { _all: n } }));
        }
      ),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  sql: neonSql,
  getSql: () => neonSql,
  withDbRetry: async <T>(fn: () => Promise<T>) => fn(),
  getNeonSql: () => neonSql,
}));

import {
  countActiveSubjectQuestions,
  getSubjectServedCounts,
} from "@/lib/question-bank-db";

describe("per-topic served counts", () => {
  it("counts only active + qaPassed rows and excludes legacy Step 3 from Step 2 CK", async () => {
    // cardiology: 2 serve-ready (null + step2); unvetted, inactive, step3 excluded.
    expect(await countActiveSubjectQuestions("usmle-step-2", "cardiology")).toBe(2);
    // neurology: 1 serve-ready; step3 excluded.
    expect(await countActiveSubjectQuestions("usmle-step-2", "neurology")).toBe(1);
  });

  it("never leaks rows from another field into a topic count", async () => {
    // nursing/cardiology must not be counted under usmle-step-2/cardiology.
    expect(await countActiveSubjectQuestions("usmle-step-2", "cardiology")).toBe(2);
    expect(await countActiveSubjectQuestions("nursing", "cardiology")).toBe(1);
  });

  it("bulk map equals the per-subject count for every subject (consistency)", async () => {
    const map = await getSubjectServedCounts("usmle-step-2");
    expect(map).toEqual({ cardiology: 2, neurology: 1 });
    for (const subjectId of Object.keys(map)) {
      expect(map[subjectId]).toBe(
        await countActiveSubjectQuestions("usmle-step-2", subjectId)
      );
    }
  });

  it("applies no step separation for non-USMLE fields", async () => {
    const map = await getSubjectServedCounts("nursing");
    expect(map).toEqual({ cardiology: 1, "med-surg": 1 });
  });
});
