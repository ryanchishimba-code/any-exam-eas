#!/usr/bin/env node
/**
 * Audit + propose re-tags for NAPLEX Foundational Sciences misfiles.
 *
 * Primary key: QuestionBankItem.subjectId
 * Canonical foundation subjects (pharmacy taxonomy):
 *   - pharmaceutics
 *   - pharmacokinetics
 *   - pharmacology
 *   - compounding-calculations
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-subject-misfiles.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-subject-misfiles.ts --apply   # writes SQL preview only unless --commit
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-subject-misfiles.ts --commit # applies updates
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply") || process.argv.includes("--commit");
const COMMIT = process.argv.includes("--commit");

type Row = {
  id: string;
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

type Bucket = "pharmaceutics" | "pharmacokinetics" | "compounding-calculations";

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    /* comma-separated fallback */
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

function fullText(r: Row): string {
  return `${stemText(r)}\n${r.explanation}\n${r.tags ?? ""}`.toLowerCase();
}

/**
 * Strict pharmaceutics: construct must appear in vignette/stem/answer
 * (not only buried in a long clinical explanation).
 */
const PHARMACEUTICS_STEM_RE =
  /\b(usp\s*<?\s*79[578]>?|usp\s*<?\s*800>?|beyond[- ]use date|\bbud\b|excipient|dosage form|extended[- ]release|immediate[- ]release|delayed[- ]release|enteric[- ]coated|transdermal patch|do not crush|crush(ing)? (the )?(tablet|capsule)|bioequivalence|bcs class|dissolution (rate|test)|isotonicity|tonicity|osmolarity|sterile compound|nonsterile compound|cleanroom|aseptic technique|laminar.?flow|hazardous drug|photodegradation|light[- ]protect|propylene glycol|\bhlb\b|particle size|polymorph|depot (injection|formulation|microsphere)|orally disintegrating|odt\b|matrix (tablet|system)|osmotic pump|film[- ]coated|reconstitut(e|ion)|emulsif|suspension vehicle|preservative[- ]free)\b/i;

const PK_STEM_RE =
  /\b(half[- ]life|t1\/2|volume of distribution|\bvd\b|steady[- ]state|first[- ]pass metabolism|auc\b|cmax\b|tmax\b|elimination rate constant|protein binding|nonlinear kinetics|michaelis[- ]menten|hepatic extraction|loading dose|maintenance dose|extraction ratio|fraction unbound|accumulation factor|\bke\b|\bkel\b|drug clearance|systemic clearance|total body clearance)\b/i;

/** Clinical CrCl / renal dosing vignettes are therapeutics — not foundational PK. */
const CLINICAL_CRCL_RE =
  /\b(creatinine clearance|crcl|egfr|apixaban|rivaroxaban|dabigatran|dose adjust|renal (dose|adjustment|impairment)|ckd stage)\b/i;

const CALC_STEM_RE =
  /\b(how many (ml|mg|tablets|meq|units)|infusion rate|ml\/hr|alligation|mg\/kg|round to the nearest|calculate the (dose|rate|volume|quantity))\b/i;

/** Soft signals only used when stem already suggests foundation science. */
const PHARMACEUTICS_EXPLAIN_BOOST =
  /\b(crushing destroys|dose dumping|bioequivalence|80–125%|80-125%|noyes[- ]whitney|required hlb|beyond[- ]use|csp category)\b/i;

function classify(r: Row): { bucket: Bucket; confidence: "high" | "medium"; reason: string } | null {
  const stem = stemText(r);
  const full = fullText(r);

  // Counseling-primary items mentioning a dosage form stay in counseling/pharmacology
  // unless the stem asks a formulation/compounding/BE decision.
  const counselingPrimary =
    /\b((which|what).{0,40}counseling|most essential counseling|counsel the patient|safety counseling)\b/i.test(
      stem
    ) && !/\b(crush|bioequivalence|bcs|bud\b|usp\s*<|dosage form)\b/i.test(stem);

  if (
    !counselingPrimary &&
    (PHARMACEUTICS_STEM_RE.test(stem) ||
      (PHARMACEUTICS_STEM_RE.test(full) && PHARMACEUTICS_EXPLAIN_BOOST.test(full)))
  ) {
    const why =
      PHARMACEUTICS_STEM_RE.exec(stem)?.[0] ??
      PHARMACEUTICS_STEM_RE.exec(full)?.[0] ??
      "pharmaceutics construct";
    return {
      bucket: "pharmaceutics",
      confidence: PHARMACEUTICS_STEM_RE.test(stem) ? "high" : "medium",
      reason: `Primary construct is pharmaceutics/biopharmaceutics/compounding ("${why}"), not drug MOA.`,
    };
  }

  // Require true PK construct; exclude CrCl-based DOAC renal dosing (therapeutics).
  if (PK_STEM_RE.test(stem) && !CLINICAL_CRCL_RE.test(stem)) {
    const why = PK_STEM_RE.exec(stem)?.[0] ?? "PK construct";
    return {
      bucket: "pharmacokinetics",
      confidence: "high",
      reason: `Primary construct is ADME/PK-PD ("${why}"), not receptor/MOA pharmacology.`,
    };
  }

  if (CALC_STEM_RE.test(stem)) {
    const why = CALC_STEM_RE.exec(stem)?.[0] ?? "calculation";
    return {
      bucket: "compounding-calculations",
      confidence: "high",
      reason: `Primary ask is quantitative ("${why}"); belongs in Pharmacy Calculations.`,
    };
  }

  return null;
}

