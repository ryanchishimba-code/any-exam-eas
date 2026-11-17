import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DashboardUpgradeBanner } from "@/components/dashboard/DashboardUpgradeBanner";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { TRIAL_UPGRADE_OFFER_PERCENT } from "@/lib/billing/trial-upgrade-offer";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import { applyDiscount } from "@/lib/promo-pricing";
import type { StudyUsageSnapshot } from "@/lib/study/usage-limits";

const usage: StudyUsageSnapshot = {
  plan: "free",
  usedToday: 0,
  remainingToday: null,
  limits: {
    dailyQuestions: null,
    trialLifetimeQuestions: TRIAL_LIFETIME_QUESTIONS,
    maxPerSession: null,
    maxTimedExamLength: null,
    allowPresetExams: true,
    allowShortMocks: true,
    allowFullLengthMocks: true,
    trialMockAllowance: null,
    trialFullAdaptiveAllowance: 1,
    allowAdaptive: true,
  },
  usedTrialTotal: 12,
  remainingTrialTotal: 0,
  mockExamsThisMonth: 0,
  usedTrialMocks: null,
  remainingTrialMocks: null,
  usedTrialFullAdaptive: 0,
  remainingTrialFullAdaptive: 0,
};

const free = {
  variant: "free" as const,
  daysRemaining: 0,
  usage,
};

describe("DashboardUpgradeBanner trial-end offer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the selected exam, makes no pass promise, and links the offer", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-16T14:25:00.000Z"));
    render(
      <DashboardUpgradeBanner
        {...free}
        trialEndOffer={{
          token: "tok_live",
          boardName: "NCLEX-RN",
          expiresAt: "2026-11-17T13:39:00.000Z",
        }}
      />
    );

    const monthly = formatPlanUsd(PRO_MONTHLY_PRICE_USD);
    const first = formatPlanUsd(applyDiscount(PRO_MONTHLY_PRICE_USD, TRIAL_UPGRADE_OFFER_PERCENT));
    const link = screen.getByRole("link", { name: "Claim your gift" });
    const section = link.closest("section");
    const text = section?.textContent ?? "";
    expect(screen.getByRole("heading", { name: /25% off your first month/i })).toBeTruthy();
    expect(text).toContain(
      "Thanks for practicing NCLEX-RN with us. This gift is yours for the next 48 hours."
    );
    expect(text.match(/25%/g)).toHaveLength(1);
    expect(text).toContain("Ends in 23h 14m");
    expect(text).not.toMatch(/UTC/);
    expect(text).toContain(`first month, then ${monthly}/mo`);
    expect(screen.getByText(monthly).className).toContain("line-through");
    expect(text).toContain(first);
    expect(first).not.toBe(monthly);
    expect(text).not.toMatch(/\b(USMLE|NAPLEX|PANCE|FNP|NPTE)\b/);
    expect(text).not.toMatch(/\bpass(?:ed|ing)?\b|\bscore\b|\bresult/i);
    expect(link.getAttribute("href")).toBe("/upgrade?offer=tok_live");

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(section?.textContent).toContain("Ends in 23h 13m");
  });

  it("counts the last hour in minutes only", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-17T12:57:00.000Z"));
    render(
      <DashboardUpgradeBanner
        {...free}
        trialEndOffer={{
          token: "tok_live",
          boardName: "NCLEX-RN",
          expiresAt: "2026-11-17T13:39:00.000Z",
        }}
      />
    );
    expect(screen.getByText("Ends in 42m")).toBeTruthy();
    expect(screen.getByText("Ends in 42m").textContent).not.toMatch(/h/);
  });

  it("keeps the post-trial Subscribe banner when no offer is present", () => {
    render(<DashboardUpgradeBanner {...free} />);
    expect(screen.getByText("Subscribe to unlock study tools")).toBeTruthy();
    expect(screen.queryByText("A gift for you")).toBeNull();
    expect(screen.queryByText("25% off your first month")).toBeNull();
    expect(screen.queryByRole("link", { name: "Claim your gift" })).toBeNull();
    const link = screen.getByRole("link", { name: "Subscribe" });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("/checkout?");
    expect(href).toContain("reactivate=1");
    expect(href).not.toContain("offer=");
    expect(link.className).toContain("rounded-xl");
  });

  it("leaves the trial banner unchanged when an offer is passed", () => {
    render(
      <DashboardUpgradeBanner
        variant="trial"
        daysRemaining={2}
        usage={{ ...usage, plan: "trial", remainingTrialTotal: 40 }}
        trialEndOffer={{
          token: "tok_live",
          boardName: "NCLEX-RN",
        }}
      />
    );
    expect(screen.getByRole("link", { name: "Upgrade" }).getAttribute("href")).not.toContain(
      "offer="
    );
    expect(screen.queryByText("Claim your gift")).toBeNull();
    expect(screen.queryByText("A gift for you")).toBeNull();
    expect(screen.getByText(/2 days left/)).toBeTruthy();
  });
});
