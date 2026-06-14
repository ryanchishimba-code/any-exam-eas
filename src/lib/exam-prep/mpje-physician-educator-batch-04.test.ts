import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_04 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-04";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_04 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_04);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(19);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_04) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers REMS, DSCSA, technician scope, USP 800, and FL/OH/IL", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_04.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("REMS"))).toBe(true);
    expect(tags.some((t) => t.includes("DSCSA"))).toBe(true);
    expect(tags.some((t) => t.includes("technician-scope"))).toBe(true);
    expect(tags.some((t) => t.includes("USP-800"))).toBe(true);
    expect(tags.some((t) => t.includes("florida"))).toBe(true);
    expect(tags.some((t) => t.includes("ohio"))).toBe(true);
    expect(tags.some((t) => t.includes("illinois"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-04")
    );
    expect(rows.length).toBe(19);
  });
});
