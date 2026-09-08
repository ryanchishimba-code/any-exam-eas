import { prisma } from "@/lib/prisma";
import { getChapterRelatedTopics } from "./related-topics";
import type { SgChapterDto, SgTocChapter } from "./types";

export const DEFAULT_NCLEX_GUIDE_ID = "sg_guide_nclex_rn_placeholder";

export async function getPublishedGuide(examTrack: "rn" | "pn" = "rn") {
  const guide = await prisma.sgGuide.findFirst({
    where: {
      examTrack,
      OR: [{ publishedAt: { not: null } }, { id: DEFAULT_NCLEX_GUIDE_ID }],
    },
    orderBy: { publishedAt: "desc" },
  });
  return guide;
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

export async function getChapterBySlug(
  guideId: string,
  slug: string
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
    relatedTopics: getChapterRelatedTopics(chapter.slug),
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
