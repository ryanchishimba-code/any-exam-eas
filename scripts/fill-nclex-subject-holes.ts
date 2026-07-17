#!/usr/bin/env node
/**
 * Fill NCLEX lifespan subject holes (maternal-child, pediatrics-nursing, med-surg).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/fill-nclex-subject-holes.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/fill-nclex-subject-holes.ts --subjects maternal-child --batches 3 --count 40
 */
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import {
  generateNclexFullExam,
  insertNclexFullExamItems,
  planNclexLifespanSubjectHoleSlots,
  type NclexLifespanSubjectId,
} from "../src/lib/exam-prep/nclex";

const prisma = new PrismaClient();
const ALL_SUBJECTS: NclexLifespanSubjectId[] = [
  "maternal-child",
  "pediatrics-nursing",
  "med-surg",
];

function parseArgs() {
  const args = process.argv.slice(2);
  let subjects = [...ALL_SUBJECTS];
  let batches = 2;
  let count = 40;
  let dryRun = false;
  let startExam = 9300;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--subjects" && args[i + 1]) {
      subjects = args[++i]!
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is NclexLifespanSubjectId =>
          (ALL_SUBJECTS as string[]).includes(s)
        );
    } else if (args[i] === "--batches" && args[i + 1]) batches = parseInt(args[++i]!, 10);
    else if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (args[i] === "--start-exam" && args[i + 1]) startExam = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
  }

  return { subjects, batches, count, dryRun, startExam };
}

async function countSubject(subjectId: string): Promise<number> {
  return prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true, subjectId },
  });
}

async function main() {
  const { subjects, batches, count, dryRun, startExam } = parseArgs();
  if (!dryRun) requireOpenAiKey();

  console.log(
    `\nNCLEX lifespan subject hole fill — subjects=${subjects.join(",")} batches=${batches} count=${count}${dryRun ? " [dry-run]" : ""}\n`
  );

  let examNumber = startExam;
  for (const subjectId of subjects) {
    const before = await countSubject(subjectId);
    console.log(`▶ ${subjectId}: ${before} serve-ready before`);

    for (let b = 0; b < batches; b++) {
      const slots = planNclexLifespanSubjectHoleSlots({
        examNumber,
        questionCount: count,
        subjectId,
      });
      console.log(`  Exam ${examNumber}: ${slots.length} slots for ${subjectId}`);

      if (dryRun) {
        examNumber++;
        continue;
      }

      const batchId = `nclex-lifespan-${subjectId}-${examNumber}`;
      const bundle = await generateNclexFullExam({
        examNumber,
        questionCount: count,
        batchId,
        slots,
      });

      // Ensure stored subjectId matches the hole (generation may normalize).
      for (const item of bundle.items) {
        item.subjectId = subjectId;
        item.topicCategory = subjectId;
      }

      const inserted = await insertNclexFullExamItems(prisma, bundle, { batchId });
      console.log(
        `  Exam ${examNumber}: generated ${bundle.items.length}, created ${inserted.created}, skipped ${inserted.skipped}`
      );
      examNumber++;
    }

    const after = await countSubject(subjectId);
    console.log(`◀ ${subjectId}: ${before} → ${after} serve-ready\n`);
  }

  console.log("Done.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
