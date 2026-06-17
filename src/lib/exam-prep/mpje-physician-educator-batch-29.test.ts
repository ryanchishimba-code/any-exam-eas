import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_29 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-29";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_29 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_29);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_29) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers USP-800, conscience/refusal, C-II LTC partial fill, mail-order, and MN/WI/IN", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_29.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("USP-800") || t.includes("hazardous-drug"))).toBe(true);
    expect(tags.some((t) => t.includes("conscience") || t.includes("refusal"))).toBe(true);
    expect(tags.some((t) => t.includes("partial-fill"))).toBe(true);
    expect(tags.some((t) => t.includes("LTC"))).toBe(true);
    expect(tags.some((t) => t.includes("mail-order") || t.includes("central-fill"))).toBe(true);
    expect(tags.some((t) => t.includes("minnesota"))).toBe(true);
    expect(tags.some((t) => t.includes("wisconsin"))).toBe(true);
    expect(tags.some((t) => t.includes("indiana"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-29")
    );
    expect(rows.length).toBe(18);
  });
});
