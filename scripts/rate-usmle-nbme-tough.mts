#!/usr/bin/env node
/**
 * Tough NBME/USMLE-standard review of a USMLE step bank (UWorld-bar proxy).
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/rate-usmle-nbme-tough.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/rate-usmle-nbme-tough.mts --field usmle-step-2 --sample 36
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();
requireOpenAiKey();

import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { EXPERT_RATIONALE_META_KEY } from "../src/lib/engine/rationale/expert-rationale-types";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { USMLE_FIELD_IDS } from "../src/lib/exam-prep/usmle/steps";

const prisma = new PrismaClient();
const MODEL = process.env.USMLE_RATING_MODEL?.trim() || "gpt-4o";
const OUT_DIR = path.join(process.cwd(), "tmp");

type SampleItem = {
  id: string;
  fieldId: string;
  subjectId: string | null;
  itemType: string | null;
  blueprintTopic: string | null;
  difficulty: number | null;
  vignette: string | null;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  hasEnriched: boolean;
  localScore: number;
  localOk: boolean;
  localIssues: string[];
};

type ItemScore = {
  id: string;
  score: number;
  wouldAppearOnUsmle: boolean;
  strengths: string[];
  weaknesses: string[];
  criticalFlags: string[];
};

type BankGrade = {
  overallScore: number;
  overallLetter?: string;
  dimensions: Array<{
    name: string;
    score: number;
    letter?: string;
    evidence: string;
    gap: string;
  }>;
  examTakerVerdict: string;
  topStrengths: string[];
  topGaps: string[];
  prioritizedActions: string[];
};

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "usmle-step-2";
  let sample = 32;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--sample" && args[i + 1]) sample = Number(args[++i]);
  }
  if (!USMLE_FIELD_IDS.includes(field as (typeof USMLE_FIELD_IDS)[number])) {
    throw new Error(`--field must be one of ${USMLE_FIELD_IDS.join(", ")}`);
  }
  return { field, sample: Math.max(16, Math.min(48, sample || 32)) };
}

function letterFromScore(score: number): string {
  if (score >= 9.5) return "A+";
  if (score >= 9.0) return "A";
  if (score >= 8.5) return "A−";
  if (score >= 8.0) return "B+";
  if (score >= 7.5) return "B";
  if (score >= 7.0) return "B−";
  if (score >= 6.5) return "C+";
  if (score >= 6.0) return "C";
  if (score >= 5.0) return "D";
  return "F";
}

async function structuralStats(fieldId: string) {
  const [active, serve, enrichedRows, subjectGroups, typeGroups] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
    prisma.$queryRaw<Array<{ n: bigint }>>`
      SELECT COUNT(*)::bigint AS n FROM "QuestionBankItem"
      WHERE "fieldId" = ${fieldId} AND active AND "qaPassed"
        AND ("generationMeta"::text LIKE '%rationaleEnrichedAt%'
          OR "generationMeta"::text LIKE '%expertRationale%')
    `,
    prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where: { fieldId, active: true, qaPassed: true },
      _count: { _all: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["itemType"],
      where: { fieldId, active: true, qaPassed: true },
      _count: { _all: true },
    }),
  ]);

  const bySubject = Object.fromEntries(
    subjectGroups
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => [g.subjectId ?? "null", g._count._all])
  );
  const byType = Object.fromEntries(
    typeGroups.map((g) => [g.itemType ?? "null", g._count._all])
  );
  const enriched = Number(enrichedRows[0]?.n ?? 0);

  return {
    fieldId,
    active,
    serve,
    enrichedCount: enriched,
    enrichedPct: serve ? Math.round((enriched / serve) * 1000) / 10 : 0,
    bySubject,
    byType,
    thinSubjects: Object.entries(bySubject)
      .filter(([, n]) => (n as number) < 50)
      .map(([id, n]) => ({ subjectId: id, n })),
  };
}

async function pickRandom(fieldId: string, where: Record<string, unknown>, take: number) {
  const total = await prisma.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true, ...where },
  });
  if (total === 0) return [];
  const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - take)));
  return prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true, ...where },
    orderBy: { id: "asc" },
    skip,
    take,
  });
}

async function stratifiedSample(fieldId: string, target: number): Promise<SampleItem[]> {
  const subjects = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId, active: true, qaPassed: true },
    _count: { _all: true },
  });
  const topSubjects = subjects
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 10)
    .map((s) => s.subjectId)
    .filter(Boolean) as string[];

  const seen = new Set<string>();
  const rows: Awaited<ReturnType<typeof pickRandom>> = [];

  for (const subjectId of topSubjects) {
    for (const r of await pickRandom(fieldId, { subjectId }, 2)) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }
  const typeSample =
    fieldId === "usmle-step-3"
      ? [
          "vignette",
          "mcq",
          "sequential",
          "ethics",
          "biostats",
          "abstract",
          "drug_ad",
          "ccs_prompt",
        ]
      : ["vignette", "mcq", "sequential", "ethics", "biostats"];
  for (const itemType of typeSample) {
    for (const r of await pickRandom(fieldId, { itemType }, 2)) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }
  while (rows.length < target) {
    let added = 0;
    for (const r of await pickRandom(fieldId, {}, 12)) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
      added++;
      if (rows.length >= target) break;
    }
    if (added === 0) break;
  }

  return rows.slice(0, target).map((row) => {
    const item = enrichBankItemFromRow(row);
    const editorial = auditUsmleQaEditor(item, {
      fieldId: row.fieldId,
      source: row.source ?? undefined,
      itemId: row.id,
      difficulty: row.difficulty,
    });
    const serveOk = usmleBankItemIsServeReady(item, { source: row.source });
    const meta =
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    return {
      id: row.id,
      fieldId: row.fieldId,
      subjectId: row.subjectId,
      itemType: row.itemType,
      blueprintTopic: row.blueprintTopic,
      difficulty: row.difficulty,
      vignette: item.vignette ?? null,
      stem: String(item.stem ?? row.question ?? "").trim(),
      options: (item.options ?? []).slice(0, 8),
      correctAnswer: String(item.correctAnswer ?? row.correctAnswer ?? ""),
      explanation: (item.explanation ?? "").slice(0, 900) || null,
      hasEnriched: Boolean(meta[EXPERT_RATIONALE_META_KEY] || meta.rationaleEnrichedAt),
      localScore: editorial.score,
      localOk: editorial.ok && serveOk,
      localIssues: editorial.issues.slice(0, 6),
    };
  });
}

async function openaiJson<T>(client: OpenAI, system: string, user: string): Promise<T> {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return JSON.parse(res.choices[0]?.message?.content ?? "{}") as T;
}

async function scoreItems(client: OpenAI, sample: SampleItem[]): Promise<ItemScore[]> {
  const system = `You are a ruthless USMLE/NBME item writer grading commercial QBank items against a UWorld-level bar.
Score each item 0-10. Be tough. Flag: wrong teaching points, cueing, non-vignette laundry lists, weak distractors, missing units on calcs, physician-only CCS without decision framework (Step 3), basic-science without clinical integration when Step 2/3.
Return JSON: {"items":[{"id","score","wouldAppearOnUsmle","strengths":[],"weaknesses":[],"criticalFlags":[]}]}`;

  const out: ItemScore[] = [];
  const BATCH = 6;
  for (let i = 0; i < sample.length; i += BATCH) {
    const chunk = sample.slice(i, i + BATCH);
    console.log(`  OpenAI item batch ${Math.floor(i / BATCH) + 1}…`);
    const raw = await openaiJson<{ items?: ItemScore[] }>(
      client,
      system,
      JSON.stringify({
        items: chunk.map((s) => ({
          id: s.id,
          fieldId: s.fieldId,
          subjectId: s.subjectId,
          itemType: s.itemType,
          blueprintTopic: s.blueprintTopic,
          vignette: (s.vignette ?? "").slice(0, 700),
          stem: s.stem.slice(0, 400),
          options: s.options,
          correctAnswer: s.correctAnswer,
          explanation: s.explanation,
          localScore: s.localScore,
          localIssues: s.localIssues,
          hasEnriched: s.hasEnriched,
        })),
      })
    );
    const scored = Array.isArray(raw.items) ? raw.items : [];
    console.log(`  ${scored.length} scored`);
    out.push(...scored);
  }
  return out;
}

async function gradeBank(
  client: OpenAI,
  structure: Awaited<ReturnType<typeof structuralStats>>,
  sample: SampleItem[],
  itemScores: ItemScore[]
): Promise<BankGrade> {
  const avgAi =
    itemScores.length > 0
      ? itemScores.reduce((a, b) => a + (Number(b.score) || 0), 0) / itemScores.length
      : 0;
  const system = `You grade an entire USMLE commercial QBank step against a UWorld-level bar for exam takers.
Standards: vignette authenticity, one-best-answer craft, high-yield blueprint coverage, mechanism→clinic integration (Step 1) or next-step management (Step 2/3), biostats/ethics where expected, rationale teachability that transfers, volume without repetition burnout.
Be tough. Do not inflate for raw count alone.
Return JSON with overallScore (0-10), overallLetter, dimensions[{name,score,letter,evidence,gap}] for:
Bank size & dedicated volume,
NBME blueprint / systems coverage,
Item craft (stem/options/clinical reasoning),
Basic-science ↔ clinical integration (or next-step management for Step 2/3),
Biostats / ethics / CCS readiness (as applicable),
Rationale / teachability (UWorld-depth proxy),
High-yield disease & pharm readiness,
Quality gates & consistency,
examTakerVerdict, topStrengths[3-5], topGaps[3-5], prioritizedActions[4-6].`;

  return openaiJson<BankGrade>(
    client,
    system,
    JSON.stringify({
      structure,
      sampleMeta: {
        n: sample.length,
        avgOpenAiItemScore: Number(avgAi.toFixed(2)),
        enrichedInSample: sample.filter((s) => s.hasEnriched).length,
        localOkRate: sample.filter((s) => s.localOk).length / Math.max(1, sample.length),
      },
      itemScoreSummary: itemScores
        .slice()
        .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
        .map((i) => ({
          id: i.id,
          score: i.score,
          wouldAppearOnUsmle: i.wouldAppearOnUsmle,
          criticalFlags: i.criticalFlags,
          weaknesses: i.weaknesses?.slice(0, 3),
        })),
    })
  );
}

async function main() {
  const { field, sample: sampleSize } = parseArgs();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  console.log(`\nUSMLE tough NBME/UWorld-bar review · ${field} · model=${MODEL} · sample=${sampleSize}\n`);

  const structure = await structuralStats(field);
  console.log(
    `Serve ${structure.serve}/${structure.active} · enriched ${structure.enrichedCount} (${structure.enrichedPct}%) · subjects ${Object.keys(structure.bySubject).length}`
  );

  const sample = await stratifiedSample(field, sampleSize);
  console.log(`Sampled ${sample.length} stratified serve items`);
  const itemScores = await scoreItems(client, sample);
  console.log("  OpenAI bank-level synthesis…");
  const bank = await gradeBank(client, structure, sample, itemScores);
  if (!bank.overallLetter && typeof bank.overallScore === "number") {
    bank.overallLetter = letterFromScore(bank.overallScore);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, `usmle-nbme-tough-rating-${field}.json`);
  const payload = {
    checkedAt: new Date().toISOString(),
    model: MODEL,
    standard: "NBME/USMLE UWorld-bar proxy",
    structure,
    itemScores,
    bank,
  };
  writeFileSync(out, JSON.stringify(payload, null, 2));
  console.log(`\nWrote ${out}`);
  console.log(`\nVERDICT: ${bank.overallLetter} (${bank.overallScore}/10)`);
  console.log(bank.examTakerVerdict);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
