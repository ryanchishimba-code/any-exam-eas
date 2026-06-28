#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  assessNclexItemQuality,
  assessNclexServeQuality,
  NCLEX_SERVE_TARGET,
} from "../src/lib/exam-prep/nclex-quality-gate";

const prisma = new PrismaClient();
const BATCH = 500;

async function main() {
  const total = await prisma.questionBankItem.count({ where: { fieldId: "nursing", active: true } });
  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  console.log(`\nNCLEX serve-rate report — ${total} active items (target ${NCLEX_SERVE_TARGET})\n`);

  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let serve = 0;
  let reject = 0;
  const blockers: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const bestVerdict = assessNclexItemQuality(item, { source: row.source });
      const serveVerdict = assessNclexServeQuality(item, { source: row.source });
      if (bestVerdict.tier === "best") best++;
      if (serveVerdict.ok) serve++;
      else reject++;
      for (const code of serveVerdict.issues) blockers[code] = (blockers[code] ?? 0) + 1;
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 5000 === 0 || processed === total) console.log(`  … ${processed}/${total}`);
  }

  const serveRate = total ? (serve / total) * 100 : 0;
  const outPath = path.join(process.cwd(), "artifacts", "nclex-serve-rate-report.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        target: NCLEX_SERVE_TARGET,
        total,
        best,
        serve,
        serveRatePercent: serveRate,
        dbQaPassed: qaPassed,
        topBlockers: blockers,
      },
      null,
      2
    )
  );

  console.log(`\nBest tier: ${best} | Serve-ready: ${serve} / ${total} (${serveRate.toFixed(1)}%)`);
  console.log(`DB qaPassed: ${qaPassed}`);
  console.log(serve >= NCLEX_SERVE_TARGET ? "\n✓ 5K serve target met." : `\n⚠ ${NCLEX_SERVE_TARGET - serve} below target`);
  console.log(`Report: ${outPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
