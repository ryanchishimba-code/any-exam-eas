#!/usr/bin/env node
/**
 * AI-elevate NAPLEX items that polish alone couldn't reach best tier.
 *
 * Usage:
 *   npm run db:curate-naplex-best:ai
 *   npm run db:curate-naplex-best:ai -- --dry-run --limit 25
 *
 * Requires OPENAI_API_KEY.
 */
import { loadEnvFiles, requireOpenAiKey } from "./load-env";
loadEnvFiles();
import { PrismaClient } from "@prisma/client";
import { curateNaplexBankItem } from "../src/lib/engine/curation";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../src/lib/exam-prep/naplex-quality-gate";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();

const BATCH_SIZE = 20;
const PROGRESS_EVERY = 25;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let subject: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--subject" && args[i + 1]) subject = args[++i];
  }
  return { limit, dryRun, subject };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type RowUpdate = {
  id: string;
  data: {
    scenario: string | null;
    question: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    tags: string | null;
    topicCategory: string | null;
    itemType: string | null;
    contentHash: string;
    qaPassed: boolean;
    qaAuditedAt: Date;
    source: string;
  };
};

async function flushUpdates(pending: RowUpdate[]) {
  if (pending.length === 0) return;
  const now = new Date();
  await prisma.$transaction(
    pending.map((u) =>
      prisma.questionBankItem.update({
        where: { id: u.id },
        data: { ...u.data, qaAuditedAt: now },
      })
    )
  );
  pending.length = 0;
}

async function main() {
  const { limit, dryRun, subject } = parseArgs();

  if (!dryRun) requireOpenAiKey();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(subject ? { subjectId: subject } : {}),
    },
    orderBy: { id: "asc" },
    ...(limit > 0 ? { take: limit * 4 } : {}),
  });

  const candidates = rows.filter((row) => {
    const item = enrichBankItemFromRow(row);
    return !isNaplexBestQuality(item, { source: row.source });
  });

  const toProcess = limit > 0 ? candidates.slice(0, limit) : candidates;

  console.log(
    `\nNAPLEX AI best elevation — ${toProcess.length} candidate(s) of ${rows.length} scanned${dryRun ? " [dry-run]" : ""}\n`
  );

  const stats = {
    scanned: 0,
    elevated: 0,
    stillBelow: 0,
    unchanged: 0,
    errors: 0,
  };

  const pending: RowUpdate[] = [];

  for (const row of toProcess) {
    stats.scanned++;
    const item = enrichBankItemFromRow(row);
    const before = assessNaplexItemQuality(item, { source: row.source });

    const fieldSubject = getFieldSubject("pharmacy", row.subjectId);
    const label = fieldSubject?.label ?? row.subjectId;

    try {
      const result = await curateNaplexBankItem(item, row.subjectId, {
        subjectLabel: label,
        seed: seedFromId(row.id),
        useAi: true,
        forceAi: true,
      });

      const after = assessNaplexItemQuality(result.item, { source: "ai-curated" });
      const isBest = isNaplexBestQuality(result.item, { source: "ai-curated" });

      if (!result.changed) {
        stats.unchanged++;
        continue;
      }

      if (!isBest) {
        stats.stillBelow++;
        if (stats.stillBelow <= 10) {
          console.log(
            `  [below-bar] ${row.id.slice(0, 10)}… ${before.tier}→${after.tier} score ${before.score.toFixed(2)}→${after.score.toFixed(2)} | ${after.issues.slice(0, 2).join(", ")}`
          );
        }
        continue;
      }

      const finalHash = bankItemContentHash("pharmacy", row.subjectId, result.item);
      const collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });
      if (collision) continue;

      if (dryRun) {
        console.log(
          `  [dry-run] ${row.id.slice(0, 10)}… ${before.tier}→best score ${before.score.toFixed(2)}→${after.score.toFixed(2)}`
        );
        stats.elevated++;
        continue;
      }

      pending.push({
        id: row.id,
        data: {
          scenario: result.item.vignette ?? result.item.scenario ?? null,
          question: result.item.question,
          options: serializeBankOptions(result.item),
          correctAnswer: result.item.correctAnswer,
          explanation: result.item.explanation,
          tags: result.item.tags ? JSON.stringify(result.item.tags) : row.tags,
          topicCategory: result.item.topicCategory ?? row.topicCategory,
          itemType: result.item.itemType ?? row.itemType,
          contentHash: finalHash,
          qaPassed: true,
          qaAuditedAt: new Date(),
          source: "ai-curated",
        },
      });
      stats.elevated++;

      if (pending.length >= BATCH_SIZE) {
        await flushUpdates(pending);
      }
    } catch (e) {
      stats.errors++;
      console.error(`  error ${row.id}:`, e instanceof Error ? e.message : e);
    }

    if (stats.scanned % PROGRESS_EVERY === 0) {
      console.log(`  … ${stats.scanned}/${toProcess.length} processed, ${stats.elevated} elevated`);
    }
  }

  await flushUpdates(pending);

  console.log(`\n── AI elevation summary ──`);
  console.log(`Candidates:   ${toProcess.length}`);
  console.log(`Scanned:      ${stats.scanned}`);
  console.log(`${dryRun ? "Would elevate" : "Elevated"}:   ${stats.elevated}`);
  console.log(`Still below:  ${stats.stillBelow}`);
  console.log(`Unchanged:    ${stats.unchanged}`);
  console.log(`Errors:       ${stats.errors}`);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
