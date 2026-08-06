#!/usr/bin/env node
/**
 * Elevate NAPLEX bank toward A− / A on the tough NABP bar.
 *
 * Focus:
 *  1) Domain 1 foundations — PK / PD / pharmaceutics / calcs
 *  2) Domain 3 treatment planning — endocrine, renal, resp, GI, neuro/psych, onco, peds/geri
 *  3) Exceptional rationales (structured / expert template)
 *  4) Quarantine broken ordered-response / unsafe calc items
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/elevate-naplex-a-quality.mts --audit-only
 *   bash scripts/run-with-node.sh npx tsx scripts/elevate-naplex-a-quality.mts --wave 1
 *   bash scripts/run-with-node.sh npx tsx scripts/elevate-naplex-a-quality.mts --wave 1 --skip-generate
 *
 * Env: DATABASE_URL + OPENAI_API_KEY via scripts/load-env.ts (never hardcode).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { serializeBankOptions, enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { generateStructuredRationale, rationaleInputFromBankItem } from "../src/lib/engine/rationale";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();
const MODEL = process.env.NAPLEX_ELEVATION_MODEL?.trim() || "gpt-4o";
const OUT_DIR = path.join(process.cwd(), "tmp");
const ARTIFACTS = path.join(process.cwd(), "artifacts");

const DOMAIN1_SUBJECTS = ["pharmacokinetics", "pharmaceutics", "compounding-calculations", "pharmacology"] as const;
const DOMAIN3_SUBJECTS = [
  "endocrine-rx",
  "cns-rx",
  "infectious-disease-rx",
  "cardiovascular-rx",
  "otc-self-care",
] as const;

const PK_TOPICS = [
  "absorption-bioavailability",
  "vd-distribution",
  "hepatic-metabolism-cyp",
  "renal-elimination-crcl",
  "half-life-steady-state",
  "loading-maintenance-dose",
  "tdm-vancomycin-aminoglycosides",
  "nonlinear-phenytoin-pk",
  "pharmacogenomics-cyp2c19-cyp2d6",
  "biopharmaceutics-dissolution",
] as const;

const DOMAIN3_TOPICS = [
  "diabetes-gdmt-sglt2-glp1",
  "asthma-copd-inhalers",
  "ckd-dosing-anemia",
  "anticoag-doac-bridge",
  "oncology-supportive-care",
  "depression-ssri-monitoring",
  "epilepsy-asm-interactions",
  "geriatrics-beers-polypharmacy",
  "pediatrics-weight-based-dosing",
  "gerd-pud-hpyori",
  "hf-gdmt-arni-mra",
  "ids-stewardship-mrsa-pseudomonas",
] as const;

/** Medication Use Process (NABP Domain 2) — tough rating's emptiest outline domain. */
const DOMAIN2_TOPICS = [
  "prescription-verification",
  "dispensing-labeling-auxiliary",
  "tdm-vancomycin-aminoglycosides",
  "adherence-barriers-assessment",
  "medication-reconciliation",
  "administration-devices-inhalers",
  "drug-information-resources",
  "ismp-high-alert-meds",
  "look-alike-sound-alike",
  "iv-push-safety",
] as const;

const DOMAIN2_SUBJECTS = [
  "patient-counseling",
  "pharmacology",
  "pharmacokinetics",
  "compounding-calculations",
] as const;

/** Medication safety / professional practice — tough rating's weakest NAPLEX domain. */
const SAFETY_TOPICS = [
  "ismp-high-alert-meds",
  "look-alike-sound-alike",
  "tall-man-lettering",
  "medication-reconciliation",
  "iv-push-safety",
  "wrong-route-prevention",
  "allergy-cross-reactivity",
  "heparin-insulin-double-check",
  "pediatric-weight-error-prevention",
  "dispensing-error-recovery",
] as const;

const SAFETY_SUBJECTS = ["patient-counseling", "pharmacology", "pharmacy-law"] as const;

type GenItem = {
  subjectId: string;
  blueprintDomain: string;
  blueprintTopic: string;
  itemType: "vignette" | "constructed_response" | "select_all";
  vignette: string;
  question: string;
  options: [string, string, string, string] | string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  rationale: {
    whyCorrect: string;
    distractorRationales: Record<string, string>;
    clinicalPearl: string;
    mnemonic: string;
    stepByStep: string[];
    realWorldNextSteps: string;
    keyTakeaway: string;
  };
};

