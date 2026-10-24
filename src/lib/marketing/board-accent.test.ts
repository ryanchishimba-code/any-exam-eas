import { describe, expect, it } from "vitest";
import { boardAccentFromHref, boardAccentPillClass } from "./board-accent";

describe("boardAccentPillClass", () => {
  it("maps each public board slug to a pill modifier", () => {
    expect(boardAccentPillClass("nclex")).toBe("aee-board-pill aee-board-pill--nclex");
    expect(boardAccentPillClass("aanp-fnp")).toBe("aee-board-pill aee-board-pill--aanp-fnp");
    expect(boardAccentFromHref("/naplex")).toBe("naplex");
  });
});
