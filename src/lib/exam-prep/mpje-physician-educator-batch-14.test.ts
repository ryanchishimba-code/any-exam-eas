import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_14 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-14";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_14 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_14);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_14) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers prescriber red flags, partial fills, DIR, harassment, and NM/WY/ND", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_14.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("prescriber-validity") || t.includes("red-flags"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("partial-fill"))).toBe(true);
    expect(tags.some((t) => t.includes("DIR-fees"))).toBe(true);
    expect(tags.some((t) => t.includes("workplace-harassment") || t.includes("retaliation"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("new-mexico"))).toBe(true);
    expect(tags.some((t) => t.includes("wyoming"))).toBe(true);
    expect(tags.some((t) => t.includes("north-dakota"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-14")
    );
    expect(rows.length).toBe(18);
  });
});
