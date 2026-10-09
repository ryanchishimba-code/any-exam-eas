import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aggregateActiveInventory } from "@/lib/inventory/active-questions";
import type { BankStatsBundle } from "@/lib/marketing/question-bank-counts";

const harness = vi.hoisted(() => ({
  getIsrBankStatsBundle: vi.fn(),
  redisGet: vi.fn(),
  redisSet: vi.fn(async () => {}),
}));

vi.mock("@/lib/marketing/public-question-count", () => ({
  getIsrBankStatsBundle: (...args: unknown[]) => harness.getIsrBankStatsBundle(...args),
}));

vi.mock("@/lib/upstash-redis", () => ({
  redisCacheGet: (...args: unknown[]) => harness.redisGet(...args),
  redisCacheSet: (...args: unknown[]) => harness.redisSet(...args),
  redisCacheDelete: vi.fn(async () => {}),
}));

import {
  getPublicBankStatsBundle,
  PUBLIC_BANK_STATS_CACHE_KEY,
  PUBLIC_BANK_STATS_STALE_MAX_MS,
  resetPublicBankStatsCache,
} from "@/lib/marketing/public-bank-stats";

function bundle(count: number, degraded = false): BankStatsBundle {
  const inventory = aggregateActiveInventory([
    {
      fieldId: "nursing",
      subjectId: "med-surg",
      clientNeeds: "physiological-adaptation",
      itemType: "mcq",
      hasCaseGroup: false,
      count,
    },
  ]);
  inventory.degraded = degraded;
  return {
    inventory,
    snapshot: {
      fields: {} as BankStatsBundle["snapshot"]["fields"],
      totals: { total: count, active: count, served: count },
      updatedAt: "2026-10-09T00:00:00.000Z",
      degraded,
    },
  };
}

describe("getPublicBankStatsBundle", () => {
  beforeEach(() => {
    resetPublicBankStatsCache();
    harness.getIsrBankStatsBundle.mockReset();
    harness.redisGet.mockReset();
    harness.redisSet.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    resetPublicBankStatsCache();
  });

  it("returns the page snapshot and stores that value for the fallback", async () => {
    harness.getIsrBankStatsBundle.mockResolvedValue(bundle(43371));
    const value = await getPublicBankStatsBundle();
    expect(value.inventory.boards.nclex.active).toBe(43371);
    expect(value.snapshot.degraded).toBe(false);
    expect(harness.redisGet).not.toHaveBeenCalled();
    expect(harness.redisSet).toHaveBeenCalledWith(
      PUBLIC_BANK_STATS_CACHE_KEY,
      expect.objectContaining({
        bundle: expect.objectContaining({
          snapshot: expect.objectContaining({ degraded: false }),
        }),
        storedAt: expect.any(Number),
      }),
      PUBLIC_BANK_STATS_STALE_MAX_MS
    );
    expect(PUBLIC_BANK_STATS_CACHE_KEY).toBe("public-bank-stats-v2");
  });

  it("marks a redis fallback degraded and records its age", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T12:00:00.000Z"));
    const storedAt = new Date("2026-10-09T11:40:00.000Z").getTime();
    harness.getIsrBankStatsBundle.mockResolvedValue(bundle(0, true));
    harness.redisGet.mockResolvedValue({ bundle: bundle(43475), storedAt });

    const again = await getPublicBankStatsBundle();

    expect(again.snapshot.degraded).toBe(true);
    expect(again.inventory.degraded).toBe(true);
    expect(again.staleAgeMs).toBe(20 * 60 * 1000);
    expect(again.inventory.boards.nclex.active).toBe(43475);
    expect(console.error).toHaveBeenCalledWith(
      "[bank-counts] recompute failed:",
      expect.any(Error)
    );
  });

  it("logs the real error and skips a fallback older than 30 minutes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T12:00:00.000Z"));
    const cause = new Error("Neon connection timeout");
    harness.getIsrBankStatsBundle.mockRejectedValue(cause);
    harness.redisGet.mockResolvedValue({
      bundle: bundle(43475),
      storedAt: new Date("2026-10-09T11:00:00.000Z").getTime(),
    });

    await expect(getPublicBankStatsBundle()).rejects.toThrow(cause);
    expect(console.error).toHaveBeenCalledWith("[bank-counts] recompute failed:", cause);
    expect(harness.redisSet).not.toHaveBeenCalled();
  });

  it("does not treat a legacy unmarked redis value as fresh", async () => {
    harness.getIsrBankStatsBundle.mockResolvedValue(bundle(0, true));
    harness.redisGet.mockResolvedValue(bundle(43475));

    const value = await getPublicBankStatsBundle();
    expect(value.snapshot.degraded).toBe(true);
    expect(value.staleAgeMs).toBeUndefined();
    expect(value.inventory.boards.nclex.active).not.toBe(43475);
  });
});
