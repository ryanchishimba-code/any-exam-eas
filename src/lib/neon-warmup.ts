/**
 * Wake Neon compute via HTTP before Prisma TCP work.
 * Scale-to-zero cold starts often fail Prisma with P1001 for ~10s; Neon HTTP
 * wakes the endpoint faster and makes the subsequent TCP connect succeed.
 */
import { withNeon } from "@/lib/db-resilience";

export type NeonWarmupResult = {
  ok: boolean;
  ms: number;
  /** True when a recent successful warm is reused (same isolate). */
  cached?: boolean;
};

/** Reuse a successful warm within this window to avoid HTTP ping storms. */
const WARM_CACHE_TTL_MS = 45_000;

let lastSuccessfulWarmAt = 0;

export function resetNeonWarmCacheForTests(): void {
  lastSuccessfulWarmAt = 0;
}

export async function warmNeonCompute(
  label = "warmup"
): Promise<NeonWarmupResult> {
  const started = Date.now();
  try {
    const { getNeonSql } = await import("@/db");
    const sql = getNeonSql();
    await withNeon(
      label,
      async () => {
        await sql`SELECT 1 as n`;
      },
      {
        // Cold compute often needs 10–20s; retry timeouts until awake.
        maxAttempts: 3,
        timeoutMs: 18_000,
        baseDelayMs: 2_000,
      }
    );
    lastSuccessfulWarmAt = Date.now();
    return { ok: true, ms: Date.now() - started };
  } catch (error) {
    console.warn(
      `[db] neon warmup failed (${label}):`,
      error instanceof Error ? error.message : error
    );
    return { ok: false, ms: Date.now() - started };
  }
}

/**
 * Ensure Neon is awake before study pages / APIs hit Prisma.
 * Cached per serverless isolate so concurrent requests don't stampede.
 */
export async function ensureNeonReady(
  label = "ensure"
): Promise<NeonWarmupResult> {
  if (
    lastSuccessfulWarmAt > 0 &&
    Date.now() - lastSuccessfulWarmAt < WARM_CACHE_TTL_MS
  ) {
    return { ok: true, ms: 0, cached: true };
  }
  return warmNeonCompute(label);
}
