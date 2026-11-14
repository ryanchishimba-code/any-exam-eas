import { describe, expect, it } from "vitest";
import { GAP_STEP2_20261114 } from "./gap-step2-20261114";

const ABSOLUTE = /\b(always|never|all|none|only|must|every|completely|invariably)\b/i;

const DOMAIN_COUNTS: Record<string, number> = {
  "reproductive-endocrine": 20,
  "social-sciences": 20,
  "msk-skin": 17,
  "blood-lymph-immune": 15,
  "respiratory-renal": 12,
  gastrointestinal: 6,
  "biostats-epi": 4,
  "behavioral-nervous": 3,
  cardiovascular: 3,
};

describe("Step 2 gap batch 2026-11-14", () => {
  it("has 100 items in the planned domain and difficulty mix", () => {
    expect(GAP_STEP2_20261114).toHaveLength(100);
    const domains: Record<string, number> = {};
    const bands: Record<string, number> = {};
    for (const item of GAP_STEP2_20261114) {
      domains[item.blueprintDomain] = (domains[item.blueprintDomain] ?? 0) + 1;
      bands[item.difficultyBand] = (bands[item.difficultyBand] ?? 0) + 1;
      expect(item.fieldId).toBe("usmle-step-2");
      expect(item.stepLevel).toBe("step2");
      expect(item.itemType).toBe("vignette");
      const expectedDifficulty = item.difficultyBand === "easy" ? 2 : item.difficultyBand === "medium" ? 3 : 5;
      expect(item.difficulty).toBe(expectedDifficulty);
    }
    expect(domains).toEqual(DOMAIN_COUNTS);
    expect(bands).toEqual({ easy: 20, medium: 30, hard: 50 });
  });

  it("keeps one defensible key, cue-free options, and a rationale for every distractor", () => {
    const codes = new Set<string>();
    for (const item of GAP_STEP2_20261114) {
      expect(codes.has(item.code)).toBe(false);
      codes.add(item.code);
      expect(item.options).toHaveLength(5);
      expect(new Set(item.options).size).toBe(5);
      expect(item.options).toContain(item.correctAnswer);
      expect(item.stem.trim().endsWith("?")).toBe(true);
      expect(item.vignette.length).toBeGreaterThan(120);
      expect(item.explanation.length).toBeGreaterThan(200);
      expect(item.references[0]?.url).toMatch(/^https:\/\//);
      const keyLength = item.correctAnswer.length;
      const longerDistractor = item.options.some(
        (option) => option !== item.correctAnswer && option.length >= keyLength
      );
      expect(longerDistractor, item.code).toBe(true);
      for (const option of item.options) {
        if (option.toLowerCase().includes("all-trans")) continue;
        expect(option, item.code).not.toMatch(ABSOLUTE);
        if (option !== item.correctAnswer) {
          expect(item.explanation, `${item.code} ${option}`).toContain(option);
        }
      }
    }
  });
});
