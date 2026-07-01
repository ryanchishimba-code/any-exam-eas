#!/usr/bin/env node
/**
 * Insert QA-gated open-source NCLEX procedural items until best-tier target is met.
 *
 * Usage:
 *   npm run db:insert-nclex-oer-procedural
 *   npm run db:insert-nclex-oer-procedural -- --dry-run
 *   npm run db:insert-nclex-oer-procedural -- --target 4000
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";
import { ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { generateNclexOerProcedural, oerSeedToRawBankItem } from "../src/lib/edtech/seeds/nclex-oer-procedural";
import { polishOerNclexItem } from "../src/lib/exam-prep/nclex/oer-import-polish";
import { nclexItemPassesBestExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { NCLEX_BEST_TARGET_TOTAL } from "../src/lib/exam-prep/nclex/types";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { NCLEX_FULL_EXAM_VERSION } from "../src/lib/exam-prep/nclex/types";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const skipQaGate = process.argv.includes("--skip-qa-gate");

function parseTarget(): number {
  const idx = process.argv.indexOf("--target");
  if (idx >= 0 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1]!, 10);
  return NCLEX_BEST_TARGET_TOTAL;
}

async function countBest(): Promise<number> {
  return prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });
}

async function main() {
  const target = parseTarget();
  const startBest = await countBest();
  const need = Math.max(0, target - startBest);

  console.log(`\nNCLEX OER procedural insert — best-tier ${startBest}/${target} (need ${need})${dryRun ? " [dry-run]" : ""}\n`);

  if (need === 0) {
    console.log("Target already met.\n");
    return;
  }

  const pool = generateNclexOerProcedural(800);
  let created = 0;
  let updated = 0;
  let skippedQa = 0;
  let skippedDup = 0;
  let insertedBest = 0;

  for (const seed of pool) {
    const currentBest = startBest + insertedBest;
    if (currentBest >= target) break;

    const raw = oerSeedToRawBankItem(seed);
    const polished = polishOerNclexItem(raw, raw.tags ?? [], false);
    const pass = nclexItemPassesBestExamGate(polished);

    if (!pass) {
      skippedQa++;
      if (dryRun && skippedQa <= 5) {
        const verdict = assessNclexItemQuality(polished, { source: polished.source ?? null });
        console.log(
          `  [skip-qa] ${seed.subjectId} score=${verdict.score.toFixed(2)} issues=${verdict.issues.join(",")}`
        );
      }
      continue;
    }

    const hash = bankItemContentHash("nursing", seed.subjectId, polished);
    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true, qaPassed: true },
    });

    if (existing) {
      if (!existing.qaPassed && !dryRun) {
        await prisma.questionBankItem.update({
          where: { id: existing.id },
          data: {
            qaPassed: true,
            active: true,
            qaAuditedAt: new Date(),
            reviewStatus: "approved",
            updatedAt: new Date(),
          },
        });
        updated++;
        insertedBest++;
      } else {
        skippedDup++;
      }
      continue;
    }

    if (dryRun) {
      created++;
      insertedBest++;
      continue;
    }

    await prisma.questionBankItem.create({
      data: {
        fieldId: "nursing",
        subjectId: seed.subjectId,
        difficulty: polished.difficulty ?? 3,
        topicCategory: seed.topicCategory,
        blueprintDomain: "nclex-oer-procedural",
        generationVersion: `${NCLEX_FULL_EXAM_VERSION}-oer-procedural`,
        reviewStatus: "approved",
        itemType: "vignette",
        question: polished.question,
        scenario: polished.vignette ?? null,
        options: serializeBankOptions(polished),
        correctAnswer: polished.correctAnswer,
        explanation: polished.explanation ?? "",
        tags: JSON.stringify(polished.tags ?? []),
        references: polished.references?.length ? polished.references : undefined,
        source: "polished",
        contentHash: hash,
        active: true,
        qaPassed: true,
        qaAuditedAt: new Date(),
      },
    });
    created++;
    insertedBest++;
  }

  const endBest = dryRun ? startBest + insertedBest : await countBest();
  const report = {
    generatedAt: new Date().toISOString(),
    target,
    startBest,
    endBest,
    created,
    updated,
    skippedQa,
    skippedDup,
    poolSize: pool.length,
  };

  const dir = path.join(process.cwd(), "artifacts");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "nclex-oer-procedural-insert.json"), JSON.stringify(report, null, 2));

  console.log(`\nCreated: ${created} | Updated: ${updated} | QA skip: ${skippedQa} | Dup skip: ${skippedDup}`);
  console.log(`Best-tier: ${startBest} → ${endBest} / ${target}`);
  console.log(`Report: artifacts/nclex-oer-procedural-insert.json\n`);

  if (!dryRun && !skipQaGate && endBest < target) {
    console.log("Running NCLEX best QA gate…\n");
    execSync("npx tsx scripts/qa-gate-nclex-best.ts", { stdio: "inherit", cwd: process.cwd() });
  }

  if (!dryRun) {
    execSync("npx tsx scripts/audit-nclex-blueprint-gaps.ts", { stdio: "inherit", cwd: process.cwd() });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
