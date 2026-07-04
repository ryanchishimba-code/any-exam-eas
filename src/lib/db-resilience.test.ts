import { describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";
import {
  DbUnavailableError,
  executeWithRetry,
  getPrismaRetryOptions,
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
  });

  it("does not retry unique constraint violations", () => {
    const err = new Prisma.PrismaClientKnownRequestError("unique", {
      code: "P2002",
      clientVersion: "6.0.0",
    });
    expect(isTransientDbError(err)).toBe(false);
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
  it("uses longer timeouts on Vercel", () => {
    const prev = process.env.VERCEL;
    process.env.VERCEL = "1";
    const opts = getPrismaRetryOptions();
    expect(opts.maxAttempts).toBeGreaterThanOrEqual(3);
    expect(opts.timeoutMs).toBeGreaterThanOrEqual(15_000);
    process.env.VERCEL = prev;
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
