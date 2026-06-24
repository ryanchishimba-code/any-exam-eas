import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  assertAccountIpAllowed,
  accountIpLimitResponse,
  enforceAccountIpLimit,
  MAX_ACCOUNT_IPS,
  resolveIpHash,
} from "@/lib/account-ip-limit";

const { findManyMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userSession: {
      findMany: findManyMock,
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("resolveIpHash", () => {
  it("falls back to headerStore when request has no forwarded IP", () => {
    const req = new Request("https://example.com/api/auth/callback/credentials", {
      headers: {},
    });
    const headerStore = new Headers({ "x-forwarded-for": "203.0.113.7" });
    expect(resolveIpHash(req, headerStore)).toBeTruthy();
    expect(resolveIpHash(req)).toBeUndefined();
  });
});

describe("assertAccountIpAllowed", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalVercel = process.env.VERCEL;

  beforeEach(() => {
    findManyMock.mockReset();
    delete process.env.VERCEL;
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalVercel === undefined) {
      delete process.env.VERCEL;
    } else {
      process.env.VERCEL = originalVercel;
    }
  });

  it("allows staff regardless of IP count", async () => {
    findManyMock.mockResolvedValue([
      { ipHash: "a" },
      { ipHash: "b" },
      { ipHash: "c" },
    ]);
    const result = await assertAccountIpAllowed("user-1", {
      ipHash: "d",
      role: "admin",
    });
    expect(result.ok).toBe(true);
  });

  it("allows a known IP", async () => {
    findManyMock.mockResolvedValue([{ ipHash: "abc" }, { ipHash: "def" }]);
    const result = await assertAccountIpAllowed("user-1", {
      ipHash: "abc",
      role: "user",
    });
    expect(result.ok).toBe(true);
  });

  it("allows internal test accounts regardless of IP count", async () => {
    findManyMock.mockResolvedValue([
      { ipHash: "a" },
      { ipHash: "b" },
      { ipHash: "c" },
    ]);
    const result = await assertAccountIpAllowed("user-1", {
      ipHash: "d",
      role: "user",
      email: "test-premium@anyexameasy.test",
    });
    expect(result.ok).toBe(true);
  });

  it("blocks a fourth distinct IP in production", async () => {
    process.env.NODE_ENV = "production";
    findManyMock.mockResolvedValue([
      { ipHash: "a" },
      { ipHash: "b" },
      { ipHash: "c" },
    ]);
    const result = await assertAccountIpAllowed("user-1", {
      ipHash: "d",
      role: "user",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("too_many_ips");
    expect(MAX_ACCOUNT_IPS).toBe(3);
  });

  it("does NOT block a fourth distinct IP outside production (local dev)", async () => {
    // NODE_ENV is "test" here (set in beforeEach); the limit must not apply.
    findManyMock.mockResolvedValue([
      { ipHash: "a" },
      { ipHash: "b" },
      { ipHash: "c" },
    ]);
    const result = await assertAccountIpAllowed("user-1", {
      ipHash: "d",
      role: "user",
    });
    expect(result.ok).toBe(true);
  });

  it("allows when IP is unknown in production", async () => {
    process.env.NODE_ENV = "production";
    findManyMock.mockResolvedValue([]);
    const result = await assertAccountIpAllowed("user-1", { role: "user" });
    expect(result.ok).toBe(true);
  });

  it("allows when IP is unknown on Vercel preview", async () => {
    process.env.VERCEL = "1";
    findManyMock.mockResolvedValue([]);
    const result = await assertAccountIpAllowed("user-1", { role: "user" });
    expect(result.ok).toBe(true);
  });
});

describe("accountIpLimitResponse", () => {
  it("returns IP_REQUIRED for missing IP", async () => {
    const res = accountIpLimitResponse("ip_required");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("IP_REQUIRED");
  });

  it("returns TOO_MANY_IPS for device limit", async () => {
    const res = accountIpLimitResponse("too_many_ips");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("TOO_MANY_IPS");
  });
});

describe("enforceAccountIpLimit", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    findManyMock.mockReset();
    delete process.env.VERCEL;
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("allows access when IP is unknown in production", async () => {
    findManyMock.mockResolvedValue([]);
    const blocked = await enforceAccountIpLimit("user-1", "user");
    expect(blocked).toBeNull();
  });
});
