import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
  it("uses the selected exam, makes no pass promise, and links the offer", () => {
    render(
      <DashboardUpgradeBanner
        {...free}
        trialEndOffer={{
          token: "tok_live",
          boardName: "USMLE Step 2 CK",
          deadlineLabel: "Nov 17, 1:39 AM UTC",
        }}
      />
    );

    const monthly = formatPlanUsd(PRO_MONTHLY_PRICE_USD);
    const first = formatPlanUsd(applyDiscount(PRO_MONTHLY_PRICE_USD, TRIAL_UPGRADE_OFFER_PERCENT));
    const link = screen.getByRole("link", { name: "Unwrap 25% off" });
    const section = link.closest("section");
    const text = section?.textContent ?? "";
    expect(screen.getByText("A gift for you")).toBeTruthy();
    expect(text).toContain("25% off");
    expect(text).toContain("your first payment");
    expect(text).toContain(
      "Your USMLE Step 2 CK trial has ended. As a thank-you for practicing, take 25% off your first payment if you upgrade in the next 48 hours."
    );
    expect(text).toContain(`Ends Nov 17, 1:39 AM UTC`);
    expect(text).toContain(`Then ${monthly}/mo.`);
    expect(screen.getByText(monthly).className).toContain("line-through");
    expect(text).toContain(first);
    expect(first).not.toBe(monthly);
    expect(text).not.toMatch(/\b(NCLEX|NAPLEX|PANCE|FNP|NPTE)\b/);
    expect(text).not.toMatch(/\bpass(?:ed|ing)?\b|\bscore\b|\bresult/i);
    expect(link.getAttribute("href")).toBe("/upgrade?offer=tok_live");
    expect(link.className).toContain("rounded-xl");
    expect(section?.className).toContain("rounded-2xl");
    expect(section?.className).toContain("border-");
  });

  it("keeps the post-trial Subscribe banner when no offer is present", () => {
    render(<DashboardUpgradeBanner {...free} />);
    expect(screen.getByText("Subscribe to unlock study tools")).toBeTruthy();
    expect(screen.queryByText("A gift for you")).toBeNull();
    expect(screen.queryByText("25% off")).toBeNull();
    expect(screen.queryByRole("link", { name: "Unwrap 25% off" })).toBeNull();
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
    expect(screen.queryByText("Unwrap 25% off")).toBeNull();
    expect(screen.queryByText("A gift for you")).toBeNull();
    expect(screen.getByText(/2 days left/)).toBeTruthy();
  });
});
