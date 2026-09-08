#!/usr/bin/env npx tsx
/**
 * Ingest NCLEX Study Guide markdown from /content/nclex-study-guide.
 *
 * Preferred layout (paste-ready book): one file per chapter
 *   00-front-matter.md, 01-exam-strategy.md, …
 * Each file’s first `# …` heading is the chapter title.
 *
 * Also supports a single file split on `## Chapter …` / `# Chapter …`.
 * Does NOT fabricate clinical text.
 *
 * Usage: npm run ingest:nclex-guide
 */

import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { markdownToSimpleHtml, type MarkdownImageSize } from "../src/lib/nclex-study-guide/markdown";
import { readImageSize } from "../src/lib/nclex-study-guide/image-dimensions";

const CONTENT_DIR = path.join(process.cwd(), "content", "nclex-study-guide");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const GUIDE_ID = "sg_guide_nclex_rn_placeholder";

/**
 * Intrinsic sizes for the figures, cached per run. Stamping width/height onto
 * each <img> is what stops chapters reflowing (and visibly juddering) as their
 * images decode during a scroll.
 */
const sizeCache = new Map<string, MarkdownImageSize | undefined>();
const missingSizes = new Set<string>();

function imageSizeForSrc(src: string): MarkdownImageSize | undefined {
  if (sizeCache.has(src)) return sizeCache.get(src);
  // Reader srcs are absolute public URLs, e.g. /nclex-study-guide/visuals/x.jpg
  const size = src.startsWith("/")
    ? readImageSize(path.join(PUBLIC_DIR, src))
    : undefined;
  if (!size) missingSizes.add(src);
  sizeCache.set(src, size);
  return size;
}

/** Numbered chapter files only — skip README, DEV, PASTE-READY, etc. */
const CHAPTER_FILE_RE = /^\d{2}-.+\.md$/i;

const SKIP_NAMES = new Set([
  "readme.md",
  "dev.md",
  "cursor-drop-in.md",
  "visuals-needed.md",
  "book.md",
  "_paste-ready-full-book.md",
  "paste-ready-anyexameasy-nclex-book.md",
]);

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/^chapter\s+\d+\s*[—–-]\s*/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "chapter"
  );
}

function slugFromFilename(file: string): string {
  const base = file.replace(/\.md$/i, "");
  const withoutNum = base.replace(/^\d{2}-/, "");
  return withoutNum.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") || slugify(base);
}

/** Rewrite relative visuals/… paths to the public URL used by the reader. */
function rewriteVisualPaths(md: string): string {
  return md.replace(
    /(!\[[^\]]*\]\()(?:\.\/)?visuals\//g,
    "$1/nclex-study-guide/visuals/"
  );
}

function firstH1(md: string): string | null {
  const m = /^#\s+(.+)$/m.exec(md);
  return m?.[1]?.trim() ?? null;
}

function firstH2(md: string): string | null {
  const m = /^##\s+(.+)$/m.exec(md);
  return m?.[1]?.trim() ?? null;
}

function parseFileAsChapter(
  file: string,
  md: string
): { slug: string; title: string; sectionLabel: string; bodyMd: string } {
  const normalized = rewriteVisualPaths(md.replace(/\r\n/g, "\n").trim());
  const h1 = firstH1(normalized);
  const title =
    (h1 ?? file.replace(/\.md$/i, ""))
      .replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "")
      .trim() || "Chapter title pending";
  return {
    slug: slugFromFilename(file),
    title,
    sectionLabel: firstH2(normalized) ?? "",
    bodyMd: normalized || "Body pending.",
  };
}

/**
 * Split a multi-chapter markdown blob on `# Chapter` or `## Chapter` headings.
 */
