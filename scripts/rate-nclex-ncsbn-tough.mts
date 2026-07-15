#!/usr/bin/env node
/**
 * Tough NCSBN/NGN-standard review of the NCLEX-RN question bank.
 *
 * Samples stratified serve-ready items, scores local quality gates, then asks
 * OpenAI to grade item craft + bank readiness for real NCLEX-RN exam takers.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/rate-nclex-ncsbn-tough.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/rate-nclex-ncsbn-tough.mts --sample 24
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();
requireOpenAiKey();

import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { EXPERT_RATIONALE_META_KEY } from "../src/lib/engine/rationale/expert-rationale-types";
import { NCLEX_NGN_SERVE_TARGETS } from "../src/lib/exam-prep/nclex/types";
import { assessNclexServeQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const MODEL = process.env.NCLEX_RATING_MODEL?.trim() || "gpt-4o";
const OUT_DIR = path.join(process.cwd(), "tmp");

const CLIENT_NEEDS = [
  "management-of-care",
  "safety-infection",
  "health-promotion",
  "psychosocial",
  "basic-care-comfort",
  "pharmacology-nursing",
  "reduction-risk",
  "physiological-adaptation",
] as const;

const NGN_TYPES = [
  "select_all",
  "ngn_bowtie",
  "ngn_matrix",
  "ordered_response",
  "ngn_highlight",
  "case_study",
] as const;

type SampleItem = {
  id: string;
  subjectId: string | null;
  itemType: string | null;
  blueprintTopic: string | null;
  difficulty: number | null;
  vignette: string | null;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  hasExpert: boolean;
  localScore: number;
  localTier: string;
  localOk: boolean;
  localIssues: string[];
};

function parseArgs() {
  const args = process.argv.slice(2);
  let sample = 28;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--sample" && args[i + 1]) sample = Number(args[++i]);
  }
  return { sample: Math.max(16, Math.min(48, sample || 28)) };
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

async function structuralStats() {
  const [active, serve, expertRows, topicRows, subjectGroups, typeGroups] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "nursing", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "nursing", active: true, qaPassed: true },
    }),
    prisma.$queryRaw<Array<{ n: bigint }>>`
      SELECT COUNT(*)::bigint AS n FROM "QuestionBankItem"
      WHERE "fieldId" = 'nursing' AND active AND "qaPassed"
        AND "generationMeta"::text LIKE '%expertRationale%'
    `,
    prisma.$queryRaw<Array<{ n: bigint }>>`
      SELECT COUNT(DISTINCT "blueprintTopic")::bigint AS n FROM "QuestionBankItem"
      WHERE "fieldId" = 'nursing' AND active AND "qaPassed"
        AND "blueprintTopic" IS NOT NULL AND TRIM("blueprintTopic") <> ''
    `,
    prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where: { fieldId: "nursing", active: true, qaPassed: true },
      _count: { _all: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["itemType"],
      where: { fieldId: "nursing", active: true, qaPassed: true },
      _count: { _all: true },
    }),
  ]);

  const bySubject = Object.fromEntries(
    subjectGroups.map((g) => [g.subjectId ?? "null", g._count._all])
  );
  const byType = Object.fromEntries(
    typeGroups.map((g) => [g.itemType ?? "null", g._count._all])
  );

  const ngnCoverage = Object.fromEntries(
    Object.entries(NCLEX_NGN_SERVE_TARGETS).map(([type, target]) => {
      const have = byType[type] ?? 0;
      return [type, { have, target, gap: Math.max(0, target - have) }];
    })
  );

  return {
    active,
    serve,
    expertCount: Number(expertRows[0]?.n ?? 0),
    expertPct: serve ? Math.round((Number(expertRows[0]?.n ?? 0) / serve) * 1000) / 10 : 0,
    distinctBlueprintTopics: Number(topicRows[0]?.n ?? 0),
    bySubject,
    byType,
    ngnCoverage,
  };
}

async function pickRandomServe(where: Record<string, unknown>, take: number) {
  const total = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true, ...where },
  });
  if (total === 0) return [];
  const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - take)));
  return prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true, ...where },
    orderBy: { id: "asc" },
    skip,
    take,
  });
}

async function stratifiedSample(target: number): Promise<SampleItem[]> {
  const perNeed = Math.max(2, Math.floor(target / (CLIENT_NEEDS.length + 4)));
  const seen = new Set<string>();
  const rows: Awaited<ReturnType<typeof pickRandomServe>> = [];

  for (const subjectId of CLIENT_NEEDS) {
    const batch = await pickRandomServe({ subjectId }, perNeed);
    for (const r of batch) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }

  for (const itemType of NGN_TYPES) {
    const batch = await pickRandomServe({ itemType }, 2);
    for (const r of batch) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }

  while (rows.length < target) {
    const batch = await pickRandomServe({}, 8);
    let added = 0;
    for (const r of batch) {
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
    const verdict = assessNclexServeQuality(item, { source: row.source });
    const meta =
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    const stem = String(item.stem ?? row.question ?? "").trim();
    return {
      id: row.id,
      subjectId: row.subjectId,
      itemType: row.itemType,
      blueprintTopic: row.blueprintTopic,
      difficulty: row.difficulty,
      vignette: item.vignette ?? null,
      stem,
      options: (item.options ?? []).slice(0, 8),
      correctAnswer: String(item.correctAnswer ?? row.correctAnswer ?? ""),
      explanation: (item.explanation ?? "").slice(0, 900) || null,
      hasExpert: Boolean(meta[EXPERT_RATIONALE_META_KEY]),
      localScore: verdict.score,
      localTier: verdict.tier,
      localOk: verdict.ok,
      localIssues: verdict.issues.slice(0, 6),
    };
  });
}

async function openaiJson<T>(
  client: OpenAI,
  system: string,
  user: string
): Promise<T> {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const text = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as T;
}

type ItemScore = {
  id: string;
  score: number;
  wouldAppearOnNclex: boolean;
  strengths: string[];
  weaknesses: string[];
  criticalFlags: string[];
};

type BankGrade = {
  overallScore: number;
  overallLetter: string;
  dimensions: Array<{
    name: string;
    score: number;
    letter: string;
    evidence: string;
    gap: string;
  }>;
  examTakerVerdict: string;
  topStrengths: string[];
  topGaps: string[];
  prioritizedActions: string[];
};

async function scoreItemBatch(client: OpenAI, items: SampleItem[]): Promise<ItemScore[]> {
  const payload = items.map((it) => ({
    id: it.id,
    subjectId: it.subjectId,
    itemType: it.itemType,
    blueprintTopic: it.blueprintTopic,
    difficulty: it.difficulty,
    vignette: it.vignette,
    stem: it.stem,
    options: it.options,
    correctAnswer: it.correctAnswer,
    explanation: it.explanation,
    hasExpertRationale: it.hasExpert,
    localGate: {
      score: it.localScore,
      tier: it.localTier,
      ok: it.localOk,
      issues: it.localIssues,
    },
  }));

  const system = `You are a ruthless NCLEX-RN item writer / NCSBN psychometric reviewer.
Apply the REAL 2023–2026 NCLEX-RN standard (including Next Gen Clinical Judgment Measurement Model).
Be harsh: marketing polish does not raise the score. Entry-level RN scope only.
Score each item 0–10 for readiness to prepare a candidate for the actual CAT NCLEX-RN.
Flag physician-level diagnosis, unsafe teaching, cartoon distractors, cueing, absolute language, weak prioritization, or non-CJ reasoning.
Return JSON: {"items":[{"id":"...","score":0-10,"wouldAppearOnNclex":bool,"strengths":[...],"weaknesses":[...],"criticalFlags":[...]}]}`;

  const raw = await openaiJson<{ items?: ItemScore[] }>(
    client,
    system,
    `Grade these NCLEX bank items against the real exam. Sample:\n${JSON.stringify(payload)}`
  );
  return Array.isArray(raw.items) ? raw.items : [];
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
  const avgLocal =
    sample.length > 0 ? sample.reduce((a, b) => a + b.localScore, 0) / sample.length : 0;
  const wouldPassRate =
    itemScores.length > 0
      ? itemScores.filter((i) => i.wouldAppearOnNclex).length / itemScores.length
      : 0;

  const system = `You are grading an entire NCLEX-RN commercial question bank against the real NCSBN NCLEX-RN / NGN standard for exam takers.
Standards (non-negotiable):
1) Clinical Judgment Measurement Model depth (recognize cues → evaluate outcomes)
2) Entry-level RN scope and safe prioritization (ABC, unstable first, nursing process)
3) Plausible distractors mirroring common candidate errors
4) NGN format authenticity (bowtie, matrix, highlight, ordered response, case study, SATA)
5) Client Needs / blueprint breadth for CAT readiness
6) Rationale quality that teaches transferable judgment (not answer keys)
7) Volume + variety sufficient for multi-week prep without repetition burnout
Be tough. Competitors like UWorld set the bar near A/A−. Do not inflate.
Return JSON with:
overallScore (0-10), overallLetter,
dimensions:[{name,score,letter,evidence,gap}] for:
Bank size & CAT volume,
Blueprint / Client Needs coverage,
Item craft (stem/options/CJ),
NGN / exam-native formats,
Rationale / teachability,
High-yield safety & pharm readiness,
Quality gates & consistency,
examTakerVerdict (2-4 sentences),
topStrengths[3-5], topGaps[3-5], prioritizedActions[4-6].`;

  const user = JSON.stringify({
    structure,
    sampleMeta: {
      n: sample.length,
      avgLocalScore: Number(avgLocal.toFixed(2)),
      localServePassRate: sample.filter((s) => s.localOk).length / Math.max(1, sample.length),
      avgOpenAiItemScore: Number(avgAi.toFixed(2)),
      openAiWouldAppearRate: Number(wouldPassRate.toFixed(3)),
      expertInSample: sample.filter((s) => s.hasExpert).length,
      itemTypeMix: Object.fromEntries(
        [...new Set(sample.map((s) => s.itemType ?? "mcq"))].map((t) => [
          t,
          sample.filter((s) => (s.itemType ?? "mcq") === t).length,
        ])
      ),
    },
    itemScoreSummary: itemScores
      .slice()
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
      .map((i) => ({
        id: i.id,
        score: i.score,
        wouldAppearOnNclex: i.wouldAppearOnNclex,
        criticalFlags: i.criticalFlags,
        weaknesses: i.weaknesses?.slice(0, 3),
      })),
    worstItems: itemScores
      .slice()
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
      .slice(0, 6),
    bestItems: itemScores
      .slice()
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 4),
  });

  const grade = await openaiJson<BankGrade>(client, system, user);
  if (!grade.overallLetter && typeof grade.overallScore === "number") {
    grade.overallLetter = letterFromScore(grade.overallScore);
  }
  return grade;
}

async function main() {
  const { sample: sampleSize } = parseArgs();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  console.log(`\nNCLEX tough NCSBN review · model=${MODEL} · sample=${sampleSize}\n`);

  const structure = await structuralStats();
  console.log(
    `Serve ${structure.serve}/${structure.active} · expert ${structure.expertCount} (${structure.expertPct}%) · topics ${structure.distinctBlueprintTopics}`
  );

  const sample = await stratifiedSample(sampleSize);
  console.log(`Sampled ${sample.length} stratified serve items`);

  const itemScores: ItemScore[] = [];
  const BATCH = 6;
  for (let i = 0; i < sample.length; i += BATCH) {
    const chunk = sample.slice(i, i + BATCH);
    process.stdout.write(`  OpenAI item batch ${i / BATCH + 1}…`);
    const scored = await scoreItemBatch(client, chunk);
    itemScores.push(...scored);
    console.log(` ${scored.length} scored`);
  }

  console.log("  OpenAI bank-level synthesis…");
  const bank = await gradeBank(client, structure, sample, itemScores);

  const avgAi =
    itemScores.length > 0
      ? Math.round(
          (itemScores.reduce((a, b) => a + (Number(b.score) || 0), 0) / itemScores.length) * 10
        ) / 10
      : 0;
  const avgLocal =
    sample.length > 0
      ? Math.round((sample.reduce((a, b) => a + b.localScore, 0) / sample.length) * 10) / 10
      : 0;

  const report = {
    checkedAt: new Date().toISOString(),
    model: MODEL,
    standard: "NCSBN NCLEX-RN / NGN Clinical Judgment Measurement Model (tough commercial bar)",
    structure,
    sample: {
      size: sample.length,
      avgLocalGateScore: avgLocal,
      localOkRate:
        Math.round((sample.filter((s) => s.localOk).length / Math.max(1, sample.length)) * 1000) /
        10,
      avgOpenAiItemScore: avgAi,
      wouldAppearOnNclexRate:
        Math.round(
          (itemScores.filter((i) => i.wouldAppearOnNclex).length /
            Math.max(1, itemScores.length)) *
            1000
        ) / 10,
      expertInSample: sample.filter((s) => s.hasExpert).length,
    },
    itemScores,
    bank,
    samplesForReview: sample.map((s) => ({
      id: s.id,
      subjectId: s.subjectId,
      itemType: s.itemType,
      blueprintTopic: s.blueprintTopic,
      localScore: s.localScore,
      localTier: s.localTier,
      stem: (s.stem || "").slice(0, 160),
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, "nclex-ncsbn-tough-rating.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${outPath}`);
  console.log(
    `\nVERDICT: ${bank.overallLetter ?? letterFromScore(bank.overallScore)} (${bank.overallScore}/10)`
  );
  console.log(bank.examTakerVerdict ?? "");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
