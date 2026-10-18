import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeCompare } from "@/components/marketing/elevation/HomeCompare";
import { HomeQuickBites } from "@/components/marketing/elevation/HomeQuickBites";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { homeCompareRows } from "@/lib/marketing/home-compare";
import { homeQuickBiteSamples } from "@/lib/marketing/home-quick-bites";
import { ROUTES } from "@/lib/routes";

const MEDIA_FILE = /\.mp4|\.vtt|blob\.vercel-storage/i;

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
  it("shows one sample poster per track and loads video only after play", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          videoUrl: `https://iiuq2awk7g8oulze.private.blob.vercel-storage.com/${url}.mp4?vercel-blob-signature=test`,
          captionsUrl: `${url}?part=captions`,
        }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);
    HTMLMediaElement.prototype.play = () => Promise.resolve();

    const { container } = render(<HomeQuickBites />);
    const samples = homeQuickBiteSamples();

    expect(screen.getByRole("heading", { name: "Quick Bites" })).toBeInTheDocument();
    expect(screen.getByText("Watch a sample.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get full access" })).toHaveAttribute("href", ROUTES.pricing);
    expect(screen.queryByText(/lessons/i)).toBeNull();
    expect(container.querySelector(".aee-flagship-cta")).toBeNull();
    expect(container.querySelector("video")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();

    for (const sample of samples) {
      const button = screen.getByRole("button", { name: `Play ${sample.episodeTitle}` });
      expect(button.querySelector("img")).toHaveAttribute("src", sample.jpg);
      expect(button.querySelector("source")).toHaveAttribute("srcset", sample.webp);
    }
    expect(container.innerHTML).not.toMatch(MEDIA_FILE);
    expect(container.innerHTML).not.toMatch(/\/api\/quick-bites/);

    await user.click(screen.getByRole("button", { name: "Play How the Nursing Boards Work" }));
    const video = await screen.findByLabelText("How the Nursing Boards Work video");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(samples[0]?.mediaUrl);
    expect(video).toHaveAttribute("preload", "none");
    expect(video.getAttribute("src")).toContain("vercel-blob-signature=");
    expect(screen.getByRole("button", { name: "Play Anticoagulants: Warfarin vs Heparins vs DOACs" })).toBeInTheDocument();
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
    expect(screen.queryByRole("link", { name: "Get full access" })).toBeNull();
  });

  it("places both sections on the public home page for logged-out visitors", () => {
    const { container } = render(<PublicHome ngnCaseStudies />);
    expect(screen.getByRole("heading", { name: "Quick Bites" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AnyExamEasy vs. typical prep sites" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /free trial/i }).length).toBeGreaterThan(0);
    expect(container.querySelector("#quick-bites-heading")).toBeTruthy();
    expect(container.querySelector(".aee-flagship-cta")).toBeTruthy();
    expect(container.querySelector("video")).toBeNull();
    expect(container.innerHTML).not.toMatch(MEDIA_FILE);
  });

  it("links each first-screen board tile to that board page", () => {
    render(<PublicHome />);
    const tiles = within(screen.getByRole("navigation", { name: "Board exams" }));
    const expected: [string, string][] = [
      ["NCLEX", "/nclex"],
      ["NAPLEX", "/naplex"],
      ["USMLE", "/usmle"],
      ["FNP", "/aanp-fnp"],
      ["PANCE", "/pance"],
      ["NPTE-PT", "/npte-pt"],
    ];
    for (const [name, href] of expected) {
      const link = tiles.getByRole("link", { name });
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", href);
    }
  });
});
