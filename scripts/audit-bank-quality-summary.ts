#!/usr/bin/env node
/**
 * Per-field bank quality snapshot — active, qaPassed, and runtime serve alignment.
 *
 * Usage:
 *   npm run db:audit-bank-quality
 *   npm run db:audit-bank-quality -- --field usmle-step-2
 */
import {
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { bankItemPassesIngestGate } from "../src/lib/exam-prep/bank-ingest-gate";

const prisma = getScriptPrisma();

const BOARD_FIELDS = [
  "nursing",
  "pharmacy",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

const SAMPLE = 500;

function parseFieldArg(): string | undefined {
  const idx = process.argv.indexOf("--field");
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function auditField(fieldId: string) {
  const [active, qaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
  ]);

  const sampleRows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true },
    orderBy: { updatedAt: "desc" },
    take: Math.min(SAMPLE, active),
  });

  let serveReady = 0;
  for (const row of sampleRows) {
    const item = enrichBankItemFromRow(row);
    if (bankItemPassesIngestGate(fieldId, item, row.source)) serveReady++;
  }

  const sampleRate = sampleRows.length ? serveReady / sampleRows.length : 0;
  const qaRate = active ? qaPassed / active : 0;
  const aligned = Math.abs(qaRate - sampleRate) < 0.08;

  return {
    fieldId,
    active,
    qaPassed,
    qaRate,
    sampleSize: sampleRows.length,
    serveReadySample: serveReady,
    serveRateSample: sampleRate,
    aligned,
  };
}

async function main() {
  const fieldFilter = parseFieldArg();
  const fields = fieldFilter ? [fieldFilter] : [...BOARD_FIELDS];

  console.log("\n── Question bank quality snapshot ──\n");
  console.log(
    "Field".padEnd(16) +
      "Active".padStart(8) +
      "Served".padStart(8) +
      "QA %".padStart(8) +
      "Serve*".padStart(8) +
      "  Status"
  );
  console.log("-".repeat(60));

  let totalActive = 0;
  let totalServed = 0;

  for (const fieldId of fields) {
    const row = await auditField(fieldId);
    totalActive += row.active;
    totalServed += row.qaPassed;

    const status = row.aligned ? "aligned" : "review gates";
    console.log(
      row.fieldId.padEnd(16) +
        String(row.active).padStart(8) +
        String(row.qaPassed).padStart(8) +
        `${(row.qaRate * 100).toFixed(1)}%`.padStart(8) +
        `${(row.serveRateSample * 100).toFixed(1)}%`.padStart(8) +
        `  ${status}`
    );
  }

  console.log("-".repeat(60));
  console.log(
    "TOTAL".padEnd(16) +
      String(totalActive).padStart(8) +
      String(totalServed).padStart(8) +
      `${totalActive ? ((totalServed / totalActive) * 100).toFixed(1) : 0}%`.padStart(8)
  );
  console.log(`\n* Serve % = sample of up to ${SAMPLE} recent rows passing runtime ingest gate.`);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectScriptPrisma());
