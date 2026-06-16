import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_31 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-31";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_31 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_31);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_31) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers HIPAA minimum necessary, inspection, naloxone, DIR transparency, and GA/PA/NJ", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_31.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("minimum-necessary"))).toBe(true);
    expect(tags.some((t) => t.includes("inspection"))).toBe(true);
    expect(tags.some((t) => t.includes("naloxone") || t.includes("standing-order"))).toBe(true);
    expect(tags.some((t) => t.includes("DIR-fees") || t.includes("transparency"))).toBe(true);
    expect(tags.some((t) => t.includes("georgia"))).toBe(true);
    expect(tags.some((t) => t.includes("pennsylvania"))).toBe(true);
    expect(tags.some((t) => t.includes("new-jersey"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-31")
    );
    expect(rows.length).toBe(18);
  });
});
