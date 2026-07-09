import { describe, expect, it } from "vitest";
import {
  COMMUNITY_NCLEX_DOSAGE_CALC_100,
  communityDosageItemToBankItem,
  type CommunityNclexDosageItem,
} from "./community-nclex-dosage-calc-100";

function correctOption(item: CommunityNclexDosageItem): string {
  const idx = item.correctLetter.charCodeAt(0) - 65;
  return item.options[idx]!;
}

describe("community NCLEX dosage calc 100", () => {
  it("builds 100 unique items with ids 1–100", () => {
    expect(COMMUNITY_NCLEX_DOSAGE_CALC_100).toHaveLength(100);
    const ids = COMMUNITY_NCLEX_DOSAGE_CALC_100.map((item) => item.id);
    expect(new Set(ids).size).toBe(100);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(100);
  });

  it("every item has a worked rationale (solution) and valid correct letter", () => {
    for (const item of COMMUNITY_NCLEX_DOSAGE_CALC_100) {
      expect(item.rationale.trim().length).toBeGreaterThan(20);
      expect(["A", "B", "C", "D"]).toContain(item.correctLetter);
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options.map((o) => o.trim().toLowerCase())).size).toBe(4);
      expect(correctOption(item)).toBeTruthy();
    }
  });

  it("bank conversion preserves correct answer and explanation", () => {
    for (const row of COMMUNITY_NCLEX_DOSAGE_CALC_100) {
      const bank = communityDosageItemToBankItem(row);
      expect(bank.correctAnswer).toBe(correctOption(row));
      expect(bank.explanation).toBe(row.rationale);
      expect(bank.solutionSteps ?? bank.explanation).toBeTruthy();
    }
  });

  it("specified oral tablet items match arithmetic", () => {
    const cases: Array<{ id: number; expected: string }> = [
      { id: 1, expected: "3 tablets" },
      { id: 2, expected: "2 tablets" },
      { id: 4, expected: "½ tablet" },
    ];
    for (const { id, expected } of cases) {
      const item = COMMUNITY_NCLEX_DOSAGE_CALC_100.find((i) => i.id === id)!;
      expect(correctOption(item)).toBe(expected);
    }
  });

  it("specified IV dopamine item matches infusion-rate math", () => {
    const item = COMMUNITY_NCLEX_DOSAGE_CALC_100.find((i) => i.id === 44)!;
    // 5 mcg/kg/min × 80 kg = 400 mcg/min; 400 mg/250 mL → 1600 mcg/mL; rate = 15 mL/hr
    expect(correctOption(item)).toBe("15 mL/hr");
    expect(item.rationale).toMatch(/15 mL\/hr/i);
  });

  it("specified fluid balance item matches intake/output math", () => {
    const item = COMMUNITY_NCLEX_DOSAGE_CALC_100.find((i) => i.id === 86)!;
    expect(correctOption(item)).toBe("+300 mL");
  });
});
