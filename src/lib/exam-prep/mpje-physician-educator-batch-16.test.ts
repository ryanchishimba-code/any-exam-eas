import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_16 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-16";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_16 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_16);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_16) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers recalls, opioid disposal, lab interface, relief pharmacist, and IA/AR/CT", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_16.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("FDA-recall"))).toBe(true);
    expect(tags.some((t) => t.includes("opioid-disposal") || t.includes("take-back"))).toBe(true);
    expect(tags.some((t) => t.includes("clinical-laboratory"))).toBe(true);
    expect(tags.some((t) => t.includes("relief-pharmacist"))).toBe(true);
    expect(tags.some((t) => t.includes("iowa"))).toBe(true);
    expect(tags.some((t) => t.includes("arkansas"))).toBe(true);
    expect(tags.some((t) => t.includes("connecticut"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-16")
    );
    expect(rows.length).toBe(18);
  });
});
