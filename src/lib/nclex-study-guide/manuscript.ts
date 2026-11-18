import fs from "node:fs";
import path from "node:path";
import { markdownToSimpleHtml, type MarkdownImageSize } from "./markdown";
import { readImageSize } from "./image-dimensions";

/** Numbered chapter files only. README and clinical review stay out of the book. */
export const CHAPTER_FILE_RE = /^\d{2}-.+\.md$/i;

export type ManuscriptChapter = {
  file: string;
  slug: string;
  title: string;
  sectionLabel: string;
  bodyMd: string;
  sortOrder: number;
};

export function listChapterFiles(contentDir: string): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => CHAPTER_FILE_RE.test(file))
    .sort();
}

export function slugFromFilename(file: string): string {
  const base = file.replace(/\.md$/i, "");
  const withoutNum = base.replace(/^\d{2}-/, "");
  return withoutNum.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") || "chapter";
}

function firstHeading(md: string, level: 1 | 2): string | null {
  const pattern = level === 1 ? /^#\s+(.+)$/m : /^##\s+(.+)$/m;
  return pattern.exec(md)?.[1]?.trim() ?? null;
}

export function rewriteVisualPaths(md: string, visualsPrefix: string): string {
  return md.replace(/(!\[[^\]]*\]\()(?:\.\/)?visuals\//g, `$1${visualsPrefix}`);
}

export function readManuscriptChapters(
  contentDir: string,
  visualsPrefix: string
): ManuscriptChapter[] {
  return listChapterFiles(contentDir).map((file, index) => {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8").replace(/\r\n/g, "\n").trim();
    const normalized = rewriteVisualPaths(raw, visualsPrefix);
    const h1 = firstHeading(normalized, 1);
    const title =
      (h1 ?? file.replace(/\.md$/i, "")).replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "").trim() ||
      "Chapter title pending";
    return {
      file,
      slug: slugFromFilename(file),
      title,
      sectionLabel: firstHeading(normalized, 2) ?? "",
      bodyMd: normalized || "Body pending.",
      sortOrder: index + 1,
    };
  });
}

export function manuscriptHtml(
  bodyMd: string,
  imageSize?: (src: string) => MarkdownImageSize | undefined
): string {
  return markdownToSimpleHtml(bodyMd, { imageSize });
}

/** Public-folder lookup used at ingest and when a book is still only on disk. */
export function publicImageSize(publicDir: string): (src: string) => MarkdownImageSize | undefined {
  const cache = new Map<string, MarkdownImageSize | undefined>();
  return (src: string) => {
    if (cache.has(src)) return cache.get(src);
    const size = src.startsWith("/") ? readImageSize(path.join(publicDir, src)) : undefined;
    cache.set(src, size);
    return size;
  };
}
