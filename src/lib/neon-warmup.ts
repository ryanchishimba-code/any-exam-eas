/**
 * Wake Neon compute via HTTP before Prisma TCP work.
 * Scale-to-zero cold starts often fail Prisma with P1001 for ~10s; Neon HTTP
 * wakes the endpoint faster and makes the subsequent TCP connect succeed.
 *
 * Page/API paths use a short budget so a cold Neon never burns the whole
 * Vercel function timeout (that surfaced as "Question bank unavailable").
 * Cron keepalive keeps the long retry path.
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

/** Page/API paths must not block longer than this waiting for Neon HTTP. */
const PAGE_WARM_BUDGET_MS = 4_000;

let lastSuccessfulWarmAt = 0;

export function resetNeonWarmCacheForTests(): void {
  lastSuccessfulWarmAt = 0;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function warmNeonCompute(
  label = "warmup",
  options?: { maxAttempts?: number; timeoutMs?: number; baseDelayMs?: number }
): Promise<NeonWarmupResult> {
  const started = Date.now();
  const forCron = label.startsWith("cron.");
  try {
    const { getNeonSql } = await import("@/db");
    const sql = getNeonSql();
    await withNeon(
      label,
      async () => {
        await sql`SELECT 1 as n`;
      },
      {
        // Cron can wait for a full cold wake; page paths stay short.
        maxAttempts: options?.maxAttempts ?? (forCron ? 3 : 2),
        timeoutMs: options?.timeoutMs ?? (forCron ? 18_000 : 3_500),
        baseDelayMs: options?.baseDelayMs ?? (forCron ? 2_000 : 400),
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
 * Cached per serverless isolate. Always soft-fails within budgetMs so the
 * request can continue to Prisma retries instead of timing out the page.
 */
export async function ensureNeonReady(
  label = "ensure",
  options?: { budgetMs?: number }
): Promise<NeonWarmupResult> {
  if (
    lastSuccessfulWarmAt > 0 &&
    Date.now() - lastSuccessfulWarmAt < WARM_CACHE_TTL_MS
  ) {
    return { ok: true, ms: 0, cached: true };
  }

  const budgetMs = options?.budgetMs ?? PAGE_WARM_BUDGET_MS;
  const started = Date.now();
  const warm = warmNeonCompute(label);
  const timedOut = sleep(budgetMs).then(
    (): NeonWarmupResult => ({ ok: false, ms: Date.now() - started })
  );
  return Promise.race([warm, timedOut]);
}
