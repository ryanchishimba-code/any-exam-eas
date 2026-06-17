import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_26 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-26";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_26 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_26);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_26) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers USP-797 BUD, importation, PBM appeals, PAP, and NV/ND/SD", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_26.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("USP-797"))).toBe(true);
    expect(tags.some((t) => t.includes("BUD"))).toBe(true);
    expect(tags.some((t) => t.includes("personal-importation"))).toBe(true);
    expect(tags.some((t) => t.includes("PBM"))).toBe(true);
    expect(tags.some((t) => t.includes("clawback") || t.includes("appeal"))).toBe(true);
    expect(tags.some((t) => t.includes("PAP") || t.includes("patient-assistance"))).toBe(true);
    expect(tags.some((t) => t.includes("nevada"))).toBe(true);
    expect(tags.some((t) => t.includes("north-dakota"))).toBe(true);
    expect(tags.some((t) => t.includes("south-dakota"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-26")
    );
    expect(rows.length).toBe(18);
  });
});
