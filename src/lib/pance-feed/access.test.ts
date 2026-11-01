import { describe, expect, it } from "vitest";
import type { UserAccess } from "@/lib/access-control";
import { canUsePanceFeed, flashcardFeedLevel } from "./access";

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

  it("gives a live trial the slice and keeps everyone else locked or full", () => {
    expect(flashcardFeedLevel(access("subscriber", "active"))).toBe("full");
    expect(flashcardFeedLevel(access("staff", "none", true))).toBe("full");
    expect(flashcardFeedLevel(access("trial", "trialing", true))).toBe("trial");
    expect(flashcardFeedLevel(access("trial", "trialing", false))).toBe("locked");
    expect(flashcardFeedLevel(access("free", "trial_expired", false))).toBe("locked");
    expect(flashcardFeedLevel(access("expired", "inactive", false))).toBe("locked");
  });
});
