/**
 * Re-evaluate currently-served NCLEX (nursing) and NAPLEX (pharmacy) bank
 * items against the hardened ingest/serve gate and report the true "clean"
 * counts. With --apply, demotes failing rows (qaPassed=false) so the DB
 * matches what the runtime serve gate would actually allow.
 *
 *   npx tsx scripts/regate-clinical-bank.ts            # dry run (report only)
 *   npx tsx scripts/regate-clinical-bank.ts --apply    # demote failing rows
 */
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { bankItemPassesIngestGate } from "@/lib/exam-prep/bank-ingest-gate";

const APPLY = process.argv.includes("--apply");
const FIELDS = ["nursing", "pharmacy"] as const;

async function main() {
  for (const fieldId of FIELDS) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, qaPassed: true },
      select: {
        id: true,
        subjectId: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        solutionSteps: true,
        tags: true,
        itemType: true,
        scenario: true,
        difficulty: true,
        topicCategory: true,
        blueprintDomain: true,
        taskCategory: true,
        blueprintTopic: true,
        reviewStatus: true,
        generationVersion: true,
        generationMeta: true,
        references: true,
        source: true,
      },
    });

    let pass = 0;
    const failIds: string[] = [];
    const byCode: Record<string, number> = {};

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const ok = bankItemPassesIngestGate(fieldId, item, row.source);
      if (ok) {
        pass++;
        continue;
      }
      failIds.push(row.id);
      for (const issue of auditBankItem(item, fieldId).issues) {
        if (issue.severity === "error") byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
      }
    }

    console.log(`\n===== ${fieldId} =====`);
    console.log(`served (active+qaPassed): ${rows.length}`);
    console.log(`pass hardened gate:       ${pass}`);
    console.log(`fail hardened gate:       ${failIds.length}`);
    console.log("top error codes:", JSON.stringify(byCode, null, 0));

    if (APPLY && failIds.length > 0) {
      const BATCH = 500;
      let demoted = 0;
      for (let i = 0; i < failIds.length; i += BATCH) {
        const slice = failIds.slice(i, i + BATCH);
        const r = await prisma.questionBankItem.updateMany({
          where: { id: { in: slice } },
          data: { qaPassed: false },
        });
        demoted += r.count;
      }
      console.log(`DEMOTED (qaPassed=false): ${demoted}`);
    }
  }
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
