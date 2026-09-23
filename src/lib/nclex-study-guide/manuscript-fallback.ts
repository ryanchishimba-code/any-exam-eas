import fs from "node:fs";
import path from "node:path";
import { markdownToSimpleHtml } from "./markdown";
import { STUDY_GUIDES, type StudyGuideExam } from "./guide-registry";
import type { SgChapterDto, SgTocChapter } from "./types";

const CHAPTER_FILE_RE = /^\d{2}-.+\.md$/i;

const SKIP_NAMES = new Set([
  "readme.md",
  "dev.md",
  "cursor-drop-in.md",
  "visuals-needed.md",
  "book.md",
  "improvements.md",
  "qa-report.md",
]);

function slugFromFilename(file: string): string {
  return (
    file
      .replace(/\.md$/i, "")
      .replace(/^\d{2}-/, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .replace(/^-|-$/g, "") || "chapter"
  );
}

function firstHeading(md: string, level: 1 | 2): string | null {
  const re = level === 1 ? /^#\s+(.+)$/m : /^##\s+(.+)$/m;
  return re.exec(md)?.[1]?.trim() ?? null;
}

export type ManuscriptGuide = {
  guide: { id: string; title: string };
  toc: SgTocChapter[];
  chapters: Record<string, SgChapterDto>;
};

const cache = new Map<StudyGuideExam, ManuscriptGuide>();

function parseNumberedChapters(exam: StudyGuideExam): ManuscriptGuide {
  const config = STUDY_GUIDES[exam];
  const dir = path.join(process.cwd(), "content", config.contentDir);
  const files = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter(
          (f) =>
            CHAPTER_FILE_RE.test(f) &&
            !SKIP_NAMES.has(f.toLowerCase())
        )
        .sort()
    : [];

  const toc: SgTocChapter[] = [];
  const chapters: Record<string, SgChapterDto> = {};

  files.forEach((file, index) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r\n/g, "\n");
    const slug = slugFromFilename(file);
    const title =
      (firstHeading(raw, 1) ?? file.replace(/\.md$/i, ""))
        .replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "")
        .trim() || "Chapter";
    const id = `manuscript:${exam}:${slug}`;
    const estimatedMinutes = Math.max(5, Math.round(raw.length / 1200));
    toc.push({
      id,
      slug,
      title,
      sectionLabel: firstHeading(raw, 2) ?? "",
      sortOrder: index + 1,
      estimatedMinutes,
    });
    chapters[slug] = {
      id,
      guideId: config.guideId,
      slug,
      title,
      sectionLabel: firstHeading(raw, 2) ?? "",
      sortOrder: index + 1,
      estimatedMinutes,
      bodyHtml: markdownToSimpleHtml(raw),
      prevSlug: null,
      nextSlug: null,
      relatedTopics: [],
    };
  });

  toc.forEach((entry, index) => {
    const chapter = chapters[entry.slug];
    if (!chapter) return;
    chapter.prevSlug = toc[index - 1]?.slug ?? null;
    chapter.nextSlug = toc[index + 1]?.slug ?? null;
  });

  return {
    guide: { id: config.guideId, title: config.title },
    toc,
    chapters,
  };
}

/** Filesystem book used when the published DB row is empty (pre-ingest). */
export function loadManuscriptGuide(exam: StudyGuideExam): ManuscriptGuide {
  const hit = cache.get(exam);
  if (hit) return hit;
  const loaded = parseNumberedChapters(exam);
  cache.set(exam, loaded);
  return loaded;
}

export function getManuscriptChapter(exam: StudyGuideExam, slug: string) {
  const manuscript = loadManuscriptGuide(exam);
  const chapter = manuscript.chapters[slug];
  if (!chapter) return null;
  return {
    guide: manuscript.guide,
    toc: manuscript.toc,
    chapter,
  };
}
