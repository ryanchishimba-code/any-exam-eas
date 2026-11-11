#!/usr/bin/env node
/**
 * Read-only AANP FNP content candidates.
 *
 * Selects served rows (active, qaPassed, STUDENT_ELIGIBLE_SQL) and writes
 * reports/fnp-content-candidates.csv. It does not update the database.
 *
 *   npx tsx scripts/audit-fnp-content-candidates.ts
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
  differentKeyGroups,
  garbledOptions,
  optionTypeMismatch,
  type FnpAuditItem,
} from "../src/lib/exam-prep/aanp-fnp/content-audit";

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
      }>
    >(
      `
      SELECT id, question, scenario, options, "correctAnswer"
      FROM "QuestionBankItem"
      WHERE "fieldId" = 'aanp-fnp'
        AND active = true
        AND "qaPassed" = true
        AND ${STUDENT_ELIGIBLE_SQL}
      `
    );
    const items: FnpAuditItem[] = rows.map((row) => ({
      id: row.id,
      question: row.question,
      scenario: row.scenario,
      options: parseOptions(row.options),
      correctAnswer: row.correctAnswer,
    }));
    const keyGroups = differentKeyGroups(items);
    const keyIds = new Set(keyGroups.flat().map((item) => item.id));
    const lines = ["id,flag,detail"];
    for (const group of keyGroups) {
      const keys = [...new Set(group.map((item) => item.correctAnswer.trim()))].join(" | ");
      for (const item of group) {
        lines.push([csvCell(item.id), csvCell("different_key"), csvCell(keys)].join(","));
      }
    }
    let mismatch = 0;
    let garbled = 0;
    for (const item of items) {
      if (optionTypeMismatch(item)) {
        mismatch += 1;
        lines.push([csvCell(item.id), csvCell("option_type_mismatch"), csvCell(item.question.slice(0, 180))].join(","));
      }
      const broken = garbledOptions(item);
      if (broken.length > 0) {
        garbled += 1;
        lines.push([csvCell(item.id), csvCell("garbled_option"), csvCell(broken.join(" | "))].join(","));
      }
    }
    const outPath = resolve("reports/fnp-content-candidates.csv");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${lines.join("\n")}\n`);
    console.log(
      JSON.stringify(
        {
          served: items.length,
          differentKeyItems: keyIds.size,
          differentKeyGroups: keyGroups.length,
          optionTypeMismatch: mismatch,
          garbledOptionItems: garbled,
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
