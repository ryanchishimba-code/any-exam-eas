#!/usr/bin/env node
/**
 * Restore blueprintTopic on NCLEX full-exam-generated rows from their tags
 * (slot.blueprintTopic is embedded as a tag at generation time).
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { HIGH_YIELD_ROTATION } from "../src/lib/exam-prep/nclex/blueprint-quota";
import { slugifyNclexTopic } from "../src/lib/exam-prep/nclex/infer-blueprint-topic";

const ROTATION_SLUGS = new Set(
  Object.values(HIGH_YIELD_ROTATION)
    .flat()
    .map((t) => slugifyNclexTopic(t))
);

function topicFromFullExamTags(tags: string[] | undefined): string | null {
  for (const raw of tags ?? []) {
    const slug = slugifyNclexTopic(raw);
    if (ROTATION_SLUGS.has(slug)) return slug;
    // tags use hyphenated slugs; rotation uses spaces
    const spaced = raw.trim().toLowerCase();
    for (const topics of Object.values(HIGH_YIELD_ROTATION)) {
      for (const topic of topics) {
        if (slugifyNclexTopic(topic) === slug) return slugifyNclexTopic(topic);
        if (topic.toLowerCase() === spaced) return slugifyNclexTopic(topic);
      }
    }
  }
  return null;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const prisma = new PrismaClient();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "nursing",
      active: true,
      tags: { contains: "full-exam-generated" },
    },
  });

  const updates: { id: string; from: string | null; to: string }[] = [];
  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const restored = topicFromFullExamTags(item.tags);
    if (!restored) continue;
    const current = row.blueprintTopic?.trim() || null;
    if (current === restored) continue;
    updates.push({ id: row.id, from: current, to: restored });
  }

  console.log(`\nRestore NCLEX full-exam blueprintTopic`);
  console.log(`  candidates: ${rows.length}`);
  console.log(`  to restore: ${updates.length}`);
  console.log(`  mode: ${apply ? "APPLY" : "dry-run"}`);
  for (const u of updates.slice(0, 10)) {
    console.log(`    ${u.from ?? "(null)"} → ${u.to}`);
  }

  if (!apply) {
    await prisma.$disconnect();
    return;
  }

  for (let i = 0; i < updates.length; i += 50) {
    const batch = updates.slice(i, i + 50);
    await prisma.$transaction(
      batch.map((u) =>
        prisma.questionBankItem.update({
          where: { id: u.id },
          data: { blueprintTopic: u.to },
        })
      )
    );
  }
  console.log(`Done. Restored ${updates.length} rows.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
