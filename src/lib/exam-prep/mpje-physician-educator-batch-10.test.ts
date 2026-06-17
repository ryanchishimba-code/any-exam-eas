import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_10 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-10";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_10 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_10);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_10) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers central fill, transfers, emergency prep, PIC, and WI/IN/MI", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_10.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("central-fill") || t.includes("mail-order"))).toBe(true);
    expect(tags.some((t) => t.includes("transfer"))).toBe(true);
    expect(tags.some((t) => t.includes("emergency-preparedness"))).toBe(true);
    expect(tags.some((t) => t.includes("PIC") || t.includes("ownership"))).toBe(true);
    expect(tags.some((t) => t.includes("wisconsin"))).toBe(true);
    expect(tags.some((t) => t.includes("indiana"))).toBe(true);
    expect(tags.some((t) => t.includes("michigan"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-10")
    );
    expect(rows.length).toBe(18);
  });
});
