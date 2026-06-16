import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_24 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-24";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_24 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_24);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_24) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers DSCSA returns, EC access, BUD audits, eRx retention, and AZ/NM/UT", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_24.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("DSCSA"))).toBe(true);
    expect(tags.some((t) => t.includes("saleable-returns"))).toBe(true);
    expect(tags.some((t) => t.includes("emergency-contraception") || t.includes("hormonal-contraception"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("BUD"))).toBe(true);
    expect(tags.some((t) => t.includes("compounding-audit"))).toBe(true);
    expect(tags.some((t) => t.includes("record-retention") || t.includes("e-prescribing"))).toBe(true);
    expect(tags.some((t) => t.includes("arizona"))).toBe(true);
    expect(tags.some((t) => t.includes("new-mexico"))).toBe(true);
    expect(tags.some((t) => t.includes("utah"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-24")
    );
    expect(rows.length).toBe(18);
  });
});
