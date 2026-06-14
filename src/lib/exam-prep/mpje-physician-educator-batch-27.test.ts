import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_27 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-27";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { assessMpjeItemQuality } from "./mpje-quality-gate";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_27 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_27);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(18);
  });

  it("every item is A+ best-tier", () => {
    for (const item of MPJE_PHYSICIAN_EDUCATOR_BATCH_27) {
      const verdict = assessMpjeItemQuality(item, { source: "seed" });
      expect(verdict.tier, item.question.slice(0, 80)).toBe("best");
    }
  });

  it("covers telehealth, OSHA, forgery, NDC billing, and MT/AK/HI", () => {
    const tags = MPJE_PHYSICIAN_EDUCATOR_BATCH_27.flatMap((i) => i.tags ?? []);
    expect(tags.some((t) => t.includes("telehealth") || t.includes("telemedicine"))).toBe(true);
    expect(tags.some((t) => t.includes("hazard-communication") || t.includes("OSHA"))).toBe(true);
    expect(tags.some((t) => t.includes("forgery") || t.includes("tampering"))).toBe(true);
    expect(tags.some((t) => t.includes("NDC") || t.includes("billing-accuracy"))).toBe(true);
    expect(tags.some((t) => t.includes("montana"))).toBe(true);
    expect(tags.some((t) => t.includes("alaska"))).toBe(true);
    expect(tags.some((t) => t.includes("hawaii"))).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-27")
    );
    expect(rows.length).toBe(18);
  });
});
