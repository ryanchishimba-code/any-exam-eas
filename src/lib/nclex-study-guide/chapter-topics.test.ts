import { describe, expect, it } from "vitest";
import { NCLEX_TOPIC_REGISTRY } from "@/lib/exam-prep/nclex/topic-registry";
import { NAPLEX_TOPIC_REGISTRY } from "@/lib/exam-prep/naplex/topic-registry";
import { CHAPTER_TOPICS_BY_EXAM, getTopicSlugsForChapter } from "./chapter-topics";
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
    for (const [chapter, slugs] of Object.entries(CHAPTER_TOPICS_BY_EXAM.nclex)) {
      for (const slug of slugs) {
        if (!known.has(slug)) unknown.push(`${chapter} → ${slug}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it("covers every chapter so a new chapter cannot be silently missed", () => {
    const mapped = Object.keys(CHAPTER_TOPICS_BY_EXAM.nclex).sort();
    expect(mapped).toEqual([...CHAPTER_SLUGS].sort());
  });

  it("does not repeat a topic within one chapter", () => {
    for (const [chapter, slugs] of Object.entries(CHAPTER_TOPICS_BY_EXAM.nclex)) {
      expect(new Set(slugs).size, `${chapter} has duplicates`).toBe(slugs.length);
    }
  });

  it("returns no topics for unknown or navigational chapters", () => {
    expect(getTopicSlugsForChapter("nclex", "does-not-exist")).toEqual([]);
    expect(getChapterRelatedTopics("nclex", "front-matter")).toEqual([]);
    expect(getChapterRelatedTopics("nclex", "back-matter")).toEqual([]);
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
    expect(getChapterRelatedTopics("nclex", chapter).length).toBeGreaterThan(0);
  });

  it("never emits an entry without a usable link", () => {
    for (const chapter of CHAPTER_SLUGS) {
      for (const t of getChapterRelatedTopics("nclex", chapter)) {
        const hasLink = Boolean(t.deepDiveHref || t.libraryHref || t.anatomyHref);
        expect(hasLink, `${chapter} → ${t.slug} has no link`).toBe(true);
        expect(t.title.trim()).not.toBe("");
      }
    }
  });

  it("points deep dives at the review module the hub can open", () => {
    const cardio = getChapterRelatedTopics("nclex", "cardiac").find(
      (t) => t.slug === "cardiovascular"
    );
    expect(cardio?.deepDiveHref).toBe("/dashboard/topics?topic=cardiovascular&mode=deep");
  });

  it("omits topics the hub cannot display", () => {
    // burns-trauma has no review module and no Library cards, so linking to
    // /dashboard/topics?topic=burns-trauma would strand the reader.
    const slugs = getChapterRelatedTopics("nclex", "other-medsurg").map((t) => t.slug);
    expect(slugs).not.toContain("burns-trauma");
  });

  it("does not attach anatomy without an explicit structure link", () => {
    // The shared ranking scores structures on their own high-yield flag, so it
    // would hand back "Adrenal Glands" here. The strict lookup must not.
    const anticoag = getChapterRelatedTopics("nclex", "cardiac").find(
      (t) => t.slug === "anticoagulation-nursing"
    );
    expect(anticoag?.anatomyHref).toBeUndefined();
  });

  it("only advertises a Library link when cards back it", () => {
    for (const chapter of CHAPTER_SLUGS) {
      for (const t of getChapterRelatedTopics("nclex", chapter)) {
        if (t.libraryHref) expect(t.libraryCardCount).toBeGreaterThan(0);
        else expect(t.libraryCardCount).toBe(0);
      }
    }
  });
});

/** NAPLEX chapters, as reported by the ingest run for content/naplex-study-guide. */
const NAPLEX_CHAPTER_SLUGS = [
  "front-matter",
  "exam-strategy",
  "foundational-knowledge",
  "calculations",
  "medication-use-process",
  "cardiology",
  "infectious-disease",
  "endocrine",
  "respiratory",
  "neuro-psych",
  "renal-hepatic",
  "onc-heme",
  "otc-selfcare",
  "special-populations",
  "professional-practice-ops",
  "quick-reference",
  "back-matter",
];

describe("NAPLEX chapter → topic map", () => {
  it("only references topics that exist in the NAPLEX registry", () => {
    const known = new Set(Object.keys(NAPLEX_TOPIC_REGISTRY));
    const unknown: string[] = [];
    for (const [chapter, slugs] of Object.entries(CHAPTER_TOPICS_BY_EXAM.naplex)) {
      for (const slug of slugs) {
        if (!known.has(slug)) unknown.push(`${chapter} → ${slug}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it("covers every chapter the ingest produces", () => {
    expect(Object.keys(CHAPTER_TOPICS_BY_EXAM.naplex).sort()).toEqual(
      [...NAPLEX_CHAPTER_SLUGS].sort()
    );
  });

  it("does not repeat a topic within one chapter", () => {
    for (const [chapter, slugs] of Object.entries(CHAPTER_TOPICS_BY_EXAM.naplex)) {
      expect(new Set(slugs).size, `${chapter} has duplicates`).toBe(slugs.length);
    }
  });

  it("never emits an entry without a usable link", () => {
    for (const chapter of NAPLEX_CHAPTER_SLUGS) {
      for (const t of getChapterRelatedTopics("naplex", chapter)) {
        const hasLink = Boolean(t.deepDiveHref || t.libraryHref || t.anatomyHref);
        expect(hasLink, `${chapter} → ${t.slug} has no link`).toBe(true);
        expect(t.title.trim()).not.toBe("");
      }
    }
  });

  it("only advertises a Library link when cards back it", () => {
    for (const chapter of NAPLEX_CHAPTER_SLUGS) {
      for (const t of getChapterRelatedTopics("naplex", chapter)) {
        if (t.libraryHref) expect(t.libraryCardCount).toBeGreaterThan(0);
        else expect(t.libraryCardCount).toBe(0);
      }
    }
  });

  it("keeps the two books' maps apart on their shared chapter slugs", () => {
    // Both books have `endocrine`, `respiratory`, and `quick-reference`. If the
    // exam were ever dropped on the way through, NAPLEX chapters would resolve
    // nursing topics — the failure this whole keying exists to prevent.
    for (const shared of ["endocrine", "respiratory", "quick-reference"]) {
      const nclex = getTopicSlugsForChapter("nclex", shared);
      const naplex = getTopicSlugsForChapter("naplex", shared);
      expect(naplex.length, `naplex/${shared} unmapped`).toBeGreaterThan(0);
      expect(naplex).not.toEqual(nclex);
      expect(naplex.filter((s) => nclex.includes(s))).toEqual([]);
    }
  });

  it("resolves a pharmacy deep dive, not a nursing one, for calculations", () => {
    const topics = getChapterRelatedTopics("naplex", "calculations");
    expect(topics.length).toBeGreaterThan(0);
    // Only calculations-workshop has a review module; the sibling calc topics
    // are correctly dropped for having no destination.
    expect(topics.map((t) => t.slug)).toContain("calculations-workshop");
    // The nursing equivalent must never leak in through a shared chapter name.
    expect(topics.map((t) => t.slug)).not.toContain("dosage-calculations");
  });
});
