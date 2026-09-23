import { describe, expect, it } from "vitest";
import { selectReviewQueueIds } from "./item-mastery";

const t0 = Date.parse("2026-09-01T15:00:00.000Z");

describe("review incorrect selection", () => {
  it("keeps an item that was corrected once", () => {
    const ids = selectReviewQueueIds({
      attempts: [
        { bankItemId: "a", questionKey: "a", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "b", questionKey: "b", correct: false, createdAt: t0 + 1, sessionId: "s1" },
        { bankItemId: "b", questionKey: "b", correct: true, createdAt: t0 + 2, sessionId: "s1" },
        { bankItemId: "c", questionKey: "c", correct: false, createdAt: t0 + 3, sessionId: "s1" },
      ],
      now: t0 + 3,
      limit: 10,
    });
    expect(ids.sort()).toEqual(["a", "b", "c"]);
  });

  it("drops an item after spaced re-proof", () => {
    const day = 24 * 60 * 60 * 1000;
    const ids = selectReviewQueueIds({
      attempts: [
        { bankItemId: "a", correct: false, createdAt: t0, sessionId: "s1" },
        { bankItemId: "a", correct: true, createdAt: t0 + 1000, sessionId: "s2" },
        { bankItemId: "a", correct: true, createdAt: t0 + day + 1000, sessionId: "s3" },
        { bankItemId: "c", correct: false, createdAt: t0, sessionId: "s1" },
      ],
      now: t0 + day + 1000,
      limit: 10,
    });
    expect(ids).toEqual(["c"]);
  });

  it("skips numeric ephemeral keys without bankItemId", () => {
    const ids = selectReviewQueueIds({
      attempts: [
        { bankItemId: null, questionKey: "12", correct: false, createdAt: t0 },
        { bankItemId: "real", questionKey: "real", correct: false, createdAt: t0 },
      ],
      now: t0,
      limit: 10,
    });
    expect(ids).toEqual(["real"]);
  });

  it("respects limit", () => {
    const ids = selectReviewQueueIds({
      attempts: [
        { bankItemId: "a", questionKey: "a", correct: false, createdAt: t0 + 3 },
        { bankItemId: "b", questionKey: "b", correct: false, createdAt: t0 + 2 },
        { bankItemId: "c", questionKey: "c", correct: false, createdAt: t0 + 1 },
      ],
      now: t0 + 3,
      limit: 2,
    });
    expect(ids).toEqual(["a", "b"]);
  });
});
