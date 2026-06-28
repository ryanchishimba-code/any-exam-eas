#!/usr/bin/env node
/**
 * Deep audit of serve-ready (qaPassed) NCLEX items — catches subtle answer/stem bugs
 * that pass automated gates but harm learner experience.
 *
 * Usage: npx tsx scripts/audit-nclex-serve-deep.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import {
  assertScriptDbConnection,
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { cleanOptionText } from "../src/lib/question-format";
import {
  auditNclexBankItem,
  resolveNclexStem,
  resolveNclexVignette,
} from "../src/lib/exam-prep/nclex-bank-audit";
import {
  assessNclexItemQuality,
  isNclexBestQuality,
  NCLEX_BEST_MIN_SCORE,
} from "../src/lib/exam-prep/nclex-quality-gate";
import { nclexBankItemIsServeReady } from "../src/lib/exam-prep/nclex-serve-gate";
import { scoreNclexBankItem } from "../src/lib/engine/polish/nclex-polish";
import {
  isGenericCommunicationBankItem,
  isGenericInterventionBankItem,
  isGenericPharmacologyBankItem,
  isGenericRiskBankItem,
  isGenericTeachingBankItem,
} from "../src/lib/engine/polish/nclex-generic-checks";

const prisma = getScriptPrisma();
const BATCH = 400;
const OUT = path.join(process.cwd(), "artifacts", "nclex-serve-deep-audit.json");

type Flag =
  | "correct_not_in_options"
  | "correct_is_first_option"
  | "duplicate_options"
  | "ambiguous_correct_substring"
  | "thin_explanation"
  | "missing_per_option_rationales"
  | "generic_correct_answer"
  | "generic_distractor_set"
  | "near_score_threshold"
  | "runtime_serve_gate_fail"
  | "stale_qa_not_best"
  | "audit_warn"
  | "audit_error";

type Sample = {
  id: string;
  subjectId: string;
  source: string | null;
  score: number;
  flags: Flag[];
  stem: string;
  correctAnswer: string;
  options: string[];
};

function norm(s: string): string {
  return cleanOptionText(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

const GENERIC_CORRECT = [
  /^Unstable airway, breathing, or circulation related to/i,
  /^Delegate only tasks within scope/i,
  /^Standard precautions plus transmission-based/i,
  /^Therapeutic communication supporting/i,
  /^Verify rights, dose, route, time/i,
  /^Teach-back to confirm understanding/i,
  /^Evidence-based nursing intervention for/i,
  /^Notify the (?:healthcare provider|provider) immediately$/i,
];

function checkItem(row: { id: string; subjectId: string; source: string | null }, raw: ReturnType<typeof enrichBankItemFromRow>) {
  const flags: Flag[] = [];
  const options = raw.options.map((o) => cleanOptionText(String(o)));
  const correct = cleanOptionText(raw.correctAnswer);
  const score = scoreNclexBankItem(raw);

  const optionNorms = options.map(norm);
  const correctNorm = norm(correct);
  const matchIdx = optionNorms.findIndex((o) => o === correctNorm);

  if (matchIdx < 0) flags.push("correct_not_in_options");
  if (matchIdx === 0) flags.push("correct_is_first_option");

  const seen = new Set<string>();
  for (const o of optionNorms) {
    if (seen.has(o)) flags.push("duplicate_options");
    seen.add(o);
  }

  if (matchIdx >= 0) {
    for (let i = 0; i < options.length; i++) {
      if (i === matchIdx) continue;
      const other = optionNorms[i]!;
      if (other.includes(correctNorm) && other.length > correctNorm.length + 8) {
        flags.push("ambiguous_correct_substring");
        break;
      }
    }
  }

  const explanation = raw.explanation?.trim() ?? "";
  if (explanation.length < 150) flags.push("thin_explanation");

  const wrongOptions = options.filter((o) => norm(o) !== correctNorm);
  const incorrectLines = (explanation.match(/Incorrect —/gi) ?? []).length;
  const drCount = raw.distractorRationale ? Object.keys(raw.distractorRationale).length : 0;
  if (wrongOptions.length >= 3 && incorrectLines < 2 && drCount < 2) {
    flags.push("missing_per_option_rationales");
  }

  if (GENERIC_CORRECT.some((re) => re.test(correct))) flags.push("generic_correct_answer");
  if (
    isGenericRiskBankItem(raw) ||
    isGenericTeachingBankItem(raw) ||
    isGenericCommunicationBankItem(raw) ||
    isGenericPharmacologyBankItem(raw) ||
    isGenericInterventionBankItem(raw)
  ) {
    flags.push("generic_distractor_set");
  }

  if (score >= NCLEX_BEST_MIN_SCORE && score < NCLEX_BEST_MIN_SCORE + 0.06) {
    flags.push("near_score_threshold");
  }

  const verdict = assessNclexItemQuality(raw, { source: row.source });
  if (!isNclexBestQuality(raw, { source: row.source })) flags.push("stale_qa_not_best");
  if (!nclexBankItemIsServeReady(raw, { source: row.source ?? null })) {
    flags.push("runtime_serve_gate_fail");
  }

  const audit = auditNclexBankItem(raw);
  if (audit.issues.some((i) => i.severity === "error")) flags.push("audit_error");
  if (audit.issues.some((i) => i.severity === "warn")) flags.push("audit_warn");

  return {
    flags: [...new Set(flags)],
    score,
    verdict,
    audit,
    sample: {
      id: row.id,
      subjectId: row.subjectId,
      source: row.source,
      score,
      flags: [] as Flag[],
      stem: resolveNclexStem(raw).slice(0, 140),
      correctAnswer: correct.slice(0, 120),
      options: options.map((o) => o.slice(0, 80)),
    } satisfies Sample,
  };
}

async function main() {
  await assertScriptDbConnection();

  const served = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });
  const active = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true },
  });

  console.log(`\nNCLEX deep serve audit`);
  console.log(`Active: ${active} | qaPassed (served): ${served}\n`);

  const flagCounts: Record<string, number> = {};
  const subjectCounts: Record<string, Record<string, number>> = {};
  const sourceCounts: Record<string, number> = {};
  const scoreBuckets = { below72: 0, "72-78": 0, "78-85": 0, "85+": 0 };
  const samples: Sample[] = [];
  const sampleCounts: Record<string, number> = {};

  let lastId: string | undefined;
  let processed = 0;
  let anyFlag = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
        active: true,
        qaPassed: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const result = checkItem(row, item);
      sourceCounts[row.source ?? "(null)"] = (sourceCounts[row.source ?? "(null)"] ?? 0) + 1;

      const s = result.score;
      if (s < 0.72) scoreBuckets.below72++;
      else if (s < 0.78) scoreBuckets["72-78"]++;
      else if (s < 0.85) scoreBuckets["78-85"]++;
      else scoreBuckets["85+"]++;

      if (result.flags.length > 0) {
        anyFlag++;
        for (const f of result.flags) {
          flagCounts[f] = (flagCounts[f] ?? 0) + 1;
          if (!subjectCounts[row.subjectId]) subjectCounts[row.subjectId] = {};
          subjectCounts[row.subjectId]![f] = (subjectCounts[row.subjectId]![f] ?? 0) + 1;

          if ((sampleCounts[f] ?? 0) < 3) {
            sampleCounts[f] = (sampleCounts[f] ?? 0) + 1;
            samples.push({ ...result.sample, flags: [f] });
          }
        }
      }
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 1000 === 0 || processed === served) {
      console.log(`  … ${processed}/${served}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    active,
    served,
    itemsWithAnyDeepFlag: anyFlag,
    deepFlagRatePercent: served ? (anyFlag / served) * 100 : 0,
    flagCounts: Object.fromEntries(
      Object.entries(flagCounts).sort((a, b) => b[1] - a[1])
    ),
    scoreDistribution: scoreBuckets,
    sourceBreakdown: Object.fromEntries(
      Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])
    ),
    flagsBySubject: subjectCounts,
    samples,
  };

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(report, null, 2));

  console.log(`\n── Deep audit (qaPassed pool) ──`);
  console.log(`Items with ≥1 subtle flag: ${anyFlag} / ${served} (${report.deepFlagRatePercent.toFixed(1)}%)`);
  console.log(`\nFlag counts:`);
  for (const [f, n] of Object.entries(flagCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${f}: ${n} (${((n / served) * 100).toFixed(1)}%)`);
  }
  console.log(`\nScore distribution:`);
  console.log(`  ${JSON.stringify(scoreBuckets)}`);
  console.log(`\nSources:`);
  for (const [s, n] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`  ${s}: ${n}`);
  }
  console.log(`\nReport: ${OUT}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectScriptPrisma());
