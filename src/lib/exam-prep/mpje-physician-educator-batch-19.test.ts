import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_19 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-19";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_19 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_19);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_19) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers 503B, auxiliary labeling, workers comp, tech ratio, and MD/DC/PR", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_19.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("503B") || t.includes("outsourcing"))).toBe(true);
    expect(tags.some((t) => t.includes("auxiliary-label") || t.includes("labeling"))).toBe(true);
    expect(tags.some((t) => t.includes("workers-comp"))).toBe(true);
    expect(tags.some((t) => t.includes("technician-ratio") || t.includes("supervision"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("maryland"))).toBe(true);
    expect(tags.some((t) => t.includes("district-of-columbia"))).toBe(true);
    expect(tags.some((t) => t.includes("puerto-rico"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-19")
    );
    expect(rows.length).toBe(18);
  });
});
