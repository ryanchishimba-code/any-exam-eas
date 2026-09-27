import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PublicFoldOffer } from "@/components/marketing/PublicFoldOffer";

const pathname = vi.hoisted(() => ({ current: "/about" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

describe("PublicFoldOffer", () => {
  beforeEach(() => {
    pathname.current = "/about";
  });

  it("puts one trial CTA on a plain public page without repeating the offer line", () => {
    render(<PublicFoldOffer />);
    expect(
      screen.queryByText("5-day free trial · no payment method required · then $27.99/mo")
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start your free trial/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/signup?plan=trial")
    );
    expect(screen.queryByText(/% off|save \d+%/i)).not.toBeInTheDocument();
  });

  it("stays off pages that already open with the hero or the pricing fold", () => {
    for (const path of ["/", "/nclex", "/pricing", "/naplex"]) {
      pathname.current = path;
      const { container, unmount } = render(<PublicFoldOffer />);
      expect(container).toBeEmptyDOMElement();
      unmount();
    }
  });
});
