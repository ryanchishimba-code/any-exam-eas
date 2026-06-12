import { PrismaClient } from "@prisma/client";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } = require("../src/lib/edtech/seeds/usmle-physician-educator-batch-01.ts");
const { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } = require("../src/lib/edtech/seeds/usmle-physician-educator-batch-02.ts");
const { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } = require("../src/lib/edtech/seeds/usmle-physician-educator-batch-03.ts");

const prisma = new PrismaClient();

const curated = [
  ["batch-03", USMLE_PHYSICIAN_EDUCATOR_BATCH_03[0]],
  ["batch-03", USMLE_PHYSICIAN_EDUCATOR_BATCH_03[2]],
  ["batch-01", USMLE_PHYSICIAN_EDUCATOR_BATCH_01[0]],
  ["batch-02", USMLE_PHYSICIAN_EDUCATOR_BATCH_02[3]],
  ["batch-02", USMLE_PHYSICIAN_EDUCATOR_BATCH_02[8]],
  ["batch-01", USMLE_PHYSICIAN_EDUCATOR_BATCH_01[11]],
  ["batch-03", USMLE_PHYSICIAN_EDUCATOR_BATCH_03[6]],
  ["batch-02", USMLE_PHYSICIAN_EDUCATOR_BATCH_02[0]],
];

const bulk = await prisma.questionBankItem.findMany({
  where: {
    fieldId: "usmle-step-2",
    source: "polished",
    NOT: { tags: { contains: "physician-educator" } },
  },
  take: 2,
  orderBy: { updatedAt: "desc" },
});

const samples = [];

for (const [batch, item] of curated) {
  samples.push({
    tier: "physician-educator",
    batch,
    subject: item.subjectId,
    step: item.ngnPayload?.stepLevel,
    vignette: item.vignette?.trim() ?? "",
    stem: item.question?.trim() ?? "",
    options: item.options,
    correct: item.correctAnswer,
    explanation: item.explanation?.trim() ?? "",
  });
}

for (const row of bulk) {
  let options = [];
  try {
    options = JSON.parse(row.options);
  } catch {
    /* ignore */
  }
  const vignette = row.scenario?.trim() || row.question.split("\n\n")[0]?.trim() || "";
  const stem =
    row.scenario && row.question
      ? row.question.trim()
      : row.question.includes("\n\n")
        ? row.question.split("\n\n").slice(-1)[0].trim()
        : row.question.trim();
  samples.push({
    tier: "polished-bulk",
    batch: "auto-polished",
    subject: row.subjectId,
    step: "step2",
    vignette,
    stem,
    options,
    correct: row.correctAnswer,
    explanation: row.explanation?.trim() ?? "",
  });
}

console.log(JSON.stringify(samples.slice(0, 10), null, 2));
await prisma.$disconnect();
