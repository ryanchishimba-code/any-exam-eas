/**
 * F1 — a cross-board study-guide deep link must not split nav.
 *
 * Saved exam stays NCLEX. The NAPLEX book shows a switch banner. Header chip,
 * sidebar, and mobile bottom bar all keep NCLEX destinations in the same render.
 *
 *   npx vitest run --project component tests/unit/components/NavExamConsistency.test.tsx
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "next-auth/react";

const mockPathname = vi.fn(() => "/naplex/study-guide/front-matter");
const mockRefresh = vi.fn();
const mockPrefetch = vi.fn();
const mockSetExamSlug = vi.fn();
const mockSwitch = vi.fn(async () => ({ ok: true, examSlug: "naplex" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: mockRefresh,
    prefetch: mockPrefetch,
  }),
}));

vi.mock("@/lib/client/use-app-preferences", () => ({
  useAppPreferences: () => ({
    examSlug: "nclex",
    mpjeStateCode: null,
    loading: false,
    refresh: vi.fn(),
    setExamSlug: mockSetExamSlug,
  }),
}));

vi.mock("@/lib/client/use-user-access", () => ({
  useUserAccess: () => ({
    hasStudyAccess: true,
    hasFreeTierAccess: false,
    loading: false,
  }),
}));

vi.mock("@/lib/edtech/actions", () => ({
  switchExamPreference: (...args: unknown[]) => mockSwitch(...args),
}));

vi.mock("@/components/brand/BrandLogo", () => ({
  BrandLogo: () => <span>AnyExamEasy</span>,
}));

vi.mock("@/components/app/SubscribeToContinueHint", () => ({
  SubscribeToContinueHint: () => null,
}));

import { AppSidebar } from "@/components/app/AppSidebar";
import { MobileBottomNav } from "@/components/app/MobileBottomNav";
import { CrossBoardStudyGuideBanner } from "@/components/nclex-study-guide/CrossBoardStudyGuideBanner";

const mockedUseSession = vi.mocked(useSession);

function renderNav() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AppSidebar embedded />
      <MobileBottomNav />
      <CrossBoardStudyGuideBanner guideExam="naplex" />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPathname.mockReturnValue("/naplex/study-guide/front-matter");
  mockedUseSession.mockReturnValue({
    data: { user: { name: "Ryan" }, expires: "2099-01-01" },
    status: "authenticated",
    update: vi.fn(),
  });
});

describe("nav after a cross-board study-guide deep link", () => {
  it("keeps every board-specific link on the saved exam and offers a switch", () => {
    renderNav();

    const chip = screen.getByRole("link", { name: /current exam: nclex-rn/i });
    expect(chip).toHaveTextContent("NCLEX-RN");
    expect(screen.queryByRole("link", { name: /current exam: naplex/i })).not.toBeInTheDocument();

    const banks = screen.getAllByRole("link", { name: /question bank/i });
    expect(banks.length).toBeGreaterThanOrEqual(2);
    for (const link of banks) {
      expect(link.getAttribute("href")).toContain("field=nursing");
      expect(link.getAttribute("href")).not.toContain("pharmacy");
      expect(link.getAttribute("href")).not.toContain("naplex");
    }

    const exams = screen.getAllByRole("link", { name: /full exam/i });
    expect(exams.length).toBeGreaterThanOrEqual(2);
    for (const link of exams) {
      expect(link).toHaveAttribute("href", "/full-exam/nclex");
    }

    const guide = screen.getByRole("link", { name: /study guide/i });
    expect(guide).toHaveAttribute("href", "/nclex/study-guide");

    expect(screen.getByRole("status")).toHaveTextContent(
      "You're viewing the NAPLEX guide. Switch to NAPLEX?"
    );
  });

  it("switches the saved exam from the banner without leaving the book", async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole("button", { name: "Switch" }));

    expect(mockSetExamSlug).toHaveBeenCalledWith("naplex");
    await waitFor(() => {
      expect(mockSwitch).toHaveBeenCalledWith("naplex");
    });
    expect(mockRefresh).toHaveBeenCalled();
  });
});
