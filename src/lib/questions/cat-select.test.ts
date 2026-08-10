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

describe("catAbilityToPracticePct", () => {
  it("maps ability bounds to 0–100", () => {
    expect(catAbilityToPracticePct(-1)).toBe(0);
    expect(catAbilityToPracticePct(0)).toBe(50);
    expect(catAbilityToPracticePct(1)).toBe(100);
  });
});
