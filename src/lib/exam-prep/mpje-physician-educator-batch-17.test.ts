import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_17 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-17";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_17 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_17);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_17) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers 503A office-use, expiration, social media, DUR docs, and DE/RI/VT", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_17.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("503A") || t.includes("office-use"))).toBe(true);
    expect(tags.some((t) => t.includes("expiration") || t.includes("prescription-validity"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("social-media") || t.includes("marketing"))).toBe(true);
    expect(tags.some((t) => t.includes("DUR"))).toBe(true);
    expect(tags.some((t) => t.includes("documentation"))).toBe(true);
    expect(tags.some((t) => t.includes("delaware"))).toBe(true);
    expect(tags.some((t) => t.includes("rhode-island"))).toBe(true);
    expect(tags.some((t) => t.includes("vermont"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-17")
    );
    expect(rows.length).toBe(18);
  });
});
