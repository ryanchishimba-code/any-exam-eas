import { describe, expect, it } from "vitest";
import { capQuickBiteWatchIncrement, isQuickBiteComplete } from "./progress-server";

describe("capQuickBiteWatchIncrement", () => {
  it("caps by policy and elapsed time since the last update", () => {
    const last = new Date(Date.now() - 10_000);
    expect(capQuickBiteWatchIncrement(60, last)).toBeLessThanOrEqual(13);
    expect(capQuickBiteWatchIncrement(5, last)).toBe(5);
  });
});

describe("isQuickBiteComplete", () => {
  it("marks complete at ninety percent watched", () => {
    expect(isQuickBiteComplete(89)).toBe(false);
    expect(isQuickBiteComplete(90)).toBe(true);
  });
});
