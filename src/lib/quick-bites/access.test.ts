import { describe, expect, it } from "vitest";
import {
  canPlayFnpQuickBiteEpisode,
  canPlayPanceQuickBiteEpisode,
  canPlayQuickBiteEpisode,
  canPlayQuickBites,
} from "./access";
import { OPEN_FNP_QUICK_BITE_SLUG } from "./fnp-catalog";
import { OPEN_PANCE_QUICK_BITE_SLUG } from "./pance-catalog";
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

  it("opens only How the Nursing Boards Work for free and trial members", () => {
    const free = access("free", "trial_expired", false);
    const trial = access("trial", "trialing", true);
    expect(canPlayQuickBiteEpisode(free, "quick-bites-ep02-nclex-works")).toBe(true);
    expect(canPlayQuickBiteEpisode(trial, "quick-bites-ep02-nclex-works")).toBe(true);
    expect(canPlayQuickBiteEpisode(free, "quick-bites-ep03-priority")).toBe(false);
    expect(canPlayQuickBiteEpisode(trial, "quick-bites-ep12-high-alert-pharm")).toBe(false);
    expect(canPlayQuickBiteEpisode(access("subscriber", "active"), "quick-bites-ep07-acid-base")).toBe(
      true
    );
  });

  it("opens only the FNP and PANCE trial samples for free and trial members", () => {
    const free = access("free", "trial_expired", false);
    const trial = access("trial", "trialing", true);
    expect(canPlayFnpQuickBiteEpisode(trial, OPEN_FNP_QUICK_BITE_SLUG)).toBe(true);
    expect(canPlayFnpQuickBiteEpisode(free, OPEN_FNP_QUICK_BITE_SLUG)).toBe(true);
    expect(canPlayFnpQuickBiteEpisode(trial, "quick-bites-fnp-ep01-screening")).toBe(false);
    expect(canPlayPanceQuickBiteEpisode(trial, OPEN_PANCE_QUICK_BITE_SLUG)).toBe(true);
    expect(canPlayPanceQuickBiteEpisode(free, OPEN_PANCE_QUICK_BITE_SLUG)).toBe(true);
    expect(canPlayPanceQuickBiteEpisode(trial, "quick-bites-pance-ep02-rhythms-valves-congenital")).toBe(
      false
    );
  });
});
