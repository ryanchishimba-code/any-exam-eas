import { describe, expect, it } from "vitest";
import { NCLEX_TOPIC_REGISTRY } from "@/lib/exam-prep/nclex/topic-registry";
import { CHAPTER_TOPIC_SLUGS, getTopicSlugsForChapter } from "./chapter-topics";
import { getChapterRelatedTopics } from "./related-topics";

/** Chapters as produced by `slugFromFilename` in scripts/ingest-nclex-guide.ts. */
const CHAPTER_SLUGS = [
  "front-matter",
  "exam-strategy",
  "fundamentals-safety",
  "management-of-care",
  "cardiac",
  "respiratory",
  "neuro",
  "endocrine",
  "renal-fluids",
  "gi-hepatic",
  "other-medsurg",
  "maternity-newborn",
  "pediatrics",
  "psych",
  "pharmacology",
  "quick-reference",
  "back-matter",
];

describe("study guide chapter → topic map", () => {
  it("only references topics that exist in the NCLEX registry", () => {
    const known = new Set(Object.keys(NCLEX_TOPIC_REGISTRY));
    const unknown: string[] = [];
    for (const [chapter, slugs] of Object.entries(CHAPTER_TOPIC_SLUGS)) {
      for (const slug of slugs) {
        if (!known.has(slug)) unknown.push(`${chapter} → ${slug}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it("covers every chapter so a new chapter cannot be silently missed", () => {
    const mapped = Object.keys(CHAPTER_TOPIC_SLUGS).sort();
    expect(mapped).toEqual([...CHAPTER_SLUGS].sort());
  });

  it("does not repeat a topic within one chapter", () => {
    for (const [chapter, slugs] of Object.entries(CHAPTER_TOPIC_SLUGS)) {
      expect(new Set(slugs).size, `${chapter} has duplicates`).toBe(slugs.length);
    }
  });

  it("returns no topics for unknown or navigational chapters", () => {
    expect(getTopicSlugsForChapter("does-not-exist")).toEqual([]);
    expect(getChapterRelatedTopics("front-matter")).toEqual([]);
    expect(getChapterRelatedTopics("back-matter")).toEqual([]);
  });
});

describe("resolved related topics", () => {
  // Not every mapped chapter can resolve: `other-medsurg` points at
  // burns-trauma / heme-oncology / chemotherapy-toxicity, none of which are
  // seeded into `highYieldTopic` or backed by Library cards. Assert the chapters
  // that do have content instead, so a resolver regression still fails here.
  it.each([
    "exam-strategy",
    "fundamentals-safety",
    "management-of-care",
    "cardiac",
    "respiratory",
    "neuro",
    "endocrine",
    "renal-fluids",
    "gi-hepatic",
    "maternity-newborn",
    "pediatrics",
    "psych",
    "pharmacology",
    "quick-reference",
  ])("resolves at least one destination for %s", (chapter) => {
    expect(getChapterRelatedTopics(chapter).length).toBeGreaterThan(0);
  });

  it("never emits an entry without a usable link", () => {
    for (const chapter of CHAPTER_SLUGS) {
      for (const t of getChapterRelatedTopics(chapter)) {
        const hasLink = Boolean(t.deepDiveHref || t.libraryHref || t.anatomyHref);
        expect(hasLink, `${chapter} → ${t.slug} has no link`).toBe(true);
        expect(t.title.trim()).not.toBe("");
      }
    }
  });

  it("points deep dives at the review module the hub can open", () => {
    const cardio = getChapterRelatedTopics("cardiac").find(
      (t) => t.slug === "cardiovascular"
    );
    expect(cardio?.deepDiveHref).toBe("/dashboard/topics?topic=cardiovascular&mode=deep");
  });

  it("omits topics the hub cannot display", () => {
    // burns-trauma has no review module and no Library cards, so linking to
    // /dashboard/topics?topic=burns-trauma would strand the reader.
    const slugs = getChapterRelatedTopics("other-medsurg").map((t) => t.slug);
    expect(slugs).not.toContain("burns-trauma");
  });

  it("does not attach anatomy without an explicit structure link", () => {
    // The shared ranking scores structures on their own high-yield flag, so it
    // would hand back "Adrenal Glands" here. The strict lookup must not.
    const anticoag = getChapterRelatedTopics("cardiac").find(
      (t) => t.slug === "anticoagulation-nursing"
    );
    expect(anticoag?.anatomyHref).toBeUndefined();
  });

  it("only advertises a Library link when cards back it", () => {
    for (const chapter of CHAPTER_SLUGS) {
      for (const t of getChapterRelatedTopics(chapter)) {
        if (t.libraryHref) expect(t.libraryCardCount).toBeGreaterThan(0);
        else expect(t.libraryCardCount).toBe(0);
      }
    }
  });
});
