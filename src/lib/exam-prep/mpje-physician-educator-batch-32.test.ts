import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_32 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-32";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_32 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_32);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_32) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers 340B, MTM billing, prescriber samples, tech ratio, and CA/TX/FL", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_32.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("340B"))).toBe(true);
    expect(tags.some((t) => t.includes("MTM"))).toBe(true);
    expect(tags.some((t) => t.includes("prescriber-samples") || t.includes("PDMA"))).toBe(true);
    expect(tags.some((t) => t.includes("technician-ratio"))).toBe(true);
    expect(tags.some((t) => t.includes("california"))).toBe(true);
    expect(tags.some((t) => t.includes("texas"))).toBe(true);
    expect(tags.some((t) => t.includes("florida"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for pance bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "pance" && r.item.tags?.includes("physician-educator-batch-32")
    );
    expect(rows.length).toBe(18);
  });
});
