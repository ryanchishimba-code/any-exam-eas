import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_05 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-05";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_05 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_05);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_05) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers partial fills, validity, immunizations, and GA/PA/NJ", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_05.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("partial-fill"))).toBe(true);
    expect(tags.some((t) => t.includes("prescription-validity"))).toBe(true);
    expect(tags.some((t) => t.includes("immunization"))).toBe(true);
    expect(tags.some((t) => t.includes("georgia"))).toBe(true);
    expect(tags.some((t) => t.includes("pennsylvania"))).toBe(true);
    expect(tags.some((t) => t.includes("new-jersey"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-05")
    );
    expect(rows.length).toBe(18);
  });
});
