#!/usr/bin/env node
/**
 * Generate typed Step 3 format items (abstract / drug_ad / ccs_prompt) into serve.
 *
 *   OPENAI_GENERATION_ONLY=1 bash scripts/run-with-node.sh npx tsx scripts/generate-usmle-step3-typed-formats.mts \
 *     --abstract 40 --drug-ad 40 --ccs 60
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { getOpenAiClient } from "../src/lib/openai-client";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import {
  usmleAbstract,
  usmleCcs,
  usmleDrugAd,
} from "../src/lib/exam-prep/usmle-seed-factory";
import type { BankItem } from "../src/lib/question-bank";
import type OpenAI from "openai";

const prisma = new PrismaClient();
const FIELD = "usmle-step-3";

function parseArgs() {
  const args = process.argv.slice(2);
  let abstract = 40;
  let drugAd = 40;
  let ccs = 60;
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--abstract" && args[i + 1]) abstract = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--drug-ad" && args[i + 1]) drugAd = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--ccs" && args[i + 1]) ccs = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
  }
  return { abstract, drugAd, ccs, dryRun };
}

async function genBatch(
  client: OpenAI,
  kind: "abstract" | "drug_ad" | "ccs_prompt",
  count: number
): Promise<BankItem[]> {
  const system =
    kind === "abstract"
      ? `You write USMLE Step 3 pharmaceutical/clinical trial ABSTRACT items.
Return JSON: {"items":[{"subjectId":"biostatistics"|"internal-medicine","title","source","body","stem","options":[4],"correct","explanation"}]}
body ≥120 chars with numbers; explanation ≥120 chars teaching why right/wrong; distractors = common misreads of non-inferiority/p-values/bias.`
      : kind === "drug_ad"
        ? `You write USMLE Step 3 pharmaceutical AD interpretation items.
Return JSON: {"items":[{"subjectId":"internal-medicine"|"pharmacology","drug","headline","indications","warnings","stem","options":[4],"correct","explanation"}]}
explanation ≥120 chars; test boxed warnings / indication scope / comparative claims.`
        : `You write USMLE Step 3 CCS-style next-step management prompts.
Return JSON: {"items":[{"subjectId":"emergency-medicine"|"internal-medicine"|"obgyn","setting","presentation","vitals","timeline","stem","options":[4],"correct","explanation"}]}
vignette via setting/presentation/vitals/timeline; explanation ≥120 chars with decision framework (orders/disposition).`;

  const res = await client.chat.completions.create({
    model: process.env.OPENAI_USMLE_MODEL?.trim() || "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Generate ${count} distinct high-yield items. No ACS/STEMI chest-pain clones. Vary topics.`,
      },
    ],
  });
  const raw = res.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { items?: Array<Record<string, unknown>> };
  const out: BankItem[] = [];
  for (const rawItem of parsed.items ?? []) {
    try {
      if (kind === "abstract") {
        out.push(
          usmleAbstract(
            String(rawItem.subjectId || "biostatistics"),
            {
              title: String(rawItem.title || "Trial abstract"),
              source: String(rawItem.source || "NEJM"),
              body: String(rawItem.body || ""),
            },
            String(rawItem.stem || "Most accurate interpretation?"),
            (rawItem.options as [string, string, string, string]) || [
              "A",
              "B",
              "C",
              "D",
            ],
            String(rawItem.correct || ""),
            String(rawItem.explanation || ""),
            {
              stepLevel: "step3",
              blueprintDomain: "usmle-biostats",
              tags: ["typed-format-gen", "abstract"],
            }
          )
        );
      } else if (kind === "drug_ad") {
        out.push(
          usmleDrugAd(
            String(rawItem.subjectId || "pharmacology"),
            {
              drug: String(rawItem.drug || "Drug X"),
              headline: String(rawItem.headline || ""),
              indications: String(rawItem.indications || ""),
              warnings: String(rawItem.warnings || ""),
            },
            String(rawItem.stem || "Most appropriate counseling point?"),
            (rawItem.options as [string, string, string, string]) || [
              "A",
              "B",
              "C",
              "D",
            ],
            String(rawItem.correct || ""),
            String(rawItem.explanation || ""),
            {
              stepLevel: "step3",
              blueprintDomain: "pharm-advertising",
              tags: ["typed-format-gen", "drug_ad"],
            }
          )
        );
      } else {
        out.push(
          usmleCcs(
            String(rawItem.subjectId || "emergency-medicine"),
            {
              setting: String(rawItem.setting || "ED"),
              presentation: String(rawItem.presentation || ""),
              vitals: String(rawItem.vitals || ""),
              timeline: String(rawItem.timeline || ""),
            },
            String(rawItem.stem || "Most appropriate next step?"),
            (rawItem.options as [string, string, string, string]) || [
              "A",
              "B",
              "C",
              "D",
            ],
            String(rawItem.correct || ""),
            String(rawItem.explanation || ""),
            {
              stepLevel: "step3",
              blueprintDomain: "ccs",
              tags: ["typed-format-gen", "ccs_prompt"],
            }
          )
        );
      }
    } catch {
      /* skip malformed */
    }
  }
  return out;
}

