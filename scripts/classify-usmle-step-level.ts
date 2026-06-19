/**
 * Smart USMLE step (exam_type) classifier + normalizer.
 *
 * Ensures every USMLE question-bank item is correctly separated by step:
 *   - `stepLevel` (canonical exam_type) is set to step1 | step2 | step3
 *   - `fieldId` is aligned to the matching per-step field (usmle-step-1/2/3)
 *
 * Strategy (keyword-first, optional LLM tie-break):
 *   1. Pure keyword classifier (src/lib/exam-prep/usmle/classify-step.ts).
 *   2. For low-confidence rows, optionally ask an LLM (--llm, needs OPENAI_API_KEY).
 *   3. Apply corrections in batched updateMany calls grouped by target bucket.
 *
 * Safety: --dry-run prints the full before/after distribution and every planned
 * transition WITHOUT touching the database. Run it first.
 *
 * Usage:
 *   npx tsx scripts/classify-usmle-step-level.ts --dry-run
 *   npx tsx scripts/classify-usmle-step-level.ts --dry-run --llm --limit 200
 *   npx tsx scripts/classify-usmle-step-level.ts          # apply
 */
import { PrismaClient } from "@prisma/client";
import {
  classifyUsmleStep,
  fieldIdForUsmleStep,
  type UsmleStepClassifierInput,
} from "../src/lib/exam-prep/usmle/classify-step";
import { USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "../src/lib/exam-prep/usmle/steps";
import type { UsmleStepLevel } from "../src/lib/exam-prep/usmle/types";

const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes("--dry-run");
const USE_LLM = process.argv.includes("--llm");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  if (i === -1) return Infinity;
  const n = Number(process.argv[i + 1]);
  return Number.isFinite(n) && n > 0 ? n : Infinity;
})();

const STEP_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

type Row = {
  id: string;
  fieldId: string;
  stepLevel: string | null;
  subjectId: string | null;
  itemType: string | null;
  blueprintDomain: string | null;
  blueprintTopic: string | null;
  topicCategory: string | null;
  tags: string | null;
  question: string;
  scenario: string | null;
};

type Bucket = { fieldId: string; stepLevel: UsmleStepLevel };

function bucketKey(b: Bucket): string {
  return `${b.fieldId}::${b.stepLevel}`;
}

async function classifyWithLlm(row: Row): Promise<UsmleStepLevel | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_CLASSIFY_MODEL ?? "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You classify USMLE practice questions by step. Reply with exactly one token: step1, step2, or step3. step1=foundational basic sciences; step2=clinical diagnosis & next-best-step management; step3=advanced management, biostatistics, ethics, abstracts, drug ads, CCS.",
        },
        {
          role: "user",
          content: `Subject: ${row.subjectId ?? "?"}\nItem type: ${row.itemType ?? "?"}\nDomain: ${row.blueprintDomain ?? "?"}\nQuestion: ${row.question.slice(0, 900)}`,
        },
      ],
    });
    const out = res.choices[0]?.message?.content?.trim().toLowerCase() ?? "";
    if (out.includes("step1")) return "step1";
    if (out.includes("step3")) return "step3";
    if (out.includes("step2")) return "step2";
    return null;
  } catch (err) {
    console.warn("  LLM classify failed for", row.id, err instanceof Error ? err.message : err);
    return null;
  }
}

