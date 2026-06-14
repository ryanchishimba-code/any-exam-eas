type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function checkRateLimitMemory(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { ok: true };
}

/** Sliding window limiter — Upstash when configured, else per-instance memory. */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const { checkDistributedRateLimit } = await import("@/lib/rate-limit-distributed");
  const distributed = await checkDistributedRateLimit(key, limit, windowMs);
  if (distributed) return distributed;
  return checkRateLimitMemory(key, limit, windowMs);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Prune stale buckets periodically (avoids unbounded memory on long-running servers). */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(key);
    }
  }, 60_000).unref?.();
}
