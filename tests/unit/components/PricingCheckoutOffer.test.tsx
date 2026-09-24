/**
 * Pricing and trial checkout offer copy.
 *
 *   npx vitest run --project component tests/unit/components/PricingCheckoutOffer.test.tsx
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { UpgradeIntervalChoice } from "@/components/checkout/UpgradeIntervalChoice";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { buildPlanPricing } from "@/lib/promo-pricing";

vi.mock("@/lib/analytics", () => ({
  analytics: {
    pricingViewed: vi.fn(),
    planSelected: vi.fn(),
  },
}));

const APPROVED = "5-day free trial · no payment method required · then $27.99/mo";

describe("pricing and checkout offer copy", () => {
  it("shows the approved trial line on the pricing card and drops the first-month promo", async () => {
    const user = userEvent.setup();
    render(<PricingTiers />);

    expect(screen.getByText(APPROVED, { exact: false })).toBeInTheDocument();
    expect(screen.queryByText(/no card/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/20% off first month/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/save \d+%/i)).not.toBeInTheDocument();
    expect(screen.getByText("$27.99/mo")).toBeInTheDocument();
    expect(screen.getByText("$235.12 · ≈ $19.59/mo")).toBeInTheDocument();
    expect(screen.getByText("Best value")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /other billing options/i }));
    expect(screen.queryByText(/save \d+%/i)).not.toBeInTheDocument();
    expect(screen.getByText("$147.79 · ≈ $24.63/mo")).toBeInTheDocument();
    expect(screen.getByText("$79.77 · ≈ $26.59/mo")).toBeInTheDocument();
  });

  it("keeps interval dollar prices on the shared billing picker and drops percent-off badges", async () => {
    const user = userEvent.setup();
    render(<UpgradeIntervalChoice value="monthly" onChange={() => {}} />);

    expect(screen.queryByText(/new members/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/20% off/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/save \d+%/i)).not.toBeInTheDocument();
    expect(screen.getByText("$27.99/mo")).toBeInTheDocument();
    expect(screen.getByText("$235.12 · ≈ $19.59/mo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /other billing options/i }));
    expect(screen.queryByText(/save \d+%/i)).not.toBeInTheDocument();
    expect(screen.getByText("$147.79 · ≈ $24.63/mo")).toBeInTheDocument();
    expect(screen.getByText("$79.77 · ≈ $26.59/mo")).toBeInTheDocument();
  });

  it("uses the approved trial terms on a $0 monthly checkout summary", () => {
    render(
      <CheckoutOrderSummary
        pricing={buildPlanPricing("trial", "pro", "monthly")}
        discount={null}
        interval="monthly"
      />
    );

    expect(screen.getByText(APPROVED)).toBeInTheDocument();
    expect(screen.queryByText(/no card/i)).not.toBeInTheDocument();
  });

  it("does not claim $27.99/mo after a non-monthly trial selection", () => {
    render(
      <CheckoutOrderSummary
        pricing={buildPlanPricing("trial", "pro", "yearly")}
        discount={null}
        interval="yearly"
      />
    );

    expect(
      screen.getByText("5-day free trial · no payment method required")
    ).toBeInTheDocument();
    expect(screen.queryByText(/then \$27\.99\/mo/)).not.toBeInTheDocument();
    expect(screen.queryByText(/no card/i)).not.toBeInTheDocument();
  });
});
