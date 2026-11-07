import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubscriptionPaywall } from "@/components/SubscriptionPaywall";
import type { SubscriptionAccess } from "@/lib/subscription-access";

function access(status: SubscriptionAccess["status"]): SubscriptionAccess {
  return {
    status,
    tier: "pro",
    planDuration: "monthly",
    daysRemaining: status === "trial_expired" ? 0 : 5,
    hasAccess: status === "trialing",
    needsPaymentMethod: false,
    canStartCheckout: true,
    trialEndsAt: null,
    currentPeriodEnd: null,
  } as SubscriptionAccess;
}

describe("SubscriptionPaywall", () => {
  it("does not offer another free trial after the trial has ended", () => {
    render(<SubscriptionPaywall access={access("trial_expired")} />);
    expect(screen.getByRole("link", { name: "Subscribe to keep studying" })).toHaveAttribute(
      "href",
      "/checkout?plan=subscribe"
    );
    expect(screen.queryByRole("link", { name: /start .*free trial/i })).not.toBeInTheDocument();
  });
});
