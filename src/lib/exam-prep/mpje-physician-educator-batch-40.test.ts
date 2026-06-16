import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_40 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-40";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_40 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_40);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_40) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers Ryan Haight, USP-795, DIR clawbacks, disaster prep, and IA/MN/WI", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_40.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("Ryan-Haight"))).toBe(true);
    expect(tags.some((t) => t.includes("USP-795"))).toBe(true);
    expect(tags.some((t) => t.includes("DIR-fees") || t.includes("clawback"))).toBe(true);
    expect(tags.some((t) => t.includes("emergency-preparedness") || t.includes("disaster"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("iowa"))).toBe(true);
    expect(tags.some((t) => t.includes("minnesota"))).toBe(true);
    expect(tags.some((t) => t.includes("wisconsin"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-40")
    );
    expect(rows.length).toBe(18);
  });
});
