import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options.ts";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate.ts";

const fieldId = process.argv[2] ?? "usmle-step-2";
const prisma = new PrismaClient();
const BATCH = 500;
let skip = 0;
let qaPassed = 0;
let serveReady = 0;

while (true) {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
    skip,
    take: BATCH,
    orderBy: { id: "asc" },
  });
  if (!rows.length) break;
  qaPassed += rows.length;
  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    if (usmleBankItemIsServeReady(item, fieldId)) serveReady++;
  }
  skip += rows.length;
  if (rows.length < BATCH) break;
  if (skip % 2000 === 0) {
    console.log("scanned", skip, "serveReady", serveReady);
  }
}

console.log(JSON.stringify({ fieldId, qaPassed, serveReady }, null, 2));
await prisma.$disconnect();
