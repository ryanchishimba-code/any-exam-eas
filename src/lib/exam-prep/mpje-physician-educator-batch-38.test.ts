import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_38 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-38";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_38 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_38);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_38) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers EPCS credentialing, LTC emergency kit, inspection, pregnancy/lactation, and UT/AZ/NM", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_38.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("EPCS"))).toBe(true);
    expect(tags.some((t) => t.includes("emergency-kit") || t.includes("LTC"))).toBe(true);
    expect(tags.some((t) => t.includes("inspection"))).toBe(true);
    expect(tags.some((t) => t.includes("pregnancy") || t.includes("lactation"))).toBe(true);
    expect(tags.some((t) => t.includes("utah"))).toBe(true);
    expect(tags.some((t) => t.includes("arizona"))).toBe(true);
    expect(tags.some((t) => t.includes("new-mexico"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-38")
    );
    expect(rows.length).toBe(18);
  });
});
