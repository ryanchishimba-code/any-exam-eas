import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FinishLineBadge } from "@/components/marketing/FinishLineBadge";
import { FINISH_LINE_HERO_LINE } from "@/lib/marketing/finish-line-offer";

describe("FinishLineBadge", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders nothing when the flag is off", () => {
    vi.stubEnv("OFFER_FINISH_LINE_ENABLED", "false");
    const { container } = render(<FinishLineBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders headline, fine print, and terms link when the flag is on", () => {
    vi.stubEnv("OFFER_FINISH_LINE_ENABLED", "true");
    render(<FinishLineBadge />);
    expect(screen.getByText(FINISH_LINE_HERO_LINE)).toBeInTheDocument();
    expect(screen.getByText(/Meet every condition/i)).toBeInTheDocument();
    const terms = screen.getByRole("link", { name: "See terms" });
    expect(terms).toHaveAttribute("href", "/finish-line-refund-terms");
  });
});
