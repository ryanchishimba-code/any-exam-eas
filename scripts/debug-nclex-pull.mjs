import { config } from "dotenv";
config({ path: ".env.local" });

import { prisma } from "../src/lib/prisma.ts";
import { curatedNclexWhereClause } from "../src/lib/question-bank/nclex-curated.ts";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options.ts";
import { dedupeBankItemsByStem, shuffleBankItems } from "../src/lib/question-bank-db.ts";

const want = 255;
const where = { fieldId: "nursing", active: true, qaPassed: true };
const curatedWhere = { ...where, ...curatedNclexWhereClause() };
const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
console.log("curatedTotal", curatedTotal);

const curatedWant = Math.min(curatedTotal, Math.max(Math.ceil(want * 1), Math.min(want, curatedTotal)));
const pull = Math.min(500, Math.max(curatedWant * 4, curatedWant + 40));
const skip = curatedTotal > pull ? Math.floor(Math.random() * Math.max(0, curatedTotal - pull)) : 0;
console.log("curatedWant", curatedWant, "pull", pull, "skip", skip);

const rows = await prisma.questionBankItem.findMany({
  where: curatedWhere,
  skip,
  take: pull,
  orderBy: { id: "asc" },
});
console.log("rows fetched", rows.length);

const collected = dedupeBankItemsByStem(shuffleBankItems(rows.map(enrichBankItemFromRow))).slice(0, curatedWant);
console.log("after dedupe slice", collected.length);

const result = await import("../src/lib/question-bank-db.ts").then((m) =>
  m.sampleQuestionBankItemsForField({ fieldId: "nursing", count: 255 })
);
console.log("sampleQuestionBankItemsForField", result.length);
