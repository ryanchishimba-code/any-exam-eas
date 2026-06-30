#!/usr/bin/env node
/**
 * Repair NAPLEX calculation bank quality:
 * 1. Reclassify mislabeled constructed_response MCQs → vignette
 * 2. Promote physician-educator / case-calculation seeds to best tier
 * 3. Deactivate items that cannot be auto-repaired
 *
 * Usage:
 *   npm run db:fix-naplex-calculations
 *   npm run db:fix-naplex-calculations:dry
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { resolveNaplexStem } from "../src/lib/exam-prep/naplex-bank-audit";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
} from "../src/lib/exam-prep/naplex-format-coherence";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../src/lib/exam-prep/naplex-quality-gate";
import {
  alignNaplexBankItemAnswers,
  correctAnswerMatchesOption,
  recoverMisclassifiedMcqAnswer,
} from "../src/lib/exam-prep/naplex-answer-align";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const CALC_LEAD_IN =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

function isMisclassifiedConstructed(item: ReturnType<typeof enrichBankItemFromRow>): boolean {
  const stem = resolveNaplexStem(item);
  const hasMcqOptions = item.options.filter((o) => o.trim().length > 2).length >= 4;
  return item.itemType === "constructed_response" && hasMcqOptions && !CALC_LEAD_IN.test(stem);
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  console.log(
    `\nNAPLEX calculation bank repair — ${rows.length} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let reclassified = 0;
  let promoted = 0;
  let deactivated = 0;
  let unchanged = 0;

  const report: {
    reclassified: Array<{ id: string; stem: string; answer: string }>;
    promoted: Array<{ id: string; tier: string }>;
    deactivated: Array<{ id: string; reason: string; stem: string }>;
  } = { reclassified: [], promoted: [], deactivated: [] };

  for (const row of rows) {
    let item = enrichBankItemFromRow(row);
    let changed = false;
    let deactivatedThis = false;

    if (isMisclassifiedConstructed(item)) {
      const { item: repaired, changed: formatChanged, note } = fixNaplexFormatCoherence(item);
      const remainingIssues = detectNaplexFormatIssues(repaired);

      if (formatChanged && remainingIssues.length === 0) {
        item = repaired;
        changed = true;
        reclassified++;
        report.reclassified.push({
          id: row.id,
          stem: resolveNaplexStem(item).slice(0, 100),
          answer: item.correctAnswer.slice(0, 80),
        });
        console.log(`  ✓ reclassified ${row.id} — ${note ?? "vignette MCQ"}`);
      } else {
        deactivatedThis = true;
        report.deactivated.push({
          id: row.id,
          reason: remainingIssues.map((i) => i.code).join(", ") || "unresolved_misclassified_cr",
          stem: resolveNaplexStem(item).slice(0, 100),
        });
        console.log(`  ✗ deactivate ${row.id} — could not repair misclassified constructed_response`);
      }
    }

    if (!deactivatedThis && item.itemType === "constructed_response") {
      const tagList = item.tags ?? [];
      const mergedTags = [
        ...tagList,
        ...(CALC_LEAD_IN.test(resolveNaplexStem(item)) ? ["physician-educator", "case-calculation"] : []),
      ].filter((t, i, arr) => arr.indexOf(t) === i);
      if (mergedTags.length !== tagList.length) {
        item = { ...item, tags: mergedTags };
        changed = true;
      }
    }

    const tierBefore = assessNaplexItemQuality(enrichBankItemFromRow(row), {
      source: row.source,
    }).tier;
    const tierAfter = deactivatedThis
      ? "reject"
      : assessNaplexItemQuality(item, { source: row.source }).tier;
    const qaPassed = !deactivatedThis && isNaplexBestQuality(item, { source: row.source });

    if (!deactivatedThis && tierBefore !== "best" && tierAfter === "best") {
      promoted++;
      report.promoted.push({ id: row.id, tier: tierAfter });
    }

    const qaChanged = row.qaPassed !== qaPassed;
    if (deactivatedThis) {
      deactivated++;
    } else if (!changed && !qaChanged) {
      unchanged++;
      continue;
    }

    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          ...(deactivatedThis
            ? { active: false, qaPassed: false }
            : {
                scenario: item.vignette ?? item.scenario ?? null,
                question: item.question,
                options: serializeBankOptions(item),
                correctAnswer: item.correctAnswer,
                explanation: item.explanation,
                itemType: item.itemType ?? "mcq",
                tags: item.tags?.length ? JSON.stringify(item.tags) : row.tags,
                contentHash: bankItemContentHash("pharmacy", item.subjectId, item),
                qaPassed,
                active: true,
              }),
          qaAuditedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  const artifactDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactDir, { recursive: true });
  const reportPath = path.join(artifactDir, "naplex-calculation-fix-report.json");
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        dryRun,
        reclassified,
        promoted,
        deactivated,
        unchanged,
        details: report,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`\n── Calculation bank repair complete ──`);
  console.log(`Reclassified to vignette MCQ: ${reclassified}`);
  console.log(`Promoted to best tier:        ${promoted}`);
  console.log(`Deactivated (unrepairable):   ${deactivated}`);
  console.log(`Unchanged:                    ${unchanged}`);
  console.log(`Report: ${reportPath}\n`);

  const fixReportPath = path.join(artifactDir, "naplex-calculation-fix-report.json");
  if (existsSync(fixReportPath)) {
    const prior = JSON.parse(readFileSync(fixReportPath, "utf8")) as {
      details?: { reclassified?: Array<{ id: string }> };
    };
    const reclassifiedIds = prior.details?.reclassified?.map((row) => row.id) ?? [];
    if (reclassifiedIds.length > 0) {
      console.log(`Re-aligning ${reclassifiedIds.length} previously reclassified MCQ(s)…`);
      let realigned = 0;
      let deactivatedRealigned = 0;

      for (const id of reclassifiedIds) {
        const row = await prisma.questionBankItem.findUnique({ where: { id } });
        if (!row || !row.active) continue;

        let item = enrichBankItemFromRow(row);
        const recovered = recoverMisclassifiedMcqAnswer(item);
        if (recovered && recovered !== item.correctAnswer) {
          item = { ...item, correctAnswer: recovered };
        }
        const aligned = alignNaplexBankItemAnswers(item);
        item = aligned.item;

        const qaPassed = isNaplexBestQuality(item, { source: row.source });
        const deactivate =
          !correctAnswerMatchesOption(item.options, item.correctAnswer, item.itemType) ||
          !qaPassed;

        if (deactivate) {
          deactivatedRealigned++;
          if (!dryRun) {
            await prisma.questionBankItem.update({
              where: { id },
              data: { active: false, qaPassed: false, qaAuditedAt: new Date(), updatedAt: new Date() },
            });
          }
          continue;
        }

        if (aligned.changed || recovered !== row.correctAnswer) {
          realigned++;
          if (!dryRun) {
            await prisma.questionBankItem.update({
              where: { id },
              data: {
                correctAnswer: item.correctAnswer,
                options: serializeBankOptions(item),
                qaPassed,
                qaAuditedAt: new Date(),
                contentHash: bankItemContentHash("pharmacy", item.subjectId, item),
                updatedAt: new Date(),
              },
            });
          }
        }
      }

      console.log(`Re-aligned answers: ${realigned}`);
      console.log(`Deactivated after failed recovery: ${deactivatedRealigned}\n`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
