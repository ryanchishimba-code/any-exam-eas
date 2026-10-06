import { describe, expect, it } from "vitest";
import { fullExamTimeUsedSec } from "@/lib/full-exam/time-used";

describe("fullExamTimeUsedSec", () => {
  it("uses wall-clock elapsed time, not a throttled countdown", () => {
    const started = new Date("2026-10-05T12:00:00.000Z");
    const now = started.getTime() + (2 * 60 * 60 + 15) * 1000;
    expect(
      fullExamTimeUsedSec({
        startedAt: started,
        nowMs: now,
        fallbackSec: 4 * 60 + 38,
      })
    ).toBe(2 * 60 * 60 + 15);
  });

  it("subtracts paused time", () => {
    const started = new Date("2026-10-05T12:00:00.000Z");
    const now = started.getTime() + 600 * 1000;
    expect(
      fullExamTimeUsedSec({
        startedAt: started,
        nowMs: now,
        pausedSec: 120,
      })
    ).toBe(480);
  });

  it("keeps a first-paint stamp when the session start is only a few seconds", () => {
    const now = Date.parse("2026-10-06T12:10:56.000Z");
    const used = fullExamTimeUsedSec({
      startedAt: "2026-10-06T12:10:28.000Z",
      nowMs: now,
      fallbackSec: 28,
      openedAtMs: Date.parse("2026-10-06T12:04:00.000Z"),
      answerTimes: ["2026-10-06T12:10:56.000Z"],
    });
    expect(used).toBe(6 * 60 + 56);
  });

  it("falls back to the timer when the session has no start", () => {
    expect(fullExamTimeUsedSec({ startedAt: null, nowMs: Date.now(), fallbackSec: 90 })).toBe(90);
  });
});
