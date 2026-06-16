import { config } from "dotenv";
config({ path: ".env.local" });

import { prisma } from "../src/lib/prisma.ts";
import { sampleQuestionBankItemsForField } from "../src/lib/question-bank-db.ts";
import { nclexItemPassesTimedExamGate } from "../src/lib/exam-prep/nclex-serve-gate.ts";
import { gatherTimedExamBankItems } from "../src/lib/questions/timed-exam-sampling.ts";
import { curatedNclexWhereClause } from "../src/lib/question-bank/nclex-curated.ts";

const curatedWhere = { fieldId: "nursing", active: true, qaPassed: true, ...curatedNclexWhereClause() };
const total = await prisma.questionBankItem.count({ where: curatedWhere });
console.log("curated count now", total);

for (let i = 0; i < 3; i++) {
  const batch = await sampleQuestionBankItemsForField({ fieldId: "nursing", count: 255 });
  const pass = batch.filter(nclexItemPassesTimedExamGate).length;
  console.log("sample round", i + 1, "batch", batch.length, "pass", pass);
}

const gathered = await gatherTimedExamBankItems({
  fieldId: "nursing",
  limit: 85,
  filterFn: nclexItemPassesTimedExamGate,
  initialSampleCount: 255,
});
console.log("gathered", gathered.length);
