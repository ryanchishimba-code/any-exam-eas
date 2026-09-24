import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(async () => null),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    sgBookmark: { findMany: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
    sgHighlight: { findMany: vi.fn(), create: vi.fn(), deleteMany: vi.fn() },
    sgNote: { findMany: vi.fn(), create: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
    sgReadingProgress: { findUnique: vi.fn(), upsert: vi.fn() },
    sgGuide: { findFirst: vi.fn() },
    sgChapter: { findMany: vi.fn(), findUnique: vi.fn() },
  },
}));

const getChapterBySlug = vi.fn();
const getGuideToc = vi.fn();
const getPublishedGuide = vi.fn();

vi.mock("@/lib/nclex-study-guide", async () => {
  const actual = await vi.importActual<typeof import("@/lib/nclex-study-guide")>(
    "@/lib/nclex-study-guide"
  );
  return {
    ...actual,
    getChapterBySlug: (...args: unknown[]) => getChapterBySlug(...args),
    getGuideToc: (...args: unknown[]) => getGuideToc(...args),
    getPublishedGuide: (...args: unknown[]) => getPublishedGuide(...args),
  };
});

import { POST as bookmarkPost } from "./bookmarks/route";
import { GET as chapterGet } from "./chapters/[slug]/route";
import { GET as highlightGet } from "./highlights/route";
import { POST as notePost } from "./notes/route";
import { GET as tocGet } from "./toc/route";

describe("study guide premium API gate", () => {
  beforeEach(() => {
    getChapterBySlug.mockReset();
    getGuideToc.mockReset();
    getPublishedGuide.mockReset();
  });

  it("refuses chapter HTML and TOC without a session", async () => {
    const chapter = await chapterGet(
      new Request("https://www.anyexameasy.com/api/nclex-study-guide/chapters/cardiac?exam=nclex"),
      { params: Promise.resolve({ slug: "cardiac" }) }
    );
    const toc = await tocGet(
      new Request("https://www.anyexameasy.com/api/nclex-study-guide/toc?exam=naplex")
    );

    expect(chapter.status).toBe(401);
    expect(toc.status).toBe(401);
    expect(getPublishedGuide).not.toHaveBeenCalled();
    expect(getChapterBySlug).not.toHaveBeenCalled();
    expect(getGuideToc).not.toHaveBeenCalled();
  });

  it("refuses bookmark, highlight, and note writes without a session", async () => {
    const bookmark = await bookmarkPost(
      new Request("https://www.anyexameasy.com/api/nclex-study-guide/bookmarks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chapterId: "c1",
          anchorId: "intro",
          label: "Intro",
          scrollPct: 10,
        }),
      })
    );
    const highlights = await highlightGet(
      new Request("https://www.anyexameasy.com/api/nclex-study-guide/highlights?chapterId=c1")
    );
    const note = await notePost(
      new Request("https://www.anyexameasy.com/api/nclex-study-guide/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chapterId: "c1", body: "Remember this." }),
      })
    );

    expect(bookmark.status).toBe(401);
    expect(highlights.status).toBe(401);
    expect(note.status).toBe(401);
  });
});