function secondaryTags(bucket: Bucket, r: Row): string[] {
  const b = fullText(r);
  const tags = new Set<string>(parseTags(r.tags));
  tags.add("foundational-sciences");
  tags.add("retagged-from-pharmacology");
  tags.add(`retagged-to-${bucket}`);

  if (bucket === "pharmaceutics") {
    tags.add("pharmaceutics");
    if (/usp\s*<?\s*797/i.test(b)) tags.add("USP797");
    if (/usp\s*<?\s*800/i.test(b)) tags.add("USP800");
    if (/usp\s*<?\s*795/i.test(b)) tags.add("USP795");
    if (/bioequivalence|bcs/i.test(b)) tags.add("biopharmaceutics");
    if (/extended[- ]release|do not crush|enteric|dose dumping/i.test(b)) tags.add("modified-release");
    if (/transdermal|patch/i.test(b)) tags.add("transdermal");
    if (/excipient|propylene glycol|preservative/i.test(b)) tags.add("excipients");
    if (/compound|cleanroom|aseptic|bud\b|csp/i.test(b)) tags.add("compounding");
    if (/stability|photodegrad|light[- ]protect|hydrolysis|oxidation/i.test(b)) tags.add("stability");
    if (/dissolution|particle size|polymorph/i.test(b)) tags.add("preformulation");
  }
  if (bucket === "pharmacokinetics") {
    tags.add("pharmacokinetics");
    tags.add("PKPD");
    if (/half[- ]life|t1\/2/i.test(b)) tags.add("half-life");
    if (/clearance/i.test(b)) tags.add("clearance");
    if (/volume of distribution|\bvd\b/i.test(b)) tags.add("Vd");
    if (/bioavailability|first[- ]pass|auc|cmax/i.test(b)) tags.add("ADME");
    if (/steady[- ]state/i.test(b)) tags.add("steady-state");
    if (/protein binding/i.test(b)) tags.add("protein-binding");
    if (/loading dose|maintenance dose/i.test(b)) tags.add("dosing-kinetics");
  }
  if (bucket === "compounding-calculations") {
    tags.add("calculations");
    if (/ml\/hr|infusion/i.test(b)) tags.add("IV-rate");
    if (/alligation/i.test(b)) tags.add("alligation");
    if (/mg\/kg/i.test(b)) tags.add("weight-based");
  }
  return [...tags];
}

function topicCategoryFor(bucket: Bucket): string {
  if (bucket === "pharmaceutics") return "Pharmaceutics";
  if (bucket === "pharmacokinetics") return "Pharmacokinetics & Pharmacodynamics";
  return "Pharmacy Calculations";
}

function contentHash(subjectId: string, r: Row): string {
  const payload = ["pharmacy", subjectId, r.scenario ?? "", r.question, r.options, r.correctAnswer].join(
    "\u0000"
  );
  return createHash("sha256").update(payload).digest("hex");
}

