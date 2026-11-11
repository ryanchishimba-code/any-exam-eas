import { describe, expect, it } from "vitest";
import { nextPanceBreakMark, panceBlockLabel } from "./pance-breaks";

describe("PANCE blocks", () => {
  it("offers a break after each of the first four hours", () => {
    const offered = new Set<number>();
    expect(nextPanceBreakMark(60 * 60, offered)).toBe(60 * 60);
    offered.add(60 * 60);
    expect(nextPanceBreakMark(2 * 60 * 60, offered)).toBe(2 * 60 * 60);
    expect(nextPanceBreakMark(30 * 60, offered)).toBeNull();
  });

  it("names the block from the question index on a 300-question exam", () => {
    expect(panceBlockLabel(0, 300)).toBe("Block 1 of 5");
    expect(panceBlockLabel(59, 300)).toBe("Block 1 of 5");
    expect(panceBlockLabel(60, 300)).toBe("Block 2 of 5");
    expect(panceBlockLabel(299, 300)).toBe("Block 5 of 5");
    expect(panceBlockLabel(10, 50)).toBeNull();
  });
});