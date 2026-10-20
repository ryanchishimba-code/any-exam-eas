#!/usr/bin/env node
/**
 * Apply clinical decisions for the 23 letter-mismatch items (dry run by default).
 *
 *   npx tsx scripts/apply-letter-mismatch-fix-20261020.ts
 *   npx tsx scripts/apply-letter-mismatch-fix-20261020.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  parseOptionsPayload,
  rebuildOptionsRaw,
  rewriteLettersToNumbers,
  rewriteUnknown,
} from "./letter-rationale-fix-20261020.ts";

const BACKUP_TABLE = "qbi_letter_mismatch_fix_backup_20261020";
const DECISIONS_PATH = path.join(
  process.cwd(),
  "scripts/data/letter-mismatch-decisions-20261020.json"
);

const prisma = new PrismaClient();

type Decision = {
  id: string;
  fieldId: string;
  action: "relabel" | "rekey" | "hide";
  correctAnswer: string;
  newCorrectAnswer: string | null;
  reason: string;
  source: string;
};

function relabelOptionsPayload(payload: ReturnType<typeof parseOptionsPayload>): string {
  const n = payload.options.length;
  if (!n) return payload.raw;

  const exp = rewriteLettersToNumbers;
  if (payload.clinicalReasoning) {
    payload.clinicalReasoning = exp(payload.clinicalReasoning, n).text;
  }
  if (payload.solutionSteps?.length) {
    payload.solutionSteps = payload.solutionSteps.map((s) => exp(s, n).text);
  }
  if (payload.distractorRationale) {
    const next: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload.distractorRationale)) {
      let k = key;
      if (/^[A-F]$/i.test(key)) {
        const idx = key.toUpperCase().charCodeAt(0) - 65;
        if (idx >= 0 && idx < n) k = String(idx + 1);
      }
      next[k] = exp(value, n).text;
    }
    payload.distractorRationale = next;
  }
  if (payload.expertRationale != null) {
    payload.expertRationale = rewriteUnknown(payload.expertRationale, n).value;
  }
  if (payload.keyTakeaways != null) {
    payload.keyTakeaways = rewriteUnknown(payload.keyTakeaways, n).value;
  }
  return rebuildOptionsRaw(payload);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const { decisions } = JSON.parse(readFileSync(DECISIONS_PATH, "utf8")) as {
    decisions: Decision[];
  };

  const counts = { relabel: 0, rekey: 0, hide: 0 };
  const patches: {
    id: string;
    action: Decision["action"];
    explanation?: string;
    options?: string;
    correctAnswer?: string;
    qaPassed?: boolean;
  }[] = [];

  for (const d of decisions) {
    counts[d.action] += 1;
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT id, options, explanation, "correctAnswer", "qaPassed" FROM "QuestionBankItem" WHERE id = $1`,
      d.id
    )) as {
      id: string;
      options: string;
      explanation: string;
      correctAnswer: string;
      qaPassed: boolean;
    }[];
    const row = rows[0];
    if (!row) {
      console.warn(`missing row ${d.id}`);
      continue;
    }

    if (d.action === "hide") {
      patches.push({ id: d.id, action: d.action, qaPassed: false });
      continue;
    }

    const payload = parseOptionsPayload(row.options);
    const n = payload.options.length || 4;
    const explanation = rewriteLettersToNumbers(row.explanation, n).text;
    const options = relabelOptionsPayload(payload);

    if (d.action === "relabel") {
      if (row.correctAnswer !== d.correctAnswer) {
        console.warn(
          `key drift ${d.id}: live "${row.correctAnswer}" vs decision "${d.correctAnswer}"`
        );
      }
      patches.push({ id: d.id, action: d.action, explanation, options });
      continue;
    }

    if (d.action === "rekey") {
      if (!d.newCorrectAnswer) {
        console.warn(`rekey ${d.id} missing newCorrectAnswer`);
        continue;
      }
      patches.push({
        id: d.id,
        action: d.action,
        explanation,
        options,
        correctAnswer: d.newCorrectAnswer,
      });
    }
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log("decisions:", counts);
  console.log(`patches prepared: ${patches.length}`);
  console.log(`backup table (apply): ${BACKUP_TABLE}`);
  console.log("apply command: npx tsx scripts/apply-letter-mismatch-fix-20261020.ts --apply");

  for (const p of patches.slice(0, 3)) {
    const d = decisions.find((x) => x.id === p.id)!;
    console.log(`  sample ${p.id} [${d.fieldId}] ${p.action}`);
  }

  if (!apply) {
    console.log("\nNo writes.");
    return;
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE false
  `);

  for (const patch of patches) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "${BACKUP_TABLE}"
      SELECT q.*, now() AS backed_up_at
      FROM "QuestionBankItem" q
      WHERE q.id = $1
        AND NOT EXISTS (SELECT 1 FROM "${BACKUP_TABLE}" b WHERE b.id = q.id)
      `,
      patch.id
    );

    const data: Record<string, unknown> = {};
    if (patch.explanation !== undefined) data.explanation = patch.explanation;
    if (patch.options !== undefined) data.options = patch.options;
    if (patch.correctAnswer !== undefined) data.correctAnswer = patch.correctAnswer;
    if (patch.qaPassed === false) data.qaPassed = false;

    await prisma.questionBankItem.update({
      where: { id: patch.id },
      data: data as Parameters<typeof prisma.questionBankItem.update>[0]["data"],
    });
  }

  console.log(`\nApplied ${patches.length} updates. Backup: ${BACKUP_TABLE}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
