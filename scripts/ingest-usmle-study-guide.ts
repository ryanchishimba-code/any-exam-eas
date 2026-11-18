#!/usr/bin/env npx tsx
/**
 * Ingest the three USMLE study-guide books into sg_guides and sg_chapters.
 *
 * Does not touch NCLEX, NAPLEX, AANP FNP, or PANCE. A write copies the current
 * USMLE rows into backup tables first. Undo copies those tables back and
 * deletes only USMLE rows this ingest added.
 *
 *   npx tsx scripts/ingest-usmle-study-guide.ts --dry-run
 *   npx tsx scripts/ingest-usmle-study-guide.ts --dry-run --step=step-1
 *   npx tsx scripts/ingest-usmle-study-guide.ts --write
 *   npx tsx scripts/ingest-usmle-study-guide.ts --undo
 *
 * Do not run --write against production until the books are approved to go live.
 * This file's default is to refuse a write when NODE_ENV is production.
 */

import fs from "node:fs";
import path from "node:path";
import { markdownToSimpleHtml, type MarkdownImageSize } from "../src/lib/nclex-study-guide/markdown";
import { readImageSize } from "../src/lib/nclex-study-guide/image-dimensions";
import {
  USMLE_STUDY_STEPS,
  isUsmleStudyStep,
  usmleStudyBook,
  type UsmleStudyBook,
  type UsmleStudyStepId,
} from "../src/lib/nclex-study-guide/guide-registry";

const BACKUP_GUIDES = "sg_guides_backup_usmle_study_guide";
const BACKUP_CHAPTERS = "sg_chapters_backup_usmle_study_guide";

const dryRun = process.argv.includes("--dry-run");
const write = process.argv.includes("--write");
const undo = process.argv.includes("--undo");
const allowProduction = process.argv.includes("--allow-production");
const stepArg = process.argv.find((arg) => arg.startsWith("--step="))?.split("=")[1] ?? "all";

const CHAPTER_FILE_RE = /^\d{2}-.+\.md$/i;

function selectedSteps(): UsmleStudyStepId[] {
  if (stepArg === "all") return [...USMLE_STUDY_STEPS];
  if (!isUsmleStudyStep(stepArg)) {
    console.error(`Unknown step "${stepArg}". Known: ${USMLE_STUDY_STEPS.join(", ")}, all.`);
    process.exit(1);
  }
  return [stepArg];
}

function slugFromFilename(file: string): string {
  const base = file.replace(/\.md$/i, "");
  const withoutNum = base.replace(/^\d{2}-/, "");
  return withoutNum.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "") || "chapter";
}

function firstHeading(md: string, level: 1 | 2): string | null {
  const match = new RegExp(`^#{${level}}\\s+(.+)$`, "m").exec(md);
  return match?.[1]?.trim() ?? null;
}

function parseFile(book: UsmleStudyBook, file: string, md: string) {
  const normalized = md
    .replace(/\r\n/g, "\n")
    .trim()
    .replace(/(!\[[^\]]*\]\()(?:\.\/)?visuals\//g, `$1${book.visualsPrefix}`);
  const h1 = firstHeading(normalized, 1);
  const title =
    (h1 ?? file.replace(/\.md$/i, "")).replace(/^Chapter\s+\d+\s*[—–-]\s*/i, "").trim() ||
    "Chapter";
  return {
    slug: slugFromFilename(file),
    title,
    sectionLabel: firstHeading(normalized, 2) ?? "",
    bodyMd: normalized,
  };
}

function chaptersFor(book: UsmleStudyBook) {
  const dir = path.join(process.cwd(), "content", book.contentDir);
  if (!fs.existsSync(dir)) {
    console.error(`Missing content folder: ${dir}`);
    process.exit(1);
  }
  return fs
    .readdirSync(dir)
    .filter((file) => CHAPTER_FILE_RE.test(file))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      return { file, words: raw.split(/\s+/).filter(Boolean).length, ...parseFile(book, file, raw) };
    });
}

