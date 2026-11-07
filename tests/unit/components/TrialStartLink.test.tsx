import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TrialStartLink } from "@/components/marketing/TrialStartLink";

const session = vi.hoisted(() => ({ status: "unauthenticated" as "unauthenticated" | "authenticated" }));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ status: session.status, data: null }),
}));

const HREF = "/signup?plan=trial&interval=monthly&tier=pro";

describe("TrialStartLink", () => {
  afterEach(() => {
    session.status = "unauthenticated";
    vi.useRealTimers();
  });

  it("keeps a signed-out trial CTA on signup and shows a loading state before navigation", () => {
    const assign = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      assign,
    } as Location);
    const original = window.location.assign.bind(window.location);
    Object.defineProperty(window.location, "assign", { configurable: true, value: assign });

    vi.useFakeTimers();
    render(
      <TrialStartLink className="fp-cta" href={HREF}>
        Start free trial, no card required
      </TrialStartLink>
    );

    const link = screen.getByRole("link", { name: /start free trial, no card required/i });
    expect(link).toHaveAttribute("href", HREF);
    expect(link.getAttribute("href")).not.toContain("/checkout");

    fireEvent.click(link);

    const pending = screen.getByRole("link", { name: /starting your free trial/i });
    expect(pending).toHaveAttribute("aria-busy", "true");
    expect(pending).toHaveAttribute("data-loading", "true");
    expect(assign).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(assign).toHaveBeenCalledWith(HREF);

    Object.defineProperty(window.location, "assign", { configurable: true, value: original });
  });

  it("tells a signed-in visitor the click opens the dashboard, not checkout", () => {
    session.status = "authenticated";
    vi.useFakeTimers();
    const assign = vi.fn();
    Object.defineProperty(window.location, "assign", { configurable: true, value: assign });

    render(
      <TrialStartLink href={HREF}>
        Start free trial, no card required
      </TrialStartLink>
    );

    fireEvent.click(screen.getByRole("link", { name: /start free trial, no card required/i }));
    expect(screen.getByRole("link", { name: /opening your dashboard/i })).toHaveAttribute("href", HREF);
    expect(screen.getByRole("link", { name: /opening your dashboard/i }).getAttribute("href")).not.toContain(
      "plan=subscribe"
    );
  });
});
