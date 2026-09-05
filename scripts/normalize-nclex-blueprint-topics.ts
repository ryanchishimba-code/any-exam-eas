#!/usr/bin/env node
/**
 * Normalize NCLEX blueprintTopic aliases → 2026 canonical slugs.
 *
 * Default: alias-only (safe). Optional --content retags only weak/non-canonical
 * topics that strongly match thin Study Hub gaps (disaster/burns/etc.).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/normalize-nclex-blueprint-topics.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/normalize-nclex-blueprint-topics.ts --apply
 *   bash scripts/run-with-node.sh npx tsx scripts/normalize-nclex-blueprint-topics.ts --apply --content
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { canonicalizeNclexBlueprintTopic } from "../src/lib/exam-prep/nclex/blueprint-topic-aliases";
import { allNclex2026TopicSlugs } from "../src/lib/exam-prep/nclex/blueprint-topics-2026";
import { inferNclexBlueprint } from "../src/lib/exam-prep/nclex/infer-blueprint-topic";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");
const allowContent = process.argv.includes("--content");
const OUT = path.join(process.cwd(), "artifacts", "nclex-blueprint-normalize.json");
const CANONICAL = new Set(allNclex2026TopicSlugs());

/** Protect maternal / specialty topics from opportunistic content retags. */
const PROTECTED_PREFIXES = [
  "postpartum",
  "prenatal",
  "pregnancy",
  "breastfeed",
  "labor",
  "newborn",
  "pediatric",
  "delegation",
  "fire-safety",
  "ethical",
  "informed-consent",
];

function isProtectedTopic(topic: string | null): boolean {
  if (!topic) return false;
  const t = topic.toLowerCase();
  return PROTECTED_PREFIXES.some((p) => t.includes(p));
}

function isUsableTopic(slug: string | null | undefined): slug is string {
  if (!slug?.trim()) return false;
  const s = slug.trim();
  if (s.length > 48) return false;
  if (/\d{2,}|\bbmi\b|\bbp-\d/i.test(s)) return false;
  const canon = canonicalizeNclexBlueprintTopic(s) ?? s;
  return CANONICAL.has(canon);
}

/** Only fill truly empty/gap topics — never overwrite good specialty tags. */
const CONTENT_TARGETS: Array<{ slug: string; pattern: RegExp }> = [
  {
    slug: "disaster-triage",
    pattern: /\b(START triage|mass casualty|\bMCI\b|triage tag|black tag|red tag)\b/i,
  },
  {
    slug: "burns-trauma",
    pattern: /\b(Parkland|TBSA|rule of nines|burn (?:patient|victim|injury)|full-thickness burn)\b/i,
  },
  {
    slug: "musculoskeletal",
    pattern: /\b(compartment syndrome|fat embolism|cast care|skeletal traction)\b/i,
  },
];

type Update = {
  id: string;
  prevTopic: string | null;
  nextTopic: string;
  reason: "alias" | "content" | "infer";
};

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    select: {
      id: true,
      subjectId: true,
      blueprintTopic: true,
      blueprintDomain: true,
      scenario: true,
      question: true,
      explanation: true,
      tags: true,
      options: true,
      correctAnswer: true,
      itemType: true,
      difficulty: true,
      source: true,
    },
  });

  const updates: Update[] = [];
  const byReason = { alias: 0, content: 0, infer: 0 };

  for (const row of rows) {
    const prev = row.blueprintTopic?.trim() || null;
    const aliasedRaw = canonicalizeNclexBlueprintTopic(prev);
    const aliased =
      aliasedRaw && aliasedRaw !== prev && CANONICAL.has(aliasedRaw) ? aliasedRaw : null;

    if (aliased) {
      updates.push({ id: row.id, prevTopic: prev, nextTopic: aliased, reason: "alias" });
      byReason.alias++;
      continue;
    }

    // Infer only for null/empty topics
    if (!prev) {
      const item = enrichBankItemFromRow(row);
      const inferred = inferNclexBlueprint(item);
      const canon =
        canonicalizeNclexBlueprintTopic(inferred.blueprintTopic) ?? inferred.blueprintTopic;
      if (isUsableTopic(canon)) {
        updates.push({ id: row.id, prevTopic: prev, nextTopic: canon, reason: "infer" });
        byReason.infer++;
        continue;
      }
    }

    if (!allowContent) continue;
    if (isProtectedTopic(prev)) continue;
    if (prev && CANONICAL.has(prev)) continue; // never overwrite a valid catalog slug

    const text = `${row.scenario ?? ""}\n${row.question ?? ""}`;
    for (const target of CONTENT_TARGETS) {
      if (!target.pattern.test(text)) continue;
      if (!CANONICAL.has(target.slug)) continue;
      if (prev === target.slug) break;
      updates.push({ id: row.id, prevTopic: prev, nextTopic: target.slug, reason: "content" });
      byReason.content++;
      break;
    }
  }

  console.log(
    `\nNCLEX blueprintTopic normalize${apply ? "" : " [dry-run]"}${allowContent ? " +content-gaps" : " (alias/infer only)"}`
  );
  console.log(`  scanned: ${rows.length}`);
  console.log(`  to update: ${updates.length}`);
  console.log(`  by reason:`, byReason);
  console.log("  samples:");
  for (const u of updates.slice(0, 12)) {
    console.log(`    ${u.prevTopic ?? "(null)"} → ${u.nextTopic} [${u.reason}]`);
  }

  if (apply && updates.length) {
    let written = 0;
    for (const u of updates) {
      await prisma.questionBankItem.update({
        where: { id: u.id },
        data: { blueprintTopic: u.nextTopic, updatedAt: new Date() },
      });
      written++;
      if (written % 200 === 0) console.log(`  … wrote ${written}/${updates.length}`);
    }
    console.log(`  wrote ${written} rows`);
  }

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        apply,
        allowContent,
        scanned: rows.length,
        updated: updates.length,
        byReason,
        samples: updates.slice(0, 50),
      },
      null,
      2
    )
  );
  console.log(`\nWrote ${OUT}`);
  if (!apply) console.log("Pass --apply to write changes.");

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
