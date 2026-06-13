import { describe, expect, it } from "vitest";
import { cacheGetOrSetDeduped, cacheDelete, cacheKey } from "@/lib/cache";

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
