import { prisma } from "@/lib/prisma";
import { STUDY_GUIDES, type StudyGuideExam } from "./guide-registry";
import { getChapterRelatedTopics } from "./related-topics";
import type { SgChapterDto, SgTocChapter } from "./types";

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
export async function getPublishedGuide(exam: StudyGuideExam = "nclex") {
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
  });
}

export async function getGuideToc(guideId: string): Promise<SgTocChapter[]> {
  const chapters = await prisma.sgChapter.findMany({
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
  });
  return chapters;
}

/**
 * `exam` is required rather than defaulting: chapter slugs collide across books
 * (both have `01-exam-strategy`, `07-endocrine`, `15-quick-reference`), so a
 * default would quietly hang NCLEX topic links off NAPLEX chapters.
 */
export async function getChapterBySlug(
  guideId: string,
  slug: string,
  exam: StudyGuideExam
): Promise<SgChapterDto | null> {
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
