/** @vitest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  quickBiteListProgressPercent,
  quickBiteResumeSeconds,
  scheduleQuickBiteResumeSeek,
  useQuickBiteProgressReporter,
  useQuickBiteResumeSnapshot,
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

describe("useQuickBiteResumeSnapshot", () => {
  it("locks resume position per session and ignores later progress POSTs", async () => {
    const progress = {
      "ep-3": {
        watchPct: 78,
        playbackPositionSec: 74,
        watchSeconds: 200,
        completedAt: null,
      },
    };
    const { result, rerender } = renderHook(
      ({ sessionKey, slug, map, loaded }) =>
        useQuickBiteResumeSnapshot(sessionKey, slug, map, loaded),
      {
        initialProps: {
          sessionKey: "1:ep-3",
          slug: "ep-3",
          map: progress,
          loaded: true,
        },
      }
    );

    expect(result.current.ready).toBe(true);
    expect(result.current.snapshot.playbackPositionSec).toBe(74);

    rerender({
      sessionKey: "1:ep-3",
      slug: "ep-3",
      map: {
        "ep-3": {
          ...progress["ep-3"],
          playbackPositionSec: 12,
        },
      },
      loaded: true,
    });

    expect(result.current.snapshot.playbackPositionSec).toBe(74);
  });

  it("waits for progress GET before locking resume snapshot", () => {
    const progress = {
      "ep-3": {
        watchPct: 78,
        playbackPositionSec: 47.167,
        watchSeconds: 200,
        completedAt: null,
      },
    };
    const { result, rerender } = renderHook(
      ({ sessionKey, slug, map, loaded }) =>
        useQuickBiteResumeSnapshot(sessionKey, slug, map, loaded),
      {
        initialProps: {
          sessionKey: "3:ep-3",
          slug: "ep-3",
          map: progress,
          loaded: false,
        },
      }
    );

    expect(result.current.ready).toBe(false);

    rerender({
      sessionKey: "3:ep-3",
      slug: "ep-3",
      map: progress,
      loaded: true,
    });

    expect(result.current.ready).toBe(true);
    expect(result.current.snapshot.playbackPositionSec).toBe(47.167);
  });

  it("fills async progress once before resume is applied", async () => {
    const { result, rerender } = renderHook(
      ({ sessionKey, slug, map, loaded }) =>
        useQuickBiteResumeSnapshot(sessionKey, slug, map, loaded),
      {
        initialProps: {
          sessionKey: "2:ep-3",
          slug: "ep-3",
          map: {} as Record<string, never>,
          loaded: true,
        },
      }
    );

    expect(result.current.snapshot.playbackPositionSec).toBe(0);

    rerender({
      sessionKey: "2:ep-3",
      slug: "ep-3",
      map: {
        "ep-3": {
          watchPct: 78,
          playbackPositionSec: 74,
          watchSeconds: 0,
          completedAt: null,
        },
      },
      loaded: true,
    });

    await waitFor(() => {
      expect(result.current.snapshot.playbackPositionSec).toBe(74);
    });
  });
});

describe("open episode with saved position 47", () => {
  it("does not POST near-zero progress until resume seek completes", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ progress: {} }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 246, configurable: true });
    let time = 0;
    Object.defineProperty(video, "currentTime", {
      get: () => time,
      set: (value: number) => {
        time = value;
      },
      configurable: true,
    });
    Object.defineProperty(video, "readyState", { value: 1, configurable: true });
    Object.defineProperty(video, "paused", { value: false, configurable: true });
    Object.defineProperty(video, "ended", { value: false, configurable: true });
    vi.spyOn(video, "pause").mockImplementation(() => {});

    const resumeSeekCompletedRef = { current: false };
    const suppressProgressFlushRef = { current: false };
    const videoRef = { current: video };

    renderHook(() =>
      useQuickBiteProgressReporter({
        slug: "quick-bites-fnp-ep03-diabetes",
        apiBase: "/api/quick-bites-fnp",
        enabled: true,
        videoRef,
        videoElement: video,
        suppressProgressFlushRef,
        resumeSeekCompletedRef,
      })
    );

    scheduleQuickBiteResumeSeek(
      video,
      { playbackPositionSec: 47.167, completed: false },
      () => {},
      { suppressProgressFlush: suppressProgressFlushRef }
    );

    expect(time).toBe(47.167);
    time = 0.15;
    await vi.advanceTimersByTimeAsync(1_100);

    const progressPosts = fetchMock.mock.calls.filter((call) =>
      String(call[0]).includes("/progress")
    );
    expect(progressPosts).toHaveLength(0);

    resumeSeekCompletedRef.current = true;
    await vi.advanceTimersByTimeAsync(11_000);
    expect(fetchMock).toHaveBeenCalled();

    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});

describe("useQuickBiteProgressReporter unmount flush", () => {
  it("does not POST a zero head position after the student watched further", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        progress: {
          watchPct: 25,
          playbackPositionSec: 58,
          watchSeconds: 10,
          completedAt: null,
        },
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 246, configurable: true });
    let time = 58;
    Object.defineProperty(video, "currentTime", {
      get: () => time,
      set: (value: number) => {
        time = value;
      },
      configurable: true,
    });
    Object.defineProperty(video, "paused", { value: true, configurable: true });
    Object.defineProperty(video, "ended", { value: false, configurable: true });

    const videoRef = { current: video };
    const resumeSeekCompletedRef = { current: true };
    const { unmount } = renderHook(() =>
      useQuickBiteProgressReporter({
        slug: "quick-bites-fnp-ep03-diabetes",
        apiBase: "/api/quick-bites-fnp",
        enabled: true,
        videoRef,
        videoElement: video,
        resumeSeekCompletedRef,
      })
    );

    await vi.advanceTimersByTimeAsync(11_000);
    fetchMock.mockClear();
    time = 0;
    unmount();

    expect(fetchMock).not.toHaveBeenCalled();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});

describe("scheduleQuickBiteResumeSeek", () => {
  it("does not POST progress when pause fires during resume seek", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        progress: {
          watchPct: 78,
          playbackPositionSec: 59,
          watchSeconds: 0,
          completedAt: null,
        },
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 246, configurable: true });
    let time = 0;
    Object.defineProperty(video, "currentTime", {
      get: () => time,
      set: (value: number) => {
        time = value;
      },
      configurable: true,
    });
    Object.defineProperty(video, "readyState", { value: 1, configurable: true });
    Object.defineProperty(video, "paused", { value: true, configurable: true });
    Object.defineProperty(video, "ended", { value: false, configurable: true });
    vi.spyOn(video, "pause").mockImplementation(function pause(this: HTMLVideoElement) {
      this.dispatchEvent(new Event("pause"));
    });

    const suppressProgressFlushRef = { current: false };
    const videoRef = { current: video };
    const { unmount } = renderHook(() =>
      useQuickBiteProgressReporter({
        slug: "quick-bites-fnp-ep03-diabetes",
        apiBase: "/api/quick-bites-fnp",
        enabled: true,
        videoRef,
        videoElement: video,
        suppressProgressFlushRef,
      })
    );

    scheduleQuickBiteResumeSeek(
      video,
      { playbackPositionSec: 59, completed: false },
      () => {},
      { suppressProgressFlush: suppressProgressFlushRef }
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(time).toBe(59);
    unmount();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("seeks before calling onReady", () => {
    const video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 246, configurable: true });
    Object.defineProperty(video, "currentTime", {
      value: 0,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(video, "readyState", { value: 1, configurable: true });
    const pause = vi.spyOn(video, "pause").mockImplementation(() => {});
    const onReady = vi.fn();

    scheduleQuickBiteResumeSeek(
      video,
      { playbackPositionSec: 74, completed: false },
      onReady
    );

    expect(pause).toHaveBeenCalled();
    expect(video.currentTime).toBe(74);
    expect(onReady).toHaveBeenCalledTimes(1);
  });
});
