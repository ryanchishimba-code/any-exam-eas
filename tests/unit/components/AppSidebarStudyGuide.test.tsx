/**
 * AppSidebar — Study Tools entry for the study guide.
 *
 * The guide shipped for NCLEX first and was gated by a boolean `nclexOnly`
 * flag. When the NAPLEX book launched, a NAPLEX learner saw no Study Guide in
 * Study Tools at all. These tests pin the per-exam behaviour so the next book
 * cannot repeat it.
 *
 *   npx vitest run --project component tests/unit/components/AppSidebarStudyGuide.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPreferences = vi.fn();
const mockAccess = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("@/lib/client/use-app-preferences", () => ({
  useAppPreferences: () => mockPreferences(),
}));

vi.mock("@/lib/client/use-user-access", () => ({
  useUserAccess: () => mockAccess(),
}));

// Pulls in the session/exam switcher tree, which is irrelevant to nav filtering.
vi.mock("@/components/navigation/GlobalExamSwitcher", () => ({
  GlobalExamSwitcher: () => null,
}));

vi.mock("@/components/brand/BrandLogo", () => ({
  BrandLogo: () => null,
}));

vi.mock("@/components/app/SubscribeToContinueHint", () => ({
  SubscribeToContinueHint: () => null,
}));

import { AppSidebar } from "@/components/app/AppSidebar";

beforeEach(() => {
  vi.clearAllMocks();
  mockAccess.mockReturnValue({
    hasStudyAccess: true,
    hasFreeTierAccess: false,
    loading: false,
  });
});

const renderFor = (examSlug: string | null) => {
  mockPreferences.mockReturnValue({ examSlug });
  return render(<AppSidebar />);
};

const studyGuideLink = () =>
  screen.queryByRole("link", { name: /study guide/i });

describe("Study Guide in Study Tools", () => {
  it("shows for a NAPLEX learner and points at the NAPLEX book", () => {
    renderFor("naplex");
    const link = studyGuideLink();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/naplex/study-guide");
  });

  it("still shows for an NCLEX learner and points at the NCLEX book", () => {
    renderFor("nclex");
    const link = studyGuideLink();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/nclex/study-guide");
  });

  it("stays under the Study Tools heading", () => {
    renderFor("naplex");
    expect(screen.getByText(/study tools/i)).toBeInTheDocument();
  });

  it("hides for an exam with no book", () => {
    // Linking here would open a reader with nothing to read.
    renderFor("usmle");
    expect(studyGuideLink()).not.toBeInTheDocument();
  });

  it("hides until the exam resolves, rather than guessing NCLEX", () => {
    renderFor(null);
    expect(studyGuideLink()).not.toBeInTheDocument();
  });
});
