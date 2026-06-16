import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_34 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-34";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_34 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_34);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_34) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers Ryan Haight, DSCSA returns, board consent, emergency supply, and VA/NC/SC", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_34.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("Ryan-Haight") || t.includes("telemedicine"))).toBe(true);
    expect(tags.some((t) => t.includes("DSCSA") || t.includes("saleable-returns"))).toBe(true);
    expect(tags.some((t) => t.includes("consent-agreement") || t.includes("board-discipline"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("emergency-supply") || t.includes("emergency-refill"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("virginia"))).toBe(true);
    expect(tags.some((t) => t.includes("north-carolina"))).toBe(true);
    expect(tags.some((t) => t.includes("south-carolina"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-34")
    );
    expect(rows.length).toBe(18);
  });
});
