#!/usr/bin/env node
/**
 * Serve QA gate that preserves authentic NGN formats.
 * Classic vignettes keep the standard serve bar; NGN formats use exam-fill /
 * audit-clean rules so missing MCQ distractor JSON does not wipe bowtie/matrix/case.
 */
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import {
  isNclexExamFillQuality,
  isNclexServeQuality,
} from "../src/lib/exam-prep/nclex-quality-gate";
import { auditNclexBankItem, nclexHasServeBlockIssues } from "../src/lib/exam-prep/nclex-bank-audit";
import { prepareNclexBankItem } from "../src/lib/exam-prep/nclex-format-coherence";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

const NGN_TYPES = new Set([
  "select_all",
  "sata",
  "ngn_bowtie",
  "bow_tie",
  "ngn_matrix",
  "matrix",
  "ordered_response",
  "ngn_highlight",
  "highlight",
  "case_study",
  "unfolding_case",
]);

function passesNgnServe(item: ReturnType<typeof enrichBankItemFromRow>): boolean {
  const prepared = prepareNclexBankItem(item);
  // duplicate_vignette_in_stem is repaired by prepareNclexBankItem for NGN packs
  if (nclexHasServeBlockIssues(prepared)) return false;
  const audit = auditNclexBankItem(prepared);
  const hard = audit.issues.filter((i) => i.severity === "error");
  if (hard.length > 0) return false;
  if (isNclexExamFillQuality(prepared, { source: prepared.source ?? "seed" })) return true;
  const explanation = prepared.explanation?.trim() ?? "";
  return explanation.length >= 40 && Boolean(prepared.correctAnswer?.trim());
}

async function main() {
  const where = { fieldId: "nursing", active: true };
  const total = await prisma.questionBankItem.count({ where });
  console.log(
    `\nNCLEX NGN-preserving serve QA — ${total} active nursing items${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let pass = 0;
  let reject = 0;
  let ngnPass = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { ...where, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    const updates: Array<{ id: string; qaPassed: boolean }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const type = (item.itemType ?? row.itemType ?? "vignette").trim();
      const ok = NGN_TYPES.has(type)
        ? passesNgnServe(item)
        : isNclexServeQuality(item, { source: row.source });
      if (ok) {
        pass++;
        if (NGN_TYPES.has(type)) ngnPass++;
      } else {
        reject++;
      }
      updates.push({ id: row.id, qaPassed: ok });
    }

    if (!dryRun) {
      await applyQaPassedBatch(prisma, updates, dryRun);
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} (pass ${pass}, reject ${reject}, ngnPass ${ngnPass})`);
    }
  }

  console.log(`\nServe pass: ${pass} | Rejected: ${reject} | NGN pass: ${ngnPass}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