function printDryRun(steps: UsmleStudyStepId[]) {
  let files = 0;
  let words = 0;
  for (const step of steps) {
    const book = usmleStudyBook(step);
    const chapters = chaptersFor(book);
    console.log(`\n${book.shortLabel} (${book.contentDir}) — ${chapters.length} chapter(s)`);
    for (const chapter of chapters) {
      files += 1;
      words += chapter.words;
      console.log(`${chapter.file}\t${chapter.words} words\t${chapter.slug}`);
    }
  }
  console.log(
    `\nDry run only. ${files} file(s), ${words} words, ${steps.length} book(s). No database writes.`
  );
}

async function getPrisma() {
  const { prisma } = await import("../src/lib/prisma");
  return prisma;
}

async function backup(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${BACKUP_GUIDES}"`);
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${BACKUP_CHAPTERS}"`);
  await prisma.$executeRawUnsafe(
    `CREATE TABLE "${BACKUP_GUIDES}" AS SELECT * FROM "sg_guides" WHERE "examSlug" = 'usmle'`
  );
  await prisma.$executeRawUnsafe(
    `CREATE TABLE "${BACKUP_CHAPTERS}" AS SELECT c.* FROM "sg_chapters" c JOIN "sg_guides" g ON g.id = c."guideId" WHERE g."examSlug" = 'usmle'`
  );
  const guides = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `SELECT COUNT(*)::bigint AS count FROM "${BACKUP_GUIDES}"`
  );
  const chapters = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `SELECT COUNT(*)::bigint AS count FROM "${BACKUP_CHAPTERS}"`
  );
  console.log(
    `Backup ${BACKUP_GUIDES} (${guides[0]?.count ?? 0} guides) and ${BACKUP_CHAPTERS} (${chapters[0]?.count ?? 0} chapters).`
  );
}

