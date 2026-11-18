import fs from "node:fs";
import path from "node:path";
import type { UsmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";
import { markdownToSimpleHtml } from "@/lib/nclex-study-guide/markdown";
import type { SgChapterDto, SgTocChapter } from "@/lib/nclex-study-guide/types";

/**
 * Renders a USMLE book from the markdown sources. Used only when
 * `USMLE_STUDY_GUIDE_FILE_FALLBACK=1` outside production, so screenshots and
 * local review do not need an ingest. Production never calls this.
 */

const CHAPTER_FILE_RE = /^\d{2}-.+\.md$/i;

function slugFromFilename(file: string): string {
  const base = file.replace(/\.md$/i, "");
  const withoutNum = base.replace(/^\d{2}-/, "");
  return withoutNum.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") || "chapter";
}

function firstH1(md: string): string | null {
  const match = /^#\s+(.+)$/m.exec(md);
  return match?.[1]?.trim() ?? null;
}

function firstH2(md: string): string | null {
  const match = /^##\s+(.+)$/m.exec(md);
  return match?.[1]?.trim() ?? null;
}

export function loadUsmleChaptersFromFiles(book: UsmleStudyBook): SgChapterDto[] {
  const dir = path.join(process.cwd(), "content", book.contentDir);
  const files = fs
    .readdirSync(dir)
    .filter((file) => CHAPTER_FILE_RE.test(file))
    .sort();
  const parsed = files.map((file, index) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n").trim();
    const md = raw.replace(/(!\[[^\]]*\]\()(?:\.\/)?visuals\//g, `$1${book.visualsPrefix}`);
    const h1 = firstH1(md);
    const title =
      (h1 ?? file.replace(/\.md$/i, "")).replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "").trim() ||
      "Chapter";
    return {
      slug: slugFromFilename(file),
      title,
      sectionLabel: firstH2(md) ?? "",
      sortOrder: index + 1,
      estimatedMinutes: Math.max(5, Math.round(md.length / 1200)),
      bodyHtml: markdownToSimpleHtml(md),
    };
  });
  return parsed.map((chapter, index) => ({
    id: `file-${book.step}-${chapter.slug}`,
    guideId: book.guideId,
    ...chapter,
    prevSlug: parsed[index - 1]?.slug ?? null,
    nextSlug: parsed[index + 1]?.slug ?? null,
    relatedTopics: [],
  }));
}

export function loadUsmleTocFromFiles(book: UsmleStudyBook): SgTocChapter[] {
  return loadUsmleChaptersFromFiles(book).map((chapter) => ({
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    sectionLabel: chapter.sectionLabel,
    sortOrder: chapter.sortOrder,
    estimatedMinutes: chapter.estimatedMinutes,
  }));
}
