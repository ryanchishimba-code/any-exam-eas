import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BillingSettingsSection } from "@/components/settings/BillingSettingsSection";

vi.mock("@/components/ManageBillingButton", () => ({
  ManageBillingButton: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}));

type StatusOverrides = Record<string, unknown>;

function mockStatus(overrides: StatusOverrides) {
  const body = {
    hasAccess: true,
    status: "active",
    planTier: "pro",
    planInterval: "monthly",
    trialEndsAt: null,
    daysRemaining: null,
    hasStripeSubscription: false,
    purchaseType: "subscription",
    accessEndsAt: null,
    reactivation: null,
    ...overrides,
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => body }) as unknown as Response)
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("BillingSettingsSection pay-once view", () => {
  it("shows the access end date and hides the plan switcher for an active pass", async () => {
    const accessEndsAt = "2027-03-14T12:00:00.000Z";
    // Match the component's own formatting so the assertion holds in any timezone.
    const expectedDate = new Date(accessEndsAt).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    mockStatus({ purchaseType: "one_time", accessEndsAt, daysRemaining: 30 });

    render(<BillingSettingsSection />);

    await waitFor(() => {
      expect(screen.getByText(/Pay-once access · 30 days left/)).toBeTruthy();
    });
    expect(
      screen.getByText(new RegExp(`Access ends ${expectedDate} and will not renew`))
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Buy more time" })).toBeTruthy();

    // Nothing renews, so there is no plan change to schedule and nothing to cancel.
    expect(screen.queryByText("Change plan")).toBeNull();
    expect(screen.queryByText("Schedule plan change")).toBeNull();
    expect(screen.queryByText("Cancel or manage billing")).toBeNull();
  });

  it("keeps a lapsed pass in pay-once mode instead of offering a subscription", async () => {
    mockStatus({
      hasAccess: false,
      status: "inactive",
      purchaseType: "one_time",
      accessEndsAt: "2026-01-01T00:00:00.000Z",
      needsPaymentMethod: true,
    });

    render(<BillingSettingsSection />);

    await waitFor(() => {
      expect(screen.getByText(/Your pay-once pass has ended/)).toBeTruthy();
    });
    const cta = screen.getByRole("link", { name: "Buy another pass" });
    expect(cta.getAttribute("href")).toContain("mode=manual");
    expect(screen.queryByText("Reactivate subscription")).toBeNull();
  });

  it("still shows the plan switcher for a recurring subscriber", async () => {
    mockStatus({ hasStripeSubscription: true });

    render(<BillingSettingsSection />);

    await waitFor(() => {
      expect(screen.getByText("Active subscription")).toBeTruthy();
    });
    expect(screen.getByText("Change plan")).toBeTruthy();
    expect(screen.getByText("Cancel or manage billing")).toBeTruthy();
    expect(screen.queryByText(/Pay-once access/)).toBeNull();
  });
});
