import { describe, expect, it } from "vitest";
import { naplexBreakLabel, nextNaplexBreakMark } from "./naplex-breaks";

describe("NAPLEX scheduled breaks", () => {
  it("offers a break at 2 hours and again at 4 hours", () => {
    const offered = new Set<number>();
    expect(nextNaplexBreakMark(90 * 60, offered)).toBeNull();
    const first = nextNaplexBreakMark(2 * 60 * 60, offered);
    expect(first).toBe(2 * 60 * 60);
    expect(naplexBreakLabel(first!)).toBe("2-hour break point");
    offered.add(first!);
    expect(nextNaplexBreakMark(3 * 60 * 60, offered)).toBeNull();
    expect(nextNaplexBreakMark(4 * 60 * 60 + 10, offered)).toBe(4 * 60 * 60);
  });
});
