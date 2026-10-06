import { describe, expect, it } from "vitest";
import { initCatSession, updateCatSession } from "./cat-engine";
import {
  catAbilityToPracticePct,
  mapDifficultyToCatBand,
  pickCatNext,
} from "./cat-select";

describe("mapDifficultyToCatBand", () => {
  it("maps common bank labels", () => {
    expect(mapDifficultyToCatBand("easy", 0)).toBe("easy");
    expect(mapDifficultyToCatBand("HARD", 0)).toBe("hard");
    expect(mapDifficultyToCatBand("medium", 0)).toBe("medium");
  });

  it("falls back to index banding when unknown", () => {
    expect(mapDifficultyToCatBand(undefined, 0)).toBe("easy");
    expect(mapDifficultyToCatBand("mystery", 1)).toBe("medium");
    expect(mapDifficultyToCatBand("", 2)).toBe("hard");
  });
});

describe("pickCatNext", () => {
  const pool = [
    { id: "e1", difficultyBand: "easy" as const },
    { id: "m1", difficultyBand: "medium" as const },
    { id: "h1", difficultyBand: "hard" as const },
    { id: "h2", difficultyBand: "hard" as const },
  ];

  it("prefers the target difficulty band", () => {
    let state = initCatSession();
    for (let i = 0; i < 40; i++) {
      state = updateCatSession(state, true, "hard");
    }
    const next = pickCatNext(state, pool, new Set(), () => 0);
    expect(next?.difficultyBand).toBe("hard");
  });

  it("falls back when band is exhausted", () => {
    const state = initCatSession();
    const next = pickCatNext(state, pool, new Set(["e1", "m1", "h1", "h2"]), () => 0);
    expect(next).toBeNull();
  });

  it("excludes already used ids", () => {
    const state = initCatSession();
    const next = pickCatNext(state, pool, new Set(["e1", "m1"]), () => 0);
    expect(next?.id).toBe("h1");
  });
});

describe("pickCatNext NGN share", () => {
  it("keeps delivering published NGN items instead of starving them", () => {
    const pool = [
      ...Array.from({ length: 40 }, (_, i) => ({
        id: `mcq-${i}`,
        difficultyBand: (i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard") as const,
        ngn: false,
      })),
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `ngn-${i}`,
        difficultyBand: (i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard") as const,
        ngn: true,
      })),
    ];
    const delivered: typeof pool = [];
    const used = new Set<string>();
    let state = initCatSession();
    for (let i = 0; i < 40; i++) {
      const next = pickCatNext(state, pool, used, () => 0.2, {
        ngnTargetRatio: 0.22,
        delivered,
      });
      expect(next).not.toBeNull();
      used.add(next!.id);
      delivered.push(next!);
      state = updateCatSession(state, true, next!.difficultyBand);
    }
    const ngn = delivered.filter((item) => item.ngn).length;
    expect(ngn).toBeGreaterThan(6);
  });

  it("continues an open sequential case in order", () => {
    const pool = [
      { id: "s1", difficultyBand: "medium" as const, setId: "case", stepIndex: 1, ngn: true },
      { id: "s2", difficultyBand: "hard" as const, setId: "case", stepIndex: 2, ngn: true },
      { id: "m1", difficultyBand: "medium" as const },
    ];
    const next = pickCatNext(initCatSession(), pool, new Set(["s1"]), () => 0, {
      delivered: [{ id: "s1", setId: "case", stepIndex: 1, ngn: true }],
    });
    expect(next?.id).toBe("s2");
  });
});

describe("catAbilityToPracticePct", () => {
  it("maps ability bounds to 0–100", () => {
    expect(catAbilityToPracticePct(-1)).toBe(0);
    expect(catAbilityToPracticePct(0)).toBe(50);
    expect(catAbilityToPracticePct(1)).toBe(100);
  });
});
