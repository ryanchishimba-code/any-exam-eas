import { describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import {
  DbUnavailableError,
  executeWithRetry,
  getPrismaRetryOptions,
  isNeonColdStartError,
  isQueryTimeoutError,
  isRetryableDbError,
  isTransientDbError,
  retryDelayMs,
} from "@/lib/db-resilience";

describe("isTransientDbError", () => {
  it("detects Prisma connection errors", () => {
    const err = new Prisma.PrismaClientKnownRequestError("timeout", {
      code: "P2024",
      clientVersion: "6.0.0",
    });
    expect(isTransientDbError(err)).toBe(true);
    expect(isRetryableDbError(err)).toBe(true);
  });

  it("does not retry unique constraint violations", () => {
    const err = new Prisma.PrismaClientKnownRequestError("unique", {
      code: "P2002",
      clientVersion: "6.0.0",
    });
    expect(isTransientDbError(err)).toBe(false);
    expect(isRetryableDbError(err)).toBe(false);
  });

  it("detects socket reset messages", () => {
    expect(isTransientDbError(new Error("read ECONNRESET"))).toBe(true);
  });
});

describe("retryDelayMs", () => {
  it("grows exponentially with jitter bound", () => {
    expect(retryDelayMs(0, 200)).toBeGreaterThanOrEqual(200);
    expect(retryDelayMs(0, 200)).toBeLessThan(450);
    expect(retryDelayMs(2, 200)).toBeGreaterThanOrEqual(800);
  });
});

describe("getPrismaRetryOptions", () => {
  it("uses cold-start-aware retries on Vercel", () => {
    const prev = process.env.VERCEL;
    const prevTimeout = process.env.PRISMA_QUERY_TIMEOUT_MS;
    const prevAttempts = process.env.PRISMA_MAX_ATTEMPTS;
    delete process.env.PRISMA_QUERY_TIMEOUT_MS;
    delete process.env.PRISMA_MAX_ATTEMPTS;
    process.env.VERCEL = "1";
    const opts = getPrismaRetryOptions();
    expect(opts.maxAttempts).toBe(3);
    expect(opts.timeoutMs).toBe(15_000);
    expect(opts.baseDelayMs).toBe(1_500);
    process.env.VERCEL = prev;
    if (prevTimeout === undefined) delete process.env.PRISMA_QUERY_TIMEOUT_MS;
    else process.env.PRISMA_QUERY_TIMEOUT_MS = prevTimeout;
    if (prevAttempts === undefined) delete process.env.PRISMA_MAX_ATTEMPTS;
    else process.env.PRISMA_MAX_ATTEMPTS = prevAttempts;
  });
});

describe("isNeonColdStartError", () => {
  it("detects unreachable Neon hosts", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Can't reach database server", {
      code: "P1001",
      clientVersion: "6.0.0",
    });
    expect(isNeonColdStartError(err)).toBe(true);
    expect(
      isNeonColdStartError(
        new Error("Can't reach database server at ep-x-pooler.aws.neon.tech:5432")
      )
    ).toBe(true);
  });
});

describe("query race timeouts", () => {
  const timeout = new Error("prisma:User.update_timeout");

  it("detects Promise.race label_timeout", () => {
    expect(isQueryTimeoutError(timeout)).toBe(true);
  });

  it("does not retry Promise.race label_timeout (avoids pool pile-up)", () => {
    expect(isRetryableDbError(timeout)).toBe(false);
  });

  it("still maps race timeouts as user-facing unavailable", () => {
    expect(isTransientDbError(timeout)).toBe(true);
  });
});

describe("executeWithRetry", () => {
  it("returns on first success", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    await expect(executeWithRetry(fn, { label: "test" })).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries transient failures then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("read ECONNRESET"))
      .mockResolvedValue("ok");

    await expect(
      executeWithRetry(fn, { label: "test", maxAttempts: 3, baseDelayMs: 1 })
    ).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws DbUnavailableError after exhausting retries", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("read ECONNRESET"));

    await expect(
      executeWithRetry(fn, { label: "test", maxAttempts: 2, baseDelayMs: 1 })
    ).rejects.toBeInstanceOf(DbUnavailableError);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("maps race timeouts to DbUnavailableError without retrying", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("prisma:User.find_timeout"));

    await expect(
      executeWithRetry(fn, { label: "test", maxAttempts: 3, baseDelayMs: 1 })
    ).rejects.toBeInstanceOf(DbUnavailableError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not retry non-transient errors", async () => {
    const err = new Prisma.PrismaClientKnownRequestError("unique", {
      code: "P2002",
      clientVersion: "6.0.0",
    });
    const fn = vi.fn().mockRejectedValue(err);

    await expect(executeWithRetry(fn, { label: "test" })).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
