#!/usr/bin/env node
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

const { PrismaClient } = await import("@prisma/client");
const { allUsmle2026TopicSlugs, USMLE_CROSS_CUTTING_TOPICS } = await import(
  "../src/lib/exam-prep/usmle/blueprint-topics-2026.ts"
);

const VALID = new Set([
  ...allUsmle2026TopicSlugs(),
  ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug),
]);

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[''""]/g, "")
    .replace(/[^\w-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const prisma = new PrismaClient();
const fields = ["usmle-step-1", "usmle-step-2", "usmle-step-3"];

for (const fieldId of fields) {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true },
    select: {
      blueprintTopic: true,
      blueprintDomain: true,
      subjectId: true,
      stepLevel: true,
    },
  });

  const total = rows.length;
  const missing = rows.filter((r) => !r.blueprintTopic?.trim()).length;
  const invalidExact = rows.filter(
    (r) => r.blueprintTopic?.trim() && !VALID.has(r.blueprintTopic.trim())
  );
  const invalidNormalized = rows.filter((r) => {
    const raw = r.blueprintTopic?.trim();
    if (!raw) return false;
    return !VALID.has(raw) && !VALID.has(normalizeSlug(raw));
  });

  const counts = new Map();
  for (const r of invalidExact) {
    counts.set(r.blueprintTopic, (counts.get(r.blueprintTopic) || 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);

  console.log(`\n=== ${fieldId} ===`);
  console.log(`total: ${total}`);
  console.log(`missing blueprintTopic: ${missing}`);
  console.log(`invalid slug (exact): ${invalidExact.length}`);
  console.log(`invalid slug (after normalize): ${invalidNormalized.length}`);
  console.log("top invalid blueprintTopic values:");
  for (const [k, v] of top) console.log(`  ${v}\t${k}`);
}

await prisma.$disconnect();