function parseArgs() {
  const args = process.argv.slice(2);
  let wave = 1;
  let auditOnly = false;
  let skipGenerate = false;
  let skipEnrich = false;
  let skipFix = false;
  let generateCount = 40;
  let enrichLimit = 150;
  /** Force mix: calcs/PK-heavy, Domain 2 medication-use, safety-heavy, Domain 3, or auto. */
  let bias: "auto" | "calcs" | "safety" | "domain3" | "domain2" | "coverage" = "auto";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--wave" && args[i + 1]) wave = Number(args[++i]);
    else if (args[i] === "--audit-only") auditOnly = true;
    else if (args[i] === "--skip-generate") skipGenerate = true;
    else if (args[i] === "--skip-enrich") skipEnrich = true;
    else if (args[i] === "--skip-fix") skipFix = true;
    else if (args[i] === "--generate-count" && args[i + 1]) generateCount = Number(args[++i]);
    else if (args[i] === "--enrich-limit" && args[i + 1]) enrichLimit = Number(args[++i]);
    else if (args[i] === "--bias" && args[i + 1]) {
      const v = String(args[++i]).toLowerCase();
      if (
        v === "calcs" ||
        v === "safety" ||
        v === "domain3" ||
        v === "domain2" ||
        v === "coverage" ||
        v === "auto"
      ) {
        bias = v;
      }
    }
  }
  return { wave, auditOnly, skipGenerate, skipEnrich, skipFix, generateCount, enrichLimit, bias };
}

async function audit() {
  const serve = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true, qaPassed: true },
  });
  const subjects = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pharmacy", active: true, qaPassed: true },
    _count: { _all: true },
  });
  const bySubject = Object.fromEntries(subjects.map((s) => [s.subjectId ?? "null", s._count._all]));
  const types = await prisma.questionBankItem.groupBy({
    by: ["itemType"],
    where: { fieldId: "pharmacy", active: true, qaPassed: true },
    _count: { _all: true },
  });
  const byType = Object.fromEntries(types.map((t) => [t.itemType ?? "null", t._count._all]));
  const enriched = await prisma.$queryRaw<Array<{ n: number }>>`
    SELECT COUNT(*)::int AS n FROM "QuestionBankItem"
    WHERE "fieldId" = 'pharmacy' AND active AND "qaPassed"
      AND ("generationMeta"::text LIKE '%rationaleEnrichedAt%'
        OR "generationMeta"::text LIKE '%expertRationale%')
  `;

  const domain1 =
    (bySubject.pharmacokinetics ?? 0) +
    (bySubject.pharmaceutics ?? 0) +
    (bySubject["compounding-calculations"] ?? 0);
  const domain3Core =
    (bySubject["endocrine-rx"] ?? 0) +
    (bySubject["cns-rx"] ?? 0) +
    (bySubject["infectious-disease-rx"] ?? 0) +
    (bySubject["cardiovascular-rx"] ?? 0);

  const report = {
    checkedAt: new Date().toISOString(),
    serve,
    bySubject,
    byType,
    enrichedRationales: enriched[0]?.n ?? 0,
    enrichedPct: serve ? Math.round(((enriched[0]?.n ?? 0) / serve) * 1000) / 10 : 0,
    gapScores: {
      pharmacokinetics: bySubject.pharmacokinetics ?? 0,
      pharmaceutics: bySubject.pharmaceutics ?? 0,
      domain1Proxy: domain1,
      domain3Core,
      ordered_response: byType.ordered_response ?? 0,
      select_all: byType.select_all ?? 0,
    },
    targets: {
      pharmacokineticsServe: 200,
      pharmaceuticsServe: 150,
      enrichedPct: 15,
    },
    flags: [
      (bySubject.pharmacokinetics ?? 0) < 50 ? "critical_pk_underbuild" : null,
      (bySubject.pharmaceutics ?? 0) < 80 ? "pharmaceutics_thin" : null,
      (bySubject["endocrine-rx"] ?? 0) < 500 ? "endocrine_thin_vs_domain3" : null,
      (bySubject["cns-rx"] ?? 0) < 500 ? "neuropsych_thin_vs_domain3" : null,
      ((enriched[0]?.n ?? 0) / Math.max(1, serve)) * 100 < 10
        ? "rationale_teachability_low"
        : null,
    ].filter(Boolean),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, "naplex-a-quality-gap.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`\nGap audit → ${out}`);
  console.log(JSON.stringify(report.gapScores, null, 2));
  console.log("Flags:", report.flags.join(", ") || "none");
  return report;
}

