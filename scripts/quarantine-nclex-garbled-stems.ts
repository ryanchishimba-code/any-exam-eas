/**
 * Quarantine mashed double-stem NCLEX items from Phase 2 fill.
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-nclex-garbled-stems.ts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-nclex-garbled-stems.ts --apply
 */
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "nursing",
      active: true,
      subjectId: { in: ["fundamentals", "maternal-child"] },
      OR: [
        { question: { contains: "dry cough Which" } },
        { question: { contains: "? Which" } },
        { question: { contains: "? What" } },
      ],
    },
    select: { id: true, subjectId: true, question: true },
    take: 100,
  });

  const garbled = rows.filter(
    (r) =>
      /\?\s+(Which|What|How|Select)\b/i.test(r.question) ||
      /cough Which/i.test(r.question)
  );

  console.log(
    `\nGarbled-stem quarantine${apply ? " [apply]" : " [dry-run]"} — candidates ${rows.length}, true garbled ${garbled.length}\n`
  );
  for (const r of garbled) {
    console.log(`  · ${r.id} [${r.subjectId}] ${r.question.slice(0, 140)}`);
    if (apply) {
      await prisma.questionBankItem.update({
        where: { id: r.id },
        data: {
          active: false,
          qaPassed: false,
          reviewStatus: "nclex_stem_garbled_quarantine",
        },
      });
    }
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
