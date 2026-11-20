import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckoutReview } from "@/components/checkout/CheckoutReview";
import { OFFER_PUBLIC_MESSAGE } from "@/lib/billing/trial-upgrade-offer";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("plan=subscribe&interval=monthly&tier=pro"),
  useRouter: () => ({ replace: vi.fn() }),
}));

const onContinue = vi.fn();

function renderOffer(
  offer: {
    status: "valid" | "expired" | "used" | "already_paid";
    message: string;
    token: string | null;
  } | null,
  interval: "monthly" | "yearly" = "monthly"
) {
  return render(
    <CheckoutReview
      initialPlan="subscribe"
      initialInterval={interval}
      offer={
        offer
          ? {
              ...offer,
              expiresAt: offer.status === "valid" ? "2026-11-17T01:39:00.000Z" : null,
              percentOff: offer.status === "valid" ? 25 : null,
            }
          : null
      }
      onContinue={onContinue}
    />
  );
}

describe("checkout offer price", () => {
  it("shows 25% off the first payment when the offer is valid", () => {
    renderOffer({
      status: "valid",
      message: OFFER_PUBLIC_MESSAGE.valid,
      token: "tok_live",
    });
    expect(screen.getByText("$20.99")).toBeTruthy();
    expect(screen.getByText("$27.99")).toBeTruthy();
    expect(screen.getByText(/25% off first payment/i)).toBeTruthy();
    expect(screen.getByText(/can’t be combined with another code/i)).toBeTruthy();
    expect(screen.queryByText(/have a promo code/i)).toBeNull();
  });

  it("shows the discounted yearly total, not a monthly-only price", () => {
    renderOffer(
      { status: "valid", message: OFFER_PUBLIC_MESSAGE.valid, token: "tok_live" },
      "yearly"
    );
    expect(screen.getByText("$176.34")).toBeTruthy();
    expect(screen.getByText("$235.12")).toBeTruthy();
  });

  it("shows a polite note and the regular price when the offer has ended", () => {
    renderOffer({ status: "expired", message: OFFER_PUBLIC_MESSAGE.expired, token: null });
    expect(screen.getByText(OFFER_PUBLIC_MESSAGE.expired)).toBeTruthy();
    expect(screen.getByText("$27.99")).toBeTruthy();
    expect(screen.queryByText("$20.99")).toBeNull();
    expect(screen.getByText(/have a promo code/i)).toBeTruthy();
  });

  it("shows a polite note and the regular price when the offer was used", () => {
    renderOffer({ status: "used", message: OFFER_PUBLIC_MESSAGE.used, token: null });
    expect(screen.getByText(OFFER_PUBLIC_MESSAGE.used)).toBeTruthy();
    expect(screen.queryByText("$20.99")).toBeNull();
    expect(screen.getByText("$27.99")).toBeTruthy();
  });

  it("shows a polite note and the regular price when the account has already paid", () => {
    renderOffer({
      status: "already_paid",
      message: OFFER_PUBLIC_MESSAGE.already_paid,
      token: null,
    });
    expect(screen.getByText(OFFER_PUBLIC_MESSAGE.already_paid)).toBeTruthy();
    expect(screen.queryByText("$20.99")).toBeNull();
    expect(screen.getByText("$27.99")).toBeTruthy();
  });
});
