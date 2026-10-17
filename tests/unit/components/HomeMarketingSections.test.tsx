import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeCompare } from "@/components/marketing/elevation/HomeCompare";
import { HomeQuickBites } from "@/components/marketing/elevation/HomeQuickBites";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { homeCompareRows } from "@/lib/marketing/home-compare";
import { homeQuickBiteTracks } from "@/lib/marketing/home-quick-bites";
import { ROUTES } from "@/lib/routes";

const MEDIA_URL = /\.mp4|\.vtt|\/api\/quick-bites|blob\.vercel-storage/i;

beforeEach(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  window.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
});

describe("homepage marketing sections", () => {
  it("shows catalog posters and a secondary plans link, with no media URL", () => {
    const { container } = render(<HomeQuickBites />);
    const tracks = homeQuickBiteTracks();

    expect(screen.getByRole("heading", { name: "Quick Bites" })).toBeInTheDocument();
    expect(screen.getByText("Short animated lessons with quizzes. Premium.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See plans" })).toHaveAttribute("href", ROUTES.pricing);
    expect(container.querySelector(".aee-flagship-cta")).toBeNull();
    expect(container.querySelector("video")).toBeNull();

    for (const track of tracks) {
      expect(screen.getByText(track.countLabel)).toBeInTheDocument();
      for (const poster of track.posters) {
        const image = screen.getByRole("img", { name: poster.title });
        expect(image).toHaveAttribute("src", poster.jpg);
        expect(image).toHaveAttribute("loading", "lazy");
        expect(image.parentElement?.querySelector("source")).toHaveAttribute("srcset", poster.webp);
      }
    }

    expect(container.innerHTML).not.toMatch(MEDIA_URL);
  });

  it("renders a three-column table without per-board question counts", () => {
    render(<HomeCompare ngnCaseStudies />);
    const rows = homeCompareRows(true);

    expect(
      screen.getByRole("heading", { name: "AnyExamEasy vs. typical prep sites" })
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Feature" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "AnyExamEasy" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Typical prep sites" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1);
    for (const row of rows) {
      expect(screen.getByRole("rowheader", { name: new RegExp(row.feature) })).toBeInTheDocument();
    }
    expect(screen.getByText("Often one exam per subscription")).toBeInTheDocument();
    expect(screen.getByText("Not always shown")).toBeInTheDocument();
    expect(screen.getByText("Often a separate purchase")).toBeInTheDocument();
    expect(screen.getAllByText("Varies")).toHaveLength(3);
    expect(screen.getAllByText("Included")).toHaveLength(rows.length);
    expect(screen.queryByText(/questions/i)).toBeNull();
    expect(screen.queryByRole("link", { name: "See plans" })).toBeNull();
  });

  it("places both sections on the public home page for logged-out visitors", () => {
    const { container } = render(<PublicHome ngnCaseStudies />);
    expect(screen.getByRole("heading", { name: "Quick Bites" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AnyExamEasy vs. typical prep sites" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /free trial/i }).length).toBeGreaterThan(0);
    expect(container.querySelector("#quick-bites-heading")).toBeTruthy();
    expect(container.innerHTML).not.toMatch(MEDIA_URL);
  });
});
