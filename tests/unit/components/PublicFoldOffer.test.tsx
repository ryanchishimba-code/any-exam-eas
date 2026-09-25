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

  it("puts the exact offer line and one trial CTA on a plain public page", () => {
    render(<PublicFoldOffer />);
    expect(
      screen.getByText("5-day free trial · no payment method required · then $27.99/mo")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /try for free/i })).toHaveAttribute(
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
