import { beforeEach, describe, expect, it, vi } from "vitest";
import { messageForErrorCode } from "./messages";
import { validateDiscount } from "./validate";
import { prisma } from "@/lib/prisma";

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

describe("validateDiscount pass codes", () => {
  beforeEach(() => {
    vi.mocked(prisma.promoCode.findUnique).mockReset();
  });

  it("rejects an access grant as a checkout discount", async () => {
    vi.mocked(prisma.promoCode.findUnique).mockResolvedValue({
      id: "promo_pass",
      code: "RN-7K4Q-2M",
      discountPercent: null,
      discountAmount: null,
      expiryDate: null,
      maxUses: 1,
      currentUses: 0,
      stripeCouponId: null,
      compDays: 30,
      audience: "nursing",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await validateDiscount({ code: "rn-7k4q-2m", plan: "subscribe" });
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/free pass/i);
    expect(result.message).toMatch(/sign-up page/i);
  });
});
