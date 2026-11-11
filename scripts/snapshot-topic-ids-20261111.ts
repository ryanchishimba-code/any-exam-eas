#!/usr/bin/env node
/**
 * Snapshot rows whose subjectId
 * scripts/backfill-question-topic-ids.ts will fill.
 *
 *   npx tsx scripts/snapshot-topic-ids-20261111.ts --field nursing
 *   npx tsx scripts/snapshot-topic-ids-20261111.ts --field pharmacy --apply
 *
 * --apply commits qbi_<field>_topic_ids_20261111_backup.
 * It does not update QuestionBankItem. Only nursing and pharmacy are accepted.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { resolveBlueprintCategoryIdForAttempt } from "../src/lib/learning/attempt-blueprint-attribution";
import { getSubjectsForFieldId } from "../src/lib/subjects/subject-catalog";
import { snapshotQuestionRows } from "./qbi-snapshot-20261111";

const prisma = new PrismaClient();

function arg(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

async function changeIds(fieldId: "nursing" | "pharmacy"): Promise<string[]> {
  const catalogIds = new Set(
    (() => {
      try {
        return getSubjectsForFieldId(fieldId).map((subject) => subject.id);
      } catch {
        return [] as string[];
      }
    })()
  );
  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      subjectId: string | null;
      clientNeeds: string | null;
      blueprintDomain: string | null;
      topicCategory: string | null;
    }>
  >`
    SELECT id, "subjectId", "clientNeeds", "blueprintDomain", "topicCategory"
    FROM "QuestionBankItem"
    WHERE "fieldId" = ${fieldId}
      AND active = true
      AND "qaPassed" = true
      AND ("subjectId" IS NULL OR btrim("subjectId") = '')
  `;
  const ids: string[] = [];
  for (const row of rows) {
    const namedCatalog = [row.topicCategory, row.clientNeeds, row.blueprintDomain].find(
      (value) => value && catalogIds.has(value.trim())
    );
    const resolved = resolveBlueprintCategoryIdForAttempt(fieldId, {
      subjectId: row.subjectId,
      clientNeeds: row.clientNeeds,
      blueprintDomain: row.blueprintDomain,
      topicCategory: row.topicCategory,
    });
    const to =
      fieldId === "pharmacy"
        ? namedCatalog?.trim() || (resolved && catalogIds.has(resolved) ? resolved : null)
        : resolved;
    if (to) ids.push(row.id);
  }
  return ids;
}

async function main() {
  const field = arg("--field");
  if (field !== "nursing" && field !== "pharmacy") {
    throw new Error("--field must be nursing or pharmacy");
  }
  const apply = process.argv.includes("--apply");
  const backup =
    field === "nursing"
      ? "qbi_nursing_topic_ids_20261111_backup"
      : "qbi_pharmacy_topic_ids_20261111_backup";
  const ids = await changeIds(field);
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`field: ${field}`);
  console.log(`backup: ${backup}`);
  console.log(`topic-id rows to snapshot: ${ids.length}`);
  console.log("QuestionBankItem is not updated.");
  if (ids.length === 0) {
    console.log("No rows would change. Backup table not created.");
    return;
  }
  const result = await snapshotQuestionRows({ backup, ids, apply });
  console.log(apply ? `Committed ${result.rows} rows.` : `Would commit ${result.rows} rows, then roll back.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
