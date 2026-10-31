import { describe, expect, it } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import { canUsePanceFeed } from "./access";

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

describe("canUsePanceFeed", () => {
  it("follows the paid-plan gate", () => {
    expect(canUsePanceFeed(access("subscriber", "active"))).toBe(true);
    expect(canUsePanceFeed(access("staff", "none", true))).toBe(true);
    expect(canUsePanceFeed(access("trial", "trialing", true))).toBe(false);
    expect(canUsePanceFeed(access("free", "trial_expired", false))).toBe(false);
    expect(canUsePanceFeed(access("expired", "inactive", false))).toBe(false);
  });
});
