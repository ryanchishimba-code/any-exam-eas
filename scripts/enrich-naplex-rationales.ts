/**
 * NAPLEX Phase 3 — upgrade rationales to structured/expert teachability.
 *
 * Prioritizes Domain 1 foundations + Domain 2 Medication Use Process, then
 * optionally Domain 3 / safety. Stores structured markdown + expertRationale
 * JSON so the study UI Concise/Expert panels work.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/enrich-naplex-rationales.ts --dry-run --limit 10
 *   bash scripts/run-with-node.sh npx tsx scripts/enrich-naplex-rationales.ts \
 *     --domains naplex-area1-foundations,naplex-area2-therapeutics --limit 400
 *   bash scripts/run-with-node.sh npx tsx scripts/enrich-naplex-rationales.ts \
 *     --missing-v2 --limit 300
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import {
  EXPERT_RATIONALE_META_KEY,
  EXPERT_RATIONALE_VERSION,
  readExpertRationaleFromMeta,
  type ExpertStructuredRationale,
} from "../src/lib/engine/rationale/expert-rationale-types";
import {
  generateStructuredRationale,
  needsRationaleEnrichment,
  rationaleInputFromBankItem,
  type StructuredRationale,
} from "../src/lib/engine/rationale";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH = 40;
const DELAY_MS = (() => {
  const raw = process.env.ENRICH_DELAY_MS?.trim();
  if (!raw) return 150;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 150;
})();

const DEFAULT_DOMAINS = [
  "naplex-area1-foundations",
  "naplex-area2-therapeutics",
] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 100;
  let dryRun = false;
  let force = false;
  let missingV2 = false;
  let domains: string[] = [...DEFAULT_DOMAINS];
  let subjects: string[] | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--force") force = true;
    else if (args[i] === "--missing-v2") missingV2 = true;
    else if (args[i] === "--domains" && args[i + 1]) {
      domains = args[++i]!
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (args[i] === "--subjects" && args[i + 1]) {
      subjects = args[++i]!
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (args[i] === "--all-domains") {
      domains = [];
    }
  }

  return { limit, dryRun, force, missingV2, domains, subjects };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function readMeta(row: { generationMeta: unknown }): Record<string, unknown> {
  return typeof row.generationMeta === "object" && row.generationMeta
    ? { ...(row.generationMeta as Record<string, unknown>) }
    : {};
}

/** Promote structured NAPLEX rationale into expert UI payload. */
function structuredToExpert(structured: StructuredRationale): ExpertStructuredRationale {
  return {
    ...structured,
    stepByStepReasoning: [
      `Recognize cues: ${structured.whyCorrect.headline}`,
      ...structured.whyCorrect.conceptBreakdown.slice(0, 3).map((b) => `Analyze: ${b}`),
      `Act: choose the pharmacist-owned option that best fits THIS patient.`,
      `Evaluate: ${structured.keyTakeaway}`,
    ].slice(0, 6),
    clinicalPearl: structured.whyCorrect.clinicalContext,
    pharmacologyTieIn: structured.whyCorrect.clinicalContext,
    highYieldFacts: structured.whyCorrect.conceptBreakdown.slice(0, 4),
    commonPitfalls: structured.whyIncorrect.slice(0, 3).map((e) => e.misconception),
    testTakingTip:
      "On NAPLEX, prefer the pharmacist action (verify, counsel, monitor, dose-adjust) that is safest for this patient — not a true-but-not-best general fact.",
    realWorldApplication: structured.whyCorrect.clinicalContext,
    layeredDepth: {
      basic: structured.keyTakeaway,
      intermediate: structured.whyCorrect.headline,
      advanced: structured.whyCorrect.clinicalContext,
    },
  };
}

async function main() {
  const opts = parseArgs();
  if (!opts.dryRun) requireOpenAiKey();

  console.log(
    `\nNAPLEX rationale Phase 3${opts.dryRun ? " [dry-run]" : ""}${opts.missingV2 ? " [missing-v2]" : ""}${opts.force ? " [force]" : ""}${opts.domains.length ? ` [domains=${opts.domains.join(",")}]` : " [all-domains]"}${opts.subjects?.length ? ` [subjects=${opts.subjects.join(",")}]` : ""} limit ${opts.limit}\n`
  );

  let lastId: string | undefined;
  let scanned = 0;
  let enriched = 0;
  let skipped = 0;
  let failed = 0;

  while (enriched < opts.limit) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        qaPassed: true,
        ...(opts.domains.length ? { blueprintDomain: { in: opts.domains } } : {}),
        ...(opts.subjects?.length ? { subjectId: { in: opts.subjects } } : {}),
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!rows.length) break;

    for (const row of rows) {
      if (enriched >= opts.limit) break;
      scanned++;
      lastId = row.id;
      const priorMeta = readMeta(row);

      if (!opts.force && readExpertRationaleFromMeta(row.generationMeta)) {
        skipped++;
        continue;
      }
      if (opts.missingV2 && priorMeta.elevateRationaleV2 && !opts.force) {
        skipped++;
        continue;
      }

      const item = enrichBankItemFromRow(row);
      const serve = assessNaplexItemQuality(item, { source: row.source });
      if (!serve.ok && serve.tier === "reject") {
        skipped++;
        continue;
      }

      const check = needsRationaleEnrichment(item);
      if (!opts.force && !opts.missingV2 && !check.needs && priorMeta.elevateRationaleV2) {
        skipped++;
        continue;
      }

      if (opts.dryRun) {
        console.log(
          `  [dry-run] ${row.id.slice(0, 8)}… — ${check.reasons.slice(0, 3).join(", ") || "upgrade"}`
        );
        enriched++;
        continue;
      }

      const gen = await generateStructuredRationale(
        rationaleInputFromBankItem(item, "pharmacy")
      );
      if (!gen?.quality.ok) {
        failed++;
        console.warn(
          `  ✗ ${row.id.slice(0, 8)}… — quality ${gen?.quality.score ?? 0} ${(gen?.quality.issues ?? []).join(",")}`
        );
        await sleep(DELAY_MS);
        continue;
      }

      const expert = structuredToExpert(gen.structured);
      const hash = bankItemContentHash("pharmacy", item.subjectId ?? "pharmacy", {
        ...item,
        explanation: gen.assembled.explanation,
        distractorRationale: gen.assembled.distractorRationale,
      });

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
          contentHash: hash,
          generationMeta: {
            ...priorMeta,
            structuredRationale: gen.structured,
            [EXPERT_RATIONALE_META_KEY]: expert,
            expertRationaleVersion: `naplex-${EXPERT_RATIONALE_VERSION}`,
            rationaleEnrichedAt: new Date().toISOString(),
            elevateRationaleV2: true,
            rationaleModel: gen.model,
            rationaleQualityScore: gen.quality.score,
            pipeline: "enrich-naplex-rationales-phase3",
          },
          updatedAt: new Date(),
        },
      });

      enriched++;
      console.log(`  ✓ ${row.id.slice(0, 8)}… — score ${gen.quality.score}`);
      await sleep(DELAY_MS);
    }
  }

  const report = {
    field: "pharmacy",
    dryRun: opts.dryRun,
    domains: opts.domains,
    subjects: opts.subjects ?? null,
    scanned,
    enriched,
    skipped,
    failed,
    completedAt: new Date().toISOString(),
  };
  const out = path.join(process.cwd(), "artifacts", "naplex-rationale-phase3-report.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(`\nDone — enriched ${enriched}, failed ${failed}, skipped ${skipped}`);
  console.log(`Report: ${out}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
