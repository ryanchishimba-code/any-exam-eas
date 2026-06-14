import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_21 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-21";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_21 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_21);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_21) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers DIR audits, take-back, OBRA substitution, negligence, and GA/SC/NC", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_21.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("DIR-fees") || t.includes("payer-audit"))).toBe(true);
    expect(tags.some((t) => t.includes("take-back") || t.includes("DEA-disposal"))).toBe(true);
    expect(tags.some((t) => t.includes("OBRA") || t.includes("generic-substitution"))).toBe(true);
    expect(tags.some((t) => t.includes("negligence"))).toBe(true);
    expect(tags.some((t) => t.includes("georgia"))).toBe(true);
    expect(tags.some((t) => t.includes("south-carolina"))).toBe(true);
    expect(tags.some((t) => t.includes("north-carolina"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-21")
    );
    expect(rows.length).toBe(18);
  });
});
