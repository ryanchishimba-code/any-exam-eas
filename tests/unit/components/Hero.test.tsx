import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useSession } from "next-auth/react";
import { Hero } from "@/components/Hero";
import * as returningUser from "@/lib/client/returning-user";

vi.mock("@/lib/client/returning-user", () => ({
  firstName: (name?: string | null, email?: string) =>
    name?.split(" ")[0] ?? email?.split("@")[0] ?? "there",
  loadReturningUserHint: vi.fn(() => null),
  touchReturningVisit: vi.fn(),
}));

vi.mock("@/components/auth/LoginModalTrigger", () => ({
  LoginModalTrigger: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button type="button" className={className}>
      {children}
    </button>
  ),
}));

const mockedUseSession = vi.mocked(useSession);
const mockedLoadHint = vi.mocked(returningUser.loadReturningUserHint);

describe("Hero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedLoadHint.mockReturnValue(null);
  });

  it("renders guest headline and trial CTA for unauthenticated visitors", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });

    render(<Hero compareLayout />);

    expect(
      screen.getByRole("heading", {
        name: /pass your boards with confidence/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start.*trial/i })).toHaveAttribute(
      "href",
      "/signup?plan=trial&interval=yearly"
    );
    expect(screen.getByRole("link", { name: /try free nclex demo/i })).toHaveAttribute(
      "href",
      "#ngn-demo"
    );
  });

  it("shows Study Hub CTA when authenticated", () => {
    mockedUseSession.mockReturnValue({
      data: {
        user: { name: "Alex Student", email: "alex@example.com" },
        expires: "2099-01-01",
      },
      status: "authenticated",
      update: vi.fn(),
    });

    render(<Hero compareLayout />);

    expect(screen.getByRole("heading", { name: /keep going,\s*alex\./i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open study hub/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.queryByRole("link", { name: /start.*trial/i })).not.toBeInTheDocument();
  });

  it("welcomes returning visitors with login CTA", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });
    mockedLoadHint.mockReturnValue({
      email: "returning@example.com",
      name: "Jordan Lee",
      lastMethod: "email",
      lastVisitAt: new Date().toISOString(),
    });

    render(<Hero compareLayout />);

    expect(
      screen.getByRole("heading", { name: /welcome back,\s*jordan\./i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in to study hub/i })).toBeInTheDocument();
  });

  it("exposes an accessible landmark with labelled heading", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });

    render(<Hero compareLayout />);

    const region = screen.getByRole("region", { name: /pass your boards with confidence/i });
    expect(region).toHaveAttribute("aria-labelledby", "hero-heading");
  });
});
