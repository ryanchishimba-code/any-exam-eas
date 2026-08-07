/**
 * Production DB resilience for Neon + Vercel serverless.
 * Shared retry, timeout, slow-query logging, and user-safe error mapping.
 */
import { Prisma } from "@prisma/client";

export class DbUnavailableError extends Error {
  readonly retryable = true;

  constructor(message = "Database temporarily unavailable") {
    super(message);
    this.name = "DbUnavailableError";
  }
}

export type ExecuteWithRetryOptions = {
  /** Human-readable label for logs (e.g. "questionBank.sample"). */
  label?: string;
  /** Max attempts including the first try (default 3). */
  maxAttempts?: number;
  /** Per-attempt timeout in ms (default 15_000). */
  timeoutMs?: number;
  /** Base delay for exponential backoff in ms (default 200). */
  baseDelayMs?: number;
  /** Log slow operations above this threshold (default 500ms). */
  slowQueryMs?: number;
};

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_BASE_DELAY_MS = 200;
const DEFAULT_SLOW_QUERY_MS = 500;

/** Shared Prisma $extends retry settings — tuned for Neon cold starts on Vercel. */
export function getPrismaRetryOptions(): Required<
  Pick<ExecuteWithRetryOptions, "maxAttempts" | "timeoutMs" | "baseDelayMs">
> {
  const vercel = Boolean(process.env.VERCEL);
  return {
    // First attempt often fails while Neon compute is waking; backoff waits
    // for wake before retrying TCP. Race timeouts get one warm+retry on Vercel.
    maxAttempts: Number(process.env.PRISMA_MAX_ATTEMPTS ?? (vercel ? 3 : 3)),
    // Keep page/API worst-case under typical Vercel route budgets (60s QB).
    timeoutMs: Number(process.env.PRISMA_QUERY_TIMEOUT_MS ?? (vercel ? 12_000 : 15_000)),
    // Longer base delay on Vercel so Neon scale-to-zero can finish waking.
    baseDelayMs: vercel ? 1_200 : 200,
  };
}

/** Neon autosuspend / unreachable host — needs longer backoff than socket blips. */
export function isNeonColdStartError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1001" || error.code === "P1017") return true;
  }
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  const msg = errorMessage(error);
  return (
    msg.includes("can't reach database") ||
    msg.includes("server closed the connection") ||
    msg.includes("connection reset") ||
    msg.includes("error in postgresql connection")
  );
}

const TRANSIENT_PRISMA_CODES = new Set([
  "P1001", // Can't reach database server
  "P1002", // Advisory lock / timeout
  "P1008", // Operations timed out
  "P1017", // Server closed connection
  "P2024", // Timed out fetching connection from pool
  "P2034", // Transaction conflict (safe to retry reads / idempotent writes)
]);

const NON_RETRY_PRISMA_CODES = new Set([
  "P2002", // Unique constraint
  "P2003", // Foreign key
  "P2014", // Invalid ID
  "P2025", // Record not found
]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Jittered exponential backoff: base * 2^attempt + random(0..base). */
export function retryDelayMs(attempt: number, baseDelayMs: number): number {
  const exp = baseDelayMs * 2 ** attempt;
  const jitter = Math.floor(Math.random() * baseDelayMs);
  return exp + jitter;
}

function errorMessage(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).toLowerCase();
}

/**
 * Promise.race label_timeout from withTimeout — does NOT cancel the in-flight
 * Prisma query. Never retry these (avoids pool pile-up); still treat as unavailable
 * for user-facing 503 / redirects.
 */
export function isQueryTimeoutError(error: unknown): boolean {
  return errorMessage(error).includes("_timeout");
}

/** Whether we should backoff and retry the operation (excludes race timeouts). */
export function isRetryableDbError(error: unknown): boolean {
  if (error instanceof DbUnavailableError) return error.retryable;
  if (isQueryTimeoutError(error)) return false;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (NON_RETRY_PRISMA_CODES.has(error.code)) return false;
    if (TRANSIENT_PRISMA_CODES.has(error.code)) return true;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;

  const msg = errorMessage(error);

  if (msg.endsWith(" timeout")) return true;

  return (
    msg.includes("econnreset") ||
    msg.includes("econnrefused") ||
    msg.includes("etimedout") ||
    msg.includes("socket timeout") ||
    msg.includes("connection terminated") ||
    msg.includes("connection closed") ||
    msg.includes("too many connections") ||
    msg.includes("can't reach database") ||
    msg.includes("server closed the connection") ||
    msg.includes("database is locked") ||
    msg.includes("sqlite_busy") ||
    (msg.includes("neon") && msg.includes("timeout"))
  );
}

