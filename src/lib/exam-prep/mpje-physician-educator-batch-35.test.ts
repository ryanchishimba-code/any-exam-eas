import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_35 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-35";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_35 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_35);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_35) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers PREP Act, lab critical values, interchange, whistleblower, and TN/MO/MS", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_35.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("PREP-Act"))).toBe(true);
    expect(tags.some((t) => t.includes("critical-value") || t.includes("clinical-laboratory"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("therapeutic-interchange"))).toBe(true);
    expect(tags.some((t) => t.includes("whistleblower") || t.includes("mandatory-reporting"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("tennessee"))).toBe(true);
    expect(tags.some((t) => t.includes("missouri"))).toBe(true);
    expect(tags.some((t) => t.includes("mississippi"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-35")
    );
    expect(rows.length).toBe(18);
  });
});
