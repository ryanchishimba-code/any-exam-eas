/**
 * Hero MCQ sample must show real option text so paid-board landings
 * do not ship empty A/B/C/D buttons.
 *
 *   npx vitest run --project component tests/unit/components/LandingHeroSample.test.tsx
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/naplex",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/analytics", () => ({
  analytics: { ctaClicked: vi.fn() },
}));

import { LandingExamSelectionProvider } from "@/components/landing/v2/LandingExamSelectionContext";
import { LandingHeroPractice } from "@/components/landing/v2/LandingSamplePractice";

function renderBoard(exam: "naplex" | "aanp-fnp" | "usmle") {
  return render(
    <LandingExamSelectionProvider initialExam={exam}>
      <LandingHeroPractice />
    </LandingExamSelectionProvider>
  );
}

describe("LandingHeroPractice MCQ samples", () => {
  it("shows filled NAPLEX options and lets Check answer run", async () => {
    const user = userEvent.setup();
    renderBoard("naplex");
    expect(screen.getByText(/60 mL concentrate/i)).toBeInTheDocument();
    const check = screen.getByRole("button", { name: /check answer/i });
    expect(check).toBeDisabled();
    await user.click(screen.getByRole("option", { name: /60 mL concentrate/i }));
    expect(check).toBeEnabled();
    await user.click(check);
    expect(screen.getByText(/alligation/i)).toBeInTheDocument();
  });

  it("shows filled USMLE and AANP options", () => {
    const { unmount } = renderBoard("usmle");
    expect(screen.getByText(/Activate PCI/i)).toBeInTheDocument();
    unmount();
    renderBoard("aanp-fnp");
    expect(screen.getByText(/GLP-1 receptor agonist/i)).toBeInTheDocument();
  });
});
