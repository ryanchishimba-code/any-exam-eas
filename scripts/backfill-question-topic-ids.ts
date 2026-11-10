#!/usr/bin/env node
/**
 * Fill a missing QuestionBankItem.subjectId from clientNeeds or blueprintDomain.
 *
 * Does not change stems, options, keys, or rationales.
 * Dry-run is the default:
 *   npx tsx scripts/backfill-question-topic-ids.ts --field nursing
 *   npx tsx scripts/backfill-question-topic-ids.ts --field pharmacy
 *
 * Apply, and keep an undo file:
 *   npx tsx scripts/backfill-question-topic-ids.ts --field pharmacy --apply --undo-file ./topic-undo.json
 *
 * Restore:
 *   npx tsx scripts/backfill-question-topic-ids.ts --undo ./topic-undo.json
 *
 * Do not run --apply or --undo against production without reviewing the dry-run.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { resolveBlueprintCategoryIdForAttempt } from "../src/lib/learning/attempt-blueprint-attribution";
import { getSubjectsForFieldId } from "../src/lib/subjects/subject-catalog";

type UndoRow = { id: string; from: string | null };

function arg(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const undoPath = arg("--undo");
    if (undoPath) {
      const rows = JSON.parse(readFileSync(undoPath, "utf8")) as UndoRow[];
      if (!Array.isArray(rows)) throw new Error("Undo file must be an array.");
      console.log(`Restoring ${rows.length} topic ids from ${undoPath}`);
      for (const row of rows) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: { subjectId: row.from },
        });
      }
      console.log("Undo complete.");
      return;
    }

    const fieldId = arg("--field") ?? "nursing";
    const catalogIds = new Set(
      (() => {
        try {
          return getSubjectsForFieldId(fieldId).map((subject) => subject.id);
        } catch {
          return [] as string[];
        }
      })()
    );
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId,
        active: true,
        qaPassed: true,
        OR: [{ subjectId: null }, { subjectId: "" }],
      },
      select: { id: true, subjectId: true, clientNeeds: true, blueprintDomain: true, topicCategory: true },
    });
    const changes: { id: string; from: string | null; to: string }[] = [];
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
      // Pharmacy topic ids are catalog subjects. A blueprint area id is not a topic.
      const to =
        fieldId === "pharmacy"
          ? namedCatalog?.trim() || (resolved && catalogIds.has(resolved) ? resolved : null)
          : resolved;
      if (!to) continue;
      changes.push({ id: row.id, from: row.subjectId, to });
    }
    console.log(`${fieldId}: ${rows.length} items missing a topic id, ${changes.length} can be filled from existing fields.`);
    for (const change of changes.slice(0, 20)) {
      console.log(`${change.id}  ${change.from ?? "empty"} -> ${change.to}`);
    }
    if (!process.argv.includes("--apply")) {
      console.log("Dry-run only. Re-run with --apply --undo-file <path> to write.");
      return;
    }
    const undoFile = arg("--undo-file");
    if (!undoFile) throw new Error("--apply requires --undo-file <path>.");
    const undo: UndoRow[] = changes.map((change) => ({ id: change.id, from: change.from }));
    mkdirSync(dirname(undoFile), { recursive: true });
    writeFileSync(undoFile, JSON.stringify(undo, null, 2));
    for (const change of changes) {
      await prisma.questionBankItem.update({
        where: { id: change.id },
        data: { subjectId: change.to },
      });
    }
    console.log(`Applied ${changes.length} topic ids. Undo file: ${undoFile}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
