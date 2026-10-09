import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DbUnavailableError } from "@/lib/db-resilience";
import { aggregateActiveInventory } from "@/lib/inventory/active-questions";
import type { BankStatsBundle } from "@/lib/marketing/question-bank-counts";

vi.mock("@/lib/marketing/question-bank-counts", () => ({
  getCachedBankStatsBundle: vi.fn(),
}));

import { getCachedBankStatsBundle } from "@/lib/marketing/question-bank-counts";
import {
  getPublicBankStatsBundle,
  PUBLIC_BANK_STATS_CACHE_KEY,
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
    vi.mocked(getCachedBankStatsBundle).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    resetPublicBankStatsCache();
  });

  it("coalesces concurrent recomputes and then reuses the value", async () => {
    let calls = 0;
    vi.mocked(getCachedBankStatsBundle).mockImplementation(async () => {
      calls += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return bundle(6243);
    });

    const [first, second, third] = await Promise.all([
      getPublicBankStatsBundle(),
      getPublicBankStatsBundle(),
      getPublicBankStatsBundle(),
    ]);

    expect(calls).toBe(1);
    expect(first.inventory.boards.nclex.active).toBe(6243);
    expect(second).toBe(first);
    expect(third).toBe(first);

    const again = await getPublicBankStatsBundle();
    expect(calls).toBe(1);
    expect(again.inventory.boards.nclex.active).toBe(6243);
    expect(PUBLIC_BANK_STATS_CACHE_KEY).toBe("public-bank-stats-v1");
  });

  it("returns the last good value when a later recompute fails", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T00:00:00.000Z"));
    vi.mocked(getCachedBankStatsBundle).mockResolvedValue(bundle(6243));
    const first = await getPublicBankStatsBundle();

    vi.setSystemTime(new Date("2026-10-09T00:11:00.000Z"));
    vi.mocked(getCachedBankStatsBundle).mockRejectedValue(new DbUnavailableError("down"));
    const again = await getPublicBankStatsBundle();

    expect(again.inventory.boards.nclex.active).toBe(first.inventory.boards.nclex.active);
    expect(again.snapshot.degraded).toBe(false);
  });

  it("does not keep a degraded recompute as the fresh value", async () => {
    vi.mocked(getCachedBankStatsBundle).mockResolvedValue(bundle(0, true));
    const first = await getPublicBankStatsBundle();
    expect(first.snapshot.degraded).toBe(true);

    vi.mocked(getCachedBankStatsBundle).mockResolvedValue(bundle(6243));
    const second = await getPublicBankStatsBundle();
    expect(second.inventory.boards.nclex.active).toBe(6243);
    expect(vi.mocked(getCachedBankStatsBundle)).toHaveBeenCalledTimes(2);
  });
});
