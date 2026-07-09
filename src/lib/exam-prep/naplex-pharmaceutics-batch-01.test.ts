import { describe, expect, it } from "vitest";
import { NAPLEX_PHARMACEUTICS_BATCH_01 } from "@/lib/edtech/seeds/naplex-pharmaceutics-batch-01";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("NAPLEX_PHARMACEUTICS_BATCH_01", () => {
  it("contains 30 pharmaceutics items", () => {
    expect(NAPLEX_PHARMACEUTICS_BATCH_01).toHaveLength(30);
    expect(NAPLEX_PHARMACEUTICS_BATCH_01.every((q) => q.subjectId === "pharmaceutics")).toBe(
      true
    );
  });

  it("mixes MCQ, SATA, ordered, and calculation formats", () => {
    const types = new Set(NAPLEX_PHARMACEUTICS_BATCH_01.map((q) => q.itemType));
    expect(types.has("case_based") || types.has("vignette")).toBe(true);
    expect(types.has("select_all")).toBe(true);
    expect(types.has("ordered_response")).toBe(true);
    expect(types.has("constructed_response")).toBe(true);
  });

  it("covers top-4 priority domains via tags", () => {
    const blob = NAPLEX_PHARMACEUTICS_BATCH_01.flatMap((q) => q.tags ?? []).join(" ");
    expect(blob).toMatch(/dosage-forms|ODT|transdermal|parenteral|depot|inhaler/i);
    expect(blob).toMatch(/BCS|bioequivalence|bioavailability|dissolution/i);
    expect(blob).toMatch(/USP797|USP800/i);
    expect(blob).toMatch(/excipients|stability|incompatibility|photolysis/i);
  });

  it("requires explanations and correct answers", () => {
    for (const item of NAPLEX_PHARMACEUTICS_BATCH_01) {
      expect(item.correctAnswer?.trim().length).toBeGreaterThan(0);
      expect(item.explanation?.trim().length).toBeGreaterThan(80);
      expect(item.tags).toContain("pharmaceutics-batch-01");
    }
  });

  it("is wired into high-yield pharmacy seed collection", () => {
    const batch = new Set(NAPLEX_PHARMACEUTICS_BATCH_01);
    const rows = collectHighYieldSeedRows().filter((r) => batch.has(r.item));
    expect(rows).toHaveLength(30);
    expect(rows.every((r) => r.fieldId === "pharmacy")).toBe(true);
  });

  it("verifies embedded calculation keys", () => {
    const calcs = NAPLEX_PHARMACEUTICS_BATCH_01.filter(
      (q) => q.itemType === "constructed_response"
    );
    expect(calcs.length).toBeGreaterThanOrEqual(3);
    const answers = new Set(calcs.map((q) => q.correctAnswer));
    expect(answers.has("200")).toBe(true);
    expect(answers.has("92")).toBe(true);
    expect(answers.has("9.2")).toBe(true);
  });
});
