/**
 * Wake Neon compute via HTTP before Prisma TCP work.
 * Scale-to-zero cold starts often fail Prisma with P1001 for ~10s; Neon HTTP
 * wakes the endpoint faster and makes the subsequent TCP connect succeed.
 */
import { withNeon } from "@/lib/db-resilience";

export type NeonWarmupResult = {
  ok: boolean;
  ms: number;
};

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
        maxAttempts: 3,
        timeoutMs: 12_000,
        baseDelayMs: 1_500,
      }
    );
    return { ok: true, ms: Date.now() - started };
  } catch (error) {
    console.warn(
      `[db] neon warmup failed (${label}):`,
      error instanceof Error ? error.message : error
    );
    return { ok: false, ms: Date.now() - started };
  }
}
