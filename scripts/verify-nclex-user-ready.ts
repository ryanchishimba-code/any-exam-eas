#!/usr/bin/env node
/**
 * Simulate what users receive: prepare each served NCLEX item and verify answer integrity.
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { auditNclexBankItem } from "../src/lib/exam-prep/nclex-bank-audit";
import { prepareNclexBankItem } from "../src/lib/exam-prep/nclex-format-coherence";
import { nclexBankItemIsServeReady } from "../src/lib/exam-prep/nclex-serve-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
    orderBy: { id: "asc" },
  });

  let missingAnswer = 0;
  let answerNotInOptions = 0;
  let editorialFail = 0;
  let serveBlock = 0;
  let emptyStem = 0;

  for (const row of rows) {
    const raw = enrichBankItemFromRow(row);
    const item = prepareNclexBankItem(raw);

    const answer = item.correctAnswer?.trim() ?? "";
    if (!answer) {
      missingAnswer++;
      continue;
    }

    if (item.options?.length >= 4 && !item.options.some((o) => o.trim() === answer)) {
      answerNotInOptions++;
    }

    const stem = [item.vignette, item.scenario, item.question].filter(Boolean).join(" ");
    if (stem.trim().length < 40) emptyStem++;

    if (!auditNclexBankItem(item).ok) editorialFail++;
    if (!auditBankItem(item, "nursing").ok) editorialFail++;
    if (!nclexBankItemIsServeReady(item, { source: row.source })) serveBlock++;
  }

  console.log("\nNCLEX user-ready verification (served pool)");
  console.log(`Served items checked:     ${rows.length}`);
  console.log(`Missing correctAnswer:    ${missingAnswer}`);
  console.log(`Answer not in options:    ${answerNotInOptions}`);
  console.log(`Empty/short stem:         ${emptyStem}`);
  console.log(`Editorial fail after prep: ${editorialFail}`);
  console.log(`Serve block after prep:   ${serveBlock}`);

  const ok =
    missingAnswer === 0 &&
    answerNotInOptions === 0 &&
    editorialFail === 0 &&
    serveBlock === 0;
  console.log(ok ? "\n✓ All served items are user-ready." : "\n✗ Issues remain in served pool.\n");
  process.exit(ok ? 0 : 1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
