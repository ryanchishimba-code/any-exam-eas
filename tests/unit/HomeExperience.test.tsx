import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HomeExperience } from "@/components/home/HomeExperience";
import { LANDING_FALLBACK_BANK_COUNTS } from "@/lib/marketing/landing-fallback-counts";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("@/lib/client/use-user-access", () => ({
  useUserAccess: vi.fn(),
}));

vi.mock("@/lib/client/use-landing-bank-counts", () => ({
  useLandingBankCounts: (initial: unknown) => initial,
}));

vi.mock("@/components/landing/v2/LandingFlagshipV2", () => ({
  LandingFlagshipV2: () => (
    <div data-testid="marketing-landing">Pass Your NCLEX marketing landing</div>
  ),
}));

vi.mock("@/components/home/SubscriberHome", () => ({
  SubscriberHome: () => <div data-testid="subscriber-home">Ready to study?</div>,
}));

vi.mock("@/components/Hero", () => ({
  Hero: () => <h1>Keep going, Test.</h1>,
}));

vi.mock("@/components/landing/v2/LandingHeroSkeleton", () => ({
  LandingHeroSkeleton: () => (
    <section>
      <h1>Pass Your NCLEX, NAPLEX and USMLE With High-Quality Board-Style Questions</h1>
    </section>
  ),
}));

import { useSession } from "next-auth/react";
import { useUserAccess } from "@/lib/client/use-user-access";

describe("HomeExperience landing views", () => {
  it("shows marketing landing for guests", () => {
    vi.mocked(useSession).mockReturnValue({
      status: "unauthenticated",
      data: null,
      update: vi.fn(),
    } as never);
    vi.mocked(useUserAccess).mockReturnValue({
      loading: false,
      hasPremiumAccess: false,
      hasAppAccess: false,
      hasStudyAccess: false,
      hasFreeTierAccess: false,
      status: null,
      role: null,
    });

    render(<HomeExperience bankCounts={LANDING_FALLBACK_BANK_COUNTS} />);
    expect(screen.getByTestId("marketing-landing")).toBeInTheDocument();
    expect(screen.queryByText("Keep going, Test.")).not.toBeInTheDocument();
  });

  it("does not flash subscriber hero for unpaid authenticated users", () => {
    vi.mocked(useSession).mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test Unpaid", email: "test-unpaid@anyexameasy.test" } },
      update: vi.fn(),
    } as never);
    vi.mocked(useUserAccess).mockReturnValue({
      loading: true,
      hasPremiumAccess: false,
      hasAppAccess: false,
      hasStudyAccess: false,
      hasFreeTierAccess: false,
      status: null,
      role: null,
    });

    const { rerender } = render(
      <HomeExperience bankCounts={LANDING_FALLBACK_BANK_COUNTS} />
    );
    expect(screen.queryByText("Keep going, Test.")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Pass Your NCLEX/i })).toBeInTheDocument();

    vi.mocked(useUserAccess).mockReturnValue({
      loading: false,
      hasPremiumAccess: false,
      hasAppAccess: false,
      hasStudyAccess: false,
      hasFreeTierAccess: false,
      status: "none",
      role: "expired",
    });
    rerender(<HomeExperience bankCounts={LANDING_FALLBACK_BANK_COUNTS} />);

    expect(screen.getByTestId("marketing-landing")).toBeInTheDocument();
    expect(screen.queryByText("Keep going, Test.")).not.toBeInTheDocument();
  });

  it("shows subscriber home only when premium is confirmed", async () => {
    vi.mocked(useSession).mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test Premium" } },
      update: vi.fn(),
    } as never);
    vi.mocked(useUserAccess).mockReturnValue({
      loading: false,
      hasPremiumAccess: true,
      hasAppAccess: true,
      hasStudyAccess: true,
      hasFreeTierAccess: false,
      status: "active",
      role: "user",
    });

    render(<HomeExperience bankCounts={LANDING_FALLBACK_BANK_COUNTS} />);
    expect(screen.getByText("Keep going, Test.")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("subscriber-home")).toBeInTheDocument();
    });
  });
});
