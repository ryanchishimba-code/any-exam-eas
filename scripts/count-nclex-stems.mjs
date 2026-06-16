import { config } from "dotenv";
config({ path: ".env.local" });

import { prisma } from "../src/lib/prisma.ts";
import { curatedNclexWhereClause } from "../src/lib/question-bank/nclex-curated.ts";

const curatedWhere = {
  fieldId: "nursing",
  active: true,
  qaPassed: true,
  ...curatedNclexWhereClause(),
};

const total = await prisma.questionBankItem.count({ where: curatedWhere });
const rows = await prisma.questionBankItem.findMany({
  where: curatedWhere,
  select: { id: true, question: true },
});

const stems = new Set(rows.map((r) => r.question.trim().toLowerCase()));
const ids = new Set(rows.map((r) => r.id));
console.log("total rows", total, "unique ids", ids.size, "unique stems", stems.size);
