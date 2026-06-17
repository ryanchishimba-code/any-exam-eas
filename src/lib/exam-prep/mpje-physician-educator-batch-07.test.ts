import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_07 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-07";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_07 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_07);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_07) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers substitution, DUR, emergency C-II, LTC, and NC/MA/WA", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_07.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("generic-substitution"))).toBe(true);
    expect(tags.some((t) => t.includes("DUR"))).toBe(true);
    expect(tags.some((t) => t.includes("emergency-prescription"))).toBe(true);
    expect(tags.some((t) => t.includes("LTC") || t.includes("consultant-pharmacist"))).toBe(true);
    expect(tags.some((t) => t.includes("north-carolina"))).toBe(true);
    expect(tags.some((t) => t.includes("massachusetts"))).toBe(true);
    expect(tags.some((t) => t.includes("washington"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-07")
    );
    expect(rows.length).toBe(18);
  });
});
