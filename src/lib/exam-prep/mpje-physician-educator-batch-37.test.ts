import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_37 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-37";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_37 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_37);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_37) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers DSCSA, intern/preceptor, MTM, drug shortage, and ND/SD/MT", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_37.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("DSCSA"))).toBe(true);
    expect(tags.some((t) => t.includes("intern") || t.includes("preceptor"))).toBe(true);
    expect(tags.some((t) => t.includes("MTM") || t.includes("CMR"))).toBe(true);
    expect(tags.some((t) => t.includes("drug-shortage"))).toBe(true);
    expect(tags.some((t) => t.includes("north-dakota"))).toBe(true);
    expect(tags.some((t) => t.includes("south-dakota"))).toBe(true);
    expect(tags.some((t) => t.includes("montana"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-37")
    );
    expect(rows.length).toBe(18);
  });
});