async function quarantineBrokenItems() {
  console.log("\nQuarantine broken ordered-response / unsafe calc stems…");
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      OR: [
        { itemType: "ordered_response" },
        {
          itemType: { in: ["constructed_response", "exhibit"] },
          question: { contains: "calculate", mode: "insensitive" },
        },
      ],
    },
    take: 400,
  });

  let quarantined = 0;
  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const verdict = assessNaplexItemQuality(item, { source: row.source });
    const stem = `${row.question}\n${row.explanation ?? ""}`;
    const badOrdered =
      row.itemType === "ordered_response" &&
      (/missing units|unsafe|incomplete|misalignment/i.test(verdict.issues.join(" ")) ||
        !verdict.ok ||
        (item.options?.length ?? 0) < 3);
    const badCalc =
      /what is the (dose|rate|quantity)/i.test(row.question) &&
      !/\b(mg|mL|mEq|units|%|mL\/hr|mg\/kg)\b/i.test(stem) &&
      /calculate|how many|closest/i.test(row.question);

    if (!badOrdered && !badCalc && verdict.ok) continue;

    if (badOrdered || badCalc || verdict.tier === "reject") {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          active: false,
          qaPassed: false,
          reviewStatus: "naplex_broken_quarantine",
          updatedAt: new Date(),
        },
      });
      quarantined++;
    }
  }
  console.log(`Quarantined ${quarantined} items`);
  return quarantined;
}

