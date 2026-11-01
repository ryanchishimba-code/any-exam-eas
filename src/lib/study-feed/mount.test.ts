import { describe, expect, it } from "vitest";
import { feedIndexFromOffsets, feedMountedRange, isFeedSlideMounted } from "./mount";

describe("feed mount window", () => {
  it("keeps one card on either side and clamps the ends", () => {
    expect(feedMountedRange(201, 0)).toEqual({ start: 0, end: 1 });
    expect(feedMountedRange(201, 100)).toEqual({ start: 99, end: 101 });
    expect(feedMountedRange(201, 200)).toEqual({ start: 199, end: 200 });
    expect(feedMountedRange(1, 0)).toEqual({ start: 0, end: 0 });
    expect(feedMountedRange(0, 0)).toEqual({ start: 0, end: -1 });
  });

  it("does not mount cards outside the window", () => {
    expect(isFeedSlideMounted(0, 201, 0)).toBe(true);
    expect(isFeedSlideMounted(1, 201, 0)).toBe(true);
    expect(isFeedSlideMounted(2, 201, 0)).toBe(false);
    expect(isFeedSlideMounted(50, 201, 0)).toBe(false);
  });

  it("picks the slide nearest the scroll offset", () => {
    const offsets = [0, 800, 1600, 2400];
    expect(feedIndexFromOffsets(0, offsets)).toBe(0);
    expect(feedIndexFromOffsets(790, offsets)).toBe(1);
    expect(feedIndexFromOffsets(1700, offsets)).toBe(2);
    expect(feedIndexFromOffsets(9999, offsets)).toBe(3);
    expect(feedIndexFromOffsets(0, [])).toBe(0);
  });
});
