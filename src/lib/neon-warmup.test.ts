import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => ({
  getNeonSql: () => {
    const sql = async () => [{ n: 1 }];
    return sql;
  },
}));

vi.mock("@/lib/db-resilience", async () => {
  const actual = await vi.importActual<typeof import("@/lib/db-resilience")>(
    "@/lib/db-resilience"
  );
  return {
    ...actual,
    withNeon: async (_label: string, fn: () => Promise<unknown>) => fn(),
  };
});

describe("ensureNeonReady", () => {
  afterEach(async () => {
    const { resetNeonWarmCacheForTests } = await import("./neon-warmup");
    resetNeonWarmCacheForTests();
    vi.resetModules();
  });

  it("caches a successful warm within the TTL window", async () => {
    const { ensureNeonReady, resetNeonWarmCacheForTests } = await import(
      "./neon-warmup"
    );
    resetNeonWarmCacheForTests();

    const first = await ensureNeonReady("test-a");
    expect(first.ok).toBe(true);
    expect(first.cached).toBeUndefined();

    const second = await ensureNeonReady("test-b");
    expect(second.ok).toBe(true);
    expect(second.cached).toBe(true);
    expect(second.ms).toBe(0);
  });
});
