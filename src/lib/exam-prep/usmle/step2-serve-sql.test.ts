import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ACTIVE_INVENTORY_ROWS_SQL } from "@/lib/inventory/active-questions";
import { ACTIVE_INVENTORY_STAMP_SQL } from "@/lib/inventory/active-inventory-stamp";
import { LIVE_BOARD_COUNT_SQL } from "@/lib/marketing/live-board-counts";
import { USMLE_STEP2_SERVE_SQL, step2ServeRowCounts } from "./step2-serve-sql";

const SQL_FILES = [
  "src/lib/marketing/live-board-counts.ts",
  "src/lib/inventory/active-questions.ts",
  "src/lib/inventory/active-inventory-stamp.ts",
  "src/lib/question-bank-db.ts",
  "src/lib/exam-prep/usmle/exam-options.ts",
  "src/app/api/catalog/subjects/route.ts",
];

describe("Step 2 served-count predicate", () => {
  it("includes a blank step and excludes inactive, failed QA, and Step 3 rows on Step 2", () => {
    expect(
      step2ServeRowCounts({
        fieldId: "usmle-step-2",
        active: true,
        qaPassed: true,
        stepLevel: null,
      })
    ).toBe(true);
    expect(
      step2ServeRowCounts({
        fieldId: "usmle-step-2",
        active: true,
        qaPassed: true,
        stepLevel: "step2",
      })
    ).toBe(true);
    expect(
      step2ServeRowCounts({
        fieldId: "usmle-step-2",
        active: true,
        qaPassed: true,
        stepLevel: "step3",
      })
    ).toBe(false);
    expect(
      step2ServeRowCounts({
        fieldId: "usmle-step-2",
        active: false,
        qaPassed: true,
        stepLevel: null,
      })
    ).toBe(false);
    expect(
      step2ServeRowCounts({
        fieldId: "usmle-step-2",
        active: true,
        qaPassed: false,
        stepLevel: "step2",
      })
    ).toBe(false);
    expect(
      step2ServeRowCounts({
        fieldId: "usmle-step-1",
        active: true,
        qaPassed: true,
        stepLevel: null,
      })
    ).toBe(true);
  });

  it("uses the null-safe SQL in every public count query", () => {
    expect(USMLE_STEP2_SERVE_SQL).toContain('"stepLevel" IS NULL');
    expect(USMLE_STEP2_SERVE_SQL).not.toContain("NOT (");
    expect(LIVE_BOARD_COUNT_SQL).toContain(USMLE_STEP2_SERVE_SQL);
    expect(ACTIVE_INVENTORY_ROWS_SQL).toContain(USMLE_STEP2_SERVE_SQL);
    expect(ACTIVE_INVENTORY_STAMP_SQL).toContain(USMLE_STEP2_SERVE_SQL);
    for (const file of SQL_FILES) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain("USMLE_STEP2_SERVE_SQL");
      expect(source, file).not.toContain(
        `AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')`
      );
    }
  });
});
