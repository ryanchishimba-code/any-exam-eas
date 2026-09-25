/**
 * First-paint text on the dashboard must match the server HTML.
 * Production logged two React #418 text mismatches (args[]=text) on reload.
 *
 *   npx vitest run --project component tests/unit/components/DashboardHydration.test.tsx
 */
import { act, type ReactElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSession } from "next-auth/react";
import { DashboardExamCountdown } from "@/components/dashboard/DashboardExamCountdown";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GlobalExamSwitcher } from "@/components/navigation/GlobalExamSwitcher";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/client/use-app-preferences", () => ({
  useAppPreferences: () => ({
    examSlug: "nclex",
    mpjeStateCode: null,
    loading: false,
    refresh: vi.fn(),
    setExamSlug: vi.fn(),
  }),
}));

vi.mock("@/lib/edtech/actions", () => ({
  switchExamPreference: vi.fn(async () => ({ ok: true })),
}));

const mockedUseSession = vi.mocked(useSession);

function hydrate(node: ReactElement) {
  const errors: string[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  });
  const html = renderToString(node);
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  act(() => {
    hydrateRoot(container, node);
  });
  spy.mockRestore();
  container.remove();
  return { html, errors: errors.join("\n") };
}

beforeEach(() => {
  mockedUseSession.mockReturnValue({
    data: {
      user: { name: "Ryan Chishimba", email: "ryan@example.com" },
      expires: "2099-01-01",
    },
    status: "authenticated",
    update: vi.fn(),
  });
});

describe("dashboard first-paint text", () => {
  it("hydrates the exam-day title from a timezone-stable calendar string", () => {
    const { html, errors } = hydrate(
      <DashboardExamCountdown examSlug="nclex" examName="NCLEX-RN" testDate="2026-10-15" />
    );
    expect(html).toContain("Thursday, October 15, 2026");
    expect(html).not.toContain("days to go");
    expect(errors).not.toMatch(/418|did not match|Hydration failed/i);
  });

  it("hydrates attempt counts with ASCII commas", () => {
    const { html, errors } = hydrate(
      <DashboardHeader
        examName="NCLEX-RN"
        userName="Ryan Chishimba"
        streakDays={3}
        dueCount={2}
        boardAttempts={1234567}
      />
    );
    expect(html).toContain("Hi, Ryan");
    expect(html).toContain("1,234,567");
    expect(errors).not.toMatch(/418|did not match|Hydration failed/i);
  });

  it("does not paint the exam name or account name before mount", () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const html = renderToString(
      <QueryClientProvider client={client}>
        <GlobalExamSwitcher variant="nav" />
      </QueryClientProvider>
    );
    expect(html).not.toContain("NCLEX");
    expect(html).not.toContain("Ryan");
    expect(html).not.toContain("Select exam");
  });
});
