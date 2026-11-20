import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrialUpgradeScreen } from "@/components/trial/TrialUpgradeScreen";
import { OFFER_PUBLIC_MESSAGE } from "@/lib/billing/trial-upgrade-offer";

const base = {
  examSlug: "nclex" as const,
  boardName: "NCLEX",
  questionsAnswered: 12,
  accuracyPct: 80,
  testimonial: null,
};

describe("TrialUpgradeScreen offer", () => {
  it("keeps the regular price when no offer is present", () => {
    render(<TrialUpgradeScreen {...base} />);
    expect(screen.getByRole("heading", { name: /keep studying for \$27\.99\/mo/i })).toBeTruthy();
    const link = screen.getByRole("link", { name: /continue to checkout — \$27\.99\/mo/i });
    expect(link.getAttribute("href")).not.toContain("offer=");
  });

  it("shows the discounted first month and carries a valid offer to checkout", () => {
    render(
      <TrialUpgradeScreen
        {...base}
        offer={{
          status: "valid",
          message: OFFER_PUBLIC_MESSAGE.valid,
          expiresAt: "2026-11-17T01:39:00.000Z",
          token: "tok_live",
          percentOff: 25,
        }}
      />
    );
    expect(screen.getByRole("heading", { name: /\$20\.99/i })).toBeTruthy();
    expect(screen.getByText(/25% off your first payment on any plan/i)).toBeTruthy();
    expect(screen.getByText(/then \$27\.99\/mo/i)).toBeTruthy();
    const link = screen.getByRole("link", { name: /\$20\.99 first month/i });
    expect(link.getAttribute("href")).toContain("offer=tok_live");
    expect(link.getAttribute("href")).toContain("plan=subscribe");
  });

  it("shows a polite note and the regular price when the offer has ended", () => {
    render(
      <TrialUpgradeScreen
        {...base}
        offer={{
          status: "expired",
          message: OFFER_PUBLIC_MESSAGE.expired,
          expiresAt: null,
          token: null,
          percentOff: null,
        }}
      />
    );
    expect(screen.getByText(OFFER_PUBLIC_MESSAGE.expired)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /keep studying for \$27\.99\/mo/i })).toBeTruthy();
    const link = screen.getByRole("link", { name: /continue to checkout — \$27\.99\/mo/i });
    expect(link.getAttribute("href")).not.toContain("offer=");
  });
});
