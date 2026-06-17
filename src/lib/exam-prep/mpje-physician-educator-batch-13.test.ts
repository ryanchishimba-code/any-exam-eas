import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_13 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-13";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_13 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_13);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_13) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers BUD, counseling refusal, payer audits, automation, and HI/AK/MT", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_13.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("BUD") || t.includes("USP-795"))).toBe(true);
    expect(tags.some((t) => t.includes("counseling-refusal") || t.includes("offer-to-counsel"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("payer-audit"))).toBe(true);
    expect(tags.some((t) => t.includes("pharmacy-automation"))).toBe(true);
    expect(tags.some((t) => t.includes("hawaii"))).toBe(true);
    expect(tags.some((t) => t.includes("alaska"))).toBe(true);
    expect(tags.some((t) => t.includes("montana"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-13")
    );
    expect(rows.length).toBe(18);
  });
});
