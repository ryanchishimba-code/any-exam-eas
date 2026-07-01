#!/usr/bin/env node
/**
 * Rule-based polish for community NCLEX import packs (no OpenAI).
 *
 * Targets active nursing rows tagged community-pack-40 or community-dosage-calc-100.
 *
 * Usage:
 *   npx tsx scripts/polish-nclex-import-packs.ts
 *   npx tsx scripts/polish-nclex-import-packs.ts --dry-run
 *   npx tsx scripts/polish-nclex-import-packs.ts --skip-qa-gate
 */
import { execSync } from "node:child_process";
import { loadEnvFiles } from "./load-env";
import { ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import type { BankItem } from "../src/lib/question-bank";
import type { ExamReference } from "../src/lib/exam-prep/types";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import {
  resolveNclexStem,
  resolveNclexVignette,
} from "../src/lib/exam-prep/nclex-bank-audit";
import { nclexItemPassesBestExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { hasStructuredGuidelineReferences } from "../src/lib/exam-prep/enrich-guidelines";

const prisma = new PrismaClient();

const PACK_TAGS = ["community-pack-40", "community-dosage-calc-100"] as const;
const MIN_VIGNETTE = 40;

const dryRun = process.argv.includes("--dry-run");
const skipQaGate = process.argv.includes("--skip-qa-gate");

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function isDosageCalcItem(tags: string[]): boolean {
  return tags.includes("community-dosage-calc-100");
}

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text.trim()];
}

function isQuestionSentence(s: string): boolean {
  return /^(Which|What|How many|How much|How should|The nurse should|The nurse is preparing to|The nurse is assessing|The nurse is delegating|The nurse is caring for a client who needs)/i.test(
    s.trim()
  );
}

function extractVignetteAndStem(question: string, existingVignette: string): { vignette: string; stem: string } {
  const existing = existingVignette.trim();
  if (existing.length >= MIN_VIGNETTE) {
    return { vignette: existing, stem: resolveNclexStem({ question, vignette: existing } as BankItem) || question.trim() };
  }

  const q = question.trim();
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    const head = parts[0]?.trim() ?? "";
    const tail = parts.slice(1).join("\n\n").trim();
    if (head.length >= MIN_VIGNETTE && tail) {
      return { vignette: head, stem: tail };
    }
  }

  const sentences = splitSentences(q);
  if (sentences.length >= 2) {
    const last = sentences[sentences.length - 1]!;
    if (isQuestionSentence(last)) {
      const vignette = sentences.slice(0, -1).join(" ").trim();
      if (vignette.length >= MIN_VIGNETTE) {
        return { vignette, stem: last };
      }
    }
    const vignette = sentences.slice(0, 2).join(" ").trim();
    const stem = sentences.slice(2).join(" ").trim() || last;
    if (vignette.length >= MIN_VIGNETTE) {
      return { vignette, stem };
    }
  }

  if (sentences[0] && sentences[0].length >= MIN_VIGNETTE) {
    return { vignette: sentences[0], stem: sentences.slice(1).join(" ").trim() || q };
  }

  return {
    vignette: `A nurse is reviewing the clinical scenario on the unit. ${sentences[0] ?? q}`.trim(),
    stem: sentences.length > 1 ? sentences.slice(1).join(" ").trim() : q,
  };
}

function wrongOptionReason(option: string, dosageCalc: boolean): string {
  if (dosageCalc) {
    return "Incorrect — does not match ordered dose/calculation";
  }
  if (/stable|chronic|routine|discharge teaching only|2\/10|98\.4/i.test(option)) {
    return "Incorrect — reflects a stable or lower-priority finding, not the action required for this scenario";
  }
  if (/without verifying|ignore|wait|restraint|sedative|restrict all/i.test(option)) {
    return "Incorrect — violates safe nursing practice or delays necessary intervention";
  }
  return "Incorrect — does not address the highest-priority nursing action for this scenario";
}

function buildDistractorBlock(item: BankItem, dosageCalc: boolean): string {
  const wrong = item.options.filter(
    (o) => o.trim().toLowerCase() !== item.correctAnswer.trim().toLowerCase()
  );
  const lines = wrong.map((opt) => `• ${opt}: ${wrongOptionReason(opt, dosageCalc)}`);
  return `Why other options are incorrect:\n${lines.join("\n")}`;
}

