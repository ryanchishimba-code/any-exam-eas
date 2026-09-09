import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { STUDY_GUIDES, type StudyGuideExam } from "./guide-registry";
import { getChapterRelatedTopics } from "./related-topics";
import type { SgChapterDto, SgTocChapter } from "./types";

/**
 * Published book content is global and only changes when the ingest script
 * runs, but every chapter view was re-querying it. Cache the reads so soft
 * navigation inside the reader stops paying for the guide lookup and the
 * chapter body each time.
 *
 * Ingest is a CLI script and cannot call `revalidateTag`, so the TTL — not the
 * tag — is what actually expires content after a re-ingest. Keep it short
 * enough that a content fix shows up without a redeploy.
 */
export const STUDY_GUIDE_CACHE_TAG = "study-guide-content";
const STUDY_GUIDE_CACHE_TTL = 300;

/**
 * @deprecated Use `STUDY_GUIDES.nclex.guideId`. Kept as a named export because
 * the original migration seeded this id and older call sites import it.
 */
export const DEFAULT_NCLEX_GUIDE_ID = STUDY_GUIDES.nclex.guideId;

/**
 * The guide to render for an exam.
 *
 * Scoped by `examSlug` rather than only by track: selecting on track alone
 * meant every request resolved to the NCLEX book, and the `OR` fallback on a
 * hardcoded NCLEX id meant even an unpublished NCLEX guide beat a published
 * one from another exam.
 */
const loadPublishedGuide = unstable_cache(
  async (exam: StudyGuideExam) => {
    const config = STUDY_GUIDES[exam];
    return prisma.sgGuide.findFirst({
      where: {
        examSlug: exam,
        examTrack: config.track,
        // An unpublished guide is still served when it is the known seeded row,
        // so a fresh environment shows the book instead of an empty shell.
        OR: [{ publishedAt: { not: null } }, { id: config.guideId }],
      },
      orderBy: { publishedAt: "desc" },
      // Explicit projection: caching round-trips through serialization, and the
      // unused Date columns would come back as strings and quietly break typing.
      select: {
        id: true,
        title: true,
        examSlug: true,
        examTrack: true,
        edition: true,
        version: true,
      },
    });
  },
  ["sg-published-guide"],
  { revalidate: STUDY_GUIDE_CACHE_TTL, tags: [STUDY_GUIDE_CACHE_TAG] }
);

export async function getPublishedGuide(exam: StudyGuideExam = "nclex") {
  return loadPublishedGuide(exam);
}

const loadGuideToc = unstable_cache(
  async (guideId: string): Promise<SgTocChapter[]> =>
    prisma.sgChapter.findMany({
      where: { guideId },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        sectionLabel: true,
        sortOrder: true,
        estimatedMinutes: true,
      },
    }),
  ["sg-guide-toc"],
  { revalidate: STUDY_GUIDE_CACHE_TTL, tags: [STUDY_GUIDE_CACHE_TAG] }
);

export async function getGuideToc(guideId: string): Promise<SgTocChapter[]> {
  return loadGuideToc(guideId);
}

/**
 * `exam` is required rather than defaulting: chapter slugs collide across books
 * (both have `01-exam-strategy`, `07-endocrine`, `15-quick-reference`), so a
 * default would quietly hang NCLEX topic links off NAPLEX chapters.
 */
const loadChapterRow = unstable_cache(
  async (guideId: string, slug: string) => {
    // Only the slug ordering is needed for prev/next — selecting the whole row
    // here would pull every chapter body on every request.
    const [ordering, chapter] = await Promise.all([
      prisma.sgChapter.findMany({
        where: { guideId },
        orderBy: { sortOrder: "asc" },
        select: { slug: true },
      }),
      prisma.sgChapter.findUnique({
        where: { guideId_slug: { guideId, slug } },
        select: {
          id: true,
          guideId: true,
          slug: true,
          title: true,
          sectionLabel: true,
          sortOrder: true,
          estimatedMinutes: true,
          bodyHtml: true,
        },
      }),
    ]);
    return { ordering, chapter };
  },
  ["sg-chapter"],
  { revalidate: STUDY_GUIDE_CACHE_TTL, tags: [STUDY_GUIDE_CACHE_TAG] }
);

export async function getChapterBySlug(
  guideId: string,
  slug: string,
  exam: StudyGuideExam
): Promise<SgChapterDto | null> {
  // Topic links stay outside the cache: they are a pure in-memory lookup, so
  // caching them would only pin the mapping to a stale deploy.
  const { ordering, chapter } = await loadChapterRow(guideId, slug);
  if (!chapter) return null;
  const idx = ordering.findIndex((c) => c.slug === slug);
  return {
    ...chapter,
    prevSlug: ordering[idx - 1]?.slug ?? null,
    nextSlug: ordering[idx + 1]?.slug ?? null,
    // Resolved here so the SSR page and the chapter API agree without either
    // pulling the topic seeds into the client bundle.
    relatedTopics: getChapterRelatedTopics(exam, chapter.slug),
  };
}

export async function listHighlights(userId: string, chapterId: string) {
  return prisma.sgHighlight.findMany({
    where: { userId, chapterId },
    orderBy: { startOffset: "asc" },
  });
}

export async function listBookmarks(userId: string, chapterId: string) {
  return prisma.sgBookmark.findMany({
    where: { userId, chapterId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listNotes(userId: string, chapterId: string) {
  return prisma.sgNote.findMany({
    where: { userId, chapterId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReadingProgress(userId: string, guideId: string) {
  return prisma.sgReadingProgress.findUnique({
    where: { userId_guideId: { userId, guideId } },
  });
}
