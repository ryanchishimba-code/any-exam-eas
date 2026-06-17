import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_30 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-30";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_30 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_30);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_30) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers FDA recalls, immunization AE, EPCS red flags, workers comp, and IL/MI/OH", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_30.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("FDA-recall") || t.includes("market-withdrawal"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("adverse-event") || t.includes("VAERS"))).toBe(true);
    expect(tags.some((t) => t.includes("EPCS"))).toBe(true);
    expect(tags.some((t) => t.includes("red-flags"))).toBe(true);
    expect(tags.some((t) => t.includes("workers-comp"))).toBe(true);
    expect(tags.some((t) => t.includes("illinois"))).toBe(true);
    expect(tags.some((t) => t.includes("michigan"))).toBe(true);
    expect(tags.some((t) => t.includes("ohio"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-30")
    );
    expect(rows.length).toBe(18);
  });
});
