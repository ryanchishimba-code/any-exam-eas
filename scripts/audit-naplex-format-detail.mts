#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
} from "../src/lib/exam-prep/naplex-format-coherence";
import { prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { naplexBankItemIsServeReady } from "../src/lib/exam-prep/naplex-serve-gate";
import { resolveNaplexStem } from "../src/lib/exam-prep/naplex-bank-audit";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  const flagged: Array<{
    id: string;
    qaPassed: boolean;
    stem: string;
    answer: string;
    autoFix: boolean;
    serveReadyAfterPrepare: boolean;
    options: string[];
  }> = [];

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const codes = detectNaplexFormatIssues(item).map((i) => i.code);
    if (!codes.includes("naplex_stem_format_mismatch")) continue;

    const fix = fixNaplexFormatCoherence(item);
    const prepared = prepareNaplexBankItem(item);
    const afterPrepareCodes = detectNaplexFormatIssues(prepared).map((i) => i.code);

    flagged.push({
      id: row.id,
      qaPassed: row.qaPassed,
      stem: resolveNaplexStem(item).slice(0, 100),
      answer: item.correctAnswer.slice(0, 40),
      autoFix: fix.changed && detectNaplexFormatIssues(fix.item).length === 0,
      serveReadyAfterPrepare: naplexBankItemIsServeReady(prepared, { source: row.source }),
      options: item.options.slice(0, 4),
    });

    if (!fix.changed || afterPrepareCodes.length > 0) {
      // unresolved detail
    }
  }

  const counseling = flagged.filter((f) => /counseling/i.test(f.stem));
  const serveReadyBroken = flagged.filter((f) => f.qaPassed && !f.serveReadyAfterPrepare);
  const unresolved = flagged.filter((f) => !f.autoFix);

  console.log(JSON.stringify({
    totalActive: rows.length,
    flaggedHybrid: flagged.length,
    qaPassedFlagged: flagged.filter((f) => f.qaPassed).length,
    counselingHybrid: counseling.length,
    unresolvedCount: unresolved.length,
    unresolved,
    montelukastLike: flagged.filter(
      (f) => /montelukast|6-year-old|wheezing/i.test(f.stem) || f.options.some((o) => /montelukast/i.test(o))
    ),
  }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
