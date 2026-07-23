#!/usr/bin/env node
/**
 * Apply human spot-check verdicts from 2026-07-21 review pack:
 *  - Quarantine Kill + repetitive ACS clones
 *  - Apply high-priority Fix rewrites
 *  - Write spot-check report artifact
 *
 *   bash scripts/run-with-node.sh npx tsx scripts/apply-usmle-human-spotcheck-2026-07-21.mts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/apply-usmle-human-spotcheck-2026-07-21.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const REVIEW = "usmle_human_spotcheck_2026_07_21";

/** Explicit Kill from reviewer */
const KILL = [
  "cmrru3s8o00bv1y8wtyp6huwz", // #3 AKI + microorganism mismatch
  "cmrtqq4ov000z1yx3lj0iv2br", // #9 DKA "enzyme deficiency" — insulin is hormone
];

/**
 * Repetitive ACS/STEMI clones (wrongly tagged biostats/ethics or near-duplicates).
 * Keep one salvageable STEMI per step where noted as Fix-eligible; quarantine the rest.
 */
const KILL_ACS_DUPES = [
  // Step1 ACS clones (keep none of the biostats/ethics-tagged chest-pain spam)
  "cmrrtw4ir00981y8wlcm45ags", // #6
  "cmrth11zl00301yax0k2nnyzc", // #8
  "cmrruxujv00m41y8wuaa9kuzc", // #11
  "cmrruxtjr00ls1y8w3ht5u39d", // #12
  "cmrrufych00fi1y8w8t4ddj0t", // #13
  "cmrrtf40b002j1y8wy761yju8", // #16
  "cmrrt9qrp000t1y8w22k3ltzu", // #17
  "cmrth1087002i1yax3lyxi800", // #18
  "cmrrufxjc00f91y8weinbhxvh", // #19
  // Step2 ACS clones
  "cmrpvvikc003b1ylug1pcmm50", // #22
  "cmrrvvmre00c81yl8xxpc4nwj", // #27
  "cmr88ibuv00py1yr9rx7w5g5n", // #28
  "cmrrvjigb004p1yl84u8l6o6g", // #29
  "cmrpw5zjn007e1yluq5f1xws1", // #32
  "cmrrvfic9002f1yl87q697ff9", // #38
];

type FixSpec = {
  id: string;
  n: number;
  note: string;
  patch: (item: {
    vignette?: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }) => {
    vignette?: string;
    question?: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
  };
};

