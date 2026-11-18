#!/usr/bin/env npx tsx
/**
 * Ingest the three USMLE study-guide books into sg_guides and sg_chapters.
 *
 * Does not run unless you omit --dry-run. Production is refused unless
 * USMLE_GUIDE_INGEST_ALLOW_PRODUCTION=1. This change set only dry-runs.
 *
 *   npm run ingest:usmle-guide -- --dry-run
 *   npm run ingest:usmle-guide -- --dry-run --step=step1
 *   npm run ingest:usmle-guide -- --step=all
 *   npm run ingest:usmle-guide -- --undo --step=step2
 */

import fs from "node:fs";
import path from "node:path";
import { isProductionDatabaseHost } from "./prisma-env.mjs";
import {
  USMLE_GUIDE_STEPS,
  USMLE_STUDY_GUIDES,
  type UsmleGuideStep,
} from "../src/lib/nclex-study-guide/guide-registry";
import {
  listChapterFiles,
  manuscriptHtml,
  publicImageSize,
  readManuscriptChapters,
} from "../src/lib/nclex-study-guide/manuscript";

const BACKUP_DIR = path.join(process.cwd(), "scripts", "data", "usmle-guide-backups");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const undo = args.includes("--undo");
const stepArg = args.find((arg) => arg.startsWith("--step="))?.split("=")[1] ?? "all";
const backupFileArg = args.find((arg) => arg.startsWith("--backup-file="))?.split("=")[1];

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function steps(): UsmleGuideStep[] {
  if (stepArg === "all") return [...USMLE_GUIDE_STEPS];
  if (stepArg === "step1" || stepArg === "step2" || stepArg === "step3") return [stepArg];
  fail(`Unknown --step=${stepArg}. Use step1, step2, step3, or all.`);
}

function contentDir(step: UsmleGuideStep): string {
  return path.join(process.cwd(), "content", USMLE_STUDY_GUIDES[step].contentDir);
}

function printDryRun(selected: UsmleGuideStep[]) {
  let files = 0;
  let words = 0;
  for (const step of selected) {
    const dir = contentDir(step);
    const names = listChapterFiles(dir);
    console.log(`\n${USMLE_STUDY_GUIDES[step].bookTitle} (${names.length} chapters)`);
    for (const file of names) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const count = raw.split(/\s+/).filter(Boolean).length;
      files += 1;
      words += count;
      console.log(`${step}\t${file}\t${count} words`);
    }
  }
  console.log(
    `\nDry run only. ${files} file(s), ${words} words across ${selected.length} book(s). No database writes.`
  );
}

type BackupChapter = {
  slug: string;
  sortOrder: number;
  title: string;
  sectionLabel: string;
  estimatedMinutes: number;
  bodyMd: string;
  bodyHtml: string;
};

type BackupFile = {
  guideId: string;
  step: UsmleGuideStep;
  createdAt: string;
  guide: {
    id: string;
    examSlug: string;
    examTrack: string;
    title: string;
    edition: string;
    version: string;
    publishedAt: string | null;
  } | null;
  chapters: BackupChapter[];
};

function latestBackup(step: UsmleGuideStep): string {
  if (backupFileArg) return path.resolve(backupFileArg);
  if (!fs.existsSync(BACKUP_DIR)) fail(`No backups in ${BACKUP_DIR}.`);
  const matches = fs
    .readdirSync(BACKUP_DIR)
    .filter((name) => name.startsWith(`${step}-`) && name.endsWith(".json"))
    .sort();
  const latest = matches[matches.length - 1];
  if (!latest) fail(`No backup for ${step}.`);
  return path.join(BACKUP_DIR, latest);
}

