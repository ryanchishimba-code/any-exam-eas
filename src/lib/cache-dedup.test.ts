import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  cacheGetOrSetDeduped,
  cacheDelete,
  cacheDeleteLocal,
  cacheKey,
  cacheWriteThrough,
  CACHE_TTL,
} from "@/lib/cache";

vi.mock("@/lib/upstash-redis", () => {
  const remote = new Map<string, { value: string; expiresAt: number }>();
  return {
    isUpstashRedisEnabled: () => true,
    redisCacheGet: async <T,>(key: string): Promise<T | null> => {
      const hit = remote.get(`aee:cache:${key}`);
      if (!hit || hit.expiresAt <= Date.now()) {
        remote.delete(`aee:cache:${key}`);
        return null;
      }
      return JSON.parse(hit.value) as T;
    },
    redisCacheSet: async <T,>(key: string, value: T, ttlMs: number): Promise<void> => {
      remote.set(`aee:cache:${key}`, {
        value: JSON.stringify(value),
        expiresAt: Date.now() + ttlMs,
      });
    },
    redisCacheDelete: async (key: string): Promise<void> => {
      remote.delete(`aee:cache:${key}`);
    },
  };
});

describe("cacheGetOrSetDeduped", () => {
  it("coalesces concurrent factories for the same key", async () => {
    const key = cacheKey(["test-dedup", Date.now(), Math.random()]);
    let runs = 0;

    const factory = () =>
      new Promise<number>((resolve) => {
        runs++;
        setTimeout(() => resolve(runs), 30);
      });

    const [a, b, c] = await Promise.all([
      cacheGetOrSetDeduped(key, 60_000, factory),
      cacheGetOrSetDeduped(key, 60_000, factory),
      cacheGetOrSetDeduped(key, 60_000, factory),
    ]);

    expect(a).toBe(1);
    expect(b).toBe(1);
    expect(c).toBe(1);
    expect(runs).toBe(1);

    cacheDelete(key);
  });
});

describe("exam preference cache freshness", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("write-through replaces Redis so cold instances see the new exam", async () => {
    const key = cacheKey(["exam-preference", "user-freshness-test"]);
    cacheDelete(key);

    await cacheWriteThrough(key, { examSlug: "naplex" }, CACHE_TTL.examPreference);
    await cacheWriteThrough(key, { examSlug: "nclex" }, CACHE_TTL.examPreference);

    // Simulate another serverless isolate with empty L1.
    cacheDeleteLocal(key);

    let factoryRuns = 0;
    const value = await cacheGetOrSetDeduped(key, CACHE_TTL.examPreference, async () => {
      factoryRuns++;
      return { examSlug: "from-db" };
    });

    expect(value).toEqual({ examSlug: "nclex" });
    expect(factoryRuns).toBe(0);
    cacheDelete(key);
  });

  it("does not keep Redis entries fresh for the full stale window", async () => {
    const key = cacheKey(["exam-preference", "user-ttl-test"]);
    cacheDelete(key);

    await cacheWriteThrough(
      key,
      { examSlug: "naplex" },
      1_000,
      { staleTtlMs: 10 * 60_000 }
    );

    // Advance past fresh TTL. Old bug kept Redis alive for fresh+stale (11m).
    vi.advanceTimersByTime(2_000);
    cacheDeleteLocal(key);

    let factoryRuns = 0;
    const value = await cacheGetOrSetDeduped(
      key,
      1_000,
      async () => {
        factoryRuns++;
        return { examSlug: "nclex" };
      },
      { staleTtlMs: 10 * 60_000 }
    );

    expect(factoryRuns).toBe(1);
    expect(value).toEqual({ examSlug: "nclex" });
    cacheDelete(key);
  });
});
