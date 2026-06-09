import { describe, expect, it } from "vitest";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { assessMpjePhysicianEducatorBatch } from "./mpje-physician-educator-quality";
import { collectHighYieldSeedRows } from "./high-yield-index";
import { serializeBankOptions, parseBankOptions } from "@/lib/mpje/parse-bank-options";

describe("MPJE_PHYSICIAN_EDUCATOR_BATCH_01 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessMpjePhysicianEducatorBatch(MPJE_PHYSICIAN_EDUCATOR_BATCH_01);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(14);
  });

  it("includes mcq and vignette formats with federal stateCode", () => {
    const types = new Set(MPJE_PHYSICIAN_EDUCATOR_BATCH_01.map((q) => q.itemType));
    expect(types.has("vignette")).toBe(true);
    expect(types.has("mcq")).toBe(true);
    expect(MPJE_PHYSICIAN_EDUCATOR_BATCH_01.every((q) => q.stateCode == null)).toBe(true);
  });

  it("is wired into collectHighYieldSeedRows for mpje bank sync", () => {
    const rows = collectHighYieldSeedRows().filter(
      (r) => r.fieldId === "mpje" && r.item.tags?.includes("physician-educator-batch-01")
    );
    expect(rows.length).toBe(14);
    expect(rows.every((r) => r.fieldId === "mpje")).toBe(true);
  });

  it("serializes options for QuestionBankItem import round-trip", () => {
    const item = MPJE_PHYSICIAN_EDUCATOR_BATCH_01[0]!;
    const raw = serializeBankOptions(item);
    const parsed = parseBankOptions(raw);
    expect(parsed.options.length).toBeGreaterThanOrEqual(4);
    expect(parsed.options).toContain(item.correctAnswer);
  });
});