function parseMultiChapterBlob(md: string): Array<{
  title: string;
  sectionLabel: string;
  bodyMd: string;
  slug?: string;
}> {
  const normalized = rewriteVisualPaths(md.replace(/\r\n/g, "\n"));
  const parts = normalized.split(/^(?=#{1,2}\s+Chapter\s+)/m).filter((p) => p.trim());
  const chapterParts = parts.filter((p) => /^#{1,2}\s+Chapter\s+/m.test(p));
  if (chapterParts.length === 0) {
    return [];
  }
  return chapterParts.map((chunk) => {
    const lines = chunk.trim().split("\n");
    const titleLine = (lines[0] ?? "Chapter title pending")
      .replace(/^#{1,2}\s+/, "")
      .trim();
    const rest = lines.slice(1).join("\n").trim() || "Body pending.";
    return {
      title: titleLine.replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "").trim() || titleLine,
      sectionLabel: firstH2(rest) ?? "",
      bodyMd: `# ${titleLine}\n\n${rest}`,
    };
  });
}

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Missing content folder: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const allMd = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && !SKIP_NAMES.has(f.toLowerCase()))
    .sort();

  const numbered = allMd.filter((f) => CHAPTER_FILE_RE.test(f));
  const other = allMd.filter((f) => !CHAPTER_FILE_RE.test(f));

  if (numbered.length === 0 && other.length === 0) {
    console.error("No .md manuscript files found.");
    process.exit(1);
  }

  await prisma.sgGuide.upsert({
    where: { id: GUIDE_ID },
    create: {
      id: GUIDE_ID,
      examTrack: "rn",
      title: "AnyExamEasy NCLEX Reference Book",
      edition: "1",
      version: "1.0.0",
      publishedAt: new Date(),
    },
    update: {
      title: "AnyExamEasy NCLEX Reference Book",
      version: "1.0.0",
      publishedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const seenSlugs: string[] = [];
  let sortOrder = 0;

  const upsertChapter = async (ch: {
    slug: string;
    title: string;
    sectionLabel: string;
    bodyMd: string;
  }) => {
    sortOrder += 1;
    const bodyHtml = markdownToSimpleHtml(ch.bodyMd, { imageSize: imageSizeForSrc });
    const minutes = Math.max(5, Math.round(ch.bodyMd.length / 1200));
    await prisma.sgChapter.upsert({
      where: { guideId_slug: { guideId: GUIDE_ID, slug: ch.slug } },
      create: {
        guideId: GUIDE_ID,
        slug: ch.slug,
        sortOrder,
        title: ch.title,
        sectionLabel: ch.sectionLabel,
        estimatedMinutes: minutes,
        bodyMd: ch.bodyMd,
        bodyHtml,
      },
      update: {
        sortOrder,
        title: ch.title,
        sectionLabel: ch.sectionLabel,
        estimatedMinutes: minutes,
        bodyMd: ch.bodyMd,
        bodyHtml,
      },
    });
    seenSlugs.push(ch.slug);
    console.log(`Upserted chapter ${sortOrder}: ${ch.slug} — ${ch.title}`);
  };

  if (numbered.length > 0) {
    for (const file of numbered) {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      await upsertChapter(parseFileAsChapter(file, raw));
    }
  } else {
    for (const file of other) {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const chapters = parseMultiChapterBlob(raw);
      if (chapters.length === 0) {
        await upsertChapter(parseFileAsChapter(file, raw));
        continue;
      }
      for (const ch of chapters) {
        await upsertChapter({
          slug: slugify(ch.title),
          title: ch.title,
          sectionLabel: ch.sectionLabel,
          bodyMd: ch.bodyMd,
        });
      }
    }
  }

  // Drop placeholder / removed chapters so TOC matches manuscript.
  const removed = await prisma.sgChapter.deleteMany({
    where: {
      guideId: GUIDE_ID,
      slug: { notIn: seenSlugs },
    },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} obsolete chapter(s).`);
  }

  const sized = [...sizeCache.values()].filter(Boolean).length;
  console.log(`Figures sized: ${sized}/${sizeCache.size}.`);
  if (missingSizes.size > 0) {
    // Unsized figures still render, they just reflow on load — worth knowing.
    console.warn(`No dimensions for ${missingSizes.size} figure(s):`);
    for (const src of missingSizes) console.warn(`  ${src}`);
  }

  console.log(`Done. ${sortOrder} chapter(s) ingested.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
