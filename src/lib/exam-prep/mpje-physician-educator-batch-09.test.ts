import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_09 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-09";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_09 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_09);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_09) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers telepharmacy, waste, tech registration, inspection, and SC/TN/KY", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_09.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("telepharmacy"))).toBe(true);
    expect(tags.some((t) => t.includes("hazardous-waste") || t.includes("disposal"))).toBe(true);
    expect(tags.some((t) => t.includes("technician-registration"))).toBe(true);
    expect(tags.some((t) => t.includes("inspection"))).toBe(true);
    expect(tags.some((t) => t.includes("south-carolina"))).toBe(true);
    expect(tags.some((t) => t.includes("tennessee"))).toBe(true);
    expect(tags.some((t) => t.includes("kentucky"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-09")
    );
    expect(rows.length).toBe(18);
  });
});
