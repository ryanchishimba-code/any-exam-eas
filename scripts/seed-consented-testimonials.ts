#!/usr/bin/env node
/**
 * Reversible seed for owner-supplied customer testimonials.
 *
 * Dry run by default. Nothing is written unless --apply is present.
 * On --apply, pass --backup-dir to write a JSON backup of existing rows first.
 *
 *   npx tsx scripts/seed-consented-testimonials.ts
 *   npx tsx scripts/seed-consented-testimonials.ts --batch testimonials-2026-10-24
 *   npx tsx scripts/seed-consented-testimonials.ts --batch testimonials-2026-10-24 --apply --backup-dir scripts/backups/testimonials
 *   npx tsx scripts/seed-consented-testimonials.ts --remove --batch testimonials-2026-10-24 --apply
 *   npx tsx scripts/undo-consented-testimonials.ts --batch testimonials-2026-10-28 --apply
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";
import {
  CONSENTED_TESTIMONIAL_BATCH_ID,
  CONSENTED_TESTIMONIAL_BATCH_IDS,
  consentedSeedsForBatch,
} from "../src/lib/testimonials/consented-seed";

loadEnvFiles();

const args = new Set(process.argv.slice(2));

function argValue(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

const apply = args.has("--apply");
const restore = args.has("--restore") || args.has("--remove");
const batchId = argValue("--batch") ?? CONSENTED_TESTIMONIAL_BATCH_ID;
const backupDir = argValue("--backup-dir");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main() {
  if (!batchId || !CONSENTED_TESTIMONIAL_BATCH_IDS.includes(batchId as (typeof CONSENTED_TESTIMONIAL_BATCH_IDS)[number])) {
    fail(`Unknown batch. Use one of: ${CONSENTED_TESTIMONIAL_BATCH_IDS.join(", ")}`);
  }

  const seeds = consentedSeedsForBatch(batchId);
  if (seeds.length === 0) fail(`No seeds registered for batch ${batchId}.`);

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const ids = seeds.map((row) => row.id);

  try {
    if (restore) {
      const existing = await prisma.testimonial.findMany({
        where: { id: { in: ids }, createdById: batchId },
        select: { id: true, name: true },
      });
      console.log(
        `${apply ? "Removing" : "Would remove"} ${existing.length} testimonial row(s) for batch ${batchId}.`
      );
      for (const row of existing) console.log(`  ${row.id}  ${row.name}`);
      if (apply && existing.length > 0) {
        const result = await prisma.testimonial.deleteMany({
          where: { id: { in: existing.map((row) => row.id) }, createdById: batchId },
        });
        console.log(`Removed ${result.count}.`);
      }
      if (!apply) console.log("Dry run. Re-run with --apply to delete these rows.");
      return;
    }

    console.log(`${apply ? "Applying" : "Dry run for"} batch ${batchId}.`);
    for (const row of seeds) {
      console.log(`  ${row.id}  ${row.name}  ${row.exam}`);
      console.log(`    ${row.quote}`);
    }
    if (!apply) {
      console.log("Dry run. Re-run with --apply and --backup-dir to insert these rows.");
      return;
    }

    if (!backupDir) {
      fail("Refusing --apply without --backup-dir. Nothing was written.");
    }

    const existing = await prisma.testimonial.findMany({ where: { id: { in: ids } } });
    mkdirSync(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `backup-${batchId}-${Date.now()}.json`);
    writeFileSync(backupPath, JSON.stringify(existing, null, 2));
    console.log(`Backup written: ${backupPath} (${existing.length} row(s)).`);

    for (const row of seeds) {
      const consentedAt = new Date(row.consentedAt);
      await prisma.testimonial.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          name: row.name,
          exam: row.exam,
          quote: row.quote,
          sortOrder: row.sortOrder,
          status: "approved",
          consentedAt,
          createdById: batchId,
          rating: null,
          photoUrl: null,
          outcome: null,
          featured: false,
        },
        update: {
          name: row.name,
          exam: row.exam,
          quote: row.quote,
          sortOrder: row.sortOrder,
          status: "approved",
          consentedAt,
          createdById: batchId,
          deletedAt: null,
          rating: null,
          photoUrl: null,
          outcome: null,
          featured: false,
        },
      });
    }
    console.log(`Applied ${seeds.length} testimonial(s).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
