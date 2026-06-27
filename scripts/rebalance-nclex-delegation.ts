#!/usr/bin/env node
/**
 * Rebalance NCLEX bank — repolish mis-delegated items and cap UAP/delegation serve rate.
 *
 *   npm run db:rebalance-nclex-delegation:dry
 *   npm run db:rebalance-nclex-delegation
 *   npm run db:rebalance-nclex-delegation -- --skip-repolish
 *   npm run db:rebalance-nclex-delegation -- --cap-only
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { elevateNclexBankItem } from "../src/lib/engine/polish/nclex-elevate";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import {
  delegationAllowedForSubject,
  isNclexDelegationStem,
  maxDelegationServeCount,
  NCLEX_DELEGATION_SERVE_CAP,
} from "../src/lib/exam-prep/nclex/delegation-balance";
import { resolveNclexStem, resolveNclexVignette } from "../src/lib/exam-prep/nclex-bank-audit";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const BATCH = 300;
const LOG = join(process.cwd(), "artifacts", "nclex-delegation-rebalance.json");

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    skipRepolish: args.includes("--skip-repolish") || args.includes("--cap-only"),
    capOnly: args.includes("--cap-only"),
  };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function itemHasDelegationStem(row: {
  question: string;
  scenario: string | null;
}): boolean {
  return isNclexDelegationStem(resolveNclexStem(enrichBankItemFromRow(row)), row.scenario);
}

type RankedDelegation = {
  id: string;
  subjectId: string;
  score: number;
  tier: string;
};

async function repolishMisdelegated(dryRun: boolean) {
  let lastId: string | undefined;
  let scanned = 0;
  let candidates = 0;
  let updated = 0;
  let fixed = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;

    for (const row of rows) {
      scanned++;
      if (!itemHasDelegationStem(row)) continue;
      if (delegationAllowedForSubject(row.subjectId)) continue;

      candidates++;
      const item = enrichBankItemFromRow(row);
      const subject = getFieldSubject("nursing", row.subjectId);
      const result = elevateNclexBankItem(
        item,
        row.subjectId,
        subject?.label ?? row.subjectId,
        seedFromId(row.id),
        { forcePolish: true }
      );
      const finalItem = result.item;
      const stillDelegation = isNclexDelegationStem(
        resolveNclexStem(finalItem),
        finalItem.scenario ?? finalItem.vignette
      );
      if (!stillDelegation) fixed++;

      const verdict = assessNclexItemQuality(finalItem, { source: "polished" });
      const finalHash = bankItemContentHash("nursing", row.subjectId, finalItem);
      const collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });
      if (collision) continue;

      if (dryRun) {
        updated++;
        continue;
      }

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          scenario: finalItem.vignette ?? finalItem.scenario ?? null,
          question: finalItem.question,
          options: serializeBankOptions(finalItem),
          correctAnswer: finalItem.correctAnswer,
          explanation: finalItem.explanation,
          tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
          contentHash: finalHash,
          source: "polished",
          qaPassed: verdict.tier === "best",
          qaAuditedAt: new Date(),
        },
      });
      updated++;
    }

    lastId = rows[rows.length - 1]!.id;
    if (scanned % 1500 === 0) {
      console.log(`  repolish … scanned ${scanned}, updated ${updated}, fixed ${fixed}`);
    }
  }

  return { scanned, candidates, updated, fixed };
}

async function capDelegationServed(dryRun: boolean) {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  const delegationRows = rows.filter((r) => itemHasDelegationStem(r));
  const cap = maxDelegationServeCount(rows.length);

  const ranked: RankedDelegation[] = [];
  for (const row of delegationRows) {
    const item = enrichBankItemFromRow(row);
    const verdict = assessNclexItemQuality(item, { source: row.source });
    ranked.push({
      id: row.id,
      subjectId: row.subjectId,
      score: verdict.score,
      tier: verdict.tier,
    });
  }

  ranked.sort((a, b) => {
    const tierScore = (t: string) => (t === "best" ? 2 : t === "acceptable" ? 1 : 0);
    return tierScore(b.tier) - tierScore(a.tier) || b.score - a.score;
  });

  const keep = new Set(ranked.slice(0, cap).map((r) => r.id));
  const demoteIds = delegationRows.filter((r) => !keep.has(r.id)).map((r) => r.id);

  if (!dryRun && demoteIds.length) {
    const now = new Date();
    for (let i = 0; i < demoteIds.length; i += BATCH) {
      const chunk = demoteIds.slice(i, i + BATCH);
      await prisma.questionBankItem.updateMany({
        where: { id: { in: chunk } },
        data: { qaPassed: false, qaAuditedAt: now },
      });
    }
  }

  return {
    servedTotal: rows.length,
    delegationBefore: delegationRows.length,
    delegationCap: cap,
    delegationKept: keep.size,
    demoted: demoteIds.length,
    delegationPctBefore: rows.length
      ? Number(((delegationRows.length / rows.length) * 100).toFixed(1))
      : 0,
    delegationPctAfter: rows.length
      ? Number(((keep.size / rows.length) * 100).toFixed(1))
      : 0,
  };
}

async function main() {
  const { dryRun, skipRepolish } = parseArgs();
  console.log(
    `\nNCLEX delegation rebalance (cap ${NCLEX_DELEGATION_SERVE_CAP * 100}% of served)${dryRun ? " [dry-run]" : ""}\n`
  );

  const repolish = skipRepolish
    ? { scanned: 0, candidates: 0, updated: 0, fixed: 0 }
    : await repolishMisdelegated(dryRun);

  if (!skipRepolish) {
    console.log(
      `Repolish: ${repolish.updated}/${repolish.candidates} mis-delegated items updated (${repolish.fixed} no longer delegation stems)`
    );
  }

  const cap = await capDelegationServed(dryRun);
  console.log(
    `Cap: ${cap.delegationBefore} delegation stems served → keep ${cap.delegationKept} (${cap.delegationPctAfter}% of ${cap.servedTotal})`
  );
  if (cap.demoted) console.log(`Demoted ${cap.demoted} excess delegation items from serve pool.`);

  mkdirSync(join(process.cwd(), "artifacts"), { recursive: true });
  writeFileSync(
    LOG,
    JSON.stringify({ at: new Date().toISOString(), dryRun, repolish, cap }, null, 2)
  );
  console.log(`Report: ${LOG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
