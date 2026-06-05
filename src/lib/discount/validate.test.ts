import { describe, expect, it, vi } from "vitest";
import { messageForErrorCode } from "./messages";

vi.mock("@/db", () => ({
  requireDb: () => {
    throw new Error("no db in test");
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    promoCode: { findUnique: vi.fn() },
    promoRedemption: { findUnique: vi.fn() },
  },
}));

describe("discount messages", () => {
  it("returns user-friendly expired message", () => {
    expect(messageForErrorCode("expired")).toContain("expired");
    expect(messageForErrorCode("expired")).toContain("full access");
  });

  it("returns already redeemed message", () => {
    expect(messageForErrorCode("already_redeemed")).toContain("already used");
  });
});