async function insertReady(items: BankItem[], dryRun: boolean) {
  let inserted = 0;
  let rejected = 0;
  for (const item of items) {
    if (!usmleBankItemIsServeReady(item, FIELD)) {
      rejected++;
      continue;
    }
    const subjectId = item.subjectId || "internal-medicine";
    const contentHash = bankItemContentHash(FIELD, subjectId, item);
    const exists = await prisma.questionBankItem.findUnique({ where: { contentHash } });
    if (exists) {
      rejected++;
      continue;
    }
    if (!dryRun) {
      await prisma.questionBankItem.create({
        data: {
          fieldId: FIELD,
          subjectId,
          scenario: item.vignette ?? null,
          difficulty: item.difficulty ?? 4,
          itemType: item.itemType ?? "mcq",
          stepLevel: "step3",
          question: item.question,
          options: serializeBankOptions(item),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          tags: item.tags ? JSON.stringify(item.tags) : null,
          blueprintDomain: item.blueprintDomain ?? null,
          source: "ai-typed-format",
          contentHash,
          active: true,
          qaPassed: true,
          reviewStatus: "usmle_step3_typed_format_gen",
        },
      });
    }
    inserted++;
  }
  return { inserted, rejected };
}

async function main() {
  const { abstract, drugAd, ccs, dryRun } = parseArgs();
  requireOpenAiKey();
  const client = getOpenAiClient("generation");
  if (!client) {
    console.error("OpenAI generation client unavailable");
    process.exit(1);
  }
  console.log(
    `\nStep3 typed formats${dryRun ? " [dry-run]" : ""} · abstract=${abstract} drug_ad=${drugAd} ccs=${ccs}\n`
  );

  const summary: Record<string, { inserted: number; rejected: number; generated: number }> = {};

  for (const [kind, n] of [
    ["abstract", abstract],
    ["drug_ad", drugAd],
    ["ccs_prompt", ccs],
  ] as const) {
    if (n <= 0) continue;
    const batchSize = 8;
    let generated = 0;
    let inserted = 0;
    let rejected = 0;
    for (let left = n; left > 0; left -= batchSize) {
      const want = Math.min(batchSize, left);
      const items = await genBatch(client, kind, want);
      generated += items.length;
      const r = await insertReady(items, dryRun);
      inserted += r.inserted;
      rejected += r.rejected;
      console.log(`  ${kind}: +${r.inserted} inserted (${r.rejected} rejected) this batch`);
    }
    summary[kind] = { inserted, rejected, generated };
  }

  mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
  const out = path.join(process.cwd(), "artifacts/usmle-step3-typed-formats-gen.json");
  writeFileSync(out, JSON.stringify({ dryRun, at: new Date().toISOString(), summary }, null, 2));
  console.log(`\nDone → ${out}`);
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
