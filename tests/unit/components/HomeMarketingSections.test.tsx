import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeCompare } from "@/components/marketing/elevation/HomeCompare";
import { HomeQuickBites } from "@/components/marketing/elevation/HomeQuickBites";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { HOME_COMPARE_OTHER } from "@/lib/marketing/home-compare";
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

  it("renders a two-column checklist and omits a count the live display does not have", () => {
    render(
      <HomeCompare
        exams={[
          { slug: "nclex", countLabel: "5,483" },
          { slug: "naplex", countLabel: "1" },
        ]}
        ngnCaseStudies
      />
    );

    expect(
      screen.getByRole("heading", { name: "AnyExamEasy vs. typical prep sites" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AnyExamEasy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Typical prep sites" })).toBeInTheDocument();
    expect(screen.getByText(HOME_COMPARE_OTHER)).toBeInTheDocument();
    expect(screen.getByText("NCLEX · 5,483 questions")).toBeInTheDocument();
    expect(screen.getByText("NAPLEX · 1 question")).toBeInTheDocument();
    expect(screen.getByText("USMLE")).toBeInTheDocument();
    expect(screen.getByText("NGN case studies")).toBeInTheDocument();
    expect(screen.getByText("NCLEX exam mode")).toBeInTheDocument();
    expect(screen.getByText("Guideline-checked explanations with sources")).toBeInTheDocument();
    expect(screen.getByText("Quick Bites videos")).toBeInTheDocument();
    expect(screen.getByText("Practice readiness")).toBeInTheDocument();
    expect(screen.getByText("Question of the Day")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "See plans" })).toBeNull();
  });

  it("places both sections on the public home page for logged-out visitors", () => {
    const { container } = render(<PublicHome exams={[{ slug: "nclex", countLabel: "5,483" }]} ngnCaseStudies />);
    expect(screen.getByRole("heading", { name: "Quick Bites" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AnyExamEasy vs. typical prep sites" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /free trial/i }).length).toBeGreaterThan(0);
    expect(container.querySelector("#quick-bites-heading")).toBeTruthy();
    expect(container.innerHTML).not.toMatch(MEDIA_URL);
  });
});