async function main() {
  const subjects = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pharmacy", active: true },
    _count: { _all: true },
    orderBy: { _count: { subjectId: "desc" } },
  });

  console.log("\n=== Active NAPLEX by subjectId ===");
  for (const s of subjects) console.log(String(s._count._all).padStart(6), s.subjectId);

  const rows = (await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true, subjectId: "pharmacology" },
    select: {
      id: true,
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

  type Move = {
    id: string;
    from: "pharmacology";
    to: Bucket;
    confidence: "high" | "medium";
    reason: string;
    stem: string;
    secondaryTags: string[];
    topicCategory: string;
    qaPassed: boolean;
    itemType: string;
  };

  const moves: Move[] = [];
  for (const row of rows) {
    const hit = classify(row);
    if (!hit) continue;
    moves.push({
      id: row.id,
      from: "pharmacology",
      to: hit.bucket,
      confidence: hit.confidence,
      reason: hit.reason,
      stem: `${row.scenario ? row.scenario + " | " : ""}${row.question}`.replace(/\s+/g, " ").slice(0, 220),
      secondaryTags: secondaryTags(hit.bucket, row),
      topicCategory: topicCategoryFor(hit.bucket),
      qaPassed: row.qaPassed,
      itemType: row.itemType,
    });
  }

  const high = moves.filter((m) => m.confidence === "high");
  const medium = moves.filter((m) => m.confidence === "medium");

  const countTo = (b: Bucket) => moves.filter((m) => m.to === b).length;
  console.log(`\n=== Strict misfile proposals from pharmacology (n=${rows.length}) ===`);
  console.log(`High-confidence moves:   ${high.length}`);
  console.log(`Medium-confidence moves: ${medium.length}`);
  console.log(`  → pharmaceutics:            ${countTo("pharmaceutics")}`);
  console.log(`  → pharmacokinetics:         ${countTo("pharmacokinetics")}`);
  console.log(`  → compounding-calculations: ${countTo("compounding-calculations")}`);

  console.log("\n--- High-confidence samples (with why) ---");
  for (const m of high.slice(0, 12)) {
    console.log(`\nID ${m.id}  ${m.from} → ${m.to} [${m.confidence}]`);
    console.log(`  ${m.stem}`);
    console.log(`  WHY: ${m.reason}`);
    console.log(`  TAGS: ${m.secondaryTags.filter((t) => !t.startsWith("retagged") || t.includes("to-")).slice(0, 8).join(", ")}`);
  }

  // SQL preview (high-confidence only by default for safety)
  const sqlLines: string[] = [
    "-- NAPLEX foundational subject re-tag (high-confidence only)",
    "-- Review artifacts/naplex-subject-misfile-audit.json before applying.",
    "BEGIN;",
  ];
  for (const m of high) {
    const tagsJson = serializeTags(m.secondaryTags).replace(/'/g, "''");
    const topic = m.topicCategory.replace(/'/g, "''");
    sqlLines.push(
      `UPDATE "QuestionBankItem" SET "subjectId" = '${m.to}', "topicCategory" = '${topic}', "tags" = '${tagsJson}', "updatedAt" = NOW() WHERE "id" = '${m.id}' AND "fieldId" = 'pharmacy' AND "subjectId" = 'pharmacology';`
    );
  }
  sqlLines.push("COMMIT;");

  const outDir = path.join(process.cwd(), "artifacts");
  mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(outDir, "naplex-subject-misfile-audit.json");
  const sqlPath = path.join(outDir, "naplex-retags-foundational.sql");

  const report = {
    generatedAt: new Date().toISOString(),
    taxonomy: {
      parent: "Foundational Sciences",
      subjects: {
        pharmaceutics: "Dosage forms, biopharmaceutics, compounding, stability, excipients",
        pharmacokinetics: "ADME, half-life, clearance, Vd, BA/BE metrics, dosing kinetics",
        pharmacology: "MOA, receptors, drug classes, adverse effects, interactions",
        "compounding-calculations": "Quantitative dosing, rates, alligation, concentrations",
      },
    },
    activeBySubject: Object.fromEntries(subjects.map((s) => [s.subjectId, s._count._all])),
    pharmacologyActive: rows.length,
    proposedMoves: {
      highConfidence: high.length,
      mediumConfidence: medium.length,
      byTarget: {
        pharmaceutics: countTo("pharmaceutics"),
        pharmacokinetics: countTo("pharmacokinetics"),
        "compounding-calculations": countTo("compounding-calculations"),
      },
    },
    moves,
    policy: {
      applyDefault: "high-confidence only",
      mediumRequiresHumanReview: true,
      preserveQaPassed: true,
      updateFields: ["subjectId", "topicCategory", "tags", "updatedAt", "contentHash"],
    },
  };

  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  writeFileSync(sqlPath, sqlLines.join("\n") + "\n", "utf8");
  console.log(`\nWrote ${reportPath}`);
  console.log(`Wrote ${sqlPath} (${high.length} UPDATEs)`);

  if (APPLY) {
    const targets = high;
    console.log(`\n${COMMIT ? "COMMITTING" : "DRY-RUN APPLY"} ${targets.length} high-confidence retags…`);
    let updated = 0;
    for (const m of targets) {
      const row = rows.find((r) => r.id === m.id);
      if (!row) continue;
      const data = {
        subjectId: m.to,
        topicCategory: m.topicCategory,
        tags: serializeTags(m.secondaryTags),
        contentHash: contentHash(m.to, row),
        updatedAt: new Date(),
      };
      if (COMMIT) {
        await prisma.questionBankItem.update({ where: { id: m.id }, data });
      }
      updated++;
      if (updated <= 5) console.log(`  ${COMMIT ? "✓" : "·"} ${m.id} → ${m.to}`);
    }
    console.log(`${COMMIT ? "Updated" : "Would update"}: ${updated}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
