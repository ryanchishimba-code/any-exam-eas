import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_08 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-08";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_08 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_08);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_08) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers EPCS, returns, whistleblower, inventory, and AZ/CO/MN", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_08.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("e-prescribing") || t.includes("EPCS"))).toBe(true);
    expect(tags.some((t) => t.includes("returns") || t.includes("reuse"))).toBe(true);
    expect(tags.some((t) => t.includes("whistleblower") || t.includes("mandatory-reporting"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("inventory") || t.includes("biennial"))).toBe(true);
    expect(tags.some((t) => t.includes("arizona"))).toBe(true);
    expect(tags.some((t) => t.includes("colorado"))).toBe(true);
    expect(tags.some((t) => t.includes("minnesota"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-08")
    );
    expect(rows.length).toBe(18);
  });
});
