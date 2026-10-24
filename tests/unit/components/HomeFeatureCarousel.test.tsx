import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeFeatureCarousel } from "@/components/marketing/elevation/HomeFeatureCarousel";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";

const SAMPLE: BoardFeatureCard[] = [
  {
    id: "a",
    title: "Six boards, one plan",
    line: "All boards on Pro.",
    icon: "adaptive",
    spotlight: true,
  },
  {
    id: "b",
    title: "Mobile-friendly",
    line: "Study on your phone.",
    icon: "mobile",
  },
];

beforeEach(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("HomeFeatureCarousel", () => {
  it("renders crawlable feature copy in server HTML", () => {
    render(<HomeFeatureCarousel cards={SAMPLE} />);
    expect(screen.getByRole("heading", { name: "Features" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Six boards, one plan" })).toBeInTheDocument();
    expect(screen.getByText("All boards on Pro.")).toBeInTheDocument();
    expect(screen.getByText("Study on your phone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous feature" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next feature" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Feature 1 of 2" })).toBeInTheDocument();
  });
});
