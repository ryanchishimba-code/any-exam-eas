import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_33 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-33";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_33 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_33);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_33) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers anti-kickback, accumulator/PAP, Rx validity, closure, and NY/PA/NJ", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_33.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("anti-kickback") || t.includes("Stark"))).toBe(true);
    expect(tags.some((t) => t.includes("accumulator") || t.includes("PAP"))).toBe(true);
    expect(tags.some((t) => t.includes("prescription-validity") || t.includes("red-flags"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("pharmacy-closure") || t.includes("wind-down"))).toBe(true);
    expect(tags.some((t) => t.includes("new-york"))).toBe(true);
    expect(tags.some((t) => t.includes("pennsylvania"))).toBe(true);
    expect(tags.some((t) => t.includes("new-jersey"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-33")
    );
    expect(rows.length).toBe(18);
  });
});
