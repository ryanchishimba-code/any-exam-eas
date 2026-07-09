import { describe, expect, it } from "vitest";
import { NAPLEX_PHARMACEUTICS_BATCH_02 } from "@/lib/edtech/seeds/naplex-pharmaceutics-batch-02";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("NAPLEX_PHARMACEUTICS_BATCH_02", () => {
  it("contains 30 pharmaceutics items", () => {
    expect(NAPLEX_PHARMACEUTICS_BATCH_02).toHaveLength(30);
    expect(NAPLEX_PHARMACEUTICS_BATCH_02.every((q) => q.subjectId === "pharmaceutics")).toBe(
      true
    );
  });

  it("mixes MCQ, SATA, ordered, and calculation formats", () => {
    const types = new Set(NAPLEX_PHARMACEUTICS_BATCH_02.map((q) => q.itemType));
    expect(types.has("case_based") || types.has("vignette")).toBe(true);
    expect(types.has("select_all")).toBe(true);
    expect(types.has("ordered_response")).toBe(true);
    expect(types.has("constructed_response")).toBe(true);
  });

  it("covers domains 5–10 via tags", () => {
    const blob = NAPLEX_PHARMACEUTICS_BATCH_02.flatMap((q) => q.tags ?? []).join(" ");
    expect(blob).toMatch(/pKa|polymorphism|logP|micelles|chelation|preformulation/i);
    expect(blob).toMatch(/granulation|cGMP|content-uniformity|dissolution/i);
    expect(blob).toMatch(/OROS|liposome|abuse-deterrent|modified-release/i);
    expect(blob).toMatch(/USP795|BUD|geometric-dilution/i);
    expect(blob).toMatch(/packaging|cold-chain|nitroglycerin|child-resistant/i);
    expect(blob).toMatch(/alligation|isotonicity|percent-strength|calculation/i);
  });

  it("requires explanations and correct answers", () => {
    for (const item of NAPLEX_PHARMACEUTICS_BATCH_02) {
      expect(item.correctAnswer?.trim().length).toBeGreaterThan(0);
      expect(item.explanation?.trim().length).toBeGreaterThan(80);
      expect(item.tags).toContain("pharmaceutics-batch-02");
    }
  });

  it("is wired into high-yield pharmacy seed collection", () => {
    const batch = new Set(NAPLEX_PHARMACEUTICS_BATCH_02);
    const rows = collectHighYieldSeedRows().filter((r) => batch.has(r.item));
    expect(rows).toHaveLength(30);
    expect(rows.every((r) => r.fieldId === "pharmacy")).toBe(true);
  });

  it("verifies embedded calculation keys", () => {
    const calcs = NAPLEX_PHARMACEUTICS_BATCH_02.filter(
      (q) => q.itemType === "constructed_response"
    );
    expect(calcs.length).toBe(4);
    const answers = new Set(calcs.map((q) => q.correctAnswer));
    expect(answers.has("27")).toBe(true);
    expect(answers.has("216")).toBe(true);
    expect(answers.has("900")).toBe(true);
    expect(answers.has("28")).toBe(true);
  });
});