async function main() {
  console.log(
    `USMLE step classifier ${DRY_RUN ? "(dry run)" : "(APPLY)"}${USE_LLM ? " +LLM" : ""}${
      LIMIT !== Infinity ? ` limit=${LIMIT}` : ""
    }\n`
  );

  // Candidate rows: anything in a USMLE field plus legacy generic medical fields.
  const rows = (await prisma.questionBankItem.findMany({
    where: {
      OR: [
        { fieldId: { startsWith: "usmle" } },
        { fieldId: { in: ["medicine", "usmle"] } },
      ],
    },
    select: {
      id: true,
      fieldId: true,
      stepLevel: true,
      subjectId: true,
      itemType: true,
      blueprintDomain: true,
      blueprintTopic: true,
      topicCategory: true,
      tags: true,
      question: true,
      scenario: true,
    },
    take: LIMIT === Infinity ? undefined : LIMIT,
  })) as Row[];

  console.log(`Loaded ${rows.length} USMLE candidate rows.\n`);

  const before: Record<string, number> = {};
  const after: Record<UsmleStepLevel, number> = { step1: 0, step2: 0, step3: 0 };
  const transitions: Record<string, number> = {};
  const buckets = new Map<string, { bucket: Bucket; ids: string[] }>();
  let needsReview = 0;
  let llmUsed = 0;

  for (const row of rows) {
    before[row.fieldId] = (before[row.fieldId] ?? 0) + 1;

    const inStepField = (STEP_FIELDS as readonly string[]).includes(row.fieldId);
    const itemType = (row.itemType ?? "").toLowerCase();

    // Decision policy. `fieldId` is the authoritative per-step separator for rows that
    // already live in an explicit step field, so we never move them on fuzzy vocabulary.
    //   - Step field rows: mirror stepLevel from fieldId. Only re-file to Step 3 when a
    //     *definitive structural* signal is present (biostats / ethics / CCS / abstract /
    //     drug-ad item type sitting under Step 1 or Step 2).
    //   - Generic / legacy fields (e.g. "medicine", "usmle"): content classification leads,
    //     with an optional LLM tie-break for low-confidence rows.
    let targetStep: UsmleStepLevel | null;
    if (inStepField) {
      const base = stepFromField(row.fieldId) as UsmleStepLevel;
      targetStep =
        base !== "step3" && USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType) ? "step3" : base;
    } else {
      const input: UsmleStepClassifierInput = row;
      let guess = classifyUsmleStep(input);
      if (USE_LLM && guess.confidence === "low") {
        const llm = await classifyWithLlm(row);
        if (llm) {
          guess = { step: llm, confidence: "medium", reason: "llm" };
          llmUsed++;
        }
      }
      targetStep = guess.step;
    }

    if (!targetStep) {
      needsReview++;
      continue;
    }

    after[targetStep] += 1;

    const finalField = fieldIdForUsmleStep(targetStep);
    const changed = finalField !== row.fieldId || targetStep !== row.stepLevel;
    if (!changed) continue;

    const bkey = bucketKey({ fieldId: finalField, stepLevel: targetStep });
    const entry =
      buckets.get(bkey) ?? { bucket: { fieldId: finalField, stepLevel: targetStep }, ids: [] };
    entry.ids.push(row.id);
    buckets.set(bkey, entry);

    const tkey = `${row.fieldId}/${row.stepLevel ?? "null"} -> ${finalField}/${targetStep}`;
    transitions[tkey] = (transitions[tkey] ?? 0) + 1;
  }

  console.log("Before (by fieldId):");
  for (const [k, v] of Object.entries(before).sort()) console.log(`  ${k}: ${v}`);

  console.log("\nPlanned transitions:");
  const tEntries = Object.entries(transitions).sort((a, b) => b[1] - a[1]);
  if (tEntries.length === 0) console.log("  (none)");
  for (const [k, v] of tEntries) console.log(`  ${v.toString().padStart(6)}  ${k}`);

  const totalChanges = tEntries.reduce((s, [, v]) => s + v, 0);
  console.log(`\nProjected after (by step): step1=${after.step1} step2=${after.step2} step3=${after.step3}`);
  console.log(`Rows needing manual review (no signal): ${needsReview}`);
  if (USE_LLM) console.log(`LLM tie-breaks used: ${llmUsed}`);
  console.log(`\n${DRY_RUN ? "Would update" : "Updating"} ${totalChanges} row(s) across ${buckets.size} bucket(s).`);

  if (!DRY_RUN && totalChanges > 0) {
    let applied = 0;
    const CHUNK = 2000;
    for (const { bucket, ids } of buckets.values()) {
      for (let i = 0; i < ids.length; i += CHUNK) {
        const chunk = ids.slice(i, i + CHUNK);
        const r = await prisma.questionBankItem.updateMany({
          where: { id: { in: chunk } },
          data: { fieldId: bucket.fieldId, stepLevel: bucket.stepLevel },
        });
        applied += r.count;
        console.log(`  ${bucket.fieldId}/${bucket.stepLevel}: +${r.count} (${applied} total)`);
      }
    }
    console.log(`Applied ${applied} update(s).`);
  }

  console.log("\nDone.");
}

function stepFromField(fieldId: string): UsmleStepLevel | null {
  return fieldId === "usmle-step-1"
    ? "step1"
    : fieldId === "usmle-step-3"
      ? "step3"
      : fieldId === "usmle-step-2"
        ? "step2"
        : null;
}

main()
  .catch((err) => {
    console.error("Classification failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
