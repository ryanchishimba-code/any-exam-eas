import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TrialWelcomeScreen } from "@/components/auth/TrialWelcomeScreen";

vi.mock("@/lib/client/use-app-preferences", () => ({
  useAppPreferences: () => ({ examSlug: "nclex", loading: false }),
}));

vi.mock("@/lib/client/use-user-access", () => ({
  useUserAccess: () => ({
    hasStudyAccess: true,
    hasFreeTierAccess: false,
    loading: false,
  }),
}));

describe("TrialWelcomeScreen trial length", () => {
  it("day 1 of 5 does not say halfway and uses the approved offer", () => {
    render(<TrialWelcomeScreen daysRemaining={5} trialDays={5} onDismiss={() => {}} />);
    expect(screen.getByTestId("trial-urgency")).toHaveTextContent("Day 1 of 5 · full access");
    expect(screen.getByTestId("trial-day-caption")).toHaveTextContent("Day 1 of 5");
    expect(screen.getByTestId("trial-offer")).toHaveTextContent(
      "5-day free trial · no payment method required · then $27.99/mo"
    );
    expect(screen.queryByText(/halfway/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/% off/i)).not.toBeInTheDocument();
  });

  it("day 3 of 5 is halfway", () => {
    render(<TrialWelcomeScreen daysRemaining={3} trialDays={5} onDismiss={() => {}} />);
    expect(screen.getByTestId("trial-urgency")).toHaveTextContent(
      "You're halfway through — keep the momentum."
    );
    expect(screen.getByTestId("trial-day-caption")).toHaveTextContent("Day 3 of 5");
  });

  it("day 5 names the monthly price and not a percent off", () => {
    render(<TrialWelcomeScreen daysRemaining={1} trialDays={5} onDismiss={() => {}} />);
    expect(screen.getByTestId("trial-urgency")).toHaveTextContent(
      "Last day of your trial — then $27.99/mo"
    );
    expect(screen.getByTestId("trial-day-caption")).toHaveTextContent("Day 5 of 5");
    expect(screen.queryByText(/% off/i)).not.toBeInTheDocument();
  });

  it("defaults to the 5-day plan instead of 14", () => {
    render(<TrialWelcomeScreen daysRemaining={5} onDismiss={() => {}} />);
    expect(screen.getByTestId("trial-day-caption")).toHaveTextContent("Day 1 of 5");
    expect(screen.queryByText(/of 14/)).not.toBeInTheDocument();
  });
});
