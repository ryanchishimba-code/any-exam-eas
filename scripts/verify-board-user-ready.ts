#!/usr/bin/env node
/**
 * Simulate what users receive: prepare each served item and verify answer integrity.
 *
 * Usage:
 *   npm run db:verify-board-user-ready -- --field nursing
 *   npm run db:verify-board-user-ready -- --field all
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  boardFieldLabel,
  boardItemHasScorableAnswer,
  boardItemIsUserReady,
  boardItemPassesEditorialAudit,
  prepareBoardBankItem,
  resolveBoardFieldArg,
  type BoardFieldId,
} from "../src/lib/exam-prep/board-serve-registry";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "all";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
  }
  return resolveBoardFieldArg(field);
}

type FieldReport = {
  fieldId: BoardFieldId;
  served: number;
  missingAnswer: number;
  answerNotInOptions: number;
  emptyStem: number;
  editorialFail: number;
  serveBlock: number;
};

async function verifyField(fieldId: BoardFieldId): Promise<FieldReport> {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
    orderBy: { id: "asc" },
  });

  const report: FieldReport = {
    fieldId,
    served: rows.length,
    missingAnswer: 0,
    answerNotInOptions: 0,
    emptyStem: 0,
    editorialFail: 0,
    serveBlock: 0,
  };

  for (const row of rows) {
    const raw = enrichBankItemFromRow(row);
    const item = prepareBoardBankItem(fieldId, raw);

    const answer = item.correctAnswer?.trim() ?? "";
    if (!answer) {
      report.missingAnswer++;
      continue;
    }

    if ((item.options?.length ?? 0) >= 4 && !boardItemHasScorableAnswer(fieldId, raw)) {
      report.answerNotInOptions++;
    }

    const stem = [item.vignette, item.scenario, item.question].filter(Boolean).join(" ");
    if (stem.trim().length < 40) report.emptyStem++;

    if (!boardItemPassesEditorialAudit(fieldId, item)) report.editorialFail++;
    if (!boardItemIsUserReady(fieldId, raw, { source: row.source })) report.serveBlock++;
  }

  return report;
}

function printReport(report: FieldReport) {
  const label = boardFieldLabel(report.fieldId);
  console.log(`\n${label} user-ready verification (served pool)`);
  console.log(`Served items checked:      ${report.served}`);
  console.log(`Missing correctAnswer:     ${report.missingAnswer}`);
  console.log(`Answer not in options:     ${report.answerNotInOptions}`);
  console.log(`Empty/short stem:          ${report.emptyStem}`);
  console.log(`Editorial fail after prep: ${report.editorialFail}`);
  console.log(`Serve block after prep:    ${report.serveBlock}`);

  const ok =
    report.missingAnswer === 0 &&
    report.answerNotInOptions === 0 &&
    report.editorialFail === 0 &&
    report.serveBlock === 0;
  console.log(ok ? "✓ All served items are user-ready." : "✗ Issues remain in served pool.");
  return ok;
}

async function main() {
  const fields = parseArgs();
  let allOk = true;

  for (const fieldId of fields) {
    const report = await verifyField(fieldId);
    if (!printReport(report)) allOk = false;
  }

  console.log(allOk ? "\n✓ All fields user-ready.\n" : "\n✗ One or more fields have issues.\n");
  process.exit(allOk ? 0 : 1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
