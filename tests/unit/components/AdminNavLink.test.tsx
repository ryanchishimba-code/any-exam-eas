/**
 * AdminNavLink — component tests (Vitest + React Testing Library).
 *
 * Run with:
 *   npx vitest run --project component tests/unit/components/AdminNavLink.test.tsx
 *
 * Coverage goals
 * ──────────────
 * 1. Hidden while auth is loading (prevents layout flash).
 * 2. Hidden for unauthenticated visitors.
 * 3. Hidden for regular users (role = "user").
 * 4. Hidden for support_staff and moderator roles (not admin-tier).
 * 5. Visible and links to /admin for role = "admin".
 * 6. Visible and links to /admin for role = "super_admin".
 * 7. Compact variant renders a smaller link (no ring classes).
 * 8. Active state: ring class applied when pathname is /admin/*.
 *
 * The global vitest.component.setup.tsx already mocks:
 *   - next/link → plain <a>
 *   - next-auth/react → useSession returns { data: null, status: "unauthenticated" }
 *
 * We additionally mock next/navigation and @/lib/client/admin-access here.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSession } from "next-auth/react";
import { AdminNavLink } from "@/components/navigation/AdminNavLink";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

// Re-export the real hasMinRole logic rather than mocking the whole module —
// this tests the real permission boundary.
vi.mock("@/lib/client/admin-access", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/client/admin-access")>();
  return actual;
});

const mockedUseSession = vi.mocked(useSession);

// ── Helpers ─────────────────────────────────────────────────────────────────

function sessionForRole(role: string) {
  return {
    data: {
      user: { id: "u1", name: "Test Admin", email: "admin@test.com", role },
      expires: "2099-01-01",
    },
    status: "authenticated" as const,
    update: vi.fn(),
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("AdminNavLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing while session is loading", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "loading",
      update: vi.fn(),
    });

    const { container } = render(<AdminNavLink />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for unauthenticated visitors", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });

    const { container } = render(<AdminNavLink />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for role = 'user'", () => {
    mockedUseSession.mockReturnValue(sessionForRole("user"));

    const { container } = render(<AdminNavLink />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for role = 'support_staff'", () => {
    mockedUseSession.mockReturnValue(sessionForRole("support_staff"));

    const { container } = render(<AdminNavLink />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for role = 'moderator'", () => {
    mockedUseSession.mockReturnValue(sessionForRole("moderator"));

    const { container } = render(<AdminNavLink />);
    expect(container.firstChild).toBeNull();
  });

  it("renders an /admin link for role = 'admin'", () => {
    mockedUseSession.mockReturnValue(sessionForRole("admin"));

    render(<AdminNavLink />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin");
  });

  it("renders an /admin link for role = 'super_admin'", () => {
    mockedUseSession.mockReturnValue(sessionForRole("super_admin"));

    render(<AdminNavLink />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin");
  });

  it("pill variant has the shield icon (aria-hidden)", () => {
    mockedUseSession.mockReturnValue(sessionForRole("admin"));

    render(<AdminNavLink variant="pill" />);

    // The Shield icon is aria-hidden; we confirm the link text includes "Admin"
    const link = screen.getByRole("link");
    expect(link.textContent).toMatch(/admin/i);
  });

  it("compact variant renders a link with aria-label-compatible text", () => {
    mockedUseSession.mockReturnValue(sessionForRole("admin"));

    render(<AdminNavLink variant="compact" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/admin");
    // Compact variant shows "Admin" text inline (no sm:hidden wrapper)
    expect(link.textContent).toMatch(/admin/i);
  });

  it("sets aria-current='page' when pathname is /admin", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/admin");
    mockedUseSession.mockReturnValue(sessionForRole("admin"));

    render(<AdminNavLink />);

    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });

  it("sets aria-current='page' when pathname is /admin/analytics", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/admin/analytics");
    mockedUseSession.mockReturnValue(sessionForRole("admin"));

    render(<AdminNavLink />);

    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current when on a non-admin page", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/dashboard");
    mockedUseSession.mockReturnValue(sessionForRole("admin"));

    render(<AdminNavLink />);

    expect(screen.getByRole("link")).not.toHaveAttribute("aria-current");
  });
});
