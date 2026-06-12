import { writeFileSync } from "fs";
import { createRequire } from "module";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } = require("../src/lib/edtech/seeds/usmle-physician-educator-batch-01.ts");
const { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } = require("../src/lib/edtech/seeds/usmle-physician-educator-batch-02.ts");
const { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } = require("../src/lib/edtech/seeds/usmle-physician-educator-batch-03.ts");

const prisma = new PrismaClient();

function formatItem(n, batch, item) {
  const opts = item.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}${o === item.correctAnswer ? " ✓" : ""}`).join("\n");
  return `## ${n}. ${item.subjectId} (${item.ngnPayload?.stepLevel ?? "?"}) — ${batch}

${item.vignette?.trim() ?? ""}

**${item.question?.trim() ?? ""}**

${opts}

**Rationale:** ${item.explanation?.trim() ?? ""}

---`;
}

const batches = [
  ["batch-01", USMLE_PHYSICIAN_EDUCATOR_BATCH_01],
  ["batch-02", USMLE_PHYSICIAN_EDUCATOR_BATCH_02],
  ["batch-03", USMLE_PHYSICIAN_EDUCATOR_BATCH_03],
];

let n = 0;
const sections = ["# USMLE Physician-Educator Study Sheet", "", `**${USMLE_PHYSICIAN_EDUCATOR_BATCH_01.length + USMLE_PHYSICIAN_EDUCATOR_BATCH_02.length + USMLE_PHYSICIAN_EDUCATOR_BATCH_03.length} hand-crafted vignettes**`, ""];

for (const [batch, items] of batches) {
  sections.push(`# ${batch.toUpperCase()} (${items.length} items)`, "");
  for (const item of items) {
    n++;
    sections.push(formatItem(n, batch, item));
  }
}

const peMeningitis = USMLE_PHYSICIAN_EDUCATOR_BATCH_03.find((q) => q.tags?.includes("meningitis"));

const bulkRows = await prisma.questionBankItem.findMany({
  where: {
    fieldId: "usmle-step-2",
    active: true,
    OR: [
      { correctAnswer: { contains: "bacterial meningitis" } },
      { scenario: { contains: "neck stiffness" } },
      { question: { contains: "neck stiffness" } },
    ],
    NOT: { tags: { contains: "physician-educator" } },
  },
  take: 3,
  select: { subjectId: true, scenario: true, question: true, options: true, correctAnswer: true, explanation: true },
});

sections.push("# APPENDIX: Meningitis — physician-educator vs polished bulk", "");

if (peMeningitis) {
  sections.push("## Physician-educator (batch-03)", "");
  sections.push(formatItem("PE", "batch-03", peMeningitis));
}

for (const [i, row] of bulkRows.entries()) {
  let options = [];
  try {
    options = JSON.parse(row.options);
  } catch {
    /* ignore */
  }
  const fake = {
    subjectId: row.subjectId,
    ngnPayload: { stepLevel: "step2" },
    vignette: row.scenario ?? row.question.split("\n\n")[0] ?? "",
    question: row.scenario ? row.question : row.question.split("\n\n").slice(-1)[0] ?? row.question,
    options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
  };
  sections.push(`## Polished bulk example ${i + 1} (${row.subjectId})`, "");
  sections.push(formatItem(`BULK-${i + 1}`, "auto-polished", fake));
}

const outPath = "artifacts/usmle-physician-educator-study-sheet.md";
writeFileSync(outPath, sections.join("\n"));
console.log(`Wrote ${n} items + meningitis appendix → ${outPath}`);
await prisma.$disconnect();
