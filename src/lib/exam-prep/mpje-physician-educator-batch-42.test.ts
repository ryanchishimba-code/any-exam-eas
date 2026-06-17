import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_42 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-42";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_42 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_42);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_42) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers anti-kickback, USP-800, partial fill, counseling refusal, and NV/UT/ID", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_42.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("anti-kickback") || t.includes("Stark"))).toBe(true);
    expect(tags.some((t) => t.includes("USP-800"))).toBe(true);
    expect(tags.some((t) => t.includes("partial-fill"))).toBe(true);
    expect(tags.some((t) => t.includes("counseling-refusal") || t.includes("offer-to-counsel"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("nevada"))).toBe(true);
    expect(tags.some((t) => t.includes("utah"))).toBe(true);
    expect(tags.some((t) => t.includes("idaho"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-42")
    );
    expect(rows.length).toBe(18);
  });
});
