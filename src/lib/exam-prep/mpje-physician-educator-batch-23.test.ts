import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_23 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-23";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_23 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_23);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_23) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers PREP Act, lab interface, therapeutic interchange, board consent, and TN/MO/MS", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_23.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("PREP-Act") || t.includes("countermeasure"))).toBe(true);
    expect(tags.some((t) => t.includes("clinical-laboratory") || t.includes("LDT"))).toBe(true);
    expect(tags.some((t) => t.includes("therapeutic-interchange"))).toBe(true);
    expect(tags.some((t) => t.includes("board-discipline") || t.includes("consent-agreement"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("tennessee"))).toBe(true);
    expect(tags.some((t) => t.includes("missouri"))).toBe(true);
    expect(tags.some((t) => t.includes("mississippi"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-23")
    );
    expect(rows.length).toBe(18);
  });
});
