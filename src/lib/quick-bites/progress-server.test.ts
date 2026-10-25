import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  quickBiteProgress: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  capQuickBiteWatchIncrement,
  isQuickBiteComplete,
  listQuickBiteProgressForUser,
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
        watchSeconds: 120,
        completedAt: null,
      },
    ]);
    const result = await listQuickBiteProgressForUser("user-1", [
      "quick-bites-fnp-ep01-screening",
    ]);
    expect(result["quick-bites-fnp-ep01-screening"]).toEqual({
      watchPct: 55,
      watchSeconds: 120,
      completedAt: null,
    });
  });
});
