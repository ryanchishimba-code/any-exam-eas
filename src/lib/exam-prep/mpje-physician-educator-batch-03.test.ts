import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-03";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_03 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_03);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_03) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers USP 795, ethics, transfers, and CA/TX state law", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_03.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("USP-795"))).toBe(true);
    expect(tags.some((t) => t.includes("ethics"))).toBe(true);
    expect(tags.some((t) => t.includes("transfer"))).toBe(true);
    expect(tags.some((t) => t.includes("california"))).toBe(true);
    expect(tags.some((t) => t.includes("texas"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-03")
    );
    expect(rows.length).toBe(18);
  });
});
