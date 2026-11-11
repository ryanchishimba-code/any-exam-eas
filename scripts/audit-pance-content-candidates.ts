#!/usr/bin/env node
/**
 * Read-only PANCE content candidates.
 *
 * Selects served rows (active, qaPassed, STUDENT_ELIGIBLE_SQL) and writes
 * reports/pance-content-candidates.csv. It does not update the database.
 *
 *   npx tsx scripts/audit-pance-content-candidates.ts
 *
 * --apply is rejected.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

if (process.argv.includes("--apply") || process.argv.includes("--undo")) {
  console.error("This script is read-only. It does not accept --apply or --undo.");
  process.exit(1);
}

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";
import {
  jokeDistractors,
  nearDuplicateStemGroups,
  tautologicalOneLineRationale,
  type PanceAuditItem,
} from "../src/lib/exam-prep/pance/content-audit";
import { panceDifficultyPoolReport } from "../src/lib/exam-prep/pance/sitting";
import type { BankItem } from "../src/lib/question-bank";

function parseOptions(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((option) => (typeof option === "string" ? option : String(option)));
    }
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { options?: unknown }).options)) {
      return (parsed as { options: unknown[] }).options.map((option) =>
        typeof option === "string" ? option : String(option)
      );
    }
  } catch {
    // plain text options
  }
  return trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        question: string;
        scenario: string | null;
        options: string;
        correctAnswer: string;
        explanation: string;
        difficulty: number | null;
      }>
    >(
      `
      SELECT id, question, scenario, options, "correctAnswer", explanation, difficulty
      FROM "QuestionBankItem"
      WHERE "fieldId" = 'pance'
        AND active = true
        AND "qaPassed" = true
        AND ${STUDENT_ELIGIBLE_SQL}
      `
    );
    const items: PanceAuditItem[] = rows.map((row) => ({
      id: row.id,
      question: row.question,
      scenario: row.scenario,
      options: parseOptions(row.options),
      correctAnswer: row.correctAnswer,
      explanation: row.explanation ?? "",
    }));
    const pool: BankItem[] = rows.map((row) => ({
      id: row.id,
      question: row.question,
      options: parseOptions(row.options),
      correctAnswer: row.correctAnswer,
      explanation: row.explanation ?? "",
      difficulty: row.difficulty ?? undefined,
    }));
    const groups = nearDuplicateStemGroups(items);
    const lines = ["id,flag,detail"];
    const duplicateIds = new Set<string>();
    groups.forEach((group, index) => {
      const ids = group.map((item) => item.id).join(" ");
      for (const item of group) {
        duplicateIds.add(item.id);
        lines.push([csvCell(item.id), csvCell("near_duplicate_stem"), csvCell(`group ${index + 1}: ${ids}`)].join(","));
      }
    });
    let jokeItems = 0;
    let tautologyItems = 0;
    for (const item of items) {
      const jokes = jokeDistractors(item);
      if (jokes.length > 0) {
        jokeItems += 1;
        lines.push([csvCell(item.id), csvCell("joke_distractor"), csvCell(jokes.join(" | "))].join(","));
      }
      if (tautologicalOneLineRationale(item)) {
        tautologyItems += 1;
        lines.push(
          [csvCell(item.id), csvCell("tautological_rationale"), csvCell(item.explanation.slice(0, 180))].join(",")
        );
      }
    }
    const difficulty = panceDifficultyPoolReport(pool);
    const outPath = resolve("reports/pance-content-candidates.csv");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${lines.join("\n")}\n`);
    console.log(
      JSON.stringify(
        {
          served: items.length,
          nearDuplicateGroups: groups.length,
          nearDuplicateItems: duplicateIds.size,
          jokeDistractorItems: jokeItems,
          tautologicalRationales: tautologyItems,
          difficulty,
          csv: outPath,
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main();
