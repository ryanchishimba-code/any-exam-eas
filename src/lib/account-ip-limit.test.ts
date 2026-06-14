import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  assertAccountIpAllowed,
  MAX_ACCOUNT_IPS,
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

describe("assertAccountIpAllowed", () => {
  beforeEach(() => {
    findManyMock.mockReset();
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

  it("blocks a fourth distinct IP", async () => {
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

  it("allows when IP is unknown (fail open)", async () => {
    findManyMock.mockResolvedValue([]);
    const result = await assertAccountIpAllowed("user-1", { role: "user" });
    expect(result.ok).toBe(true);
  });
});
