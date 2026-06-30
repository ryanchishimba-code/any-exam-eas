#!/usr/bin/env node
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";
loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { primaryTestedConceptKey } from "../src/lib/exam-prep/exam-similarity";

async function main() {
  const prisma = new PrismaClient();
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    select: {
      id: true,
      blueprintTopic: true,
      blueprintDomain: true,
      tags: true,
      topicCategory: true,
      subjectId: true,
    },
  });
  const items = rows.map(enrichBankItemFromRow);
  const conceptCounts = new Map<string, number>();
  const tagOnly = new Map<string, number>();
  let tagFallback = 0;
  let topicKey = 0;
  let caseKey = 0;

  for (const item of items) {
    const k = primaryTestedConceptKey(item);
    conceptCounts.set(k, (conceptCounts.get(k) ?? 0) + 1);
    if (k.startsWith("tag:")) {
      tagFallback += 1;
      const t = k.slice(4);
      tagOnly.set(t, (tagOnly.get(t) ?? 0) + 1);
    } else if (k.startsWith("topic:")) topicKey += 1;
    else if (k.startsWith("case:")) caseKey += 1;
  }

  const topTags = [...tagOnly.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  const uniqueConcepts = conceptCounts.size;
  const cap80 = Math.min(6, Math.ceil(80 / Math.max(uniqueConcepts, 1)));

  console.log("NCLEX bank concept key analysis");
  console.log(`  Active items: ${items.length}`);
  console.log(`  Unique primary concept keys: ${uniqueConcepts}`);
  console.log(`  resolveExamUniquenessPolicy cap for 80Q: maxPerConcept=${cap80}`);
  console.log(`  Key source: topic=${topicKey} tag=${tagFallback} case=${caseKey}`);
  console.log(`  Tag fallback rate: ${((100 * tagFallback) / items.length).toFixed(1)}%`);
  console.log("\n  Top tag-only keys (items sharing this primary key):");
  for (const [t, n] of topTags) {
    const over = n > cap80 ? " ← exceeds 80Q cap" : "";
    console.log(`    tag:${t}: ${n}${over}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
