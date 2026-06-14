import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_15 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-15";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_15 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_15);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_15) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers REMS follow-up, PAP, hazard communication, discipline, and SD/NE/KS", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_15.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("REMS") || t.includes("follow-up"))).toBe(true);
    expect(tags.some((t) => t.includes("patient-assistance") || t.includes("PAP"))).toBe(true);
    expect(tags.some((t) => t.includes("hazard-communication"))).toBe(true);
    expect(tags.some((t) => t.includes("board-discipline") || t.includes("probation"))).toBe(true);
    expect(tags.some((t) => t.includes("south-dakota"))).toBe(true);
    expect(tags.some((t) => t.includes("nebraska"))).toBe(true);
    expect(tags.some((t) => t.includes("kansas"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-15")
    );
    expect(rows.length).toBe(18);
  });
});
