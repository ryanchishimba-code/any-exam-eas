import { describe, expect, it } from "vitest";
import { canPlayQuickBites } from "./access";
import type { UserAccess } from "@/lib/access-control";

function access(
  role: UserAccess["role"],
  status: UserAccess["subscription"]["status"],
  hasPremiumAccess = true
): Pick<UserAccess, "role" | "hasPremiumAccess" | "subscription"> {
  return {
    role,
    hasPremiumAccess,
    subscription: { status } as UserAccess["subscription"],
  };
}

describe("canPlayQuickBites", () => {
  it("lets a paid subscriber play", () => {
    expect(canPlayQuickBites(access("subscriber", "active"))).toBe(true);
  });

  it("lets staff play", () => {
    expect(canPlayQuickBites(access("staff", "none", true))).toBe(true);
  });

  it("locks trial members even when they have product access", () => {
    expect(canPlayQuickBites(access("trial", "trialing", true))).toBe(false);
  });

  it("locks free members", () => {
    expect(canPlayQuickBites(access("free", "trial_expired", false))).toBe(false);
  });

  it("locks an active status that is not a subscriber", () => {
    expect(canPlayQuickBites(access("expired", "active", false))).toBe(false);
  });
});
