#!/usr/bin/env node
/**
 * Full NAPLEX topic–question alignment audit across ALL pharmacy subjects.
 *
 * Scores each active item against canonical subject signals and proposes
 * re-tags when the best match differs from the current subjectId.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/align-naplex-topic-questions.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/align-naplex-topic-questions.ts --commit
 *   bash scripts/run-with-node.sh npx tsx scripts/align-naplex-topic-questions.ts --subject pharmacology
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PHARMACY_SUBJECTS } from "../src/lib/subjects/pharmacy/subjects";

const prisma = new PrismaClient();
const COMMIT = process.argv.includes("--commit");

/**
 * Manual review denylist: high-confidence scorer hits that are NOT true
 * calc / pharmaceutics / foundational-PK constructs (clinical vignettes,
 * renal adjustment, or orphan "tablet count" asks with no order math).
 * These stay on their current subjectId.
 */
const HIGH_CONFIDENCE_SKIP_IDS = new Set<string>([
  "cmra7glkh00091y3evqmmvlf8", // orphan tablet ask; HF clinical vignette, no qty/days
  "cmr4c4qe8003m1ycj40f03m64", // orphan tablet ask; COPD/inhaler vignette
  "cmr4dny8g003m1ywg36uhgsn9", // orphan tablet ask; COPD refill vignette
  "cmr4f64l9003m1yg6a2f20bqb", // orphan tablet ask; abdominal pain vignette
  "cmr4hpzl6000b1yeitj20g03z", // orphan tablet ask; COPD/tiotropium vignette
  "cmr7w04iw000a1yud6wmzt8zj", // CKD metformin renal dose adjustment, not calc
  "cmr0d8z99004l1ynjlpvexlie", // sepsis vancomycin TDM selection, not foundational PK
]);

