#!/usr/bin/env node
/**
 * Reversible seed for owner-supplied customer testimonials.
 *
 * Dry run by default. Nothing is written unless --apply is present.
 * This PR does not run --apply.
 *
 *   npx tsx scripts/seed-consented-testimonials.ts
 *   npx tsx scripts/seed-consented-testimonials.ts --apply
 *   npx tsx scripts/seed-consented-testimonials.ts --restore --batch testimonials-2026-09-27
 *   npx tsx scripts/seed-consented-testimonials.ts --remove --batch testimonials-2026-09-27 --apply
 */
import { loadEnvFiles } from "./load-env";
import {
  CONSENTED_TESTIMONIAL_BATCH_ID,
  CONSENTED_TESTIMONIAL_SEEDS,
} from "../src/lib/testimonials/consented-seed";

loadEnvFiles();

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const restore = args.has("--restore") || args.has("--remove");
const batchFlag = process.argv.indexOf("--batch");
const batchId = batchFlag >= 0 ? process.argv[batchFlag + 1] : CONSENTED_TESTIMONIAL_BATCH_ID;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main() {
  if (!batchId || batchId !== CONSENTED_TESTIMONIAL_BATCH_ID) {
    fail(`Unknown batch. This script only manages ${CONSENTED_TESTIMONIAL_BATCH_ID}.`);
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const ids = CONSENTED_TESTIMONIAL_SEEDS.map((row) => row.id);

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
    for (const row of CONSENTED_TESTIMONIAL_SEEDS) {
      console.log(`  ${row.id}  ${row.name}  ${row.exam}`);
      console.log(`    ${row.quote}`);
    }
    if (!apply) {
      console.log("Dry run. Re-run with --apply to insert these rows. No stars, photos, or pass claims.");
      return;
    }

    const consentedAt = new Date("2026-09-27T00:00:00.000Z");
    for (const row of CONSENTED_TESTIMONIAL_SEEDS) {
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
    console.log(`Applied ${CONSENTED_TESTIMONIAL_SEEDS.length} testimonials.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
