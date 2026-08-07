#!/usr/bin/env node
/**
 * Tough NABP NAPLEX-standard review of the pharmacy question bank.
 *
 * Samples stratified serve-ready items, scores local quality gates, then asks
 * OpenAI to grade item craft + bank readiness for real NAPLEX exam takers.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/rate-naplex-nabp-tough.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/rate-naplex-nabp-tough.mts --sample 24
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();
requireOpenAiKey();

import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { EXPERT_RATIONALE_META_KEY } from "../src/lib/engine/rationale/expert-rationale-types";
import { NAPLEX_CONTENT_OUTLINE } from "../src/lib/exam-prep/naplex/content-outline";
import { NAPLEX_TARGET_TOTAL } from "../src/lib/exam-prep/naplex/types";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();
const MODEL = process.env.NAPLEX_RATING_MODEL?.trim() || "gpt-4o";
const OUT_DIR = path.join(process.cwd(), "tmp");
const FIELD_ID = "pharmacy";

/** Prefer sampling across common NAPLEX subject buckets when present. */
const SUBJECT_BUCKETS = [
  "pharmacotherapy",
  "pharmacology",
  "calculations",
  "pharmaceutics",
  "pharmacokinetics",
  "drug-information",
  "medication-safety",
  "compounding",
  "biostatistics",
  "infectious-disease",
  "cardiology",
  "endocrine",
] as const;

const FORMAT_TYPES = [
  "select_all",
  "ordered_response",
  "constructed_response",
  "highlight",
  "vignette",
  "mcq",
] as const;

