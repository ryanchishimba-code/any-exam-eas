#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { isNclexBestQuality } from "../src/lib/exam-prep/nclex-quality-gate";

const prisma = new PrismaClient();

async function main() {
  let lastId: string | undefined;
  let activeBest = 0;
  let qaPassedBest = 0;
  let qaPassedNotBest = 0;
  let activeBestNotQaPassed = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: 400,
    });
    if (!rows.length) break;
    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const best = isNclexBestQuality(item, { source: row.source });
      if (best) activeBest++;
      if (row.qaPassed && best) qaPassedBest++;
      if (row.qaPassed && !best) qaPassedNotBest++;
      if (!row.qaPassed && best) activeBestNotQaPassed++;
    }
    lastId = rows[rows.length - 1]!.id;
  }

  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  console.log(
    JSON.stringify(
      { qaPassed, activeBest, qaPassedBest, qaPassedNotBest, activeBestNotQaPassed },
      null,
      2
    )
  );
}

main().finally(() => prisma.$disconnect());