const FIXES: FixSpec[] = [
  {
    id: "cmrtfrrdd000y1yx2krp6eg52",
    n: 1,
    note: "Differentiate polymyositis vs statin myopathy / IMNM; note absent rash vs DM",
    patch: (item) => ({
      explanation: [
        "Proximal weakness without rash plus inflammatory myopathy pattern supports polymyositis over dermatomyositis (no Gottron/heliotrope).",
        "Important differential given atorvastatin exposure: statin-associated myopathy and immune-mediated necrotizing myopathy (IMNM) — check CK, anti-HMGCR when suspected, and stop the statin.",
        "Muscle biopsy / EMG help confirm inflammatory myositis when the clinical picture is ambiguous.",
        "",
        "Prior explanation retained key teaching: inflammatory myositis can present with progressive proximal weakness; add drug-induced myopathy to the differential when a statin is on the med list.",
        "",
        `Editor note (${REVIEW}): ${item.explanation.slice(0, 240)}`,
      ].join(" "),
    }),
  },
  {
    id: "cmrrv66vx00oo1y8w36ful7r0",
    n: 4,
    note: "Clarify acute PE anticoagulation = UFH/LMWH (antithrombin → IIa/Xa), not warfarin",
    patch: () => ({
      explanation:
        "In acute PE, immediate anticoagulation is typically unfractionated heparin or LMWH: both accelerate antithrombin-mediated inhibition of thrombin (IIa) and/or factor Xa, limiting further fibrin formation. Warfarin is not appropriate as sole acute therapy (delayed onset; needs bridging). Direct oral anticoagulants are options later/selected patients but the stem’s “inhibition of fibrin formation” maps best to heparin-class therapy in the acute window.",
    }),
  },
  {
    id: "cmrtgrgrf000l1yaxnhalmp5f",
    n: 10,
    note: "CKD Cr 1.8 — thiazides less effective at low GFR; prefer loop / optimize ACEi",
    patch: () => ({
      explanation:
        "For hypertension with CKD and creatinine ~1.8 mg/dL (reduced GFR), thiazide diuretics often lose natriuretic efficacy; a loop diuretic is generally preferred when volume control is needed, and ACE inhibitor / ARB optimization remains foundational for proteinuric CKD when tolerated (monitor K⁺/Cr). Thiazide monotherapy is less ideal as the sole step-up in this GFR range.",
    }),
  },
  {
    id: "cmrrtm82z00541y8wsadi5hnn",
    n: 14,
    note: "IBD malabsorption — prefer impaired mucosal absorption/inflammation wording",
    patch: () => ({
      explanation:
        "In inflammatory bowel disease, diarrhea and nutrient loss are driven primarily by inflamed mucosa with impaired absorptive surface and disrupted barrier function—not a nonspecific “leaky gut” label alone. Emphasize mucosal inflammation → decreased absorptive capacity (± bile salt wasting after ileal disease/resection).",
    }),
  },
  {
    id: "cmrqhfofr00381ypx8zdm3lxj",
    n: 31,
    note: "GAD — CBT long-term; acute worsening may need short-term benzo / rule-outs",
    patch: () => ({
      explanation:
        "CBT (often with SSRI/SNRI) is first-line long-term treatment for GAD. For acute symptomatic worsening, briefly assess for medical mimics, substance use, and safety; a short course of benzodiazepine can temporize severe anxiety while durable therapy is optimized—do not rely on benzos alone as definitive care.",
    }),
  },
  {
    id: "cmr87j2ak00h51yr94xkfbruz",
    n: 35,
    note: "Clarify HHS vs DKA — AG 18 + AMS favors DKA",
    patch: () => ({
      explanation:
        "Anion gap metabolic acidosis (e.g., AG ~18) with hyperglycemia and altered mentation favors DKA over HHS. HHS typically presents with marked hyperglycemia/hyperosmolarity and minimal ketoacidosis (normal/near-normal AG). Management priorities differ (insulin/fluids/electrolytes; search for precipitant), but the acid–base pattern is the key discriminator here.",
    }),
  },
  {
    id: "cmrtq47y300271yqcqmnfouhj",
    n: 40,
    note: "Febrile infant <3mo — full sepsis eval/LP before or with Abx, not 'Abx immediately' alone",
    patch: () => ({
      explanation:
        "For a febrile young infant (especially <28–90 days depending on pathway), perform a structured sepsis evaluation (labs ± LP as indicated) and give empiric antibiotics promptly—ideally after cultures are obtained when it does not delay care. “Antibiotics immediately” without completing age-appropriate workup risks incomplete evaluation; stabilize ABCs, obtain cultures, then treat without delay.",
    }),
  },
  {
    id: "cmr8lqh3j00d71ygiuyqqv7pi",
    n: 41,
    note: "Symptomatic hyponatremia — hypertonic saline; note acuity/chronicity",
    patch: () => ({
      explanation:
        "Confusion/agitation with hyponatremia indicates symptomatic hyponatremia and warrants careful hypertonic (3%) saline with close Na⁺ monitoring. Also estimate acuity vs chronicity (risk of osmotic demyelination if overcorrected in chronic hyponatremia) and treat the underlying cause once the patient is safe.",
    }),
  },
];

async function quarantine(ids: string[], reason: string) {
  if (ids.length === 0) return 0;
  if (dryRun) {
    console.log(`[dry-run] would quarantine ${ids.length} (${reason})`);
    return ids.length;
  }
  const res = await prisma.questionBankItem.updateMany({
    where: { id: { in: ids } },
    data: {
      active: false,
      qaPassed: false,
      reviewStatus: `${REVIEW}:${reason}`,
      updatedAt: new Date(),
    },
  });
  return res.count;
}

