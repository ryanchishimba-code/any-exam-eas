import { beforeEach, describe, expect, it, vi } from "vitest";

const cacheKeys: string[][] = [];
const connectionCalls: number[] = [];

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => Promise<unknown>, key: string[]) => {
    cacheKeys.push(key);
    return async () => fn();
  },
  unstable_noStore: () => {},
}));

vi.mock("next/server", () => ({
  connection: async () => {
    connectionCalls.push(1);
  },
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
import {
  ACTIVE_INVENTORY_CACHE_KEY,
  ACTIVE_INVENTORY_STAMP_CACHE_KEY,
} from "@/lib/inventory/active-inventory-cache";

function snapshotKeys(): string[][] {
  return cacheKeys.filter((key) => key[0] === ACTIVE_INVENTORY_CACHE_KEY[0]);
}
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
    connectionCalls.length = 0;
    vi.mocked(readActiveInventoryStampKey).mockReset();
    vi.mocked(fetchActiveInventoryFromDb).mockReset();
  });

  it("keys the heavy snapshot by the published stamp", async () => {
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue("6243:2026-09-23T17:00:00.000Z");
    vi.mocked(fetchActiveInventoryFromDb).mockResolvedValue(nursingInventory(6243));

    const bundle = await getCachedBankStatsBundle();

    expect(bundle.inventory.boards.nclex.active).toBe(6243);
    expect(cacheKeys).toContainEqual([...ACTIVE_INVENTORY_STAMP_CACHE_KEY]);
    expect(snapshotKeys()).toEqual([
      [...ACTIVE_INVENTORY_CACHE_KEY, "6243:2026-09-23T17:00:00.000Z"],
    ]);
    expect(connectionCalls).toHaveLength(1);
  });

  it("skips connection() for an ISR caller and still shares the stamp cache", async () => {
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue("6243:2026-09-23T17:00:00.000Z");
    vi.mocked(fetchActiveInventoryFromDb).mockResolvedValue(nursingInventory(6243));

    await getCachedBankStatsBundle({ dynamic: false });

    expect(connectionCalls).toHaveLength(0);
    expect(snapshotKeys()).toEqual([
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
    expect(snapshotKeys().map((key) => key[key.length - 1])).toEqual([
      "6457:2026-09-20T00:00:00.000Z",
      "6243:2026-09-23T17:00:00.000Z",
    ]);
  });

  it("runs one inventory read when concurrent stamp lookups fail", async () => {
    let calls = 0;
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue(null);
    vi.mocked(fetchActiveInventoryFromDb).mockImplementation(async () => {
      calls += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return nursingInventory(6243);
    });

    const [first, second, third] = await Promise.all([
      getCachedBankStatsBundle(),
      getCachedBankStatsBundle(),
      getCachedBankStatsBundle(),
    ]);

    expect(calls).toBe(1);
    expect(first.inventory.boards.nclex.active).toBe(6243);
    expect(second.inventory.boards.nclex.active).toBe(6243);
    expect(third.inventory.boards.nclex.active).toBe(6243);
  });

  it("reads the database directly when the stamp lookup fails", async () => {
    vi.mocked(readActiveInventoryStampKey).mockResolvedValue(null);
    vi.mocked(fetchActiveInventoryFromDb).mockResolvedValue(nursingInventory(6243));

    const bundle = await getCachedBankStatsBundle();

    expect(bundle.inventory.boards.nclex.active).toBe(6243);
    expect(snapshotKeys()).toEqual([]);
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
    expect(snapshotKeys()).toHaveLength(1);
  });
});
