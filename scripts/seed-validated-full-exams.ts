#!/usr/bin/env npx tsx
/**
 * Compose and seed curated preset full exams from the live bank.
 * Uses progressive threshold lowering to reach target exam counts.
 *
 * Usage:
 *   npx tsx scripts/seed-validated-full-exams.ts --exam nclex --exams 100
 *   npx tsx scripts/seed-validated-full-exams.ts --all --exams 100 --dry-run
 *
 * Requires DATABASE_URL (Neon Postgres).
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  composePracticeExamProgressive,
} from "@/lib/exam-prep/compose/compose-practice-exam";
import { minQuestionsForTier } from "@/lib/exam-prep/progressive-compose";
import {
  PRESET_EXAM_QUESTION_COUNT,
  PRESET_EXAM_SLUGS,
  clampPresetExamNumber,
  resolvePresetComposeSlug,
} from "@/lib/exam-prep/preset-exam-config";
import { insertValidatedPresetExam } from "@/lib/exam-prep/preset-exam-insert";

function parseArgs() {
  const args = process.argv.slice(2);
  let exam = "";
  let all = false;
  let exams = 100;
  let count = 0;
  let startFrom = 1;
  let dryRun = false;
  let seed: number | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exam" && args[i + 1]) exam = args[++i]!;
    else if (args[i] === "--all") all = true;
    else if (args[i] === "--exams" && args[i + 1]) exams = parseInt(args[++i]!, 10);
    else if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (args[i] === "--start-from" && args[i + 1]) startFrom = parseInt(args[++i]!, 10);
    else if (args[i] === "--seed" && args[i + 1]) seed = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
  }

  return { exam, all, exams, count, startFrom, dryRun, seed };
}

async function seedViaPracticeComposer(
  prisma: PrismaClient,
  examSlug: ExamSlug,
  opts: { exams: number; count: number; startFrom: number; dryRun: boolean; seed?: number }
) {
  const composeSlug = resolvePresetComposeSlug(examSlug);
  const targetCount = opts.count || PRESET_EXAM_QUESTION_COUNT[examSlug];
  const startExamNumber = clampPresetExamNumber(opts.startFrom);
  const batchId = `preset-batch-${examSlug}-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  const usedIds = new Set<string>();
  const baseSeed = opts.seed ?? ((Date.now() ^ 0x51ed270b) >>> 0);
  let inserted = 0;
  let failedStreak = 0;
  const entries: {
    examNumber: number;
    linked: number;
    tier: string;
    status: string;
  }[] = [];

  console.log(
    `\n=== ${EXAM_CATALOG[examSlug].name} — composing ${opts.exams} exams × ${targetCount} questions (progressive tiers, starting #${startExamNumber}) ===`
  );

  for (let i = 0; i < opts.exams; i++) {
    const examNumber = startExamNumber + i;
    const result = await composePracticeExamProgressive(composeSlug, {
      numQuestions: targetCount,
      seed: (baseSeed + examNumber * 0x9e3779b9) >>> 0,
      excludeQuestionIds: usedIds,
      outputFormat: "full_exam_study",
      failedStreak,
      examsComposed: inserted,
    });

    if (!result) {
      failedStreak++;
      console.error(
        `  ✗ Exam ${examNumber}: all progressive tiers exhausted — stopping batch.`
      );
      break;
    }

    failedStreak = 0;
    const { exam: composed, tier } = result;
    const questionIds = composed.questions
      .map((q) => q.questionId)
      .filter((id) => id && !id.startsWith("idx-"));
    const linked = questionIds.length;
    const minRequired = minQuestionsForTier(targetCount, tier);

    if (linked < minRequired) {
      console.error(
        `  ✗ Exam ${examNumber}: ${linked}/${minRequired} minimum at tier ${tier.id} — stopping batch.`
      );
      break;
    }

    const blueprintSummary = composed.questions.reduce<Record<string, number>>((acc, q) => {
      const key = q.domainLabel ?? q.domainId ?? "general";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    if (!opts.dryRun) {
      const title = `${EXAM_CATALOG[examSlug].shortName} Practice Exam ${examNumber}`;
      const insertResult = await insertValidatedPresetExam(prisma, {
        examSlug: composeSlug,
        examNumber,
        title,
        questionCount: linked,
        questionIds,
        batchId,
        qaPassed: linked >= minRequired,
        qaReport: {
          composeTier: tier.id,
          composeTierLabel: tier.label,
          targetCount,
          similarityFlags: composed.similarityFlags.slice(0, 20),
          selectionSummary: composed.selectionSummary,
        },
        blueprintSummary,
      });
      inserted++;
      entries.push({
        examNumber,
        linked: insertResult.linked,
        tier: tier.id,
        status: "inserted",
      });
      console.log(
        `  ✓ Exam ${examNumber}: linked ${insertResult.linked}/${targetCount} (tier ${tier.id})`
      );
    } else {
      entries.push({ examNumber, linked, tier: tier.id, status: "dry-run" });
      console.log(
        `  ✓ Exam ${examNumber}: composed ${linked}/${targetCount} tier ${tier.id} (dry run)`
      );
    }

    if (!tier.allowCrossExamReuse) {
      for (const id of questionIds) usedIds.add(id);
    }
  }

  const manifestPath = path.join(
    process.cwd(),
    "artifacts",
    `validated-full-exams-${examSlug}-${batchId}.json`
  );
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      { batchId, examSlug, targetCount, inserted, uniqueBankRowsUsed: usedIds.size, entries },
      null,
      2
    )
  );
  console.log(`Manifest → ${manifestPath}`);
  if (inserted < opts.exams) {
    console.warn(
      `Reached ${inserted}/${opts.exams} exams. Later tiers allow cross-exam reuse to stretch the bank.`
    );
  }
  return inserted;
}

async function main() {
  const { exam, all, exams, count, startFrom, dryRun, seed } = parseArgs();

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  if (!all && !exam) {
    console.error(
      "Usage: npx tsx scripts/seed-validated-full-exams.ts --exam <slug> [--exams 100] [--count N] [--dry-run]"
    );
    console.error(`Supported: ${PRESET_EXAM_SLUGS.join(", ")}`);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const targets = all ? PRESET_EXAM_SLUGS : ([exam as ExamSlug] as ExamSlug[]);
    let total = 0;
    for (const slug of targets) {
      if (!PRESET_EXAM_SLUGS.includes(slug)) {
        console.warn(`Skipping unknown exam slug: ${slug}`);
        continue;
      }
      total += await seedViaPracticeComposer(prisma, slug, {
        exams,
        count,
        startFrom,
        dryRun,
        seed,
      });
    }
    console.log(`\nDone. Total preset exams ${dryRun ? "composed" : "inserted"}: ${total}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
