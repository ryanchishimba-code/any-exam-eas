import { beforeEach, describe, expect, it, vi } from "vitest";

const cacheKeys: string[][] = [];

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => Promise<unknown>, key: string[]) => {
    cacheKeys.push(key);
    return async () => fn();
  },
  unstable_noStore: () => {},
}));

vi.mock("next/server", () => ({
  connection: async () => {},
}));

vi.mock("@/lib/inventory/active-inventory-stamp", () => ({
  readActiveInventoryStampKey: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionBankItem: {
      groupBy: vi.fn(async () => []),
    },
  },
}));

vi.mock("@/lib/inventory/active-questions", async () => {
  const actual = await vi.importActual<typeof import("@/lib/inventory/active-questions")>(
    "@/lib/inventory/active-questions"
  );
  return {
    ...actual,
    fetchActiveInventoryFromDb: vi.fn(),
  };
});

import { aggregateActiveInventory } from "@/lib/inventory/active-questions";
import { fetchActiveInventoryFromDb } from "@/lib/inventory/active-questions";
import { readActiveInventoryStampKey } from "@/lib/inventory/active-inventory-stamp";
import { ACTIVE_INVENTORY_CACHE_KEY } from "@/lib/inventory/active-inventory-cache";
import { getCachedBankStatsBundle } from "./question-bank-counts";

function nursingInventory(count: number) {
  return aggregateActiveInventory([
    {
      fieldId: "nursing",
      subjectId: "med-surg",
      clientNeeds: "physiological-adaptation",
      itemType: "mcq",
      hasCaseGroup: false,
      count,
    },
  ]);
}

describe("getCachedBankStatsBundle", () => {
  beforeEach(() => {
    cacheKeys.length = 0;
    vi.mocked(readActiveInventoryStampKey).mockReset();
    vi.mocked(fetchActiveInventoryFromDb).mockReset();
  });

  it("keys the heavy snapshot by the published stamp", async () => {
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue("6243:2026-09-23T17:00:00.000Z");
    vi.mocked(fetchActiveInventoryFromDb).mockResolvedValue(nursingInventory(6243));

    const bundle = await getCachedBankStatsBundle();

    expect(bundle.inventory.boards.nclex.active).toBe(6243);
    expect(cacheKeys).toEqual([
      [...ACTIVE_INVENTORY_CACHE_KEY, "6243:2026-09-23T17:00:00.000Z"],
    ]);
  });

  it("uses a new cache entry after the published count changes", async () => {
    vi.mocked(fetchActiveInventoryFromDb).mockImplementation(async () =>
      nursingInventory(6457)
    );
    vi.mocked(readActiveInventoryStampKey).mockResolvedValueOnce("6457:2026-09-20T00:00:00.000Z");
    await getCachedBankStatsBundle();

    vi.mocked(fetchActiveInventoryFromDb).mockImplementation(async () =>
      nursingInventory(6243)
    );
    vi.mocked(readActiveInventoryStampKey).mockResolvedValueOnce("6243:2026-09-23T17:00:00.000Z");
    const fresh = await getCachedBankStatsBundle();

    expect(fresh.inventory.boards.nclex.active).toBe(6243);
    expect(cacheKeys.map((key) => key[key.length - 1])).toEqual([
      "6457:2026-09-20T00:00:00.000Z",
      "6243:2026-09-23T17:00:00.000Z",
    ]);
  });

  it("reads the database directly when the stamp lookup fails", async () => {
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue(null);
    vi.mocked(fetchActiveInventoryFromDb).mockResolvedValue(nursingInventory(6243));

    const bundle = await getCachedBankStatsBundle();

    expect(bundle.inventory.boards.nclex.active).toBe(6243);
    expect(cacheKeys).toEqual([]);
  });

  it("does not cache a degraded lookup", async () => {
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue("6243:2026-09-23T17:00:00.000Z");
    vi.mocked(fetchActiveInventoryFromDb).mockResolvedValue({
      ...nursingInventory(0),
      degraded: true,
    });

    const bundle = await getCachedBankStatsBundle();

    expect(bundle.inventory.degraded).toBe(true);
    expect(fetchActiveInventoryFromDb).toHaveBeenCalledTimes(2);
    expect(cacheKeys).toHaveLength(1);
  });
});