async function main() {
  const selected = steps();
  if (dryRun && undo) fail("Use either --dry-run or --undo, not both.");
  if (dryRun) {
    printDryRun(selected);
    return;
  }

  const databaseUrl = process.env.DATABASE_URL ?? "";
  if (
    isProductionDatabaseHost(databaseUrl) &&
    process.env.USMLE_GUIDE_INGEST_ALLOW_PRODUCTION !== "1"
  ) {
    fail(
      "Refusing to write the production database. Re-run with --dry-run, or set USMLE_GUIDE_INGEST_ALLOW_PRODUCTION=1 if Ryan has approved a production ingest."
    );
  }

  const { prisma } = await import("../src/lib/prisma");
  try {
    if (undo) {
      for (const step of selected) {
        const file = latestBackup(step);
        const backup = JSON.parse(fs.readFileSync(file, "utf8")) as BackupFile;
        const config = USMLE_STUDY_GUIDES[step];
        await prisma.$transaction(async (tx) => {
          if (!backup.guide) {
            await tx.sgChapter.deleteMany({ where: { guideId: config.guideId } });
            await tx.sgGuide.deleteMany({ where: { id: config.guideId } });
            return;
          }
          await tx.sgGuide.upsert({
            where: { id: backup.guide.id },
            create: {
              id: backup.guide.id,
              examSlug: backup.guide.examSlug,
              examTrack: backup.guide.examTrack,
              title: backup.guide.title,
              edition: backup.guide.edition,
              version: backup.guide.version,
              publishedAt: backup.guide.publishedAt ? new Date(backup.guide.publishedAt) : null,
            },
            update: {
              examSlug: backup.guide.examSlug,
              examTrack: backup.guide.examTrack,
              title: backup.guide.title,
              edition: backup.guide.edition,
              version: backup.guide.version,
              publishedAt: backup.guide.publishedAt ? new Date(backup.guide.publishedAt) : null,
            },
          });
          await tx.sgChapter.deleteMany({ where: { guideId: backup.guide.id } });
          for (const chapter of backup.chapters) {
            await tx.sgChapter.create({
              data: {
                guideId: backup.guide.id,
                slug: chapter.slug,
                sortOrder: chapter.sortOrder,
                title: chapter.title,
                sectionLabel: chapter.sectionLabel,
                estimatedMinutes: chapter.estimatedMinutes,
                bodyMd: chapter.bodyMd,
                bodyHtml: chapter.bodyHtml,
              },
            });
          }
        });
        console.log(`Restored ${step} from ${file} (${backup.chapters.length} chapter(s)).`);
      }
      return;
    }

    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const imageSize = publicImageSize(path.join(process.cwd(), "public"));
    for (const step of selected) {
      const config = USMLE_STUDY_GUIDES[step];
      const existingGuide = await prisma.sgGuide.findUnique({ where: { id: config.guideId } });
      const existingChapters = await prisma.sgChapter.findMany({
        where: { guideId: config.guideId },
        orderBy: { sortOrder: "asc" },
      });
      const backup: BackupFile = {
        guideId: config.guideId,
        step,
        createdAt: new Date().toISOString(),
        guide: existingGuide
          ? {
              id: existingGuide.id,
              examSlug: existingGuide.examSlug,
              examTrack: existingGuide.examTrack,
              title: existingGuide.title,
              edition: existingGuide.edition,
              version: existingGuide.version,
              publishedAt: existingGuide.publishedAt?.toISOString() ?? null,
            }
          : null,
        chapters: existingChapters.map((chapter) => ({
          slug: chapter.slug,
          sortOrder: chapter.sortOrder,
          title: chapter.title,
          sectionLabel: chapter.sectionLabel,
          estimatedMinutes: chapter.estimatedMinutes,
          bodyMd: chapter.bodyMd,
          bodyHtml: chapter.bodyHtml,
        })),
      };
      const stamp = backup.createdAt.replace(/[:.]/g, "-");
      const backupPath = path.join(BACKUP_DIR, `${step}-${stamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      console.log(`Backup wrote ${backupPath} (${backup.chapters.length} chapter(s)).`);

      const chapters = readManuscriptChapters(contentDir(step), config.visualsPrefix);
      if (chapters.length < 15 || chapters.length > 20) {
        fail(`${step} has ${chapters.length} chapters. Expected 15 to 20.`);
      }
      await prisma.sgGuide.upsert({
        where: { id: config.guideId },
        create: {
          id: config.guideId,
          examSlug: config.exam,
          examTrack: config.track,
          title: config.bookTitle,
          edition: "1",
          version: "1.0.0",
          publishedAt: new Date(),
        },
        update: {
          examSlug: config.exam,
          examTrack: config.track,
          title: config.bookTitle,
          version: "1.0.0",
          publishedAt: new Date(),
        },
      });
      const seen: string[] = [];
      for (const chapter of chapters) {
        const bodyHtml = manuscriptHtml(chapter.bodyMd, imageSize);
        const minutes = Math.max(5, Math.round(chapter.bodyMd.length / 1200));
        await prisma.sgChapter.upsert({
          where: { guideId_slug: { guideId: config.guideId, slug: chapter.slug } },
          create: {
            guideId: config.guideId,
            slug: chapter.slug,
            sortOrder: chapter.sortOrder,
            title: chapter.title,
            sectionLabel: chapter.sectionLabel,
            estimatedMinutes: minutes,
            bodyMd: chapter.bodyMd,
            bodyHtml,
          },
          update: {
            sortOrder: chapter.sortOrder,
            title: chapter.title,
            sectionLabel: chapter.sectionLabel,
            estimatedMinutes: minutes,
            bodyMd: chapter.bodyMd,
            bodyHtml,
          },
        });
        seen.push(chapter.slug);
        console.log(`Upserted ${step} ${chapter.sortOrder}: ${chapter.slug}`);
      }
      const removed = await prisma.sgChapter.deleteMany({
        where: { guideId: config.guideId, slug: { notIn: seen } },
      });
      if (removed.count > 0) console.log(`Removed ${removed.count} obsolete ${step} chapter(s).`);
      console.log(`Done. ${chapters.length} ${step} chapter(s) ingested.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
