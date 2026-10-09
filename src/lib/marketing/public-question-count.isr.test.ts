import { beforeEach, describe, expect, it, vi } from "vitest";
import { aggregateActiveInventory } from "@/lib/inventory/active-questions";
import type { BankStatsBundle } from "@/lib/marketing/question-bank-counts";

const harness = vi.hoisted(() => ({
  redisGet: vi.fn(async () => {
    throw new Error("Upstash REST ran on a path that should stay static");
  }),
  getCachedBankStatsBundle: vi.fn(),
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
  unstable_noStore: () => {},
}));

vi.mock("@/lib/upstash-redis", () => ({
  redisCacheGet: (...args: unknown[]) => harness.redisGet(...args),
  redisCacheSet: vi.fn(async () => {}),
  redisCacheDelete: vi.fn(async () => {}),
  isUpstashRedisEnabled: () => true,
  getUpstashRedis: () => ({}),
}));

vi.mock("@/lib/marketing/question-bank-counts", async () => {
  const actual = await vi.importActual<typeof import("@/lib/marketing/question-bank-counts")>(
    "@/lib/marketing/question-bank-counts"
  );
  return {
    ...actual,
    getCachedBankStatsBundle: (...args: unknown[]) => harness.getCachedBankStatsBundle(...args),
  };
});

import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import {
  getPublicBankStatsBundle,
  resetPublicBankStatsCache,
} from "@/lib/marketing/public-bank-stats";

function bundle(degraded = false): BankStatsBundle {
  const inventory = aggregateActiveInventory([
    {
      fieldId: "nursing",
      subjectId: "med-surg",
      clientNeeds: "physiological-adaptation",
      itemType: "mcq",
      hasCaseGroup: false,
      count: 1200,
    },
  ]);
  inventory.degraded = degraded;
  return {
    inventory,
    snapshot: {
      fields: {} as BankStatsBundle["snapshot"]["fields"],
      totals: { total: 1200, active: 1200, served: 1200 },
      updatedAt: "2026-10-09T00:00:00.000Z",
      degraded,
    },
  };
}

describe("ISR question counts skip Upstash", () => {
  beforeEach(() => {
    resetPublicBankStatsCache();
    harness.redisGet.mockClear();
    harness.getCachedBankStatsBundle.mockReset();
  });

  it("reads the shared snapshot through the Next data cache", async () => {
    harness.getCachedBankStatsBundle.mockResolvedValue(bundle(false));
    const counts = await loadPublicQuestionCounts({ dynamic: false });
    expect(harness.redisGet).not.toHaveBeenCalled();
    expect(harness.getCachedBankStatsBundle).toHaveBeenCalledWith({ dynamic: false });
    expect(counts.bundle.inventory.degraded).toBe(false);
  });

  it("returns a degraded snapshot without calling Redis", async () => {
    harness.getCachedBankStatsBundle.mockResolvedValue(bundle(true));
    const counts = await loadPublicQuestionCounts({ dynamic: false });
    expect(counts.bundle.snapshot.degraded).toBe(true);
    expect(counts.exactLabel).toBe("");
    expect(harness.redisGet).not.toHaveBeenCalled();
  });

  it("serves the bank-counts API from the same snapshot without reading Upstash", async () => {
    harness.getCachedBankStatsBundle.mockResolvedValue(bundle(false));
    const value = await getPublicBankStatsBundle();
    expect(harness.redisGet).not.toHaveBeenCalled();
    expect(harness.getCachedBankStatsBundle).toHaveBeenCalledWith({ dynamic: false });
    expect(value.snapshot.degraded).toBe(false);
  });
});