async function undoBackup(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  const exists = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT tablename AS name FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('${BACKUP_GUIDES}', '${BACKUP_CHAPTERS}')`
  );
  const names = new Set(exists.map((row) => row.name));
  if (!names.has(BACKUP_GUIDES) || !names.has(BACKUP_CHAPTERS)) {
    console.error(`Undo needs both ${BACKUP_GUIDES} and ${BACKUP_CHAPTERS}. No rows were changed.`);
    process.exit(1);
  }
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `DELETE FROM "sg_chapters" WHERE "guideId" IN (SELECT id FROM "sg_guides" WHERE "examSlug" = 'usmle' AND id NOT IN (SELECT id FROM "${BACKUP_GUIDES}"))`
    );
    await tx.$executeRawUnsafe(
      `DELETE FROM "sg_guides" WHERE "examSlug" = 'usmle' AND id NOT IN (SELECT id FROM "${BACKUP_GUIDES}")`
    );
    await tx.$executeRawUnsafe(`
      INSERT INTO "sg_guides" ("id", "examSlug", "examTrack", "title", "edition", "version", "publishedAt", "createdAt", "updatedAt")
      SELECT "id", "examSlug", "examTrack", "title", "edition", "version", "publishedAt", "createdAt", "updatedAt"
      FROM "${BACKUP_GUIDES}"
      ON CONFLICT ("id") DO UPDATE SET
        "examSlug" = EXCLUDED."examSlug",
        "examTrack" = EXCLUDED."examTrack",
        "title" = EXCLUDED."title",
        "edition" = EXCLUDED."edition",
        "version" = EXCLUDED."version",
        "publishedAt" = EXCLUDED."publishedAt",
        "updatedAt" = EXCLUDED."updatedAt"
    `);
    await tx.$executeRawUnsafe(
      `DELETE FROM "sg_chapters" WHERE "guideId" IN (SELECT id FROM "sg_guides" WHERE "examSlug" = 'usmle') AND id NOT IN (SELECT id FROM "${BACKUP_CHAPTERS}")`
    );
    await tx.$executeRawUnsafe(`
      INSERT INTO "sg_chapters" (
        "id", "guideId", "slug", "sortOrder", "title", "sectionLabel",
        "estimatedMinutes", "bodyMd", "bodyHtml", "createdAt", "updatedAt"
      )
      SELECT
        "id", "guideId", "slug", "sortOrder", "title", "sectionLabel",
        "estimatedMinutes", "bodyMd", "bodyHtml", "createdAt", "updatedAt"
      FROM "${BACKUP_CHAPTERS}"
      ON CONFLICT ("id") DO UPDATE SET
        "guideId" = EXCLUDED."guideId",
        "slug" = EXCLUDED."slug",
        "sortOrder" = EXCLUDED."sortOrder",
        "title" = EXCLUDED."title",
        "sectionLabel" = EXCLUDED."sectionLabel",
        "estimatedMinutes" = EXCLUDED."estimatedMinutes",
        "bodyMd" = EXCLUDED."bodyMd",
        "bodyHtml" = EXCLUDED."bodyHtml",
        "updatedAt" = EXCLUDED."updatedAt"
    `);
  });
  console.log("Restored USMLE study-guide rows from the backup tables. Other exams were not changed.");
}

async function writeBooks(
  prisma: Awaited<ReturnType<typeof getPrisma>>,
  steps: UsmleStudyStepId[]
) {
  const publicDir = path.join(process.cwd(), "public");
  const sizeCache = new Map<string, MarkdownImageSize | undefined>();
  const imageSize = (src: string) => {
    if (sizeCache.has(src)) return sizeCache.get(src);
    const size = src.startsWith("/") ? readImageSize(path.join(publicDir, src)) : undefined;
    sizeCache.set(src, size);
    return size;
  };
  await backup(prisma);
    for (const step of steps) {
      const book = usmleStudyBook(step);
      await prisma.sgGuide.upsert({
        where: { id: book.guideId },
        create: {
          id: book.guideId,
          examSlug: book.exam,
          examTrack: book.track,
          title: book.bookTitle,
          edition: "1",
          version: "1.0.0",
          publishedAt: new Date(),
        },
        update: {
          examSlug: book.exam,
          examTrack: book.track,
          title: book.bookTitle,
          version: "1.0.0",
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      const seen: string[] = [];
      let sortOrder = 0;
      for (const chapter of chaptersFor(book)) {
        sortOrder += 1;
        const bodyHtml = markdownToSimpleHtml(chapter.bodyMd, { imageSize });
        const minutes = Math.max(5, Math.round(chapter.bodyMd.length / 1200));
        await prisma.sgChapter.upsert({
          where: { guideId_slug: { guideId: book.guideId, slug: chapter.slug } },
          create: {
            guideId: book.guideId,
            slug: chapter.slug,
            sortOrder,
            title: chapter.title,
            sectionLabel: chapter.sectionLabel,
            estimatedMinutes: minutes,
            bodyMd: chapter.bodyMd,
            bodyHtml,
          },
          update: {
            sortOrder,
            title: chapter.title,
            sectionLabel: chapter.sectionLabel,
            estimatedMinutes: minutes,
            bodyMd: chapter.bodyMd,
            bodyHtml,
          },
        });
        seen.push(chapter.slug);
        console.log(`Upserted ${book.shortLabel} ${sortOrder}: ${chapter.slug}`);
      }
      const removed = await prisma.sgChapter.deleteMany({
        where: { guideId: book.guideId, slug: { notIn: seen } },
      });
      if (removed.count > 0) {
        console.log(`Removed ${removed.count} obsolete ${book.shortLabel} chapter(s).`);
      }
    }
}

async function main() {
  const modes = [dryRun, write, undo].filter(Boolean).length;
  if (modes !== 1) {
    console.error("Pass exactly one of --dry-run, --write, or --undo.");
    process.exit(1);
  }
  if (dryRun) {
    printDryRun(selectedSteps());
    return;
  }
  if (undo && stepArg !== "all") {
    console.error("Undo restores every USMLE book from the backup. Omit --step.");
    process.exit(1);
  }
  if (process.env.NODE_ENV === "production" && !allowProduction) {
    console.error(
      "Refusing to change the database while NODE_ENV=production. Pass --allow-production only after the books are approved."
    );
    process.exit(1);
  }
  const prisma = await getPrisma();
  try {
    if (undo) {
      await undoBackup(prisma);
      return;
    }
    await writeBooks(prisma, selectedSteps());
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
