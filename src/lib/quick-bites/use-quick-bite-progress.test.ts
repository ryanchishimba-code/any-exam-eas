import { describe, expect, it } from "vitest";
import {
  quickBiteListProgressPercent,
  quickBiteResumeSeconds,
} from "@/lib/quick-bites/use-quick-bite-progress";

describe("quickBiteResumeSeconds", () => {
  it("resumes from the last saved playback head, not max watch percent", () => {
    expect(quickBiteResumeSeconds(74, 245, false)).toBe(74);
  });

  it("skips resume when complete or at the start/end", () => {
    expect(quickBiteResumeSeconds(0, 200, false)).toBeNull();
    expect(quickBiteResumeSeconds(74, 200, true)).toBeNull();
    expect(quickBiteResumeSeconds(199, 200, false)).toBeNull();
  });
});

describe("quickBiteListProgressPercent", () => {
  it("shows list progress from max watchPct until complete", () => {
    expect(
      quickBiteListProgressPercent({
        watchPct: 42,
        playbackPositionSec: 74,
        watchSeconds: 100,
        completedAt: null,
      })
    ).toBe(42);
    expect(
      quickBiteListProgressPercent({
        watchPct: 95,
        playbackPositionSec: 10,
        watchSeconds: 200,
        completedAt: new Date().toISOString(),
      })
    ).toBe(0);
  });
});
