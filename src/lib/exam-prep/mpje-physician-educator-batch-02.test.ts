import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-02";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_02 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_02);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_02) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers DEA, HIPAA, USP 797, and NY/PA/NJ state law", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_02.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("DEA") || t.includes("C-II"))).toBe(true);
    expect(tags.some((t) => t.includes("HIPAA"))).toBe(true);
    expect(tags.some((t) => t.includes("USP-797"))).toBe(true);
    expect(tags.some((t) => t.includes("new-york"))).toBe(true);
    expect(tags.some((t) => t.includes("pennsylvania"))).toBe(true);
    expect(tags.some((t) => t.includes("new-jersey"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-02")
    );
    expect(rows.length).toBe(18);
  });
});
