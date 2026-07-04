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
    maxAttempts: Number(process.env.PRISMA_MAX_ATTEMPTS ?? (vercel ? 3 : 3)),
    timeoutMs: Number(process.env.PRISMA_QUERY_TIMEOUT_MS ?? (vercel ? 20_000 : 15_000)),
    baseDelayMs: vercel ? 150 : 200,
  };
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

export function isTransientDbError(error: unknown): boolean {
  if (error instanceof DbUnavailableError) return true;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (NON_RETRY_PRISMA_CODES.has(error.code)) return false;
    if (TRANSIENT_PRISMA_CODES.has(error.code)) return true;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;

  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  if (msg.includes("_timeout") || msg.endsWith(" timeout")) return true;

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
    msg.includes("neon") && msg.includes("timeout")
  );
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
      const transient = isTransientDbError(error);
      const isLast = attempt + 1 >= maxAttempts;

      if (!transient || isLast) {
        if (transient) {
          console.error(
            `[db] ${label} failed after ${attempt + 1} attempts (${elapsed}ms):`,
            error instanceof Error ? error.message : error
          );
          throw new DbUnavailableError();
        }
        throw error;
      }

      const waitMs = retryDelayMs(attempt, baseDelayMs);
      console.warn(
        `[db] ${label} transient error (attempt ${attempt + 1}/${maxAttempts}, ${elapsed}ms) — retry in ${waitMs}ms:`,
        error instanceof Error ? error.message : error
      );
      await sleep(waitMs);
    }
  }

  throw lastError instanceof Error ? lastError : new DbUnavailableError();
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
