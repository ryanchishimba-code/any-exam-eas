import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_36 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-36";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_36 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_36);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_36) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers REMS, central fill, 503A office-use, Med Sync billing, and CO/ID/WY", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_36.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("REMS"))).toBe(true);
    expect(tags.some((t) => t.includes("central-fill") || t.includes("hub-and-spoke"))).toBe(true);
    expect(tags.some((t) => t.includes("503A") || t.includes("office-use"))).toBe(true);
    expect(tags.some((t) => t.includes("Med-Sync") || t.includes("medication-synchronization"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("colorado"))).toBe(true);
    expect(tags.some((t) => t.includes("idaho"))).toBe(true);
    expect(tags.some((t) => t.includes("wyoming"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-36")
    );
    expect(rows.length).toBe(18);
  });
});