type SampleItem = {
  id: string;
  subjectId: string | null;
  itemType: string | null;
  blueprintTopic: string | null;
  blueprintDomain: string | null;
  difficulty: number | null;
  vignette: string | null;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string | null;
  hasExpert: boolean;
  looksLikeCalc: boolean;
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

function looksCalc(text: string): boolean {
  return /\b(mg\/kg|ml\/hr|alligation|crcl|creatinine clearance|iv rate|drop factor|nnt|arr|auc|half-?life|bioavailability|dilution|compound)\b/i.test(
    text
  );
}

async function structuralStats() {
  const [active, serve, expertRows, enrichedRows, topicRows, subjectGroups, typeGroups, domainGroups] =
    await Promise.all([
      prisma.questionBankItem.count({ where: { fieldId: FIELD_ID, active: true } }),
      prisma.questionBankItem.count({
        where: { fieldId: FIELD_ID, active: true, qaPassed: true },
      }),
      prisma.$queryRaw<Array<{ n: bigint }>>`
        SELECT COUNT(*)::bigint AS n FROM "QuestionBankItem"
        WHERE "fieldId" = 'pharmacy' AND active AND "qaPassed"
          AND "generationMeta"::text LIKE '%expertRationale%'
      `,
      prisma.$queryRaw<Array<{ n: bigint }>>`
        SELECT COUNT(*)::bigint AS n FROM "QuestionBankItem"
        WHERE "fieldId" = 'pharmacy' AND active AND "qaPassed"
          AND "generationMeta"::text LIKE '%rationaleEnrichedAt%'
      `,
      prisma.$queryRaw<Array<{ n: bigint }>>`
        SELECT COUNT(DISTINCT "blueprintTopic")::bigint AS n FROM "QuestionBankItem"
        WHERE "fieldId" = 'pharmacy' AND active AND "qaPassed"
          AND "blueprintTopic" IS NOT NULL AND TRIM("blueprintTopic") <> ''
      `,
      prisma.questionBankItem.groupBy({
        by: ["subjectId"],
        where: { fieldId: FIELD_ID, active: true, qaPassed: true },
        _count: { _all: true },
      }),
      prisma.questionBankItem.groupBy({
        by: ["itemType"],
        where: { fieldId: FIELD_ID, active: true, qaPassed: true },
        _count: { _all: true },
      }),
      prisma.questionBankItem.groupBy({
        by: ["blueprintDomain"],
        where: { fieldId: FIELD_ID, active: true, qaPassed: true },
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
  const byDomain = Object.fromEntries(
    domainGroups
      .filter((g) => g.blueprintDomain)
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 20)
      .map((g) => [g.blueprintDomain!, g._count._all])
  );

  const domainMix = NAPLEX_CONTENT_OUTLINE.map((d) => {
    const count = byDomain[d.id] ?? 0;
    const actualPct = serve ? count / serve : 0;
    return {
      id: d.id,
      label: d.label,
      targetPct: d.weight,
      actualPct: Math.round(actualPct * 1000) / 10,
      count,
      deltaPp: Math.round((actualPct - d.weight) * 1000) / 10,
    };
  });
  const meanAbsErrorPp =
    domainMix.length > 0
      ? Math.round(
          (domainMix.reduce((a, row) => a + Math.abs(row.deltaPp), 0) / domainMix.length) * 10
        ) / 10
      : 99;

  return {
    active,
    serve,
    target: NAPLEX_TARGET_TOTAL,
    serveVsTargetPct: NAPLEX_TARGET_TOTAL
      ? Math.round((serve / NAPLEX_TARGET_TOTAL) * 1000) / 10
      : 0,
    expertCount: Number(expertRows[0]?.n ?? 0),
    expertPct: serve ? Math.round((Number(expertRows[0]?.n ?? 0) / serve) * 1000) / 10 : 0,
    rationaleEnrichedCount: Number(enrichedRows[0]?.n ?? 0),
    rationaleEnrichedPct: serve
      ? Math.round((Number(enrichedRows[0]?.n ?? 0) / serve) * 1000) / 10
      : 0,
    distinctBlueprintTopics: Number(topicRows[0]?.n ?? 0),
    outlineDomains: NAPLEX_CONTENT_OUTLINE.map((d) => ({
      id: d.id,
      label: d.label,
      weightLabel: d.weightLabel,
    })),
    bySubject,
    byType,
    byDomain,
    domainMix,
    domainMixMeanAbsErrorPp: meanAbsErrorPp,
  };
}

async function pickRandomServe(where: Record<string, unknown>, take: number) {
  const total = await prisma.questionBankItem.count({
    where: { fieldId: FIELD_ID, active: true, qaPassed: true, ...where },
  });
  if (total === 0) return [];
  const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - take)));
  return prisma.questionBankItem.findMany({
    where: { fieldId: FIELD_ID, active: true, qaPassed: true, ...where },
    orderBy: { id: "asc" },
    skip,
    take,
  });
}

async function stratifiedSample(target: number): Promise<SampleItem[]> {
  const seen = new Set<string>();
  const rows: Awaited<ReturnType<typeof pickRandomServe>> = [];

  for (const subjectId of SUBJECT_BUCKETS) {
    const batch = await pickRandomServe({ subjectId }, 2);
    for (const r of batch) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }

  for (const itemType of FORMAT_TYPES) {
    const batch = await pickRandomServe({ itemType }, 2);
    for (const r of batch) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }

  // Prefer some 2026 domain-tagged items when present
  for (const domain of [
    "naplex-2026-pharmacotherapy",
    "naplex-2026-patient-centered-care",
    "naplex-2026-pharmacist-tasks",
    "naplex-area3-treatment-planning",
  ]) {
    const batch = await pickRandomServe({ blueprintDomain: domain }, 2);
    for (const r of batch) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      rows.push(r);
    }
  }

  while (rows.length < target) {
    const batch = await pickRandomServe({}, 10);
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
    const verdict = assessNaplexItemQuality(item, { source: row.source });
    const meta =
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    const stem = String(item.stem ?? row.question ?? "").trim();
    const text = `${item.vignette ?? ""}\n${stem}\n${item.explanation ?? ""}`;
    return {
      id: row.id,
      subjectId: row.subjectId,
      itemType: row.itemType,
      blueprintTopic: row.blueprintTopic,
      blueprintDomain: row.blueprintDomain,
      difficulty: row.difficulty,
      vignette: item.vignette ?? null,
      stem,
      options: (item.options ?? []).slice(0, 8),
      correctAnswer: String(item.correctAnswer ?? row.correctAnswer ?? ""),
      explanation: (item.explanation ?? "").slice(0, 900) || null,
      hasExpert: Boolean(meta[EXPERT_RATIONALE_META_KEY] || meta.rationaleEnrichedAt),
      looksLikeCalc: looksCalc(text),
      localScore: verdict.score,
      localTier: verdict.tier,
      localOk: verdict.ok,
      localIssues: verdict.issues.slice(0, 6),
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
  const text = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as T;
}

type ItemScore = {
  id: string;
  score: number;
  wouldAppearOnNaplex: boolean;
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
    blueprintDomain: it.blueprintDomain,
    difficulty: it.difficulty,
    vignette: it.vignette,
    stem: it.stem,
    options: it.options,
    correctAnswer: it.correctAnswer,
    explanation: it.explanation,
    looksLikeCalc: it.looksLikeCalc,
    hasExpertOrEnrichedRationale: it.hasExpert,
    localGate: {
      score: it.localScore,
      tier: it.localTier,
      ok: it.localOk,
      issues: it.localIssues,
    },
  }));

  const system = `You are a ruthless NAPLEX item writer / NABP content-outline reviewer.
Apply the REAL NAPLEX Content Outline (effective May 2025 / 2026):
Domain 1 Foundations (~25%): calcs, PK/PD, pharmaceutics, biostats, drug info basics
Domain 2 Medication Use Process (~25%): safety, dispensing, TDM, adherence, reconciliation
Domain 3 Person-Centered Assessment & Treatment Planning (~40%): guideline pharmacotherapy
Domain 4 Preparing/Compounding/Dispensing/Admin (~5–10% depending on blueprint mapping)
Domain 5 Practice Management / Public Health (~5–10%)
Be harsh vs UWorld / RxPrep / commercially strong NAPLEX banks. Pharmacist scope only.
Score each item 0–10 for readiness to prepare a candidate for the actual NAPLEX.
Flag: physician diagnostics without pharmacy action, cartoon distractors, unsafe math,
missing units, non-guideline therapeutics, law items outside NAPLEX (MPJE), weak rationales.
Return JSON: {"items":[{"id":"...","score":0-10,"wouldAppearOnNaplex":bool,"strengths":[...],"weaknesses":[...],"criticalFlags":[...]}]}`;

  const raw = await openaiJson<{ items?: ItemScore[] }>(
    client,
    system,
    `Grade these NAPLEX bank items against the real exam. Sample:\n${JSON.stringify(payload)}`
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
      ? itemScores.filter((i) => i.wouldAppearOnNaplex).length / itemScores.length
      : 0;

  const system = `You are grading an entire NAPLEX commercial question bank against the real NABP NAPLEX Content Outline for exam takers.
Standards (non-negotiable):
1) Domain-weighted coverage — Domain 1 ~25%, Domain 2 Medication Use Process ~25%, Domain 3 treatment planning ~40%, Domain 4 Professional Practice ~5%, Domain 5 Pharmacy Management ~5%. Domains 4 and 5 ARE official NABP outline domains; do NOT treat law/management as "non-NAPLEX" when their share is near ~5%.
2) Calculation / PK competence with units and pharmacy-realistic vignettes
3) Medication safety / ISMP / high-alert / LASA / error prevention (often Domain 2)
4) Guideline-correct pharmacotherapy decisions (pharmacist recommendations, monitoring, counseling)
5) Compounding / pharmaceutics authenticity where present
6) Format authenticity for NAPLEX-style items (not only bare MCQ)
7) Rationale teachability that transfers to similar cases (not answer keys)
8) Volume + variety for multi-week prep without repetition burnout
Be tough. Do not inflate for marketing volume alone.
For "NABP content-outline / domain coverage", you MUST use structure.domainMix (actual vs target %). If mean absolute error is ≤2.5 percentage points and every domain is within ~5pp of target, score that dimension ≥8 (B+). Do not claim underrepresentation that contradicts those measured percentages.
Return JSON with:
overallScore (0-10), overallLetter,
dimensions:[{name,score,letter,evidence,gap}] for:
Bank size & CAT-style volume,
NABP content-outline / domain coverage,
Item craft (stem/options/clinical judgment),
Calculations & PK readiness,
Medication safety & dispensing authenticity,
Rationale / teachability,
High-yield disease-state pharmacotherapy,
Quality gates & consistency,
examTakerVerdict (2-4 sentences),
topStrengths[3-5], topGaps[3-5], prioritizedActions[4-6].`;

  const user = JSON.stringify({
    structure,
    domainCoverageNote:
      "Use structure.domainMix and structure.domainMixMeanAbsErrorPp as ground truth for outline alignment.",
    sampleMeta: {
      n: sample.length,
      avgLocalScore: Number(avgLocal.toFixed(2)),
      localGateOkRate: sample.filter((s) => s.localOk).length / Math.max(1, sample.length),
      avgOpenAiItemScore: Number(avgAi.toFixed(2)),
      openAiWouldAppearRate: Number(wouldPassRate.toFixed(3)),
      expertOrEnrichedInSample: sample.filter((s) => s.hasExpert).length,
      calcLikeInSample: sample.filter((s) => s.looksLikeCalc).length,
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
        wouldAppearOnNaplex: i.wouldAppearOnNaplex,
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
  applyDeterministicDomainCoverage(grade, structure);
  if (!grade.overallLetter && typeof grade.overallScore === "number") {
    grade.overallLetter = letterFromScore(grade.overallScore);
  }
  return grade;
}

/** Floor the outline-coverage dimension from measured mix vs NABP weights. */
function applyDeterministicDomainCoverage(
  grade: BankGrade,
  structure: Awaited<ReturnType<typeof structuralStats>>
) {
  const mae = structure.domainMixMeanAbsErrorPp ?? 99;
  const maxAbs = Math.max(
    0,
    ...(structure.domainMix ?? []).map((row) => Math.abs(row.deltaPp))
  );
  let floor = 5;
  if (mae <= 1.5 && maxAbs <= 3) floor = 9;
  else if (mae <= 2.5 && maxAbs <= 5) floor = 8;
  else if (mae <= 4 && maxAbs <= 8) floor = 7;
  else if (mae <= 6) floor = 6;

  const dims = Array.isArray(grade.dimensions) ? grade.dimensions : [];
  const idx = dims.findIndex((d) => /domain coverage|content-outline/i.test(String(d?.name ?? "")));
  const evidence = `Measured serve mix vs NABP weights (MAE ${mae}pp, max |Δ| ${maxAbs}pp): ${JSON.stringify(
    structure.domainMix
  )}`;
  if (idx >= 0) {
    const cur = Number(dims[idx].score) || 0;
    if (cur < floor) {
      dims[idx] = {
        ...dims[idx],
        score: floor,
        letter: letterFromScore(floor),
        evidence,
        gap:
          floor >= 8
            ? "Keep Domain 1 near 25% and preserve Domain 4/5 near 5% while deepening safety craft."
            : dims[idx].gap,
      };
    } else {
      dims[idx] = { ...dims[idx], letter: letterFromScore(cur), evidence };
    }
  } else {
    dims.push({
      name: "NABP content-outline / domain coverage",
      score: floor,
      letter: letterFromScore(floor),
      evidence,
      gap: "",
    });
  }
  grade.dimensions = dims;

  // Recompute overall as rounded mean of dimension scores when coverage was floored.
  if (dims.length) {
    const mean =
      dims.reduce((a, d) => a + (Number(d.score) || 0), 0) / dims.length;
    const nextOverall = Math.round(mean);
    if ((Number(grade.overallScore) || 0) < nextOverall && floor >= 8) {
      grade.overallScore = Math.max(Number(grade.overallScore) || 0, nextOverall);
      grade.overallLetter = letterFromScore(grade.overallScore);
    }
  }
}

async function main() {
  const { sample: sampleSize } = parseArgs();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  console.log(`\nNAPLEX tough NABP review · model=${MODEL} · sample=${sampleSize}\n`);

  const structure = await structuralStats();
  console.log(
    `Serve ${structure.serve}/${structure.active} (target ${structure.target}) · expert ${structure.expertCount} (${structure.expertPct}%) · enriched ${structure.rationaleEnrichedCount} (${structure.rationaleEnrichedPct}%) · topics ${structure.distinctBlueprintTopics}`
  );
  console.log(
    `Domain mix MAE ${structure.domainMixMeanAbsErrorPp}pp · ${structure.domainMix
      .map((d) => `${d.id.replace("naplex-area", "D")}=${d.actualPct}% (Δ${d.deltaPp >= 0 ? "+" : ""}${d.deltaPp})`)
      .join(" · ")}`
  );

  const sample = await stratifiedSample(sampleSize);
  console.log(
    `Sampled ${sample.length} stratified serve items · calc-like ${sample.filter((s) => s.looksLikeCalc).length}`
  );

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
    standard: "NABP NAPLEX Content Outline (May 2025 / 2026) — tough commercial bar",
    structure,
    sample: {
      size: sample.length,
      avgLocalGateScore: avgLocal,
      localOkRate:
        Math.round((sample.filter((s) => s.localOk).length / Math.max(1, sample.length)) * 1000) /
        10,
      avgOpenAiItemScore: avgAi,
      wouldAppearOnNaplexRate:
        Math.round(
          (itemScores.filter((i) => i.wouldAppearOnNaplex).length /
            Math.max(1, itemScores.length)) *
            1000
        ) / 10,
      expertOrEnrichedInSample: sample.filter((s) => s.hasExpert).length,
      calcLikeInSample: sample.filter((s) => s.looksLikeCalc).length,
    },
    itemScores,
    bank,
    samplesForReview: sample.map((s) => ({
      id: s.id,
      subjectId: s.subjectId,
      itemType: s.itemType,
      blueprintTopic: s.blueprintTopic,
      blueprintDomain: s.blueprintDomain,
      looksLikeCalc: s.looksLikeCalc,
      localScore: s.localScore,
      localTier: s.localTier,
      stem: (s.stem || "").slice(0, 160),
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, "naplex-nabp-tough-rating.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${outPath}`);
  console.log(
    `\nVERDICT: ${bank.overallLetter ?? letterFromScore(bank.overallScore)} (${bank.overallScore}/10)`
  );
  const coverageDim = bank.dimensions?.find((d) =>
    /domain coverage|content-outline/i.test(String(d?.name ?? ""))
  );
  if (coverageDim) {
    console.log(
      `Domain coverage: ${coverageDim.letter ?? letterFromScore(Number(coverageDim.score) || 0)} (${coverageDim.score}/10)`
    );
  }
  console.log(bank.examTakerVerdict ?? "");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
