import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_12 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-12";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_12 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_12);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_12) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers MTM, shortage, security, UMPJE, and UT/ID/NV", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_12.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("MTM") || t.includes("billing-compliance"))).toBe(true);
    expect(tags.some((t) => t.includes("drug-shortage"))).toBe(true);
    expect(tags.some((t) => t.includes("security") || t.includes("robbery"))).toBe(true);
    expect(tags.some((t) => t.includes("UMPJE") || t.includes("transition"))).toBe(true);
    expect(tags.some((t) => t.includes("utah"))).toBe(true);
    expect(tags.some((t) => t.includes("idaho"))).toBe(true);
    expect(tags.some((t) => t.includes("nevada"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-12")
    );
    expect(rows.length).toBe(18);
  });
});
