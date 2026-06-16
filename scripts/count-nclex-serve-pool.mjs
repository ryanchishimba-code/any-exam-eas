import { config } from "dotenv";
config({ path: ".env.local" });

import { prisma } from "../src/lib/prisma.ts";
import { nclexItemPassesTimedExamGate } from "../src/lib/exam-prep/nclex-serve-gate.ts";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options.ts";
import { curatedNclexWhereClause } from "../src/lib/question-bank/nclex-curated.ts";

const batchSize = 500;
let skip = 0;
let total = 0;
let pass = 0;
let curatedPass = 0;
let curatedTotal = 0;

const curatedWhere = {
  fieldId: "nursing",
  active: true,
  qaPassed: true,
  ...curatedNclexWhereClause(),
};

curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
console.log("curated qaPassed total", curatedTotal);

while (true) {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
    skip,
    take: batchSize,
    orderBy: { id: "asc" },
  });
  if (rows.length === 0) break;
  for (const row of rows) {
    total++;
    const item = enrichBankItemFromRow(row);
    if (nclexItemPassesTimedExamGate(item)) pass++;
  }
  skip += rows.length;
  if (rows.length < batchSize) break;
}

console.log("qaPassed scanned", total, "runtime pass", pass);

skip = 0;
while (true) {
  const rows = await prisma.questionBankItem.findMany({
    where: curatedWhere,
    skip,
    take: batchSize,
    orderBy: { id: "asc" },
  });
  if (rows.length === 0) break;
  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    if (nclexItemPassesTimedExamGate(item)) curatedPass++;
  }
  skip += rows.length;
  if (rows.length < batchSize) break;
}

console.log("curated runtime pass", curatedPass, "/", curatedTotal);
