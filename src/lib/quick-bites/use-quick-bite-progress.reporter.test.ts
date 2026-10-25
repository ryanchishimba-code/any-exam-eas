/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuickBiteProgressReporter } from "@/lib/quick-bites/use-quick-bite-progress";

describe("useQuickBiteProgressReporter", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          progress: { watchPct: 25, watchSeconds: 30, completedAt: null },
        }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts watch progress when a video element is bound", async () => {
    vi.useFakeTimers();
    const video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 200, configurable: true });
    Object.defineProperty(video, "currentTime", { value: 50, configurable: true, writable: true });
    Object.defineProperty(video, "paused", { value: false, configurable: true });
    Object.defineProperty(video, "ended", { value: false, configurable: true });

    const videoRef = { current: video };
    renderHook(() =>
      useQuickBiteProgressReporter({
        slug: "quick-bites-fnp-ep03-diabetes",
        apiBase: "/api/quick-bites-fnp",
        enabled: true,
        videoRef,
        videoElement: video,
      })
    );

    await vi.advanceTimersByTimeAsync(11_000);

    expect(fetch).toHaveBeenCalledWith(
      "/api/quick-bites-fnp/quick-bites-fnp-ep03-diabetes/progress",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
      })
    );
    vi.useRealTimers();
  });
});
