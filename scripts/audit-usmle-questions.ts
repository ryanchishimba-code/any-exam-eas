/**
 * Structural + editorial audit for USMLE bank rows (all step fields).
 *
 * Usage:
 *   npm run db:audit-usmle-bank
 *   npm run db:audit-usmle-bank -- --field usmle-step-2
 *   npm run db:audit-usmle-bank -- --json
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem, summarizeBankAudit } from "../src/lib/exam-prep/bank-audit";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let field: string | undefined;
  let limit = 0;
  let json = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i];
    else if (args[i] === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--json") json = true;
  }
  return { field, limit, json };
}

async function main() {
  const { field, limit, json } = parseArgs();
  const fieldIds = field ? [field] : [...USMLE_FIELDS];

  const results: Array<{
    ok: boolean;
    issues: ReturnType<typeof auditBankItem>["issues"];
    itemId: string;
    fieldId: string;
    subjectId: string;
    qaScore: number;
    examReady: boolean;
  }> = [];

  for (const fieldId of fieldIds) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true },
      orderBy: { id: "asc" },
      ...(limit > 0 ? { take: limit } : {}),
    });

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const bank = auditBankItem(item, fieldId);
      const qa = auditUsmleQaEditor(item, {
        fieldId,
        source: row.source,
        itemId: row.id,
        difficulty: row.difficulty,
      });
      results.push({
        ...bank,
        itemId: row.id,
        fieldId,
        subjectId: row.subjectId,
        qaScore: qa.overallScore,
        examReady: qa.examReady,
      });
    }
  }

  const summary = summarizeBankAudit(results);
  const examReadyCount = results.filter((r) => r.examReady).length;
  const failures = results.filter((r) => !r.ok);

  if (json) {
    console.log(
      JSON.stringify(
        {
          summary,
          passRate: summary.total ? (summary.pass / summary.total) * 100 : 0,
          examReadyCount,
          examReadyRate: summary.total ? examReadyCount / summary.total : 0,
          failures: failures.slice(0, 50).map((r) => ({
            itemId: r.itemId,
            fieldId: r.fieldId,
            subjectId: r.subjectId,
            qaScore: r.qaScore,
            issues: r.issues,
          })),
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`\nAuditing ${summary.total} active USMLE item(s)…\n`);
  console.log(`Bank audit pass: ${summary.pass}/${summary.total} (${((summary.pass / summary.total) * 100).toFixed(2)}%)`);
  console.log(`Exam-ready (QA): ${examReadyCount}/${summary.total} (${((examReadyCount / summary.total) * 100).toFixed(1)}%)`);
  console.log(`\nTop bank issue codes:`);
  for (const [code, count] of Object.entries(summary.byCode).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${code}: ${count}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
