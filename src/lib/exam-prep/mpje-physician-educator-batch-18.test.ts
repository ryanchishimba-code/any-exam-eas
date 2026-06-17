import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_18 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-18";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_18 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_18);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_18) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers shortages, veterinary, NPI fraud, closure, and ME/NH/WV", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_18.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("drug-shortage") || t.includes("FDA-reporting"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("veterinary"))).toBe(true);
    expect(tags.some((t) => t.includes("NPI") || t.includes("billing-fraud"))).toBe(true);
    expect(tags.some((t) => t.includes("pharmacy-closure") || t.includes("wind-down"))).toBe(true);
    expect(tags.some((t) => t.includes("maine"))).toBe(true);
    expect(tags.some((t) => t.includes("new-hampshire"))).toBe(true);
    expect(tags.some((t) => t.includes("west-virginia"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-18")
    );
    expect(rows.length).toBe(18);
  });
});
