/**
 * Header board chip — the saved primary exam, including on another board's book.
 * A cross-board study guide explains itself with a banner, not by relabeling nav.
 *
 *   npx vitest run --project component tests/unit/components/GlobalExamSwitcher.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "next-auth/react";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";

const mockPathname = vi.fn(() => "/dashboard");
const mockPreferences = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/client/use-app-preferences", () => ({
  useAppPreferences: () => mockPreferences(),
}));

vi.mock("@/lib/edtech/actions", () => ({
  switchExamPreference: vi.fn(async () => ({ ok: true, examSlug: "naplex" })),
}));

const mockedUseSession = vi.mocked(useSession);

function renderChip(variant?: "nav" | "mobile") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <GlobalExamSwitcher variant={variant} />
    </QueryClientProvider>
  );
}

function signedInWith(examSlug: "nclex" | "naplex" | "aanp-fnp" | null, loading = false) {
  const setExamSlug = vi.fn();
  mockPreferences.mockReturnValue({
    examSlug,
    mpjeStateCode: null,
    loading,
    refresh: vi.fn(),
    setExamSlug,
  });
  return { setExamSlug };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPathname.mockReturnValue("/dashboard");
  mockedUseSession.mockReturnValue({
    data: {
      user: { name: "Ryan", email: "ryan@example.com" },
      expires: "2099-01-01",
    },
    status: "authenticated",
    update: vi.fn(),
  });
});

describe("GlobalExamSwitcher on study-guide routes", () => {
  it("keeps the saved NCLEX board on a NAPLEX study guide", () => {
    mockPathname.mockReturnValue("/naplex/study-guide/calculations");
    const { setExamSlug } = signedInWith("nclex");

    renderChip();

    const chip = screen.getByRole("link", { name: /current exam: nclex-rn/i });
    expect(chip).toHaveTextContent("NCLEX");
    expect(chip).not.toHaveTextContent("NAPLEX");
    expect(chip).toHaveAttribute("href", "/select-exam?switch=1");
    expect(setExamSlug).not.toHaveBeenCalled();
  });

  it("keeps the saved NCLEX board on an AANP FNP study guide", () => {
    mockPathname.mockReturnValue("/aanp-fnp/study-guide");
    signedInWith("nclex");

    renderChip();

    const chip = screen.getByRole("link", { name: /current exam: nclex-rn/i });
    expect(chip).toHaveTextContent("NCLEX");
    expect(chip).toHaveAttribute("href", "/select-exam?switch=1");
  });

  it("keeps the saved NAPLEX board on the NCLEX book", () => {
    mockPathname.mockReturnValue("/nclex/study-guide/cardiac");
    signedInWith("naplex");

    renderChip();

    expect(screen.getByRole("link", { name: /current exam: naplex/i })).toHaveTextContent(
      "NAPLEX"
    );
  });

  it("keeps the saved board in the mobile switcher as well", () => {
    mockPathname.mockReturnValue("/aanp-fnp/study-guide/cardiology");
    signedInWith("nclex");

    renderChip("mobile");

    expect(screen.getByRole("link", { name: /current exam: nclex-rn/i })).toHaveTextContent(
      "NCLEX-RN"
    );
  });

  it("keeps the saved board on dashboard and still opens the switch screen", () => {
    mockPathname.mockReturnValue("/dashboard");
    signedInWith("nclex");

    renderChip();

    const chip = screen.getByRole("link", { name: /current exam: nclex-rn/i });
    expect(chip).toHaveTextContent("NCLEX");
    expect(chip).toHaveAttribute("href", "/select-exam?switch=1");
  });

  it("keeps the saved board on the question bank", () => {
    mockPathname.mockReturnValue("/question-bank");
    signedInWith("naplex");

    renderChip();

    expect(screen.getByRole("link", { name: /current exam: naplex/i })).toHaveTextContent(
      "NAPLEX"
    );
  });
});
