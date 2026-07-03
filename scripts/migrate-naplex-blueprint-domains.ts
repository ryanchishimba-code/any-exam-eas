#!/usr/bin/env node
/**
 * Migrate legacy naplex-area* blueprintDomain values to naplex-2026-* slugs.
 *
 * Usage:
 *   npm run db:migrate-naplex-blueprint
 *   npm run db:migrate-naplex-blueprint:dry
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  naplexBlueprintDomainNeedsMigration,
  targetNaplex2026BlueprintDomain,
} from "../src/lib/exam-prep/naplex/legacy-blueprint-map";

const prisma = new PrismaClient();
const BATCH = 500;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(`\nNAPLEX blueprint domain migration${dryRun ? " [dry-run]" : ""}\n`);

  let lastId: string | undefined;
  let scanned = 0;
  let migrated = 0;
  const fromTo: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
      select: {
        id: true,
        blueprintDomain: true,
        subjectId: true,
        itemType: true,
      },
    });

    if (rows.length === 0) break;

    const updates: Array<{ id: string; blueprintDomain: string }> = [];

    for (const row of rows) {
      scanned++;
      if (
        !naplexBlueprintDomainNeedsMigration({
          blueprintDomain: row.blueprintDomain,
          subjectId: row.subjectId,
          itemType: row.itemType,
        })
      ) {
        continue;
      }

      const next = targetNaplex2026BlueprintDomain({
        blueprintDomain: row.blueprintDomain,
        subjectId: row.subjectId,
        itemType: row.itemType,
      });
      const from = row.blueprintDomain?.trim() || "(unmapped)";
      const key = `${from} → ${next}`;
      fromTo[key] = (fromTo[key] ?? 0) + 1;
      updates.push({ id: row.id, blueprintDomain: next });
      migrated++;
    }

    if (!dryRun && updates.length > 0) {
      await prisma.$transaction(
        updates.map((u) =>
          prisma.questionBankItem.update({
            where: { id: u.id },
            data: { blueprintDomain: u.blueprintDomain },
          })
        )
      );
    }

    lastId = rows[rows.length - 1]!.id;
    if (scanned % 2000 === 0) {
      console.log(`  … scanned ${scanned}, queued ${migrated}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    scanned,
    migrated,
    transitions: fromTo,
  };

  const artifactDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactDir, { recursive: true });
  const reportPath = path.join(artifactDir, "naplex-blueprint-migration.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`\nScanned:  ${scanned}`);
  console.log(`Migrated: ${migrated}${dryRun ? " (would update)" : ""}`);
  console.log(`\nTop transitions:`);
  for (const [key, count] of Object.entries(fromTo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)) {
    console.log(`  ${key}: ${count}`);
  }
  console.log(`\nReport: ${reportPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
