import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_39 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-39";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_39 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_39);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_39) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers workers comp/MSA, veterinary compounding, reverse distributor, social media, and NE/KS/OK", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_39.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("workers-comp") || t.includes("MSA"))).toBe(true);
    expect(tags.some((t) => t.includes("veterinary"))).toBe(true);
    expect(tags.some((t) => t.includes("reverse-distributor"))).toBe(true);
    expect(tags.some((t) => t.includes("social-media") || t.includes("advertising"))).toBe(true);
    expect(tags.some((t) => t.includes("nebraska"))).toBe(true);
    expect(tags.some((t) => t.includes("kansas"))).toBe(true);
    expect(tags.some((t) => t.includes("oklahoma"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-39")
    );
    expect(rows.length).toBe(18);
  });
});
