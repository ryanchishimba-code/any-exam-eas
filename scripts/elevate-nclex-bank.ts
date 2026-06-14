#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { elevateNclexBankItem } from "../src/lib/engine/polish/nclex-elevate";
import { scoreNclexBankItem } from "../src/lib/engine/polish/nclex-polish";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg >= 0 ? Number.parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0;

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    orderBy: { createdAt: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(`\nNCLEX elevate — ${rows.length} items${dryRun ? " [dry-run]" : ""}\n`);

  let scanned = 0;
  let updated = 0;
  let best = 0;

  for (const row of rows) {
    scanned++;
    if (scanned % 50 === 0) console.log(`  … ${scanned}/${rows.length}, updated ${updated}, best ${best}`);

    const item = enrichBankItemFromRow(row);
    const subject = getFieldSubject("nursing", row.subjectId);
    const label = subject?.label ?? row.subjectId;

    const result = elevateNclexBankItem(item, row.subjectId, label, seedFromId(row.id), { forcePolish: true });
    const finalItem = result.item;
    const verdict = assessNclexItemQuality(finalItem, { source: "polished" });
    if (verdict.tier === "best") best++;

    const qaOk = verdict.tier === "best";
    if (!result.changed && row.qaPassed === qaOk && row.source === "polished") continue;

    const finalHash = bankItemContentHash("nursing", row.subjectId, finalItem);
    const collision = await prisma.questionBankItem.findFirst({
      where: { contentHash: finalHash, NOT: { id: row.id } },
    });
    if (collision) continue;

    if (dryRun) { updated++; continue; }

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        scenario: finalItem.vignette ?? finalItem.scenario ?? null,
        question: finalItem.question,
        options: serializeBankOptions(finalItem),
        correctAnswer: finalItem.correctAnswer,
        explanation: finalItem.explanation,
        tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
        contentHash: finalHash,
        source: "polished",
        qaPassed: qaOk,
        qaAuditedAt: new Date(),
      },
    });
    updated++;
  }

  const rate = scanned ? (best / scanned) * 100 : 0;
  console.log(`\nUpdated: ${updated} | Best tier: ${best} (${rate.toFixed(1)}%)`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
