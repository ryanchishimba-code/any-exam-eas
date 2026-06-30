#!/usr/bin/env node
/**
 * Find pharmacy items with generic calculation stems on non-calculation vignettes.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { resolveNaplexStem, resolveNaplexVignette } from "../src/lib/exam-prep/naplex-bank-audit";
import { orphanGenericCalcStemIssue } from "../src/lib/exam-prep/naplex-format-coherence";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  const hits: Array<{
    id: string;
    itemType: string;
    qaPassed: boolean;
    serveReady: boolean;
    codes: string[];
    stem: string;
    vignette: string;
    answer: string;
    optionCount: number;
  }> = [];

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const issue = orphanGenericCalcStemIssue(item);
    if (!issue) continue;
    hits.push({
      id: row.id,
      itemType: row.itemType,
      qaPassed: row.qaPassed,
      serveReady: row.qaPassed && row.active,
      codes: issue.codes,
      stem: resolveNaplexStem(item).slice(0, 120),
      vignette: resolveNaplexVignette(item).slice(0, 160),
      answer: item.correctAnswer.slice(0, 60),
      optionCount: item.options.filter((o) => o.trim().length > 2).length,
    });
  }

  const out = path.join(process.cwd(), "artifacts/naplex-calc-vignette-mismatch-audit.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), count: hits.length, hits }, null, 2));

  console.log(`\nOrphan generic calc stems: ${hits.length} of ${rows.length} active pharmacy items`);
  console.log(`Served (qaPassed): ${hits.filter((h) => h.qaPassed).length}`);
  for (const h of hits.slice(0, 20)) {
    console.log(`  ${h.id} [${h.itemType}] qa=${h.qaPassed} opts=${h.optionCount}`);
    console.log(`    ${h.vignette.slice(0, 90)}…`);
    console.log(`    STEM: ${h.stem}`);
  }
  console.log(`\nReport: ${out}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
