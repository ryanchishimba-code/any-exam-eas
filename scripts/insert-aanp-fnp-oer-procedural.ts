#!/usr/bin/env node
/**
 * Insert open-source AANP FNP items until active QA-passed count reaches target.
 *
 * Usage:
 *   npm run db:insert-aanp-fnp-oer -- --target 3000
 *   npm run db:insert-aanp-fnp-oer -- --dry-run
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { generateAanpFnpOerProcedural } from "../src/lib/edtech/seeds/aanp-fnp-oer-procedural";
import { runAanpFnpHybridGateSync } from "../src/lib/exam-prep/aanp-fnp/hybrid-gate";
import { AANP_FNP_GENERATION_VERSION } from "../src/lib/exam-prep/aanp-fnp/types";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

function parseTarget(): number {
  const idx = process.argv.indexOf("--target");
  if (idx >= 0 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1]!, 10);
  return 3000;
}

const dryRun = process.argv.includes("--dry-run");
const target = parseTarget();

async function countQaPassed() {
  return prisma.questionBankItem.count({
    where: { fieldId: "aanp-fnp", active: true, qaPassed: true },
  });
}

async function main() {
  const start = await countQaPassed();
  const need = Math.max(0, target - start);

  console.log(`\nAANP FNP OER insert — ${start}/${target} (need ${need})${dryRun ? " [dry-run]" : ""}\n`);
  if (need === 0) return;

  const pool = generateAanpFnpOerProcedural(2000);
  let created = 0;
  let skippedQa = 0;
  let skippedDup = 0;

  for (const raw of pool) {
    if (start + created >= target) break;

    const gate = runAanpFnpHybridGateSync(raw, { source: "seed" });
    if (!gate.ingestReady) {
      skippedQa++;
      continue;
    }

    const item = gate.item;
    const subjectId = item.subjectId ?? "assess";
    const hash = bankItemContentHash("aanp-fnp", subjectId, item);

    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true, qaPassed: true },
    });

    if (existing) {
      if (!existing.qaPassed && !dryRun) {
        await prisma.questionBankItem.update({
          where: { id: existing.id },
          data: { qaPassed: true, active: true, qaAuditedAt: new Date() },
        });
        created++;
      } else {
        skippedDup++;
      }
      continue;
    }

    if (dryRun) {
      created++;
      continue;
    }

    const domain =
      item.blueprintDomain ??
      (item.ngnPayload?.blueprintDomain as string | undefined) ??
      subjectId;
    const ageGroup =
      item.patientAgeGroup ??
      (item.ngnPayload?.patientAgeGroup as string | undefined) ??
      null;

    await prisma.questionBankItem.create({
      data: {
        fieldId: "aanp-fnp",
        subjectId,
        scenario: item.vignette ?? null,
        difficulty: item.difficulty ?? 3,
        topicCategory: item.topicCategory ?? subjectId,
        blueprintDomain: domain,
        patientAgeGroup: ageGroup,
        blueprintTopic: item.blueprintTopic ?? null,
        generationVersion: `${AANP_FNP_GENERATION_VERSION}-oer`,
        reviewStatus: gate.reviewStatus,
        generationMeta: item.ngnPayload?.generationMeta ?? undefined,
        itemType: "vignette",
        question: item.question,
        options: serializeBankOptions(item),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation ?? "",
        tags: item.tags ? JSON.stringify(item.tags) : null,
        references: item.references?.length ? item.references : undefined,
        source: "seed",
        contentHash: hash,
        active: true,
        qaPassed: true,
        qaAuditedAt: new Date(),
        lastReviewedAt: new Date(),
      },
    });
    created++;
  }

  const end = dryRun ? start + created : await countQaPassed();
  const report = { start, end, target, created, skippedQa, skippedDup, poolSize: pool.length };
  const dir = path.join(process.cwd(), "artifacts");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "aanp-fnp-oer-insert.json"), JSON.stringify(report, null, 2));

  console.log(`Created: ${created} | QA skip: ${skippedQa} | Dup skip: ${skippedDup}`);
  console.log(`QA-passed: ${start} → ${end} / ${target}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