/**
 * User-facing / stale-cache / 503 mapping — includes race timeouts that must
 * not be retried but should still surface as "database unavailable".
 */
export function isTransientDbError(error: unknown): boolean {
  if (error instanceof DbUnavailableError) return true;
  if (isQueryTimeoutError(error)) return true;
  return isRetryableDbError(error);
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label}_timeout`)), ms)
    ),
  ]);
}

/**
 * Run an async DB operation with exponential backoff, jitter, timeout, and slow-query logging.
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options: ExecuteWithRetryOptions = {}
): Promise<T> {
  const {
    label = "db",
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    slowQueryMs = DEFAULT_SLOW_QUERY_MS,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const started = Date.now();
    try {
      const result = await withTimeout(fn(), timeoutMs, label);
      const elapsed = Date.now() - started;
      if (elapsed >= slowQueryMs) {
        console.warn(`[db:slow] ${label} ${elapsed}ms`);
      }
      return result;
    } catch (error) {
      lastError = error;
      const elapsed = Date.now() - started;
      const isLast = attempt + 1 >= maxAttempts;

      // Race timeouts normally do not retry (in-flight query still holds a slot).
      // On Vercel: one warm+retry for Prisma; Neon HTTP warm may retry timeouts
      // across attempts so scale-to-zero wake can finish.
      const timeoutWarmRetry =
        isQueryTimeoutError(error) &&
        !isLast &&
        Boolean(process.env.VERCEL) &&
        (attempt === 0 || label.startsWith("neon:"));

      const retryable = isRetryableDbError(error) || timeoutWarmRetry;

      if (!retryable || isLast) {
        if (isTransientDbError(error)) {
          console.error(
            `[db] ${label} failed after ${attempt + 1} attempts (${elapsed}ms):`,
            error instanceof Error ? error.message : error
          );
          throw new DbUnavailableError();
        }
        throw error;
      }

      if (timeoutWarmRetry || isNeonColdStartError(error)) {
        // Only warm via Neon HTTP when a Prisma TCP op stalled — never recurse
        // into warmNeonCompute from an already-in-progress neon:/drizzle: warm.
        if (label.startsWith("prisma:")) {
          try {
            const { warmNeonCompute } = await import("@/lib/neon-warmup");
            await warmNeonCompute(`${label}.retry-warm`);
          } catch {
            /* warm best-effort */
          }
        }
      }

      const waitBase = isNeonColdStartError(error)
        ? Math.max(baseDelayMs, 2_500)
        : baseDelayMs;
      const waitMs = retryDelayMs(attempt, waitBase);
      console.warn(
        `[db] ${label} transient error (attempt ${attempt + 1}/${maxAttempts}, ${elapsed}ms) — retry in ${waitMs}ms:`,
        error instanceof Error ? error.message : error
      );
      await sleep(waitMs);
    }
  }

  throw lastError instanceof Error && isTransientDbError(lastError)
    ? new DbUnavailableError()
    : lastError instanceof Error
      ? lastError
      : new DbUnavailableError();
}

/** Prisma query wrapper — use for TCP pool operations. */
export function withPrisma<T>(
  label: string,
  fn: () => Promise<T>,
  options?: Omit<ExecuteWithRetryOptions, "label">
): Promise<T> {
  return executeWithRetry(fn, { label: `prisma:${label}`, ...options });
}

/** Drizzle / Neon HTTP wrapper — use for stateless HTTP queries. */
export function withDrizzle<T>(
  label: string,
  fn: () => Promise<T>,
  options?: Omit<ExecuteWithRetryOptions, "label">
): Promise<T> {
  return executeWithRetry(fn, {
    label: `drizzle:${label}`,
    timeoutMs: options?.timeoutMs ?? 12_000,
    ...options,
  });
}

/** Low-level Neon SQL tagged-template wrapper. */
export function withNeon<T>(
  label: string,
  fn: () => Promise<T>,
  options?: Omit<ExecuteWithRetryOptions, "label">
): Promise<T> {
  return executeWithRetry(fn, {
    label: `neon:${label}`,
    timeoutMs: options?.timeoutMs ?? 8_000,
    ...options,
  });
}

export type UserFacingDbError = {
  code: "database_unavailable";
  message: string;
  retryable: boolean;
};

export function toUserFacingDbError(error: unknown): UserFacingDbError | null {
  if (error instanceof DbUnavailableError || isTransientDbError(error)) {
    return {
      code: "database_unavailable",
      message:
        "We couldn't reach the study database right now. Please wait a moment and try again.",
      retryable: true,
    };
  }
  return null;
}