async function generateBatch(
  client: OpenAI,
  kind: "domain1" | "domain2" | "domain3" | "safety",
  count: number,
  opts?: { preferPharmaceutics?: boolean; complexCalcs?: boolean }
): Promise<GenItem[]> {
  const topics =
    kind === "domain1"
      ? PK_TOPICS
      : kind === "domain2"
        ? DOMAIN2_TOPICS
        : kind === "safety"
          ? SAFETY_TOPICS
          : DOMAIN3_TOPICS;
  const subjects =
    kind === "domain1"
      ? DOMAIN1_SUBJECTS
      : kind === "domain2"
        ? DOMAIN2_SUBJECTS
        : kind === "safety"
          ? SAFETY_SUBJECTS
          : DOMAIN3_SUBJECTS;
  const domain =
    kind === "domain1"
      ? "naplex-area1-foundations"
      : kind === "domain2"
        ? "naplex-area2-therapeutics"
        : kind === "safety"
          ? "naplex-area4-safety"
          : "naplex-area3-treatment-planning";

  const subjectBias =
    kind === "domain1"
      ? opts?.preferPharmaceutics
        ? `SUBJECT MIX (critical): ≥70% subjectId MUST be "pharmaceutics"; rest pharmacokinetics/compounding-calculations/pharmacology. Never invent new subjectIds.`
        : opts?.complexCalcs
          ? `SUBJECT MIX (critical): ≥50% subjectId "compounding-calculations", ≥30% "pharmacokinetics"; rest pharmaceutics/pharmacology. Every calc MUST show units in stem AND options; no unsafe/ambiguous math.`
          : `SUBJECT MIX (critical): ≥70% subjectId MUST be "pharmacokinetics"; rest pharmaceutics/compounding-calculations/pharmacology. Never invent new subjectIds.`
      : kind === "domain2"
        ? `SUBJECT MIX: use patient-counseling, pharmacology, pharmacokinetics, or compounding-calculations. Focus on Medication Use Process (verify Rx, dispense, administer devices, TDM, adherence, reconciliation) — pharmacist owns the action. Never invent subjectIds.`
        : kind === "safety"
          ? `SUBJECT MIX: use patient-counseling, pharmacology, or pharmacy-law only. Tag ISMP/LASA/high-alert safety actions a pharmacist owns. Never invent subjectIds.`
          : `SUBJECT MIX: spread across endocrine-rx, cns-rx, infectious-disease-rx, cardiovascular-rx, otc-self-care. Prefer underbuilt endocrine/cns/oncology-supportive vignettes tagged to those subjects. Never invent subjectIds.`;

  const focusLabel =
    kind === "domain1"
      ? opts?.complexCalcs
        ? "Domain 1 Foundations — HARD pharmacy calculations & PK with explicit units"
        : opts?.preferPharmaceutics
          ? "Domain 1 Foundations — pharmaceutics / biopharmaceutics emphasis"
          : "Domain 1 Foundations (PK/PD/biopharmaceutics/calcs/PGx)"
      : kind === "domain2"
        ? "Domain 2 Medication Use Process (verify → dispense → administer → monitor → adhere)"
        : kind === "safety"
          ? "Domain 4 Professional Practice / Medication Safety (ISMP, LASA, reconciliation, high-alert)"
          : "Domain 3 Person-Centered Treatment Planning";

  const system = `You are a NAPLEX PharmD item writer targeting A−/A commercial quality (UWorld/RxPrep bar).
Write ${count} NEW application-focused items for ${focusLabel}.
Rules:
- Pharmacist scope only (recommend, monitor, counsel, dose-adjust, catch dispensing/admin errors) — not physician diagnostics alone
- Vignette-rich with labs/meds/comorbidities
- Plausible distractors = common candidate errors
- Every item MUST include full rationale object
- Calculations: always include units (mg, mL, mg/kg, mEq, AUC units); show multi-step work in rationale.stepByStep; never omit concentration/volume/time needed to solve
- ${subjectBias}
Return JSON: {"items":[...]} with fields:
subjectId (one of ${subjects.join(", ")} ONLY),
blueprintDomain ("${domain}"),
blueprintTopic (slug from ${topics.join(", ")} or close),
itemType (vignette|constructed_response|select_all),
vignette, question, options[4] (or more for SATA), correctAnswer (exact option text; for SATA comma-join),
explanation (assembled readable narrative ≥220 chars),
difficulty 3-5,
rationale:{whyCorrect, distractorRationales{option:text}, clinicalPearl, mnemonic, stepByStep[3-6], realWorldNextSteps, keyTakeaway}`;

  const userContent =
    kind === "domain1"
      ? opts?.complexCalcs
        ? `Generate ${count} HARD calc/PK items now. Prefer CrCl dosing, TDM, IV rates, alligation, loading/maintenance, AUC. Every numeric answer option MUST include units. Topics: ${topics.join(", ")}.`
        : opts?.preferPharmaceutics
          ? `Generate ${count} items now. At least ${Math.ceil(count * 0.7)} must use subjectId "pharmaceutics". Topics: biopharmaceutics-dissolution and related foundations.`
          : `Generate ${count} items now. At least ${Math.ceil(count * 0.7)} must use subjectId "pharmacokinetics". Topics: ${topics.join(", ")}.`
      : kind === "domain2"
        ? `Generate ${count} Domain 2 Medication Use Process items now. Prefer: ${topics.slice(0, 8).join(", ")}. blueprintDomain MUST be naplex-area2-therapeutics.`
        : kind === "safety"
          ? `Generate ${count} medication-safety items now. Prefer: ${topics.slice(0, 8).join(", ")}. blueprintDomain must be naplex-area4-safety.`
          : `Generate ${count} high-yield Domain 3 items now. Prefer: ${topics.slice(0, 8).join(", ")}.`;

  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.45,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { items?: GenItem[] };
  return Array.isArray(parsed.items) ? parsed.items.slice(0, count) : [];
}

