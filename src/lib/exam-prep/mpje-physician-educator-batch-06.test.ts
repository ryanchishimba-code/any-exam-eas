import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_06 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-06";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_06 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_06);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_06) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers FDA labeling, counsel, inspections, PDMP, and OK/MO/VA", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_06.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("labeling") || t.includes("FDA"))).toBe(true);
    expect(tags.some((t) => t.includes("offer-to-counsel") || t.includes("counseling"))).toBe(true);
    expect(tags.some((t) => t.includes("inspection") || t.includes("compounding"))).toBe(true);
    expect(tags.some((t) => t.includes("PDMP") || t.includes("red-flags"))).toBe(true);
    expect(tags.some((t) => t.includes("oklahoma"))).toBe(true);
    expect(tags.some((t) => t.includes("missouri"))).toBe(true);
    expect(tags.some((t) => t.includes("virginia"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-06")
    );
    expect(rows.length).toBe(18);
  });
});