const subjectFilter = (() => {
  const idx = process.argv.indexOf("--subject");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

type Row = {
  id: string;
  subjectId: string;
  question: string;
  scenario: string | null;
  explanation: string;
  tags: string | null;
  topicCategory: string | null;
  itemType: string;
  qaPassed: boolean;
  blueprintDomain: string | null;
  correctAnswer: string;
  options: string;
  source: string | null;
};

type SubjectId = (typeof PHARMACY_SUBJECTS)[number]["id"];

type Signal = {
  subjectId: SubjectId;
  weight: number;
  pattern: RegExp;
  label: string;
};

/**
 * Construct-first signals only for auto-retag.
 * Disease keywords are used for reporting / medium review, not high-confidence moves
 * into therapeutics buckets (those stems are usually multi-topic clinical vignettes).
 */
const CONSTRUCT_SUBJECTS = new Set<SubjectId>([
  "pharmaceutics",
  "pharmacokinetics",
  "compounding-calculations",
  "pharmacy-law",
  "pharmacology",
]);

const SIGNALS: Signal[] = [
  // Pharmaceutics
  {
    subjectId: "pharmaceutics",
    weight: 12,
    label: "USP/compounding",
    pattern:
      /\b(usp\s*<?\s*79[578]>?|usp\s*<?\s*800>?|beyond[- ]use|\bbud\b|cleanroom|aseptic technique|sterile compound|nonsterile compound|csp category|hazardous drug|caci|bsc\b)\b/i,
  },
  {
    subjectId: "pharmaceutics",
    weight: 11,
    label: "dosage-form construct",
    pattern:
      /\b(dosage form|bioequivalence|bcs class|do not crush|crush(ing)? (the )?(tablet|capsule)|enteric[- ]coated|extended[- ]release formulation|dissolution (rate|test)|excipient|orally disintegrating|\bodt\b|transdermal patch|depot (injection|formulation)|osmotic pump|matrix tablet|hlb\b|polymorph|particle size|photodegradation|light[- ]protect|propylene glycol)\b/i,
  },
  // Foundational PK/PD only — NOT bare clinical "loading dose"
  {
    subjectId: "pharmacokinetics",
    weight: 12,
    label: "ADME/PK metrics",
    pattern:
      /\b(half[- ]life|t1\/2|volume of distribution|\bvd\b|steady[- ]state|first[- ]pass metabolism|auc\b|cmax\b|tmax\b|elimination rate constant|protein binding|nonlinear kinetics|michaelis[- ]menten|hepatic extraction|systemic clearance|total body clearance|extraction ratio|fraction unbound|accumulation factor|ke\b|kel\b)\b/i,
  },
  // Calculations — require an explicit quantitative ask
  {
    subjectId: "compounding-calculations",
    weight: 12,
    label: "quantitative ask",
    pattern:
      /\b(how many (ml|mL|mg|tablets|capsules|meq|mEq|units|vials)|infusion rate|mL\/hr|ml\/hr|alligation|round to the nearest|calculate the (dose|rate|volume|quantity|osmolarity|day'?s supply)|total volume to dispense|what volume|what (dose|rate) (in|should)|days'? supply)\b/i,
  },
  {
    subjectId: "compounding-calculations",
    weight: 10,
    label: "weight-based calc setup",
    pattern:
      /\b(mg\/kg\/(day|dose|hr|min)|mg\/kg).{0,120}(how many|calculate|prepare|dispense|volume|mL|ml|round)\b/i,
  },
  // Law
  {
    subjectId: "pharmacy-law",
    weight: 12,
    label: "law/DEA/HIPAA",
    pattern:
      /\b(dea\b|controlled substance schedule|hipaa|board of pharmacy|prescription validity|corresponding responsibility|pdmp|dscsa|503a|503b|refill (limit|authorized)|c-ii|c-iii|c-iv|c-v|transferring controlled)\b/i,
  },
  // Counseling (only when ask is counseling-primary)
  {
    subjectId: "patient-counseling",
    weight: 10,
    label: "counseling ask",
    pattern:
      /\b((which|what).{0,60}(counsel|educat|teach|advise|instruct)|most appropriate counseling|counsel the patient|inhaler technique|adherence counseling|missed dose counseling)\b/i,
  },
  // OTC
  {
    subjectId: "otc-self-care",
    weight: 10,
    label: "OTC/self-care",
    pattern:
      /\b(over[- ]the[- ]counter|\botc\b|self[- ]care|nonprescription|behind[- ]the[- ]counter|pharmacist[- ]only|dextromethorphan|guaifenesin|loratadine|cetirizine|diphenhydramine|omeprazole otc|ranitidine|famotidine|pseudoephedrine|phenylephrine|acetaminophen for (cold|fever|pain)|ibuprofen for (cold|fever|pain))\b/i,
  },
  // Oncology
  {
    subjectId: "oncology-rx",
    weight: 11,
    label: "oncology",
    pattern:
      /\b(chemotherapy|neutropenia|febrile neutropenia|tumor lysis|antiemetic (for chemo|regimen)|colony[- ]stimulating|filgrastim|pegfilgrastim|cisplatin|doxorubicin|cyclophosphamide|methotrexate (cancer|oncology)|checkpoint inhibitor|car[- ]t|oncolog)\b/i,
  },
  // ID
  {
    subjectId: "infectious-disease-rx",
    weight: 10,
    label: "anti-infective",
    pattern:
      /\b(antibiotic|antimicrobial|mrsa|cap\b|hap\b|vap\b|meningitis|cellulitis|pyelonephritis|hiv|art\b|integrase|nnrti|nrti|hepatitis [bc]|antifungal|amphotericin|echinocandin|vancomycin|piperacillin|ceftriaxone|azithromycin for (pneumonia|sti|chlamydia)|latent tb|active tb|malaria)\b/i,
  },
  // Endocrine
  {
    subjectId: "endocrine-rx",
    weight: 10,
    label: "endocrine",
    pattern:
      /\b(type [12] diabetes|insulin (glargine|lispro|aspart|detemir|degludec|nph|regular)|metformin|sglt2|glp[- ]?1|dpp[- ]?4|sulfonylurea|levothyroxine|hyperthyroid|hypothyroid|osteoporosis|bisphosphonate|denosumab|corticosteroid replacement|addison|cushing|hba1c|diabetic ketoacidosis)\b/i,
  },
  // CNS
  {
    subjectId: "cns-rx",
    weight: 10,
    label: "CNS/psych",
    pattern:
      /\b(ssri|snri|antipsychotic|schizophrenia|bipolar|major depressive|seizure|epilepsy|benzodiazepine|opioid use disorder|buprenorphine|naloxone|gabapentin|pregabalin|lithium|clozapine|serotonin syndrome|extrapyramidal|parkinson)\b/i,
  },
  // Cardiovascular
  {
    subjectId: "cardiovascular-rx",
    weight: 10,
    label: "cardiovascular",
    pattern:
      /\b(heart failure|hfref|hfpef|acs\b|myocardial infarction|atrial fibrillation|anticoagul|antiplatelet|statin|ldl|ace inhibitor|arb\b|arni|beta[- ]blocker|calcium channel|hypertension|ascvd|warfarin|apixaban|rivaroxaban|dabigatran|clopidogrel|ticagrelor|entresto|sacubitril|gdmt)\b/i,
  },
  // General pharmacology MOA
  {
    subjectId: "pharmacology",
    weight: 8,
    label: "MOA/receptor",
    pattern:
      /\b(mechanism of action|moa\b|agonist|antagonist|receptor subtype|competitive inhibit|noncompetitive|enzyme induc|enzyme inhibit|cyp3a4|cyp2d6|cyp2c19|pharmacodynamic interaction|affinity|efficacy|potency|partial agonist|inverse agonist)\b/i,
  },
];

const NEGATIVE: Array<{ subjectId: SubjectId; pattern: RegExp; weight: number; label: string }> = [
  // CrCl DOAC dosing is CV therapeutics, not foundational PK
  {
    subjectId: "pharmacokinetics",
    weight: 20,
    label: "clinical CrCl dosing",
    pattern:
      /\b(creatinine clearance|crcl|egfr).{0,80}(apixaban|rivaroxaban|dabigatran|dose|adjust)|((apixaban|rivaroxaban|dabigatran).{0,80}(creatinine clearance|crcl|egfr|ckd))\b/i,
  },
  // Clinical loading/maintenance dose without PK metrics ≠ foundational PK
  {
    subjectId: "pharmacokinetics",
    weight: 18,
    label: "clinical loading/maintenance only",
    pattern:
      /\b(loading dose|maintenance dose)\b/i,
  },
  // Counseling ask should not be forced into pharmaceutics just for "extended-release"
  {
    subjectId: "pharmaceutics",
    weight: 15,
    label: "counseling-primary",
    pattern:
      /\b((which|what).{0,40}(counseling|education)|most essential counseling|safety counseling)\b/i,
  },
  // Clinical renal/drug selection ≠ pharmacy calculations
  {
    subjectId: "compounding-calculations",
    weight: 14,
    label: "clinical renal/selection",
    pattern:
      /\b((most|least) appropriate|which (medication|drug|agent|regimen)|should (be|the pharmacist) (recommend|discontinue|hold|avoid)|contraindicat|drug interaction|muscle (pain|cramps)|creatine kinase|\bck\b|egfr|ckd stage)\b/i,
  },
];

const TOPIC_LABEL: Record<string, string> = Object.fromEntries(
  PHARMACY_SUBJECTS.map((s) => [s.id, s.label])
);

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    /* ignore */
  }
  return raw
    .split(/[|,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function serializeTags(tags: string[]): string {
  return JSON.stringify([...new Set(tags)]);
}

function stemText(r: Row): string {
  return `${r.scenario ?? ""}\n${r.question}\n${r.correctAnswer}`.toLowerCase();
}

function scoreRow(r: Row): { scores: Record<string, number>; hits: string[] } {
  const stem = stemText(r);
  const scores: Record<string, number> = {};
  const hits: string[] = [];

  for (const s of PHARMACY_SUBJECTS) scores[s.id] = 0;

  // Small loyalty bonus so we don't churn borderline items
  scores[r.subjectId] = (scores[r.subjectId] ?? 0) + 2;

  for (const sig of SIGNALS) {
    if (sig.pattern.test(stem)) {
      scores[sig.subjectId] += sig.weight;
      hits.push(`${sig.subjectId}:${sig.label}+${sig.weight}`);
    }
  }
  for (const neg of NEGATIVE) {
    if (neg.pattern.test(stem)) {
      scores[neg.subjectId] -= neg.weight;
      hits.push(`${neg.subjectId}:${neg.label}-${neg.weight}`);
    }
  }

  // Item-type hint only when a quantitative ask already fired
  const hasQuantAsk = hits.some((h) => h.startsWith("compounding-calculations:"));
  if (r.itemType === "constructed_response" && hasQuantAsk) {
    scores["compounding-calculations"] += 4;
    hits.push("compounding-calculations:constructed_response+4");
  }

  return { scores, hits };
}

function bestSubject(
  scores: Record<string, number>,
  current: string
): { best: string; bestScore: number; currentScore: number; margin: number } {
  let best = current;
  let bestScore = scores[current] ?? 0;
  for (const [sid, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = sid;
      bestScore = score;
    }
  }
  const currentScore = scores[current] ?? 0;
  return { best, bestScore, currentScore, margin: bestScore - currentScore };
}

function secondaryTags(to: string, from: string, existing: string | null): string[] {
  const tags = new Set(parseTags(existing));
  tags.add("topic-aligned");
  tags.add(`retagged-from-${from}`);
  tags.add(`retagged-to-${to}`);
  tags.add(to);
  return [...tags];
}

function contentHash(subjectId: string, r: Row): string {
  const payload = ["pharmacy", subjectId, r.scenario ?? "", r.question, r.options, r.correctAnswer].join(
    "\u0000"
  );
  return createHash("sha256").update(payload).digest("hex");
}

type Move = {
  id: string;
  from: string;
  to: string;
  confidence: "high" | "medium";
  margin: number;
  bestScore: number;
  currentScore: number;
  reason: string;
  hits: string[];
  stem: string;
  qaPassed: boolean;
  itemType: string;
  tags: string[];
  topicCategory: string;
};

async function main() {
  const where = {
    fieldId: "pharmacy" as const,
    active: true,
    ...(subjectFilter ? { subjectId: subjectFilter } : {}),
  };

  const counts = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pharmacy", active: true },
    _count: { _all: true },
    orderBy: { _count: { subjectId: "desc" } },
  });

  console.log("\n=== Active NAPLEX by subjectId ===");
  for (const c of counts) console.log(String(c._count._all).padStart(6), c.subjectId);

  const rows = (await prisma.questionBankItem.findMany({
    where,
    select: {
      id: true,
      subjectId: true,
      question: true,
      scenario: true,
      explanation: true,
      tags: true,
      topicCategory: true,
      itemType: true,
      qaPassed: true,
      blueprintDomain: true,
      correctAnswer: true,
      options: true,
      source: true,
    },
  })) as Row[];

  console.log(`\nScoring ${rows.length} active items${subjectFilter ? ` (filter=${subjectFilter})` : ""}…`);

  const moves: Move[] = [];
  const alignedBySubject: Record<string, { total: number; aligned: number; high: number; medium: number }> =
    {};

  for (const r of rows) {
    if (!alignedBySubject[r.subjectId]) {
      alignedBySubject[r.subjectId] = { total: 0, aligned: 0, high: 0, medium: 0 };
    }
    alignedBySubject[r.subjectId]!.total++;

    const { scores, hits } = scoreRow(r);
    const { best, bestScore, currentScore, margin } = bestSubject(scores, r.subjectId);

    if (best === r.subjectId || margin < 6) {
      alignedBySubject[r.subjectId]!.aligned++;
      continue;
    }

    const bestIsConstruct = CONSTRUCT_SUBJECTS.has(best as SubjectId);
    const constructSignalStrength = hits
      .filter((h) => h.startsWith(`${best}:`) && h.includes("+"))
      .reduce((acc, h) => {
        const m = /\+(\d+)$/.exec(h);
        return acc + (m ? Number(m[1]) : 0);
      }, 0);

    // High confidence ONLY for construct subjects with a clear construct signal.
    // Therapeutics↔therapeutics refiles are skipped — vignettes are multi-topic.
    let confidence: "high" | "medium" = "medium";
    if (
      bestIsConstruct &&
      margin >= 10 &&
      bestScore >= 12 &&
      constructSignalStrength >= 10 &&
      (best !== "compounding-calculations" ||
        hits.some((h) => h.includes("quantitative ask") || h.includes("weight-based calc")))
    ) {
      confidence = "high";
    }

    // Manual KEEP/SKIP gate for dubious high-confidence candidates
    if (confidence === "high" && HIGH_CONFIDENCE_SKIP_IDS.has(r.id)) {
      alignedBySubject[r.subjectId]!.aligned++;
      continue;
    }

    // Medium: construct refiles that are weaker; skip therapeutics churn entirely
    if (confidence === "medium" && (!bestIsConstruct || margin < 8 || bestScore < 10)) {
      alignedBySubject[r.subjectId]!.aligned++;
      continue;
    }

    const reasonHits = hits.filter((h) => h.startsWith(`${best}:`)).join("; ") || hits.slice(0, 3).join("; ");
    const move: Move = {
      id: r.id,
      from: r.subjectId,
      to: best,
      confidence,
      margin,
      bestScore,
      currentScore,
      reason: `Best match ${TOPIC_LABEL[best] ?? best} (score ${bestScore} vs ${currentScore}, margin ${margin}). Signals: ${reasonHits}`,
      hits,
      stem: `${r.scenario ? r.scenario + " | " : ""}${r.question}`.replace(/\s+/g, " ").slice(0, 220),
      qaPassed: r.qaPassed,
      itemType: r.itemType,
      tags: secondaryTags(best, r.subjectId, r.tags),
      topicCategory: TOPIC_LABEL[best] ?? best,
    };
    moves.push(move);
    if (confidence === "high") alignedBySubject[r.subjectId]!.high++;
    else alignedBySubject[r.subjectId]!.medium++;
  }

  const high = moves.filter((m) => m.confidence === "high");
  const medium = moves.filter((m) => m.confidence === "medium");

  console.log("\n=== Alignment by subject ===");
  console.log(
    "subject".padEnd(28),
    "total".padStart(6),
    "ok".padStart(6),
    "high".padStart(6),
    "med".padStart(6),
    "%ok".padStart(7)
  );
  for (const [sid, s] of Object.entries(alignedBySubject).sort((a, b) => b[1].total - a[1].total)) {
    const okPct = s.total ? ((s.aligned / s.total) * 100).toFixed(1) : "0";
    console.log(
      sid.padEnd(28),
      String(s.total).padStart(6),
      String(s.aligned).padStart(6),
      String(s.high).padStart(6),
      String(s.medium).padStart(6),
      `${okPct}%`.padStart(7)
    );
  }

  console.log(`\nProposed moves: high=${high.length} medium=${medium.length}`);

  const flow: Record<string, number> = {};
  for (const m of moves) {
    const key = `${m.from} → ${m.to}`;
    flow[key] = (flow[key] ?? 0) + 1;
  }
  console.log("\n=== Move flows ===");
  for (const [k, n] of Object.entries(flow).sort((a, b) => b[1] - a[1])) {
    console.log(String(n).padStart(5), k);
  }

  console.log("\n--- High-confidence samples ---");
  for (const m of high.slice(0, 20)) {
    console.log(`\n${m.id}  ${m.from} → ${m.to} [margin=${m.margin}]`);
    console.log(`  ${m.stem}`);
    console.log(`  ${m.reason}`);
  }

  // SQL for high-confidence
  const sql: string[] = [
    "-- NAPLEX full-topic alignment (high-confidence only)",
    "-- Generated by scripts/align-naplex-topic-questions.ts",
    "BEGIN;",
  ];
  for (const m of high) {
    const tags = serializeTags(m.tags).replace(/'/g, "''");
    const topic = m.topicCategory.replace(/'/g, "''");
    sql.push(
      `UPDATE "QuestionBankItem" SET "subjectId" = '${m.to}', "topicCategory" = '${topic}', "tags" = '${tags}', "updatedAt" = NOW() WHERE "id" = '${m.id}' AND "fieldId" = 'pharmacy' AND "subjectId" = '${m.from}';`
    );
  }
  sql.push("COMMIT;");

  const outDir = path.join(process.cwd(), "artifacts");
  mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(outDir, "naplex-topic-alignment-audit.json");
  const sqlPath = path.join(outDir, "naplex-topic-alignment-retags.sql");

  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        activeBySubject: Object.fromEntries(counts.map((c) => [c.subjectId, c._count._all])),
        alignedBySubject,
        proposedMoves: { high: high.length, medium: medium.length, flows: flow },
        highConfidence: high,
        mediumConfidence: medium,
      },
      null,
      2
    ),
    "utf8"
  );
  writeFileSync(sqlPath, sql.join("\n") + "\n", "utf8");
  console.log(`\nWrote ${reportPath}`);
  console.log(`Wrote ${sqlPath} (${high.length} UPDATEs)`);

  if (COMMIT) {
    console.log(`\nCOMMITTING ${high.length} high-confidence retags…`);
    let updated = 0;
    for (const m of high) {
      const row = rows.find((r) => r.id === m.id);
      if (!row) continue;
      await prisma.questionBankItem.update({
        where: { id: m.id },
        data: {
          subjectId: m.to,
          topicCategory: m.topicCategory,
          tags: serializeTags(m.tags),
          contentHash: contentHash(m.to, row),
          updatedAt: new Date(),
        },
      });
      updated++;
      if (updated <= 15) console.log(`  ✓ ${m.id}  ${m.from} → ${m.to}`);
    }
    console.log(`Updated: ${updated}`);

    const after = await prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where: { fieldId: "pharmacy", active: true },
      _count: { _all: true },
      orderBy: { _count: { subjectId: "desc" } },
    });
    console.log("\n=== Active counts after commit ===");
    for (const c of after) console.log(String(c._count._all).padStart(6), c.subjectId);
  } else {
    console.log("\nDry-run only. Re-run with --commit to apply high-confidence moves.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
