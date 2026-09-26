import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildSeedPlan } from "@/lib/assessment/import/plan";
import type { PilotDocument } from "@/lib/assessment/types";

const file = "content/ngn-pilot/pilot-items.json";
const bytes = readFileSync(file);
const sha256 = createHash("sha256").update(bytes).digest("hex");

describe("NGN seed plan", () => {
  it("matches the pilot sha256 and plans draft rows only", () => {
    expect(sha256).toBe("5c437135339c259afdc9593451bb1683ddf220389c8ea6ac9c2759acfe8a38b4");
    const doc = JSON.parse(bytes.toString("utf8")) as PilotDocument;
    doc.status = "published";
    const plan = buildSeedPlan(doc, sha256);
    expect(plan.errorCount).toBe(0);
    expect(plan.batch.batchId).toBe("ngn-pilot-2026-09-26");
    expect(plan.batch.rowCounts).toEqual({
      cases: 10,
      items: 70,
      caseItems: 60,
      bowties: 6,
      trends: 4,
    });
    expect(plan.cases).toHaveLength(10);
    expect(plan.items).toHaveLength(70);
    expect(plan.cases.every((row) => row.status === "draft")).toBe(true);
    expect(plan.items.every((row) => row.status === "draft")).toBe(true);
    expect(plan.items.filter((row) => row.itemType !== "case_item").every((row) => row.caseId === null)).toBe(
      true
    );
  });
});
