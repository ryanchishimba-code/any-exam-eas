import { describe, expect, it, vi } from "vitest";
import {
  buildIntegrityFlags,
  computeFastAnswerStats,
  countAnswerBurstsOverLimit,
} from "./integrity";

describe("integrity flags", () => {
  it("computes fast answer rate", () => {
    const stats = computeFastAnswerStats([
      { createdAt: new Date(), durationMs: 3000 },
      { createdAt: new Date(), durationMs: 8000 },
      { createdAt: new Date(), durationMs: null },
    ]);
    expect(stats.fastAnswersUnder5s).toBe(2);
    expect(stats.fastAnswerPercent).toBe(67);
  });

  it("counts per-minute answer bursts over 30", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-27T12:00:00.000Z"));
    try {
      const now = Date.now();
      const attempts = Array.from({ length: 35 }, (_, i) => ({
        createdAt: new Date(now + i * 1000),
      }));
      expect(countAnswerBurstsOverLimit(attempts)).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("builds the full integrity object", () => {
    const flags = buildIntegrityFlags({
      attempts: [{ createdAt: new Date(), durationMs: 2000 }],
      heartbeatsIgnoredTooFast: 4,
      examsEndedEarly: 2,
    });
    expect(flags.heartbeatsIgnoredTooFast).toBe(4);
    expect(flags.examsEndedEarly).toBe(2);
  });
});
