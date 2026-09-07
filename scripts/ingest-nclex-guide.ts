#!/usr/bin/env npx tsx
/**
 * Ingest NCLEX Study Guide markdown from /content/nclex-study-guide.
 * Splits on "## Chapter" headings and upserts sg_chapters.
 * Does NOT fabricate clinical text.
 *
 * Usage: npx tsx scripts/ingest-nclex-guide.ts
 */

import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { markdownToSimpleHtml } from "../src/lib/nclex-study-guide/markdown";

const CONTENT_DIR = path.join(process.cwd(), "content", "nclex-study-guide");
const GUIDE_ID = "sg_guide_nclex_rn_placeholder";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/^chapter\s+\d+\s*[—–-]\s*/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "chapter";
}

function parseChapters(md: string): Array<{
  title: string;
  sectionLabel: string;
  bodyMd: string;
}> {
  const normalized = md.replace(/\r\n/g, "\n");
  // Drop leading # Guide Title block before first ## Chapter
  const chapterSplit = normalized.split(/^##\s+/m).slice(1);
  if (chapterSplit.length === 0) {
    return [
      {
        title: "Manuscript pending",
        sectionLabel: "Placeholder",
        bodyMd: normalized.trim() || "Body pending.",
      },
    ];
  }

  return chapterSplit.map((chunk) => {
    const lines = chunk.split("\n");
    const titleLine = (lines[0] ?? "Chapter title pending").trim();
    const rest = lines.slice(1).join("\n").trim() || "Body pending.";
    const sectionMatch = /^###\s+(.+)$/m.exec(rest);
    return {
      title: titleLine.replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "").trim() || titleLine,
      sectionLabel: sectionMatch?.[1]?.trim() ?? "",
      bodyMd: `# ${titleLine}\n\n${rest}`,
    };
  });
}

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Missing content folder: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .sort();

  if (files.length === 0) {
    console.error("No .md manuscript files found.");
    process.exit(1);
  }

  await prisma.sgGuide.upsert({
    where: { id: GUIDE_ID },
    create: {
      id: GUIDE_ID,
      examTrack: "rn",
      title: "NCLEX-RN Study Guide",
      edition: "1",
      version: "0.1.0",
      publishedAt: new Date(),
    },
    update: { updatedAt: new Date() },
  });

  let sortOrder = 0;
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const chapters = parseChapters(raw);
    for (const ch of chapters) {
      sortOrder += 1;
      const slug = slugify(ch.title);
      const bodyHtml = markdownToSimpleHtml(ch.bodyMd);
      await prisma.sgChapter.upsert({
        where: { guideId_slug: { guideId: GUIDE_ID, slug } },
        create: {
          guideId: GUIDE_ID,
          slug,
          sortOrder,
          title: ch.title,
          sectionLabel: ch.sectionLabel,
          estimatedMinutes: 5,
          bodyMd: ch.bodyMd,
          bodyHtml,
        },
        update: {
          sortOrder,
          title: ch.title,
          sectionLabel: ch.sectionLabel,
          bodyMd: ch.bodyMd,
          bodyHtml,
        },
      });
      console.log(`Upserted chapter ${sortOrder}: ${slug}`);
    }
  }

  console.log(`Done. ${sortOrder} chapter(s) from ${files.length} file(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
