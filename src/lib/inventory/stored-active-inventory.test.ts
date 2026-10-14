import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { groupedTotal, storedCountsMatchStamp } from "./stored-active-inventory";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("stored active inventory counts", () => {
  it("accepts a refresh only when the group-by matches the live stamp", () => {
    expect(groupedTotal([{ count: 5444 }, { count: 100 }])).toBe(5544);
    expect(storedCountsMatchStamp(42106, { published: 42106 })).toBe(true);
    expect(storedCountsMatchStamp(42106, { published: 42105 })).toBe(false);
  });

  it("refreshes from the sync cron and does not scan the bank on a page read", () => {
    const cron = source("src/app/api/cron/sync-question-bank/route.ts");
    expect(cron).toContain("refreshActiveInventoryCounts");
    const reader = source("src/lib/inventory/active-questions.ts");
    expect(reader).toContain("readStoredActiveInventory");
    expect(reader).not.toContain("return aggregateActiveInventory(rows.map(normalizeDbInventoryRow))");
    const stamp = source("src/lib/inventory/active-inventory-stamp.ts");
    expect(stamp).toContain("readStoredActiveInventoryStamp");
    expect(stamp).toContain("queryLiveActiveInventoryStamp");
  });

  it("keeps the migration additive and off QuestionBankItem", () => {
    const sql = source("prisma/migrations/20261014140000_active_inventory_counts/migration.sql");
    expect(sql).toContain('CREATE TABLE "ActiveInventoryCount"');
    expect(sql).toContain('CREATE TABLE "ActiveInventoryStampRow"');
    expect(sql).toContain("DROP TABLE IF EXISTS");
    expect(sql).not.toMatch(/ALTER TABLE "QuestionBankItem"/);
    expect(sql).not.toMatch(/CREATE INDEX[^;]*"QuestionBankItem"/);
    expect(sql).not.toContain("CONCURRENTLY");
  });
});

describe("load speed config", () => {
  it("pins functions to iad1, next to the Neon us-east-1 database", () => {
    const vercel = JSON.parse(source("vercel.json")) as { regions?: string[] };
    expect(vercel.regions).toEqual(["iad1"]);
  });

  it("targets modern browsers and drops the legacy polyfills chunk", () => {
    const pkg = JSON.parse(source("package.json")) as { browserslist?: string[] };
    expect(pkg.browserslist).toEqual([
      "chrome 111",
      "edge 111",
      "firefox 111",
      "safari 16.4",
    ]);
    const config = source("next.config.ts");
    expect(config).toContain("DropLegacyPolyfills");
    expect(config).toContain("polyfills");
  });
});
