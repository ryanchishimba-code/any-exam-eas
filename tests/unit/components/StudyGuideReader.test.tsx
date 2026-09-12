/**
 * StudyGuideReader — render smoke tests (Vitest + React Testing Library).
 *
 * Run with:
 *   npx vitest run --project component tests/unit/components/StudyGuideReader.test.tsx
 *
 * Why this file exists
 * ────────────────────
 * The reader shipped once with a hook declared below the effect that named it
 * in a dependency array. Dependency arrays are evaluated during render, so the
 * `const` was in the temporal dead zone and the component threw
 * `ReferenceError: Cannot access 'paintProgress' before initialization` on
 * every render — taking the whole book down behind the route group's error
 * boundary. `tsc` did not flag it and there was no render coverage to catch it.
 *
 * So the bar here is deliberately low and broad: mount the reader and assert it
 * renders. Any hook-ordering or declaration-order regression fails loudly.
 */

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import type { SgChapterDto, SgTocChapter } from "@/lib/nclex-study-guide/types";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/nclex/study-guide/cardiac"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() })),
}));

const CHAPTERS: SgTocChapter[] = [
  { id: "c1", slug: "cardiac", title: "Cardiac", sectionLabel: "Med-Surg", sortOrder: 1 },
  { id: "c2", slug: "respiratory", title: "Respiratory", sectionLabel: "Med-Surg", sortOrder: 2 },
];

function makeChapter(overrides: Partial<SgChapterDto> = {}): SgChapterDto {
  return {
    ...CHAPTERS[0]!,
    guideId: "g1",
    bodyHtml: '<h2 id="h">Preload</h2><p>Afterload is resistance.</p>',
    prevSlug: null,
    nextSlug: "respiratory",
    relatedTopics: [],
    ...overrides,
  };
}

beforeEach(() => {
  // jsdom implements neither, and the reader calls both while restoring
  // position and keeping the active TOC entry in view.
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn();

  // The reader fetches highlights, bookmarks, and notes on mount.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      new Response(JSON.stringify({ highlights: [], bookmarks: [], notes: [] }), {
        headers: { "content-type": "application/json" },
      })
    )
  );
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const renderReader = (
  chapter = makeChapter(),
  exam: "nclex" | "naplex" = "nclex"
) =>
  render(
    <StudyGuideReader
      exam={exam}
      guideId="g1"
      guideTitle={exam === "naplex" ? "NAPLEX Study Guide" : "NCLEX-RN Study Guide"}
      chapters={CHAPTERS}
      chapter={chapter}
    />
  );

describe("StudyGuideReader", () => {

  // Assertions here are synchronous on purpose. The body is server-rendered
  // HTML, so it is present on the first paint; awaiting instead lets Framer
  // Motion begin an exit animation that never resolves under jsdom, which
  // tears the content down and fails for reasons unrelated to the component.
  it("mounts without throwing and renders the chapter body", () => {
    renderReader();
    expect(screen.getByText(/Afterload is resistance/)).toBeInTheDocument();
  });

  it("renders every chapter in the table of contents", () => {
    renderReader();
    // Desktop rail and mobile sheet both render the list, so scope to one nav.
    const navs = screen.getAllByRole("navigation", { name: /chapter list/i });
    expect(navs.length).toBeGreaterThan(0);
    for (const title of ["Cardiac", "Respiratory"]) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }
  });

  it("exposes reading progress starting at zero", () => {
    renderReader();
    const bar = screen.getByRole("progressbar", { name: /reading progress/i });
    // Progress is painted onto the node by the scroll handler, so the initial
    // render must still carry a valid value for assistive tech.
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("marks the active chapter for screen readers", () => {
    renderReader();
    const current = screen.getAllByRole("button", { current: "page" });
    expect(current.length).toBeGreaterThan(0);
  });

  it("shows the NCSBN trademark notice for the NCLEX book", () => {
    renderReader();
    const notice = screen.getByText(/registered trademark of/i);
    expect(notice).toHaveTextContent("NCSBN");
    expect(notice).toHaveTextContent("nursing program");
  });

  it("swaps the disclaimer to NABP for the NAPLEX book", () => {
    // The footer is the only place the trademark appears, and attributing
    // NAPLEX to NCSBN would be a legal error, not a copy nit.
    renderReader(makeChapter(), "naplex");
    const notice = screen.getByText(/registered trademark of/i);
    expect(notice).toHaveTextContent("NABP");
    expect(notice).not.toHaveTextContent("NCSBN");
    expect(notice).toHaveTextContent("pharmacy program");
  });

  it("shows a trial CTA and hides persistence controls in guest preview", () => {
    render(
      <StudyGuideReader
        exam="nclex"
        guideId="g1"
        guideTitle="NCLEX-RN Study Guide"
        chapters={CHAPTERS}
        chapter={makeChapter()}
        guestPreview
      />
    );
    expect(screen.getByText(/Afterload is resistance/)).toBeInTheDocument();
    expect(screen.getByText(/Want bookmarks \+ 500-question free trial/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/Highlight selection/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle(/Bookmark \(b\)/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to free guides/i })).toHaveAttribute(
      "href",
      "/free-guides"
    );
  });

  it("hides the Go deeper block when a chapter has no related topics", () => {
    renderReader();
    expect(screen.queryByText(/Go deeper on this chapter/i)).not.toBeInTheDocument();
  });

  it("renders Go deeper links for a chapter with related topics", () => {
    renderReader(
      makeChapter({
        relatedTopics: [
          {
            slug: "cardiovascular",
            title: "Cardiovascular",
            libraryCardCount: 4,
            deepDiveHref: "/dashboard/topics?topic=cardiovascular&mode=deep",
            libraryHref: "/library?topicKey=cardiovascular",
          },
        ],
      })
    );
    expect(screen.getByText(/Go deeper on this chapter/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /deep dive/i })).toHaveAttribute(
      "href",
      "/dashboard/topics?topic=cardiovascular&mode=deep"
    );
    // The count only appears when cards actually back the topic.
    expect(screen.getByRole("link", { name: /library \(4\)/i })).toBeInTheDocument();
  });
});
