import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_41 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-41";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_41 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_41);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_41) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers 340B, auxiliary/LEP, NPI fraud, Rx validity, and AR/LA/MS", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_41.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("340B"))).toBe(true);
    expect(tags.some((t) => t.includes("auxiliary-label") || t.includes("LEP"))).toBe(true);
    expect(tags.some((t) => t.includes("NPI"))).toBe(true);
    expect(tags.some((t) => t.includes("prescription-validity") || t.includes("red-flags"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("arkansas"))).toBe(true);
    expect(tags.some((t) => t.includes("louisiana"))).toBe(true);
    expect(tags.some((t) => t.includes("mississippi"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-41")
    );
    expect(rows.length).toBe(18);
  });
});
