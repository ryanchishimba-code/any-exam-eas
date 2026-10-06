#!/usr/bin/env node
/**
 * Read-only content lint. Writes a CSV report and does not update question rows.
 *
 *   npx tsx scripts/lint-exam-content.ts
 *   npx tsx scripts/lint-exam-content.ts --input scripts/fixtures/content-lint-items.json --out scripts/fixtures/content-lint-sample.csv
 *   npx tsx scripts/lint-exam-content.ts --db --limit 500 --out /tmp/content-lint.csv
 *
 * --apply is rejected. The default is a dry run against the bundled fixture.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseBankOptions } from "../src/lib/mpje/parse-bank-options";
import {
  contentLintRowsToCsv,
  exhibitTextFromBankItem,
  lintContentItems,
  type ContentLintItem,
} from "../src/lib/exam-prep/content-lint";

const DEFAULT_FIXTURE = path.join("scripts", "fixtures", "content-lint-items.json");

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

async function loadDbItems(limit: number, fieldId?: string): Promise<ContentLintItem[]> {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        active: true,
        qaPassed: true,
        ...(fieldId ? { fieldId } : {}),
      },
      ...(limit > 0 ? { take: limit } : {}),
      orderBy: { id: "asc" },
      select: {
        id: true,
        question: true,
        scenario: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        itemType: true,
        topicCategory: true,
        blueprintTopic: true,
        tags: true,
        clusterId: true,
        generationMeta: true,
        curationMeta: true,
      },
    });
    return rows.map((row) => {
      const parsed = parseBankOptions(row.options);
      const options = parsed.options;
      const generationMeta =
        row.generationMeta && typeof row.generationMeta === "object" && !Array.isArray(row.generationMeta)
          ? (row.generationMeta as Record<string, unknown>)
          : undefined;
      const curationMeta =
        row.curationMeta && typeof row.curationMeta === "object" && !Array.isArray(row.curationMeta)
          ? (row.curationMeta as Record<string, unknown>)
          : undefined;
      const ngnPayload = parsed.ngnPayload;
      const question = [row.scenario?.trim(), row.question].filter(Boolean).join("\n\n");
      return {
        id: row.id,
        question,
        options,
        correctAnswer: row.correctAnswer,
        explanation: row.explanation,
        clinicalReasoning: parsed.clinicalReasoning,
        itemType: row.itemType,
        topicCategory: row.topicCategory ?? undefined,
        blueprintTopic: row.blueprintTopic ?? undefined,
        tags: row.tags ? row.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
        clusterId: row.clusterId,
        generationMeta,
        curationMeta,
        ngnPayload,
        exhibitText: exhibitTextFromBankItem({
          question,
          options,
          correctAnswer: row.correctAnswer,
          explanation: row.explanation,
          generationMeta,
          ngnPayload,
        }),
      };
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  if (hasFlag("--apply")) {
    console.error("lint-exam-content is read-only. It never writes question data. Omit --apply.");
    process.exitCode = 2;
    return;
  }

  const dryRun = !hasFlag("--no-dry-run");
  if (!dryRun) {
    console.error("This report does not have a write mode. Re-run without --no-dry-run.");
    process.exitCode = 2;
    return;
  }

  let items: ContentLintItem[];
  let source: string;
  if (hasFlag("--db")) {
    const limitArg = argValue("--limit");
    const limit = limitArg == null ? 400 : Number(limitArg);
    const fieldId = argValue("--field");
    try {
      items = await loadDbItems(Number.isFinite(limit) && limit >= 0 ? limit : 400, fieldId);
      source = `database (read-only, ${items.length} rows${fieldId ? `, ${fieldId}` : ""})`;
    } catch (error) {
      console.error(
        "Database read failed. Falling back to the fixture.",
        error instanceof Error ? error.message : error
      );
      const fixture = argValue("--input") ?? DEFAULT_FIXTURE;
      items = JSON.parse(readFileSync(fixture, "utf8")) as ContentLintItem[];
      source = fixture;
    }
  } else {
    const fixture = argValue("--input") ?? DEFAULT_FIXTURE;
    items = JSON.parse(readFileSync(fixture, "utf8")) as ContentLintItem[];
    source = fixture;
  }

  const rows = lintContentItems(items);
  const csv = contentLintRowsToCsv(rows);
  const out = argValue("--out");
  if (out) writeFileSync(out, csv, "utf8");
  else process.stdout.write(csv);

  console.error(
    `content-lint dry-run: ${rows.length} finding(s) across ${items.length} item(s) from ${source}` +
      (out ? ` → ${out}` : "")
  );
}

void main();
