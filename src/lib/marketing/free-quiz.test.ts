import { describe, expect, it } from "vitest";
import { freeQuizRotationKey, isFreeQuizBoardSlug } from "@/lib/marketing/free-quiz";

describe("freeQuizRotationKey", () => {
  it("uses a UTC date bucket", () => {
    expect(freeQuizRotationKey(new Date("2026-10-24T15:30:00.000Z"))).toBe("2026-10-24");
  });
});

describe("isFreeQuizBoardSlug", () => {
  it("accepts the six public board slugs", () => {
    expect(isFreeQuizBoardSlug("nclex")).toBe(true);
    expect(isFreeQuizBoardSlug("aanp-fnp")).toBe(true);
    expect(isFreeQuizBoardSlug("mpje")).toBe(false);
  });
});