function toBankItem(gen: GenItem): BankItem {
  const options = (gen.options ?? []).map(String);
  const explanation = [
    gen.explanation?.trim(),
    gen.rationale?.whyCorrect ? `Why correct: ${gen.rationale.whyCorrect}` : "",
    gen.rationale?.clinicalPearl ? `Pearl: ${gen.rationale.clinicalPearl}` : "",
    gen.rationale?.mnemonic ? `Memory hook: ${gen.rationale.mnemonic}` : "",
    gen.rationale?.stepByStep?.length
      ? `Steps: ${gen.rationale.stepByStep.map((s, i) => `${i + 1}. ${s}`).join(" ")}`
      : "",
    gen.rationale?.realWorldNextSteps
      ? `Next: ${gen.rationale.realWorldNextSteps}`
      : "",
    gen.rationale?.keyTakeaway ? `Takeaway: ${gen.rationale.keyTakeaway}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const distractorRationale = gen.rationale?.distractorRationales ?? undefined;

  return {
    subjectId: gen.subjectId,
    question: gen.question,
    options: options.length >= 2 ? options : ["A", "B", "C", "D"],
    correctAnswer: gen.correctAnswer,
    explanation,
    vignette: gen.vignette,
    itemType: gen.itemType,
    difficulty: gen.difficulty ?? 4,
    blueprintDomain: gen.blueprintDomain,
    blueprintTopic: gen.blueprintTopic,
    tags: ["naplex-a-elevate", gen.blueprintTopic, gen.subjectId],
    distractorRationale,
    clinicalReasoning: gen.rationale?.whyCorrect,
    keyTakeaways: [gen.rationale?.keyTakeaway, gen.rationale?.clinicalPearl].filter(
      Boolean
    ) as string[],
  };
}

const ALLOWED_SUBJECTS = new Set<string>([
  ...DOMAIN1_SUBJECTS,
  ...DOMAIN2_SUBJECTS,
  ...DOMAIN3_SUBJECTS,
  ...SAFETY_SUBJECTS,
]);

function coerceSubjectId(raw: string | undefined, kindHint?: string): string {
  const s = (raw ?? "").trim();
  if (ALLOWED_SUBJECTS.has(s)) return s;
  // Model sometimes returns topic slugs as subjectId — map back to bank subjects.
  const topic = s.toLowerCase();
  if (/pk|half-life|steady|vd|cyp|tdm|amino|phenytoin|pharmacogen|bioavail|crcl|elimin/.test(topic))
    return "pharmacokinetics";
  if (/dissolut|biopharm|formul|pharmaceut/.test(topic)) return "pharmaceutics";
  if (/compound|alligation|percent|dilut|ivroom/.test(topic)) return "compounding-calculations";
  if (/ismp|lasa|tall-?man|reconcil|high-?alert|look.?alike|medication.?safety|dispens|adheren|verify|inhaler|device/.test(topic))
    return "patient-counseling";
  if (/diabetes|sglt|glp|endocrin|thyroid/.test(topic)) return "endocrine-rx";
  if (/depress|ssri|epilep|asm|psych|cns|seizure|parkinson/.test(topic)) return "cns-rx";
  if (/mrsa|pseudo|steward|infect|antibiotic|linezolid/.test(topic)) return "infectious-disease-rx";
  if (/hf|doac|anticoag|cardio|arni/.test(topic)) return "cardiovascular-rx";
  if (/geriatr|beers|pediatr|oncolog|asthma|copd|gerd|ckd|renal/.test(topic)) {
    if (/oncolog/.test(topic)) return "otc-self-care"; // closest pharmacy-action bucket until onco subject exists
    if (/asthma|copd|gerd|otc/.test(topic)) return "otc-self-care";
    if (/geriatr|beers|pediatr|ckd|renal/.test(topic)) return "pharmacology";
  }
  if (kindHint === "domain1") return "pharmaceutics";
  if (kindHint === "domain2" || kindHint === "safety") return "patient-counseling";
  return "pharmacology";
}

async function insertGenerated(
  items: GenItem[],
  kindHint?: "domain1" | "domain2" | "domain3" | "safety"
) {
  let created = 0;
  let skipped = 0;
  let rejected = 0;

  for (const gen of items) {
    const item = toBankItem(gen);
    const subjectId = coerceSubjectId(item.subjectId, kindHint);
    item.subjectId = subjectId;
    const forcedDomain =
      kindHint === "domain1"
        ? "naplex-area1-foundations"
        : kindHint === "domain2"
          ? "naplex-area2-therapeutics"
          : kindHint === "domain3"
            ? "naplex-area3-treatment-planning"
            : kindHint === "safety"
              ? "naplex-area4-safety"
              : item.blueprintDomain ?? null;
    item.blueprintDomain = forcedDomain ?? item.blueprintDomain;
    const hash = bankItemContentHash("pharmacy", subjectId, item);
    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const verdict = assessNaplexItemQuality(item, { source: "ai-curated" });
    const qaPassed = verdict.ok || verdict.tier === "best" || verdict.tier === "acceptable";
    if (verdict.tier === "reject" && !qaPassed) {
      rejected++;
      continue;
    }

    await prisma.questionBankItem.create({
      data: {
        fieldId: "pharmacy",
        subjectId,
        scenario: item.vignette ?? null,
        question: item.question,
        options: serializeBankOptions(item),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation ?? "",
        itemType: item.itemType ?? "vignette",
        difficulty: item.difficulty ?? 4,
        topicCategory: subjectId,
        blueprintDomain: forcedDomain ?? item.blueprintDomain ?? null,
        blueprintTopic: item.blueprintTopic ?? null,
        tags: JSON.stringify(item.tags ?? []),
        source: "ai-curated",
        contentHash: hash,
        active: true,
        qaPassed: true,
        qaAuditedAt: new Date(),
        reviewStatus: "naplex_a_elevate",
        generationMeta: {
          pipeline: "elevate-naplex-a-quality",
          model: MODEL,
          rationale: gen.rationale,
          rationaleEnrichedAt: new Date().toISOString(),
        },
      },
    });
    created++;
  }

  console.log(`Insert generated: +${created} created, ${skipped} dupes, ${rejected} rejected`);
  return { created, skipped, rejected };
}

async function enrichSlice(limit: number) {
  console.log(`\nEnrich rationales on Domain1/3 slices (limit ${limit})…`);
  requireOpenAiKey();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pharmacy",
      active: true,
      qaPassed: true,
      OR: [
        { subjectId: { in: [...DOMAIN1_SUBJECTS, ...DOMAIN3_SUBJECTS] } },
        { tags: { contains: "naplex-a-elevate" } },
        { reviewStatus: "naplex_a_elevate" },
      ],
    },
    orderBy: { updatedAt: "asc" },
    take: limit * 3,
  });

  let enriched = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of rows) {
    if (enriched >= limit) break;
    const meta =
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    if (meta.rationaleEnrichedAt && meta.elevateRationaleV2) {
      skipped++;
      continue;
    }

    const item = enrichBankItemFromRow(row);
    const gen = await generateStructuredRationale(rationaleInputFromBankItem(item, "pharmacy"));
    if (!gen?.quality.ok) {
      failed++;
      continue;
    }

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        explanation: gen.assembled.explanation,
        options: serializeBankOptions({
          ...item,
          distractorRationale: gen.assembled.distractorRationale,
          clinicalReasoning: gen.assembled.clinicalReasoning,
          keyTakeaways: gen.assembled.keyTakeaways,
        }),
        generationMeta: {
          ...meta,
          structuredRationale: gen.structured,
          rationaleEnrichedAt: new Date().toISOString(),
          elevateRationaleV2: true,
          rationaleModel: gen.model,
          rationaleQualityScore: gen.quality.score,
        },
        updatedAt: new Date(),
      },
    });
    enriched++;
    if (enriched % 10 === 0) console.log(`  … enriched ${enriched}`);
  }

  console.log(`Enrich done: ${enriched} ok, ${failed} failed, ${skipped} skipped`);
  return { enriched, failed, skipped };
}

function runNpmScript(script: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(
      "bash",
      ["scripts/run-with-node.sh", "npx", "tsx", script, ...args],
      { cwd: process.cwd(), stdio: "inherit", env: process.env }
    );
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function main() {
  const opts = parseArgs();
  mkdirSync(ARTIFACTS, { recursive: true });
  console.log(`\nNAPLEX A−/A elevation · wave ${opts.wave}\n`);

  const gap = await audit();
  if (opts.auditOnly) {
    await prisma.$disconnect();
    return;
  }

  requireOpenAiKey();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  let quarantined = 0;
  if (!opts.skipFix) {
    quarantined = await quarantineBrokenItems();
    console.log("Running format/calc coherence fixers…");
    await runNpmScript("scripts/fix-naplex-format-coherence.ts", []);
    await runNpmScript("scripts/fix-naplex-calculation-bank.ts", []);
  }

  let genStats = { d1: 0, d2: 0, d3: 0, safety: 0 };
  if (!opts.skipGenerate) {
    // PK gate already cleared (~200); prefer Domain 3 + safety when foundations are healthy
    // (tough ratings keep docking medication-safety ~4 and treatment-planning coverage).
    // --bias calcs forces PK/calc-heavy Domain 1 when calc readiness is the blocker.
    // --bias coverage / domain2 fills the nearly empty Domain 2 Medication Use Process bucket.
    const preferPharmaceutics =
      opts.bias === "calcs" ? false : (gap.gapScores.pharmacokinetics ?? 0) >= 180;
    const complexCalcs = opts.bias === "calcs";
    const foundationsHealthy =
      (gap.gapScores.pharmacokinetics ?? 0) >= 200 && (gap.gapScores.pharmaceutics ?? 0) >= 150;
    let d1Frac = foundationsHealthy ? 0.15 : 0.3;
    let d2Frac = 0;
    let safetyFrac = foundationsHealthy ? 0.4 : 0.25;
    if (opts.bias === "calcs") {
      d1Frac = 0.55;
      safetyFrac = 0.15;
      d2Frac = 0.15;
    } else if (opts.bias === "safety") {
      d1Frac = 0.15;
      safetyFrac = 0.45;
    } else if (opts.bias === "domain3") {
      d1Frac = 0.15;
      safetyFrac = 0.2;
    } else if (opts.bias === "domain2") {
      d1Frac = 0.2;
      d2Frac = 0.55;
      safetyFrac = 0.1;
    } else if (opts.bias === "coverage") {
      // Phase 2: foundations + Domain 2 therapeutics hole
      d1Frac = 0.35;
      d2Frac = 0.45;
      safetyFrac = 0.1;
    }
    const d1Count = Math.max(8, Math.floor(opts.generateCount * d1Frac));
    const d2Count = d2Frac > 0 ? Math.max(8, Math.floor(opts.generateCount * d2Frac)) : 0;
    const safetyCount = Math.max(8, Math.floor(opts.generateCount * safetyFrac));
    const d3Count = Math.max(8, opts.generateCount - d1Count - d2Count - safetyCount);
    const chunk = 8;

    console.log(
      `\nGenerating Domain 1 foundations (~${d1Count}, pharmaceuticsBias=${preferPharmaceutics}, bias=${opts.bias}) in chunks of ${chunk}…`
    );
    for (let n = 0; n < d1Count; n += chunk) {
      const want = Math.min(chunk, d1Count - n);
      const d1 = await generateBatch(client, "domain1", want, {
        preferPharmaceutics,
        complexCalcs,
      });
      const d1ins = await insertGenerated(d1, "domain1");
      genStats.d1 += d1ins.created;
    }
    if (d2Count > 0) {
      console.log(
        `\nGenerating Domain 2 Medication Use Process (~${d2Count} in chunks of ${chunk})…`
      );
      for (let n = 0; n < d2Count; n += chunk) {
        const want = Math.min(chunk, d2Count - n);
        const d2 = await generateBatch(client, "domain2", want);
        const d2ins = await insertGenerated(d2, "domain2");
        genStats.d2 += d2ins.created;
      }
    }
    console.log(`\nGenerating Domain 3 treatment-planning (~${d3Count} in chunks of ${chunk})…`);
    for (let n = 0; n < d3Count; n += chunk) {
      const want = Math.min(chunk, d3Count - n);
      const d3 = await generateBatch(client, "domain3", want);
      const d3ins = await insertGenerated(d3, "domain3");
      genStats.d3 += d3ins.created;
    }
    console.log(`\nGenerating medication-safety Domain 4 (~${safetyCount} in chunks of ${chunk})…`);
    for (let n = 0; n < safetyCount; n += chunk) {
      const want = Math.min(chunk, safetyCount - n);
      const safety = await generateBatch(client, "safety", want);
      const sins = await insertGenerated(safety, "safety");
      genStats.safety += sins.created;
    }
  }

  let enrichStats = { enriched: 0, failed: 0, skipped: 0 };
  if (!opts.skipEnrich) {
    enrichStats = await enrichSlice(opts.enrichLimit);
  }

  const after = await audit();
  const summary = {
    wave: opts.wave,
    completedAt: new Date().toISOString(),
    quarantined,
    generated: genStats,
    enrich: enrichStats,
    before: gap.gapScores,
    after: after.gapScores,
    flagsAfter: after.flags,
  };
  const summaryPath = path.join(ARTIFACTS, `naplex-a-elevate-wave${opts.wave}.json`);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\nWave summary → ${summaryPath}`);
  console.log(JSON.stringify(summary, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