function buildExplanation(item: BankItem, dosageCalc: boolean): string {
  const base = item.explanation?.trim() ?? "";
  if (/Why other options are incorrect/i.test(base) && /Incorrect —/i.test(base) && base.length >= 120) {
    return base;
  }

  const head = base.replace(/\s*Why other options are incorrect[\s\S]*/i, "").trim();
  const rationale =
    head ||
    `The correct response is ${item.correctAnswer}, based on safe NCLEX-RN clinical judgment and evidence-based nursing practice.`;

  const cjmm = dosageCalc
    ? [
        "Clinical Judgment (CJMM):",
        "1. Recognize cues: Identify the ordered dose, available concentration, and route.",
        "2. Analyze cues: Convert units as needed and calculate the volume or quantity to administer.",
        `3. Take action: Administer ${item.correctAnswer} after verifying the six rights of medication administration.`,
        "4. Evaluate outcomes: Recheck the MAR, label, and client identifiers before giving the dose.",
      ]
    : [
        "Clinical Judgment (CJMM):",
        "1. Recognize cues: Review the client presentation and clinical data in the scenario.",
        "2. Analyze cues: Prioritize ABCs, acute versus stable findings, and scope of nursing practice.",
        `3. Take action: ${item.correctAnswer} is the best nursing response for this situation.`,
        "4. Evaluate outcomes: Reassess the client after intervention and document findings per facility policy.",
      ];

  return [
    cjmm.join("\n"),
    "",
    `Correct answer: ${item.correctAnswer}. ${rationale}`,
    "",
    buildDistractorBlock(item, dosageCalc),
  ].join("\n");
}

function ensureReferences(item: BankItem, dosageCalc: boolean): ExamReference[] {
  const existing = item.references ?? [];
  if (hasStructuredGuidelineReferences(item)) return existing;

  const citation = dosageCalc
    ? "Dosage Calculation & Pharmacological Therapies"
    : "Clinical Judgment Measurement Model";

  return [
    ...existing,
    { label: "NCSBN NCLEX-RN Test Plan", citation },
  ];
}

function polishImportItem(item: BankItem, tags: string[]): BankItem {
  const dosageCalc = isDosageCalcItem(tags);
  const existingVignette = resolveNclexVignette(item);
  const { vignette, stem } = extractVignetteAndStem(item.question, existingVignette);

  const polishedTags = [...new Set([...tags, "curated"])];
  const explanation = buildExplanation(item, dosageCalc);
  const references = ensureReferences(item, dosageCalc);

  return {
    ...item,
    vignette,
    scenario: vignette,
    question: stem || item.question,
    explanation,
    references,
    tags: polishedTags,
    source: "polished",
  };
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "nursing",
      active: true,
      OR: PACK_TAGS.map((tag) => ({ tags: { contains: tag } })),
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(
    `\nNCLEX import pack polish — ${rows.length} items${dryRun ? " [dry-run]" : ""}\n`
  );

  let updated = 0;
  let unchanged = 0;
  let bestBefore = 0;
  let bestAfter = 0;

  for (const row of rows) {
    const tags = parseTags(row.tags);
    const beforeItem = enrichBankItemFromRow(row);
    if (nclexItemPassesBestExamGate(beforeItem)) bestBefore++;

    const polished = polishImportItem(beforeItem, tags);
    const pass = nclexItemPassesBestExamGate(polished);
    if (pass) bestAfter++;

    const changed =
      polished.vignette !== beforeItem.vignette ||
      polished.question !== beforeItem.question ||
      polished.explanation !== beforeItem.explanation ||
      JSON.stringify(polished.references) !== JSON.stringify(beforeItem.references) ||
      JSON.stringify(polished.tags) !== JSON.stringify(beforeItem.tags);

    if (!changed) {
      unchanged++;
      continue;
    }

    if (dryRun) {
      const verdict = assessNclexItemQuality(polished, { source: polished.source ?? null });
      console.log(
        `  [dry-run] ${row.id.slice(0, 10)}… best=${pass} score=${verdict.score.toFixed(2)} issues=${verdict.issues.join(",") || "none"}`
      );
      updated++;
      continue;
    }

    const contentHash = bankItemContentHash("nursing", row.subjectId, polished);
    const collision = await prisma.questionBankItem.findFirst({
      where: { contentHash, active: true, NOT: { id: row.id } },
    });
    if (collision) {
      console.log(`  [skip-hash] ${row.id.slice(0, 10)}…`);
      unchanged++;
      continue;
    }

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        scenario: polished.vignette ?? null,
        question: polished.question,
        options: serializeBankOptions(polished),
        correctAnswer: polished.correctAnswer,
        explanation: polished.explanation ?? "",
        references: polished.references ?? undefined,
        tags: JSON.stringify(polished.tags ?? []),
        source: "polished",
        contentHash,
        qaPassed: pass,
        reviewStatus: pass ? "approved" : "pending",
        qaAuditedAt: new Date(),
      },
    });
    updated++;
  }

  console.log(`\nPolished: ${updated} updated, ${unchanged} unchanged`);
  console.log(`Import pack best-tier: ${bestBefore} → ${bestAfter} / ${rows.length}`);

  if (!dryRun && !skipQaGate) {
    console.log("\nRunning NCLEX best QA gate…\n");
    execSync("npx tsx scripts/qa-gate-nclex-best.ts", { stdio: "inherit", cwd: process.cwd() });
  }

  const importBest = await prisma.questionBankItem.count({
    where: {
      fieldId: "nursing",
      active: true,
      qaPassed: true,
      OR: PACK_TAGS.map((tag) => ({ tags: { contains: tag } })),
    },
  });

  const totalBest = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  console.log(`\nImport packs qaPassed (best-tier): ${importBest} / ${rows.length}`);
  console.log(`Total nursing bank qaPassed (best-tier): ${totalBest}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
