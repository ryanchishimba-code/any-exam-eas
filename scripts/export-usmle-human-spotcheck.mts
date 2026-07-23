#!/usr/bin/env node
/**
 * Export 20 random serve-ready items per USMLE step for human spot-check.
 *
 *   bash scripts/run-with-node.sh npx tsx scripts/export-usmle-human-spotcheck.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/export-usmle-human-spotcheck.mts --n 20
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

const FIELDS = [
  { fieldId: "usmle-step-1", label: "Step 1" },
  { fieldId: "usmle-step-2", label: "Step 2 CK" },
  { fieldId: "usmle-step-3", label: "Step 3" },
] as const;

function parseN(): number {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--n" && args[i + 1]) return Math.max(1, Number.parseInt(args[++i]!, 10));
  }
  return 20;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function esc(s: string): string {
  return `"${String(s).replace(/"/g, '""')}"`;
}

type RowOut = {
  step: string;
  fieldId: string;
  id: string;
  subjectId: string;
  itemType: string;
  vignette: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
};

async function sampleField(fieldId: string, label: string, n: number): Promise<RowOut[]> {
  const pool = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
    take: Math.max(800, n * 40),
    orderBy: { updatedAt: "desc" },
  });
  const picked = shuffle(pool).slice(0, n);
  return picked.map((row) => {
    const item = enrichBankItemFromRow(row);
    return {
      step: label,
      fieldId,
      id: row.id,
      subjectId: row.subjectId ?? "",
      itemType: row.itemType ?? item.itemType ?? "mcq",
      vignette: (item.vignette ?? row.scenario ?? "").trim(),
      question: (item.question ?? row.question ?? "").trim(),
      options: (item.options ?? [])
        .map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`)
        .join("\n"),
      correctAnswer: (item.correctAnswer ?? row.correctAnswer ?? "").trim(),
      explanation: (item.explanation ?? row.explanation ?? "").trim(),
    };
  });
}

async function main() {
  const n = parseN();
  const all: RowOut[] = [];
  for (const f of FIELDS) {
    const rows = await sampleField(f.fieldId, f.label, n);
    all.push(...rows);
    console.log(`${f.label}: ${rows.length}`);
  }

  const outDir = path.join(process.cwd(), "artifacts");
  mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const csvPath = path.join(outDir, `usmle-human-spotcheck-${stamp}.csv`);
  const mdPath = path.join(outDir, `usmle-human-spotcheck-${stamp}.md`);
  const jsonPath = path.join(outDir, `usmle-human-spotcheck-${stamp}.json`);

  const headers = [
    "step",
    "fieldId",
    "id",
    "subjectId",
    "itemType",
    "vignette",
    "question",
    "options",
    "correctAnswer",
    "explanation",
    "passFail",
    "notes",
  ];
  writeFileSync(
    csvPath,
    [
      headers.join(","),
      ...all.map((r) =>
        [
          esc(r.step),
          esc(r.fieldId),
          esc(r.id),
          esc(r.subjectId),
          esc(r.itemType),
          esc(r.vignette),
          esc(r.question),
          esc(r.options),
          esc(r.correctAnswer),
          esc(r.explanation),
          '""',
          '""',
        ].join(",")
      ),
    ].join("\n")
  );

  const md: string[] = [
    `# USMLE human spot-check sample`,
    ``,
    `Generated: ${new Date().toISOString()}`,
    `N = ${n} random serve items per step (shuffled from recent serve pool).`,
    ``,
    `Rubric: **Pass** = keep in paid bank · **Fix** = salvageable · **Kill** = deactivate/rewrite`,
    ``,
  ];
  let idx = 0;
  for (const f of FIELDS) {
    md.push(`## ${f.label}`);
    md.push(``);
    for (const r of all.filter((x) => x.fieldId === f.fieldId)) {
      idx++;
      md.push(`### ${idx}. \`${r.id}\``);
      md.push(``);
      md.push(`- **Subject:** ${r.subjectId || "—"} · **Type:** ${r.itemType}`);
      md.push(`- **Verdict:** _Pass / Fix / Kill_`);
      md.push(`- **Notes:**`);
      md.push(``);
      if (r.vignette) {
        md.push(r.vignette);
        md.push(``);
      }
      md.push(`**${r.question}**`);
      md.push(``);
      md.push("```");
      md.push(r.options);
      md.push("```");
      md.push(``);
      md.push(`**Correct:** ${r.correctAnswer}`);
      md.push(``);
      md.push(`<details><summary>Explanation</summary>`);
      md.push(``);
      md.push(r.explanation || "_(empty)_");
      md.push(``);
      md.push(`</details>`);
      md.push(``);
      md.push(`---`);
      md.push(``);
    }
  }
  writeFileSync(mdPath, md.join("\n"));
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        perStep: n,
        total: all.length,
        rubric: ["Pass", "Fix", "Kill"],
        items: all,
      },
      null,
      2
    )
  );

  console.log(`CSV  ${csvPath}`);
  console.log(`MD   ${mdPath}`);
  console.log(`JSON ${jsonPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
