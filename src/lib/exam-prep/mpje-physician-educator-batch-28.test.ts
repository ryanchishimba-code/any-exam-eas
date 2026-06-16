import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_28 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-28";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_28 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_28);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_28) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers LTC consultant, emergency C-II, interstate transfer, security, and OR/MA/NH", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_28.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("consultant-pharmacist") || t.includes("LTC"))).toBe(true);
    expect(tags.some((t) => t.includes("emergency-prescription") || t.includes("C-II"))).toBe(true);
    expect(tags.some((t) => t.includes("prescription-transfer") || t.includes("interstate"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("security") || t.includes("robbery"))).toBe(true);
    expect(tags.some((t) => t.includes("oregon"))).toBe(true);
    expect(tags.some((t) => t.includes("massachusetts"))).toBe(true);
    expect(tags.some((t) => t.includes("new-hampshire"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-28")
    );
    expect(rows.length).toBe(18);
  });
});
