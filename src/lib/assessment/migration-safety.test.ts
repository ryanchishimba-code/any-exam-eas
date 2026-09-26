import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const up = readFileSync("prisma/migrations/20260926143000_ngn_pilot/migration.sql", "utf8");
const down = readFileSync("prisma/migrations/20260926143000_ngn_pilot/down.sql", "utf8");
const seed = readFileSync("scripts/ngn/seed-pilot.ts", "utf8");

function sqlWithoutComments(sql: string): string {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

describe("NGN migration safety", () => {
  it("creates only the new tables and does not alter existing ones", () => {
    const sql = sqlWithoutComments(up);
    expect(sql).not.toMatch(/\bALTER TABLE\b(?!\s+"ngn_)/);
    expect(sql).not.toMatch(/\bDROP\b/);
    expect(sql).not.toContain("QuestionBankItem");
    for (const table of ["ngn_import_batch", "ngn_case", "ngn_item", "ngn_item_review"]) {
      expect(sql).toContain(`CREATE TABLE "${table}"`);
    }
    expect(sql).toContain('CREATE OR REPLACE FUNCTION "canPublish"');
    expect(up).toContain("ngn_item_review is append-only");
  });

  it("drops only the new NGN objects", () => {
    const sql = sqlWithoutComments(down);
    expect(sql).toContain(
      "DROP TABLE IF EXISTS ngn_item_review, ngn_item, ngn_case, ngn_import_batch;"
    );
    expect(sql).not.toContain("QuestionBankItem");
    expect(sql).not.toMatch(/\b(?:UPDATE|INSERT|ALTER)\b/);
  });

  it("seed deletes only NGN tables", () => {
    const tables = [...seed.matchAll(/DELETE FROM (\w+)/g)].map((match) => match[1]);
    expect(new Set(tables)).toEqual(
      new Set(["ngn_item_review", "ngn_item", "ngn_case", "ngn_import_batch"])
    );
    expect(seed).not.toMatch(/QuestionBankItem"\s*\)|INTO\s+"QuestionBankItem"|FROM\s+"QuestionBankItem"/);
  });
});