async function applyFix(fix: FixSpec) {
  const row = await prisma.questionBankItem.findUnique({ where: { id: fix.id } });
  if (!row) {
    console.log(`  skip #${fix.n} missing ${fix.id}`);
    return false;
  }
  const item = enrichBankItemFromRow(row);
  const patched = fix.patch({
    vignette: item.vignette,
    question: item.question,
    options: item.options ?? [],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation ?? "",
  });
  const next = {
    ...item,
    vignette: patched.vignette ?? item.vignette,
    question: patched.question ?? item.question,
    options: patched.options ?? item.options ?? [],
    correctAnswer: patched.correctAnswer ?? item.correctAnswer,
    explanation: patched.explanation ?? item.explanation,
  };
  const contentHash = bankItemContentHash(row.fieldId, row.subjectId, next);
  if (dryRun) {
    console.log(`  [dry-run] fix #${fix.n} ${fix.id.slice(0, 10)}… — ${fix.note}`);
    return true;
  }
  await prisma.questionBankItem.update({
    where: { id: row.id },
    data: {
      scenario: next.vignette ?? null,
      question: next.question,
      options: serializeBankOptions(next),
      correctAnswer: next.correctAnswer,
      explanation: next.explanation,
      contentHash,
      reviewStatus: `${REVIEW}:fix`,
      updatedAt: new Date(),
    },
  });
  console.log(`  fixed #${fix.n} ${fix.id.slice(0, 10)}… — ${fix.note}`);
  return true;
}

async function main() {
  const pack = JSON.parse(
    readFileSync(path.join(process.cwd(), "artifacts/usmle-human-spotcheck-2026-07-21.json"), "utf8")
  ) as { items: Array<{ id: string; step: string }> };

  const killAll = [...new Set([...KILL, ...KILL_ACS_DUPES])];
  console.log(`\nHuman spot-check apply${dryRun ? " [dry-run]" : ""}`);
  console.log(`Kill explicit: ${KILL.length}`);
  console.log(`Kill ACS dupes: ${KILL_ACS_DUPES.length}`);
  console.log(`Fixes: ${FIXES.length}`);

  const k1 = await quarantine(KILL, "kill");
  const k2 = await quarantine(KILL_ACS_DUPES, "acs_duplicate");
  let fixed = 0;
  for (const f of FIXES) {
    if (await applyFix(f)) fixed++;
  }

  const report = {
    reviewedAt: new Date().toISOString(),
    pack: "artifacts/usmle-human-spotcheck-2026-07-21.json",
    nReviewed: pack.items.length,
    reviewerSummary: {
      strongest: ["ACS/STEMI management", "withdrawal", "preeclampsia", "surgical emergencies"],
      weakest: [
        "mismatched questions",
        "enzyme/hormone confusion",
        "repetitive ACS content",
        "occasional guideline drift",
      ],
      estimatedRewriteOrKillPct: "30-40%",
      gate: "humanSpotCheckPass=false — kill/fix rate too high for UWorld-close claim",
    },
    actions: {
      dryRun,
      quarantinedKill: k1,
      quarantinedAcsDupes: k2,
      quarantinedTotal: k1 + k2,
      fixesApplied: fixed,
      killIds: KILL,
      acsDupeIds: KILL_ACS_DUPES,
      fixIds: FIXES.map((f) => ({ n: f.n, id: f.id, note: f.note })),
    },
    nextSteps: [
      "Rewrite/Kill ~30-40% of bank craft (beyond this sample)",
      "Add variety: biostats, ethics, CCS-style (typed formats)",
      "Strengthen rationales with AHA/ACC, ACOG, etc.",
      "Distractors should be common clinical misses",
    ],
  };

  mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
  const out = path.join(process.cwd(), "artifacts/usmle-human-spotcheck-2026-07-21-applied.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`\nQuarantined: ${k1 + k2}  Fixed: ${fixed}`);
  console.log(`Report → ${out}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
