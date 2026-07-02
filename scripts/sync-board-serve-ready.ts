#!/usr/bin/env node
/**
 * Sync any board exam bank: qaPassed ↔ serve/best-tier pool.
 * Fills gaps for PANCE / AANP FNP / NPTE-PT; also supports all fields via --field.
 *
 * Usage:
 *   npm run db:sync-board-serve-ready -- --field pance
 *   npm run db:sync-board-serve-ready -- --field all
 *   npm run db:sync-board-serve-ready -- --field nursing --retire-non-best --retire-only
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  boardFieldLabel,
  boardItemIsUserReady,
  resolveBoardFieldArg,
  type BoardFieldId,
} from "../src/lib/exam-prep/board-serve-registry";
import { buildNclexStudyMetaPatch } from "../src/lib/exam-prep/nclex-study-meta";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { getSubjectsForFieldId } from "../src/lib/subjects/registry";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const BATCH = 400;
const RETIRE_CHUNK = 500;

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "all";
  let dryRun = false;
  let retireNonBest = false;
  let retireOnly = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--retire-non-best") retireNonBest = true;
    else if (args[i] === "--retire-only") retireOnly = true;
  }

  return { fields: resolveBoardFieldArg(field), dryRun, retireNonBest, retireOnly };
}

async function retireIds(ids: string[], dryRun: boolean) {
  for (let i = 0; i < ids.length; i += RETIRE_CHUNK) {
    const chunk = ids.slice(i, i + RETIRE_CHUNK);
    if (dryRun) continue;
    await prisma.questionBankItem.updateMany({
      where: { id: { in: chunk } },
      data: { active: false, qaPassed: false },
    });
  }
}

async function syncField(
  fieldId: BoardFieldId,
  opts: { dryRun: boolean; retireNonBest: boolean; retireOnly: boolean }
) {
  const { dryRun, retireNonBest, retireOnly } = opts;
  const label = boardFieldLabel(fieldId);
  const mode = retireOnly ? "retire non-best" : "serve-ready sync";
  console.log(`\n${label} (${fieldId}) — ${mode}${dryRun ? " [dry-run]" : ""}\n`);

  if (!dryRun) {
    await prisma.questionBankItem.updateMany({
      where: { fieldId, active: false },
      data: { qaPassed: false },
    });
  }

  const validSubjects = new Set(getSubjectsForFieldId(fieldId).map((s) => s.id));
  let lastId: string | undefined;
  let processed = 0;
  let serveReady = 0;
  let subjectFixed = 0;
  let studyMetaFixed = 0;
  let retired = 0;
  const qaUpdates: Array<{ id: string; qaPassed: boolean }> = [];
  const retireIdsList: string[] = [];

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;
    lastId = rows[rows.length - 1]!.id;

    for (const row of rows) {
      processed++;
      const item = enrichBankItemFromRow(row);
      const shouldServe = boardItemIsUserReady(fieldId, item, { source: row.source });
      if (shouldServe) serveReady++;
      else if (retireNonBest) retireIdsList.push(row.id);
      qaUpdates.push({ id: row.id, qaPassed: shouldServe });

      if (retireOnly || fieldId !== "nursing") continue;

      const meta = buildNclexStudyMetaPatch(item);
      const subjectChanged = meta.subjectId !== row.subjectId;
      const topicChanged = meta.topicCategory !== row.topicCategory;
      const optionsChanged =
        meta.changed &&
        JSON.stringify(meta.ngnPayload) !== JSON.stringify(item.ngnPayload ?? {});

      if (subjectChanged) subjectFixed++;
      if (meta.changed) studyMetaFixed++;
      if (!subjectChanged && !topicChanged && !optionsChanged) continue;
      if (dryRun) continue;

      const merged = { ...item, ...meta };
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          subjectId: meta.subjectId,
          topicCategory: meta.topicCategory,
          options: optionsChanged ? serializeBankOptions(merged) : row.options,
        },
      });
    }

    if (!dryRun && qaUpdates.length >= BATCH) {
      await applyQaPassedBatch(prisma, qaUpdates.splice(0, qaUpdates.length), dryRun);
    }

    if (processed % 2000 === 0) {
      console.log(`  … ${processed} scanned (${serveReady} serve-ready)`);
    }
  }

  if (!dryRun && qaUpdates.length > 0) {
    await applyQaPassedBatch(prisma, qaUpdates, dryRun);
  }

  if (retireNonBest && retireIdsList.length > 0) {
    await retireIds(retireIdsList, dryRun);
    retired = retireIdsList.length;
  }

  const active = await prisma.questionBankItem.count({ where: { fieldId, active: true } });
  const served = await prisma.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true },
  });

  const orphanServed = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId, active: true, qaPassed: true },
    _count: { id: true },
  });
  const orphans = orphanServed.filter((r) => validSubjects.size > 0 && !validSubjects.has(r.subjectId));

  console.log(`  ${label}: ${served} serve-ready / ${active} active`);
  if (retired) console.log(`  retired (below bar): ${retired}`);
  if (subjectFixed) console.log(`  NCLEX subject fixes: ${subjectFixed}`);
  if (studyMetaFixed) console.log(`  NCLEX study meta fixes: ${studyMetaFixed}`);
  if (processed && !retireOnly) {
    console.log(`  scanned: ${processed} (${((serveReady / processed) * 100).toFixed(1)}% serve-ready)`);
  }
  if (orphans.length) {
    console.log(
      `  ⚠ orphan subjectIds still served: ${orphans.map((r) => `${r.subjectId}(${r._count.id})`).join(", ")}`
    );
  }

  return { served, active, retired };
}

async function main() {
  const { fields, dryRun, retireNonBest, retireOnly } = parseArgs();
  let totalServed = 0;

  for (const fieldId of fields) {
    const { served } = await syncField(fieldId, { dryRun, retireNonBest, retireOnly });
    totalServed += served;
  }

  if (fields.length > 1) {
    console.log(`\nTotal serve-ready across fields: ${totalServed.toLocaleString()}\n`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
