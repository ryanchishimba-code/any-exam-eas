#!/usr/bin/env node
/**
 * Backfill USMLE blueprintTopic + blueprintDomain for bank rows.
 *
 *   npx tsx scripts/reseed-usmle-blueprint-topics.ts              # dry-run stats
 *   npx tsx scripts/reseed-usmle-blueprint-topics.ts --apply
 *   npx tsx scripts/reseed-usmle-blueprint-topics.ts --apply --field usmle-step-2
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  inferUsmleBlueprint,
  isValidUsmle2026BlueprintTopic,
  resolveLegacyUsmleTopicAlias,
} from "../src/lib/exam-prep/usmle/infer-blueprint-topic";
import { getUsmle2026Topic } from "../src/lib/exam-prep/usmle/blueprint-topics-2026";
import { resolveOrganSystemId } from "../src/lib/exam-prep/usmle/content-spine";

const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let field: string | undefined;
  let limit = 0;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--field" && args[i + 1]) field = args[++i];
    else if (a === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
  }
  return {
    apply: args.includes("--apply"),
    field,
    limit,
  };
}

function resolveStepLevel(stepLevel: string | null | undefined, fieldId: string) {
  const fromRow = stepLevel?.trim().toLowerCase();
  if (fromRow === "step1" || fromRow === "step2" || fromRow === "step3") return fromRow;
  if (fieldId === "usmle-step-1") return "step1";
  if (fieldId === "usmle-step-3") return "step3";
  return "step2";
}

function expectedDomainForTopic(topic: string, stepLevel: "step1" | "step2" | "step3") {
  return (
    resolveOrganSystemId(null, topic, null) ??
    resolveOrganSystemId(getUsmle2026Topic(topic)?.categoryId ?? null, topic, null) ??
    "multisystem"
  );
}

function shouldUpdateRow(
  blueprintTopic: string | null,
  blueprintDomain: string | null,
  inferredTopic: string,
  inferredDomain: string,
  stepLevel: "step1" | "step2" | "step3"
): boolean {
  const existing = blueprintTopic?.trim() || null;
  if (!existing) return true;

  if (existing !== inferredTopic) return true;

  const alias = resolveLegacyUsmleTopicAlias(existing, stepLevel);
  if (alias && alias !== existing) return true;

  if (!isValidUsmle2026BlueprintTopic(existing, stepLevel)) return true;

  const expectedDomain = expectedDomainForTopic(existing, stepLevel) ?? inferredDomain;
  if (!blueprintDomain?.trim() || blueprintDomain.trim() !== expectedDomain) return true;

  return false;
}

async function main() {
  const { apply, field, limit } = parseArgs();
  const prisma = new PrismaClient();
  const fields = field ? [field] : [...USMLE_FIELDS];

  for (const fieldId of fields) {
    if (!USMLE_FIELDS.includes(fieldId as (typeof USMLE_FIELDS)[number])) {
      console.error(`Unknown field: ${fieldId}`);
      process.exit(1);
    }

    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true },
      orderBy: { updatedAt: "asc" },
      ...(limit > 0 ? { take: limit } : {}),
    });

    const updates: {
      id: string;
      blueprintTopic: string;
      blueprintDomain: string;
      topicCategory: string;
      source: string;
      prevTopic: string | null;
      prevDomain: string | null;
    }[] = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const stepLevel = resolveStepLevel(row.stepLevel, fieldId);
      const inferred = inferUsmleBlueprint(item, fieldId, row.stepLevel);
      const existing = row.blueprintTopic?.trim() || null;
      const nextTopic =
        existing && isValidUsmle2026BlueprintTopic(existing, stepLevel)
          ? // Prefer content-upgraded topic from infer when it differs.
            inferred.blueprintTopic
          : inferred.blueprintTopic;
      // Prefer inferred domain (may use Step 3 clinical content → organ system).
      const nextDomain =
        inferred.blueprintDomain || expectedDomainForTopic(nextTopic, stepLevel);

      if (
        !shouldUpdateRow(
          row.blueprintTopic,
          row.blueprintDomain,
          nextTopic,
          nextDomain,
          stepLevel
        )
      ) {
        continue;
      }

      updates.push({
        id: row.id,
        blueprintTopic: nextTopic,
        blueprintDomain: nextDomain,
        topicCategory: nextTopic,
        source: inferred.source,
        prevTopic: row.blueprintTopic?.trim() || null,
        prevDomain: row.blueprintDomain?.trim() || null,
      });
    }

    const bySource: Record<string, number> = {};
    for (const u of updates) bySource[u.source] = (bySource[u.source] ?? 0) + 1;

    console.log(`\nUSMLE blueprintTopic reseed — ${fieldId}`);
    console.log(`  mode: ${apply ? "APPLY" : "dry-run"}`);
    console.log(`  scanned: ${rows.length}`);
    console.log(`  to update: ${updates.length}`);
    console.log(`  by source:`, bySource);

    console.log("\n  Sample updates:");
    for (const u of updates.slice(0, 10)) {
      console.log(
        `    ${u.prevTopic ?? "(null)"} / ${u.prevDomain ?? "(null)"} → ${u.blueprintTopic} / ${u.blueprintDomain} [${u.source}]`
      );
    }

    if (!apply) continue;

    let written = 0;
    const BATCH = 50;
    for (let i = 0; i < updates.length; i += BATCH) {
      const batch = updates.slice(i, i + BATCH);
      await prisma.$transaction(
        batch.map((u) =>
          prisma.questionBankItem.update({
            where: { id: u.id },
            data: {
              blueprintTopic: u.blueprintTopic,
              blueprintDomain: u.blueprintDomain,
              topicCategory: u.topicCategory,
            },
          })
        )
      );
      written += batch.length;
      if (written % 500 === 0 || written === updates.length) {
        console.log(`  written ${written}/${updates.length}`);
      }
    }
    console.log(`  Done. Updated ${written} rows for ${fieldId}.`);
  }

  if (!apply) console.log("\nPass --apply to write changes.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
