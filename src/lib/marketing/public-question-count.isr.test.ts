import { beforeEach, describe, expect, it, vi } from "vitest";
import { aggregateActiveInventory } from "@/lib/inventory/active-questions";
import type { ServedQuestionCounts } from "@/lib/marketing/served-question-counts";

const harness = vi.hoisted(() => ({
  redisGet: vi.fn(async () => {
    throw new Error("Upstash REST ran on a path that should stay static");
  }),
  loadServedQuestionCounts: vi.fn(),
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

vi.mock("@/lib/marketing/served-question-counts", async () => {
  const actual = await vi.importActual<typeof import("@/lib/marketing/served-question-counts")>(
    "@/lib/marketing/served-question-counts"
  );
  return {
    ...actual,
    loadServedQuestionCounts: (...args: unknown[]) => harness.loadServedQuestionCounts(...args),
  };
});

import { resetLastGoodBankStats } from "@/lib/marketing/last-good-bank-stats";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import {
  getPublicBankStatsBundle,
  resetPublicBankStatsCache,
} from "@/lib/marketing/public-bank-stats";

function served(degraded = false): ServedQuestionCounts {
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
  return { inventory: degraded ? null : inventory, live: null, clinical: {} };
}

describe("ISR question counts skip Upstash", () => {
  beforeEach(() => {
    resetPublicBankStatsCache();
    resetLastGoodBankStats();
    harness.redisGet.mockClear();
    harness.loadServedQuestionCounts.mockReset();
  });

  it("reads the served gate through the Next data cache", async () => {
    harness.loadServedQuestionCounts.mockResolvedValue(served(false));
    const counts = await loadPublicQuestionCounts({ dynamic: false });
    expect(harness.redisGet).not.toHaveBeenCalled();
    expect(harness.loadServedQuestionCounts).toHaveBeenCalled();
    expect(counts.bundle.inventory.degraded).toBe(false);
    expect(counts.exactLabel).toBe("1,200");
    expect(counts.staticLabel).toBe("1,200+");
  });

  it("returns a degraded snapshot without calling Redis", async () => {
    harness.loadServedQuestionCounts.mockResolvedValue(served(true));
    const counts = await loadPublicQuestionCounts({ dynamic: false });
    expect(counts.bundle.snapshot.degraded).toBe(true);
    expect(counts.exactLabel).toBe("");
    expect(counts.staticLabel).toBe("");
    expect(harness.redisGet).not.toHaveBeenCalled();
  });

  it("serves the last good counts when a later lookup fails", async () => {
    harness.loadServedQuestionCounts.mockResolvedValueOnce(served(false));
    const first = await loadPublicQuestionCounts({ dynamic: false });
    expect(first.bundle.inventory.boards.nclex.active).toBe(1200);
    expect(first.bundle.inventory.degraded).toBe(false);

    harness.loadServedQuestionCounts.mockResolvedValueOnce(served(true));
    const again = await loadPublicQuestionCounts({ dynamic: false });
    expect(again.bundle.inventory.degraded).toBe(false);
    expect(again.bundle.inventory.boards.nclex.active).toBe(1200);
    expect(again.bundle.snapshot.degraded).toBe(false);
    expect(harness.redisGet).not.toHaveBeenCalled();
  });

  it("serves the bank-counts API from the same served-gate read without reading Upstash", async () => {
    harness.loadServedQuestionCounts.mockResolvedValue(served(false));
    const value = await getPublicBankStatsBundle();
    expect(harness.redisGet).not.toHaveBeenCalled();
    expect(harness.loadServedQuestionCounts).toHaveBeenCalled();
    expect(value.snapshot.degraded).toBe(false);
    expect(value.snapshot.boards?.nclex?.bankItems).toBe(1200);
  });
});
