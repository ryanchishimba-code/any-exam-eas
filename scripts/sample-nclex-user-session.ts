#!/usr/bin/env node
/**
 * Sample NCLEX questions as users receive them via /api/questions and verify answer UX.
 */
import { PrismaClient } from "@prisma/client";
import { prepareNclexItemsForSession } from "../src/lib/exam-prep/nclex-serve-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const SAMPLE = Number(process.env.SAMPLE ?? 50);

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
    orderBy: { id: "asc" },
    take: SAMPLE,
    skip: Math.floor(Math.random() * 3900),
  });

  const raw = rows.map(enrichBankItemFromRow);
  const prepared = prepareNclexItemsForSession({ items: raw, field: "nursing", limit: SAMPLE });

  let bad = 0;
  for (const item of prepared) {
    const opts = item.options ?? [];
    const answer = item.correctAnswer?.trim() ?? "";
    const stem = [item.vignette, item.scenario, item.question].filter(Boolean).join(" ").trim();
    const issues: string[] = [];

    if (opts.length < 4) issues.push(`only ${opts.length} options`);
    if (!answer) issues.push("missing answer");
    else if (!opts.some((o) => o.trim() === answer)) issues.push("answer not selectable");
    if (stem.length < 40) issues.push("stem too short");
    if (opts.some((o) => !o.trim())) issues.push("empty option");

    if (issues.length) {
      bad++;
      console.log(`✗ ${item.id ?? "?"} — ${issues.join(", ")}`);
      console.log(`  Q: ${(item.question ?? "").slice(0, 80)}…`);
    }
  }

  console.log(`\nNCLEX session sample (${prepared.length} items)`);
  console.log(`User-selectable with valid stems: ${prepared.length - bad}/${prepared.length}`);
  process.exit(bad ? 1 : 0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
