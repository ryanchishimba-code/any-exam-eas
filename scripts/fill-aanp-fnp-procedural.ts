#!/usr/bin/env node
/**
 * Fill AANP FNP bank using polished procedural templates (no OpenAI) — mirrors fill-pance-procedural.
 *
 * Usage:
 *   npm run db:fill-aanp-fnp-procedural -- --count 500
 *   npm run db:fill-aanp-fnp-procedural -- --target 6000
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { generateBulkQuestionsForSubject } from "../src/lib/bulk-question-generator";
import { polishUsmleBankItem } from "../src/lib/engine/polish/usmle-polish";
import {
  mergeAanpFnpAgeGroupQuotaWithCounts,
  mergeAanpFnpDomainQuotaWithCounts,
  planAanpFnpGenerationSlots,
  AANP_FNP_GENERATION_VERSION,
  AANP_FNP_TARGET_TOTAL,
} from "../src/lib/exam-prep/aanp-fnp";
import { runAanpFnpHybridGateSync } from "../src/lib/exam-prep/aanp-fnp/hybrid-gate";
import { repairAanpFnpBankItemDeterministic } from "../src/lib/exam-prep/aanp-fnp/vignette-repair";
import { getFieldSubject } from "../src/lib/field-subjects";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const SEQ_FILE = path.join(ARTIFACTS, "aanp-fnp-generation-seq.txt");

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 500;
  let target = AANP_FNP_TARGET_TOTAL;
  let dryRun = false;
  let minScore = 8;
  let seqStart: number | undefined;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--min-score" && args[i + 1]) minScore = parseFloat(args[++i]!);
    else if (a === "--seq-start" && args[i + 1]) seqStart = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
  }
  return { count, target, dryRun, minScore, seqStart };
}

function readGenerationSeq(): number {
  try {
    const n = parseInt(fs.readFileSync(SEQ_FILE, "utf8").trim(), 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeGenerationSeq(seq: number) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  fs.writeFileSync(SEQ_FILE, String(seq));
}

async function currentActive() {
  return prisma.questionBankItem.count({
    where: { fieldId: "aanp-fnp", active: true },
  });
}

async function quotaCounts() {
  const byDomain = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain"],
    where: { fieldId: "aanp-fnp", active: true, blueprintDomain: { not: null } },
    _count: { id: true },
  });
  const byAge = await prisma.questionBankItem.groupBy({
    by: ["patientAgeGroup"],
    where: { fieldId: "aanp-fnp", active: true, patientAgeGroup: { not: null } },
    _count: { id: true },
  });
  const countsByDomain: Record<string, number> = {};
  const countsByAgeGroup: Record<string, number> = {};
  for (const row of byDomain) countsByDomain[row.blueprintDomain ?? "unset"] = row._count.id;
  for (const row of byAge) countsByAgeGroup[row.patientAgeGroup ?? "unset"] = row._count.id;
  return { countsByDomain, countsByAgeGroup };
}

function buildProceduralItem(
  generationSeq: number,
  slot: ReturnType<typeof planAanpFnpGenerationSlots>[number]
) {
  const subject = getFieldSubject("aanp-fnp", slot.clinicalSystem);
  if (!subject) return null;

  const bulkIndex = generationSeq * 97 + slot.clinicalSystem.length;
  const raw = generateBulkQuestionsForSubject("aanp-fnp", subject, bulkIndex, 1)[0];
  if (!raw) return null;

  const polished = polishUsmleBankItem(
    raw,
    "aanp-fnp",
    slot.clinicalSystem,
    "AANP-FNP",
    generationSeq
  ).item;

  const repaired = repairAanpFnpBankItemDeterministic({
    ...polished,
    subjectId: slot.clinicalSystem,
    topicCategory: slot.clinicalSystem,
    blueprintDomain: slot.blueprintDomain,
    patientAgeGroup: slot.patientAgeGroup,
    blueprintTopic: slot.blueprintTopic,
    tags: [
      ...(polished.tags ?? []).filter((t) => t !== "bulk-bank"),
      "aanp-fnp-procedural",
      "AANP-FNP-2024",
      slot.blueprintDomain,
      slot.clinicalSystem,
      slot.patientAgeGroup,
    ],
    ngnPayload: {
      ...polished.ngnPayload,
      clinicalSystem: slot.clinicalSystem,
      patientAgeGroup: slot.patientAgeGroup,
      blueprintTopic: slot.blueprintTopic,
      blueprintDomain: slot.blueprintDomain,
      generationMeta: {
        pipelineVersion: AANP_FNP_GENERATION_VERSION,
        procedural: true,
        generationSeq,
        generatedAt: new Date().toISOString(),
      },
    },
  });

  return repaired;
}

async function main() {
  const { count, target, dryRun, minScore, seqStart } = parseArgs();
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const activeBefore = await currentActive();
  const remaining = Math.max(0, target - activeBefore);
  if (remaining === 0) {
    console.log(`AANP FNP bank already at ${activeBefore}/${target}.`);
    return;
  }

  let generationSeq = seqStart ?? readGenerationSeq();
  if (generationSeq < activeBefore) generationSeq = activeBefore;
  const generationSeqStart = generationSeq;

  const attemptCount = Math.min(Math.ceil(count * 3.5), Math.ceil(remaining * 3.5));
  const { countsByDomain, countsByAgeGroup } = await quotaCounts();
  const domainQuota = mergeAanpFnpDomainQuotaWithCounts(countsByDomain, target);
  const domainDeficits: Record<string, number> = {};
  for (const q of domainQuota) domainDeficits[q.domain] = q.deficit ?? 0;

  const ageQuota = mergeAanpFnpAgeGroupQuotaWithCounts(countsByAgeGroup, target);
  const ageGroupDeficits: Record<string, number> = {};
  for (const q of ageQuota) ageGroupDeficits[q.ageGroup] = q.deficit ?? 0;

  console.log(
    `AANP FNP procedural fill: ${activeBefore}/${target} — attempting ${attemptCount} slots from seq ${generationSeq}`
  );

  const slots = planAanpFnpGenerationSlots({
    count: attemptCount,
    domainDeficits,
    ageGroupDeficits,
    seed: generationSeq,
  });

  let accepted = 0;
  let rejected = 0;
  let inserted = 0;
  let skipped = 0;
  const batchId = `proc-${Date.now().toString(36)}`;

  for (let i = 0; i < slots.length; i++) {
    if (inserted >= remaining) break;

    const slot = slots[i]!;
    const seq = generationSeq++;
    const item = buildProceduralItem(seq, slot);
    if (!item) {
      rejected++;
      continue;
    }

    const gate = runAanpFnpHybridGateSync(item, { source: "generated" });
    if (!gate.ingestReady) {
      rejected++;
      continue;
    }
    const readyItem = gate.item;

    accepted++;
    if (dryRun) continue;

    const subjectId = slot.clinicalSystem;
    const hash = bankItemContentHash("aanp-fnp", subjectId, readyItem);
    const exists = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });
    if (exists) {
      skipped++;
      continue;
    }

    const generationMeta = readyItem.ngnPayload?.generationMeta ?? null;

    await prisma.questionBankItem.create({
      data: {
        fieldId: "aanp-fnp",
        subjectId,
        scenario: readyItem.vignette ?? null,
        difficulty: readyItem.difficulty ?? slot.difficulty,
        topicCategory: subjectId,
        blueprintDomain: slot.blueprintDomain,
        patientAgeGroup: slot.patientAgeGroup,
        blueprintTopic: slot.blueprintTopic,
        generationVersion: AANP_FNP_GENERATION_VERSION,
        reviewStatus: gate.reviewStatus,
        generationMeta: generationMeta ?? undefined,
        itemType: "vignette",
        question: readyItem.question,
        options: serializeBankOptions(readyItem),
        correctAnswer: readyItem.correctAnswer,
        explanation: readyItem.explanation,
        tags: readyItem.tags ? JSON.stringify(readyItem.tags) : null,
        references: readyItem.references?.length ? readyItem.references : undefined,
        source: "generated",
        contentHash: hash,
        active: true,
        qaPassed: true,
        qaAuditedAt: new Date(),
        lastReviewedAt: new Date(),
      },
    });
    inserted++;

    if (inserted % 100 === 0) {
      console.log(`  Inserted ${inserted} (${accepted} accepted, ${rejected} rejected)`);
    }
  }

  if (!dryRun) writeGenerationSeq(generationSeq);

  const activeAfter = dryRun ? activeBefore : await currentActive();
  const report = {
    batchId,
    activeBefore,
    activeAfter,
    target,
    attemptCount,
    generationSeqStart,
    generationSeqEnd: generationSeq,
    accepted,
    rejected,
    inserted,
    skipped,
    dryRun,
    generatedAt: new Date().toISOString(),
  };

  const reportPath = path.join(ARTIFACTS, `aanp-fnp-procedural-${batchId}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(
    `\nBatch ${batchId}: ${inserted} inserted, ${accepted} accepted, ${rejected} rejected, ${skipped} dupes`
  );
  console.log(`Bank: ${activeAfter}/${target} (${Math.round((activeAfter / target) * 100)}%)`);
  console.log(`Report: ${reportPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
