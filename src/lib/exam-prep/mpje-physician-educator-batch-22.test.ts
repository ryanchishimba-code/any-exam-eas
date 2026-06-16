import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_22 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-22";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_22 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_22);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_22) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers Ryan Haight, Med Sync, USP-800, anti-kickback, and VA/WV/KY", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_22.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("Ryan-Haight") || t.includes("internet-pharmacy"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("Med-Sync") || t.includes("medication-synchronization"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("USP-800"))).toBe(true);
    expect(tags.some((t) => t.includes("anti-kickback") || t.includes("Stark"))).toBe(true);
    expect(tags.some((t) => t.includes("virginia"))).toBe(true);
    expect(tags.some((t) => t.includes("west-virginia"))).toBe(true);
    expect(tags.some((t) => t.includes("kentucky"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-22")
    );
    expect(rows.length).toBe(18);
  });
});
