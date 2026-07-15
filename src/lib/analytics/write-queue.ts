/**
 * Serialize non-critical analytics writes inside a serverless isolate.
 * With Prisma connection_limit=1 on Vercel, concurrent beacon writes compete
 * with product queries and cause P2024 pool timeouts.
 */

let chain: Promise<void> = Promise.resolve();
let pending = 0;

const MAX_PENDING = 8;

/** Enqueue a best-effort write. Drops work when the isolate is already backed up. */
export function enqueueAnalyticsWrite(task: () => Promise<void>): void {
  if (pending >= MAX_PENDING) {
    return;
  }
  pending += 1;
  chain = chain
    .then(async () => {
      try {
        await task();
      } catch {
        /* analytics must never throw into the isolate */
      } finally {
        pending -= 1;
      }
    })
    .catch(() => {
      pending = Math.max(0, pending - 1);
    });
}

/** Test helper — wait for queued writes to flush. */
export async function flushAnalyticsWriteQueue(): Promise<void> {
  await chain;
}

export function getAnalyticsWriteQueueDepth(): number {
  return pending;
}
