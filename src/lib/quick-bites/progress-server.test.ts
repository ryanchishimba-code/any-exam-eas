import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  quickBiteProgress: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  capQuickBiteWatchIncrement,
  isQuickBiteComplete,
  listQuickBiteProgressForUser,
  upsertQuickBiteProgress,
} from "./progress-server";

describe("capQuickBiteWatchIncrement", () => {
  it("caps by policy and elapsed time since the last update", () => {
    const last = new Date(Date.now() - 10_000);
    expect(capQuickBiteWatchIncrement(60, last)).toBeLessThanOrEqual(13);
    expect(capQuickBiteWatchIncrement(5, last)).toBe(5);
  });
});

describe("isQuickBiteComplete", () => {
  it("marks complete at ninety percent watched", () => {
    expect(isQuickBiteComplete(89)).toBe(false);
    expect(isQuickBiteComplete(90)).toBe(true);
  });
});

describe("listQuickBiteProgressForUser", () => {
  beforeEach(() => {
    prismaMock.quickBiteProgress.findMany.mockReset();
  });

  it("maps rows by slug", async () => {
    prismaMock.quickBiteProgress.findMany.mockResolvedValue([
      {
        slug: "quick-bites-fnp-ep01-screening",
        watchPct: 55,
        playbackPositionSec: 74,
        watchSeconds: 120,
        completedAt: null,
      },
    ]);
    const result = await listQuickBiteProgressForUser("user-1", [
      "quick-bites-fnp-ep01-screening",
    ]);
    expect(result["quick-bites-fnp-ep01-screening"]).toEqual({
      watchPct: 55,
      playbackPositionSec: 74,
      watchSeconds: 120,
      completedAt: null,
    });
  });
});

describe("upsertQuickBiteProgress", () => {
  beforeEach(() => {
    prismaMock.quickBiteProgress.findUnique.mockReset();
    prismaMock.quickBiteProgress.upsert.mockReset();
  });

  it("keeps max watchPct while updating playbackPositionSec", async () => {
    prismaMock.quickBiteProgress.findUnique.mockResolvedValue({
      watchPct: 78,
      playbackPositionSec: 185,
      watchSeconds: 200,
      completedAt: null,
      updatedAt: new Date(Date.now() - 60_000),
    });
    prismaMock.quickBiteProgress.upsert.mockResolvedValue({
      watchPct: 78,
      playbackPositionSec: 74,
      watchSeconds: 200,
      completedAt: null,
      updatedAt: new Date(),
    });

    await upsertQuickBiteProgress("user-1", "quick-bites-fnp-ep03-diabetes", {
      playbackPositionSec: 74,
      momentWatchPct: 30,
      watchSecondsDelta: 0,
    });

    expect(prismaMock.quickBiteProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          watchPct: 78,
          playbackPositionSec: 74,
        }),
      })
    );
  });

  it("ignores spurious zero playbackPositionSec on position-only saves", async () => {
    prismaMock.quickBiteProgress.findUnique.mockResolvedValue({
      watchPct: 78,
      playbackPositionSec: 59,
      watchSeconds: 200,
      completedAt: null,
      updatedAt: new Date(Date.now() - 60_000),
    });
    prismaMock.quickBiteProgress.upsert.mockResolvedValue({
      watchPct: 78,
      playbackPositionSec: 59,
      watchSeconds: 200,
      completedAt: null,
      updatedAt: new Date(),
    });

    await upsertQuickBiteProgress("user-1", "quick-bites-fnp-ep03-diabetes", {
      playbackPositionSec: 0,
      momentWatchPct: 24,
      watchSecondsDelta: 0,
    });

    expect(prismaMock.quickBiteProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          playbackPositionSec: 59,
        }),
      })
    );
  });

  it("still saves an intentional seek backward", async () => {
    prismaMock.quickBiteProgress.findUnique.mockResolvedValue({
      watchPct: 78,
      playbackPositionSec: 58,
      watchSeconds: 200,
      completedAt: null,
      updatedAt: new Date(Date.now() - 60_000),
    });
    prismaMock.quickBiteProgress.upsert.mockResolvedValue({
      watchPct: 78,
      playbackPositionSec: 10,
      watchSeconds: 200,
      completedAt: null,
      updatedAt: new Date(),
    });

    await upsertQuickBiteProgress("user-1", "quick-bites-fnp-ep03-diabetes", {
      playbackPositionSec: 10,
      momentWatchPct: 5,
      watchSecondsDelta: 0,
    });

    expect(prismaMock.quickBiteProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          playbackPositionSec: 10,
        }),
      })
    );
  });

  it("raises max watchPct when the student seeks further ahead", async () => {
    prismaMock.quickBiteProgress.findUnique.mockResolvedValue({
      watchPct: 30,
      playbackPositionSec: 74,
      watchSeconds: 90,
      completedAt: null,
      updatedAt: new Date(Date.now() - 60_000),
    });
    prismaMock.quickBiteProgress.upsert.mockResolvedValue({
      watchPct: 85,
      playbackPositionSec: 200,
      watchSeconds: 120,
      completedAt: null,
      updatedAt: new Date(),
    });

    await upsertQuickBiteProgress("user-1", "quick-bites-fnp-ep03-diabetes", {
      playbackPositionSec: 200,
      momentWatchPct: 85,
      watchSecondsDelta: 15,
    });

    expect(prismaMock.quickBiteProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          watchPct: 85,
          playbackPositionSec: 200,
        }),
      })
    );
  });
});
