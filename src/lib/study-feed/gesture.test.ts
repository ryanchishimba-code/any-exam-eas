import { describe, expect, it } from "vitest";
import { classifyFeedSwipe, feedHintStorageKey } from "./gesture";

describe("classifyFeedSwipe", () => {
  it("ignores a tap", () => {
    expect(classifyFeedSwipe(4, -3)).toBeNull();
  });

  it("maps the sides to the existing card buttons", () => {
    expect(classifyFeedSwipe(80, 10)).toBe("got");
    expect(classifyFeedSwipe(-80, 12)).toBe("again");
  });

  it("maps up and down to next and previous", () => {
    expect(classifyFeedSwipe(10, -90)).toBe("next");
    expect(classifyFeedSwipe(-8, 90)).toBe("prev");
  });

  it("lets the larger axis win", () => {
    expect(classifyFeedSwipe(40, -80)).toBe("next");
    expect(classifyFeedSwipe(90, -40)).toBe("got");
  });
});

describe("feedHintStorageKey", () => {
  it("remembers dismissal per board", () => {
    expect(feedHintStorageKey("nclex")).toBe("aee-feed-gesture-hint:nclex");
    expect(feedHintStorageKey("pance")).not.toBe(feedHintStorageKey("fnp"));
  });
});
