import { prisma } from "@/lib/prisma";
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
  const chapters = await prisma.sgChapter.findMany({
    where: { guideId },
    orderBy: { sortOrder: "asc" },
  });
  const idx = chapters.findIndex((c) => c.slug === slug);
  if (idx < 0) return null;
  const chapter = chapters[idx]!;
  return {
    id: chapter.id,
    guideId: chapter.guideId,
    slug: chapter.slug,
    title: chapter.title,
    sectionLabel: chapter.sectionLabel,
    sortOrder: chapter.sortOrder,
    estimatedMinutes: chapter.estimatedMinutes,
    bodyMd: chapter.bodyMd,
    bodyHtml: chapter.bodyHtml,
    prevSlug: chapters[idx - 1]?.slug ?? null,
    nextSlug: chapters[idx + 1]?.slug ?? null,
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
