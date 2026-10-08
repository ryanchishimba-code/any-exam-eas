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
    expect(sha256).toBe("997cf67195dc0b184ac55a6602668f59104f39bf2d6c094b12b7b8ae2cc688c5");
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
    const discharge = doc.cases
      .find((row) => row.id === "C06")
      ?.items.find((row) => row.id === "C06-S1");
    const tokens = (discharge?.payload as { tokens?: { text?: string }[] } | undefined)?.tokens ?? [];
    const stem = tokens.map((token) => token.text ?? "").join("");
    expect(stem).toContain(
      "Tolerating regular diet. Voiding without difficulty. States, 'I can't afford all these new pills.'"
    );
    expect(stem).not.toContain("pills.'. Voiding");
  });
});
