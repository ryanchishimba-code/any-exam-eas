#!/usr/bin/env node
/**
 * Review active NAPLEX bank rows and keep only best-tier (A+) items.
 *
 * - best tier  → active=true,  qaPassed=true
 * - all others → active=false, qaPassed=false (archived, not served)
 *
 * Usage:
 *   npm run db:review-naplex
 *   npm run db:review-naplex:dry
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../src/lib/exam-prep/naplex-quality-gate";

const prisma = new PrismaClient();
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

type TierStats = { best: number; acceptable: number; reject: number };
type SubjectStats = Record<string, TierStats & { kept: number; archived: number }>;

async function main() {
  const total = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });

  console.log(
    `\nNAPLEX A+ review — ${total} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let kept = 0;
  let archived = 0;
  const tiers: TierStats = { best: 0, acceptable: 0, reject: 0 };
  const rejectCodes: Record<string, number> = {};
  const bySubject: SubjectStats = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });

    if (rows.length === 0) break;

    const updates: Array<{
      id: string;
      active: boolean;
      qaPassed: boolean;
    }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const verdict = assessNaplexItemQuality(item, { source: row.source });
      const pass = isNaplexBestQuality(item, { source: row.source });

      tiers[verdict.tier]++;
      for (const code of verdict.issues) {
        rejectCodes[code] = (rejectCodes[code] ?? 0) + 1;
      }

      const sid = row.subjectId;
      if (!bySubject[sid]) {
        bySubject[sid] = { best: 0, acceptable: 0, reject: 0, kept: 0, archived: 0 };
      }
      bySubject[sid][verdict.tier]++;
      if (pass) {
        kept++;
        bySubject[sid].kept++;
      } else {
        archived++;
        bySubject[sid].archived++;
      }

      updates.push({ id: row.id, active: pass, qaPassed: pass });
    }

    if (!dryRun) {
      const now = new Date();
      await prisma.$transaction(
        updates.map((u) =>
          prisma.questionBankItem.update({
            where: { id: u.id },
            data: {
              active: u.active,
              qaPassed: u.qaPassed,
              qaAuditedAt: now,
            },
          })
        )
      );
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} (kept ${kept}, archived ${archived})`);
    }
  }

  const keepRate = total ? (kept / total) * 100 : 0;
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    totalReviewed: processed,
    kept,
    archived,
    keepRatePercent: keepRate,
    tiers,
    topRejectReasons: Object.fromEntries(
      Object.entries(rejectCodes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
    ),
    bySubject,
  };

  const artifactDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactDir, { recursive: true });
  const reportPath = path.join(artifactDir, "naplex-review-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`\n── NAPLEX A+ review complete ──`);
  console.log(`Reviewed:     ${processed}`);
  console.log(`Kept (best):  ${kept} (${keepRate.toFixed(1)}%)`);
  console.log(`Archived:     ${archived}`);
  console.log(`\nTier breakdown:`);
  console.log(`  Best:        ${tiers.best}`);
  console.log(`  Acceptable:  ${tiers.acceptable} (archived — below A+ bar)`);
  console.log(`  Reject:      ${tiers.reject} (archived)`);
  console.log(`\nTop quality blockers (archived items):`);
  for (const [code, count] of Object.entries(rejectCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)) {
    console.log(`  ${code}: ${count}`);
  }

  if (!dryRun) {
    const activeBest = await prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true, qaPassed: true },
    });
    const inactive = await prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: false },
    });
    console.log(`\nDatabase now:`);
    console.log(`  Active A+ items: ${activeBest}`);
    console.log(`  Inactive total:  ${inactive}`);
  } else {
    console.log(`\nDry-run — no database updates written.`);
  }

  console.log(`\nReport: ${reportPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
