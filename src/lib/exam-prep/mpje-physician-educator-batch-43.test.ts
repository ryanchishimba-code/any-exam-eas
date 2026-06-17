import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_43 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-43";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_43 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_43);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_43) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers HIPAA breach, DEA inventory/CSOS, Rx transfer, bloodborne, and MA/CT/RI", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_43.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("HIPAA") || t.includes("breach-notification"))).toBe(true);
    expect(tags.some((t) => t.includes("biennial-inventory") || t.includes("CSOS") || t.includes("Form-222"))).toBe(
      true
    );
    expect(tags.some((t) => t.includes("prescription-transfer"))).toBe(true);
    expect(tags.some((t) => t.includes("bloodborne-pathogens") || t.includes("needlestick"))).toBe(true);
    expect(tags.some((t) => t.includes("massachusetts"))).toBe(true);
    expect(tags.some((t) => t.includes("connecticut"))).toBe(true);
    expect(tags.some((t) => t.includes("rhode-island"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-43")
    );
    expect(rows.length).toBe(18);
  });
});
