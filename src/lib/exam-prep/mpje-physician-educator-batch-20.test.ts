import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_20 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-20";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_20 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_20);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_20) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers 340B, MTM docs, interstate compounding, HIPAA breach, and OK/PA/OH", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_20.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("340B"))).toBe(true);
    expect(tags.some((t) => t.includes("MTM"))).toBe(true);
    expect(tags.some((t) => t.includes("documentation"))).toBe(true);
    expect(tags.some((t) => t.includes("interstate-compounding"))).toBe(true);
    expect(tags.some((t) => t.includes("breach-response"))).toBe(true);
    expect(tags.some((t) => t.includes("oklahoma"))).toBe(true);
    expect(tags.some((t) => t.includes("pennsylvania"))).toBe(true);
    expect(tags.some((t) => t.includes("ohio"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-20")
    );
    expect(rows.length).toBe(18);
  });
});
