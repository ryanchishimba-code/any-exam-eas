import path from "node:path";
import { prisma } from "@/lib/prisma";
import { USMLE_STUDY_GUIDES, type UsmleGuideStep, type UsmleStudyGuideConfig } from "./guide-registry";
import { getChapterBySlug, getGuideToc } from "./queries";
import { manuscriptHtml, publicImageSize, readManuscriptChapters } from "./manuscript";
import type { SgChapterDto, SgTocChapter } from "./types";

export type LoadedUsmleBook = {
  guideId: string;
  guideTitle: string;
  fromManuscript: boolean;
  toc: SgTocChapter[];
  chapter: SgChapterDto | null;
};

function contentDir(config: UsmleStudyGuideConfig): string {
  return path.join(process.cwd(), "content", config.contentDir);
}

function manuscriptBook(config: UsmleStudyGuideConfig, chapterSlug: string | null): LoadedUsmleBook {
  const chapters = readManuscriptChapters(
    contentDir(config),
    config.visualsPrefix
  );
  const imageSize = publicImageSize(path.join(process.cwd(), "public"));
  const toc: SgTocChapter[] = chapters.map((chapter) => ({
    id: `ms-${config.track}-${chapter.slug}`,
    slug: chapter.slug,
    title: chapter.title,
    sectionLabel: chapter.sectionLabel,
    sortOrder: chapter.sortOrder,
    estimatedMinutes: Math.max(5, Math.round(chapter.bodyMd.length / 1200)),
  }));
  const match = chapterSlug
    ? chapters.find((chapter) => chapter.slug === chapterSlug) ?? null
    : chapters[0] ?? null;
  if (!match) {
    return {
      guideId: config.guideId,
      guideTitle: config.bookTitle,
      fromManuscript: true,
      toc,
      chapter: null,
    };
  }
  const idx = chapters.findIndex((chapter) => chapter.slug === match.slug);
  const row = toc[idx]!;
  return {
    guideId: config.guideId,
    guideTitle: config.bookTitle,
    fromManuscript: true,
    toc,
    chapter: {
      ...row,
      guideId: config.guideId,
      bodyHtml: manuscriptHtml(match.bodyMd, imageSize),
      prevSlug: toc[idx - 1]?.slug ?? null,
      nextSlug: toc[idx + 1]?.slug ?? null,
      relatedTopics: [],
    },
  };
}

async function databaseBook(
  config: UsmleStudyGuideConfig,
  chapterSlug: string | null
): Promise<LoadedUsmleBook | null> {
  try {
    const guide = await prisma.sgGuide.findUnique({
      where: { id: config.guideId },
      select: { id: true, title: true },
    });
    if (!guide) return null;
    const toc = await getGuideToc(guide.id);
    if (toc.length === 0) return null;
    const slug = chapterSlug ?? toc[0]?.slug ?? null;
    const chapter = slug ? await getChapterBySlug(guide.id, slug, "usmle") : null;
    return {
      guideId: guide.id,
      guideTitle: guide.title,
      fromManuscript: false,
      toc,
      chapter,
    };
  } catch (error) {
    console.warn(
      "[usmle/study-guide] database unread, using the manuscript",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Prefer ingested rows. Before ingest, the numbered markdown is the book an
 * admin can preview. A published ingest replaces that fallback.
 */
export async function loadUsmleBook(
  step: UsmleGuideStep,
  chapterSlug: string | null
): Promise<LoadedUsmleBook> {
  const config = USMLE_STUDY_GUIDES[step];
  const stored = await databaseBook(config, chapterSlug);
  if (stored && (chapterSlug === null || stored.chapter)) return stored;
  return manuscriptBook(config, chapterSlug);
}
