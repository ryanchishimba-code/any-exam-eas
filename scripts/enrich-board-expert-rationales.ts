#!/usr/bin/env node
/**
 * Bulk-upgrade board exam rationales — expert tier for NCLEX, structured tier for other exams.
 *
 * Usage:
 *   npm run db:enrich-board-expert -- --field nursing --limit 200
 *   npm run db:enrich-board-expert -- --field pance --serve-only --limit 500
 *   npm run db:enrich-board-expert -- --field all --serve-only --limit 100
 *
 * Requires OPENAI_API_KEY.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import {
  bankItemIsBoardServeReady,
  boardFieldLabel,
  resolveBoardFieldArg,
  type BoardFieldId,
} from "../src/lib/exam-prep/board-serve-registry";
import {
  EXPERT_RATIONALE_META_KEY,
  EXPERT_RATIONALE_VERSION,
  readExpertRationaleFromMeta,
} from "../src/lib/engine/rationale/expert-rationale-types";
import { generateExpertNclexRationale } from "../src/lib/engine/rationale/generate-expert-rationale";
import {
  applyAssembledRationale,
  generateStructuredRationale,
  needsRationaleEnrichment,
  rationaleInputFromBankItem,
} from "../src/lib/engine/rationale";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH = 40;
/** Override via ENRICH_DELAY_MS (ms). Lower = faster OpenAI throughput; 0 is fine with good rate limits. */
const DELAY_MS = (() => {
  const raw = process.env.ENRICH_DELAY_MS?.trim();
  if (!raw) return 150;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 150;
})();

const TRANSIENT_PRISMA = new Set(["P1017", "P1001", "P1002", "P1008"]);

async function withDbRetry<T>(label: string, fn: () => Promise<T>, attempts = 5): Promise<T> {
  let last: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: unknown }).code ?? "")
          : "";
      const msg = err instanceof Error ? err.message : String(err);
      const transient =
        TRANSIENT_PRISMA.has(code) ||
        /Server has closed the connection|Can't reach database server|Connection reset/i.test(msg);
      if (!transient || i === attempts) throw err;
      const waitMs = Math.min(30_000, 1000 * 2 ** (i - 1));
      console.warn(`[enrich-board] ${label} DB retry ${i}/${attempts} (${code || "conn"}) in ${waitMs}ms`);
      await sleep(waitMs);
    }
  }
  throw last;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "all";
  let limit = 50;
  let dryRun = false;
  let serveOnly = true;
  let force = false;
  let missingEnriched = false;
  const excludeFields: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--exclude-field" && args[i + 1]) excludeFields.push(args[++i]!);
    else if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--serve-only") serveOnly = true;
    else if (args[i] === "--all-active") serveOnly = false;
    else if (args[i] === "--force") force = true;
    else if (args[i] === "--missing-enriched") missingEnriched = true;
  }

  return {
    fields: resolveBoardFieldArg(field, excludeFields),
    limit,
    dryRun,
    serveOnly,
    force,
    missingEnriched,
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function hasRationaleEnrichedAt(meta: unknown): boolean {
  return (
    typeof meta === "object" &&
    meta !== null &&
    typeof (meta as { rationaleEnrichedAt?: unknown }).rationaleEnrichedAt === "string"
  );
}

async function enrichField(
  fieldId: BoardFieldId,
  opts: {
    limit: number;
    dryRun: boolean;
    serveOnly: boolean;
    force: boolean;
    /** Only items that have never been rationale-enriched (moves coverage %). */
    missingEnriched: boolean;
  }
) {
  const label = boardFieldLabel(fieldId);
  console.log(
    `\n${label} rationale enrichment${opts.serveOnly ? " [serve-ready]" : ""}${opts.missingEnriched ? " [missing-enriched]" : ""}${opts.dryRun ? " [dry-run]" : ""} limit ${opts.limit}\n`
  );

  let lastId: string | undefined;
  let scanned = 0;
  let enriched = 0;
  let skipped = 0;
  let failed = 0;
  const perFieldLimit = opts.limit;

  while (enriched < perFieldLimit) {
    const rows = await withDbRetry(`findMany:${fieldId}`, () =>
      prisma.questionBankItem.findMany({
        where: {
          fieldId,
          active: true,
          ...(opts.serveOnly ? { qaPassed: true } : {}),
          ...(lastId ? { id: { gt: lastId } } : {}),
        },
        orderBy: { id: "asc" },
        take: BATCH,
      })
    );
    if (!rows.length) break;

    for (const row of rows) {
      if (enriched >= perFieldLimit) break;
      scanned++;
      lastId = row.id;

      if (!opts.force && readExpertRationaleFromMeta(row.generationMeta)) {
        skipped++;
        continue;
      }

      if (opts.missingEnriched && !opts.force && hasRationaleEnrichedAt(row.generationMeta)) {
        skipped++;
        continue;
      }

      const item = enrichBankItemFromRow(row);
      if (opts.serveOnly && !bankItemIsBoardServeReady(fieldId, item, { source: row.source })) {
        skipped++;
        continue;
      }

      const check = needsRationaleEnrichment(item);
      // Coverage pass: enrich never-flagged items even if heuristics say "good enough".
      if (!opts.force && !opts.missingEnriched && !check.needs) {
        skipped++;
        continue;
      }

      if (opts.dryRun) {
        console.log(`  [dry-run] ${row.id.slice(0, 8)}… — ${check.reasons.join(", ")}`);
        enriched++;
        continue;
      }

      if (fieldId === "nursing") {
        const result = await generateExpertNclexRationale(
          rationaleInputFromBankItem(item, fieldId)
        );
        if (!result?.quality.ok) {
          failed++;
          console.warn(`  ✗ ${row.id.slice(0, 8)}… — expert quality ${result?.quality.score ?? 0}`);
          await sleep(DELAY_MS);
          continue;
        }

        const hash = bankItemContentHash(fieldId, item.subjectId ?? "nursing", {
          ...item,
          explanation: result.assembled.explanation,
          distractorRationale: result.assembled.distractorRationale,
        });

        const priorMeta =
          typeof row.generationMeta === "object" && row.generationMeta
            ? (row.generationMeta as Record<string, unknown>)
            : {};

        await withDbRetry(`update:${row.id.slice(0, 8)}`, () =>
          prisma.questionBankItem.update({
            where: { id: row.id },
            data: {
              explanation: result.assembled.explanation,
              options: serializeBankOptions({
                ...item,
                distractorRationale: result.assembled.distractorRationale,
                clinicalReasoning: result.assembled.clinicalReasoning,
                keyTakeaways: result.assembled.keyTakeaways,
              }),
              contentHash: hash,
              generationMeta: {
                ...priorMeta,
                [EXPERT_RATIONALE_META_KEY]: result.structured,
                expertRationaleVersion: EXPERT_RATIONALE_VERSION,
                rationaleEnrichedAt: new Date().toISOString(),
                rationaleModel: result.model,
                rationaleQualityScore: result.quality.score,
              },
            },
          })
        );

        enriched++;
        console.log(`  ✓ ${row.id.slice(0, 8)}… — expert score ${result.quality.score}`);
      } else {
        const gen = await generateStructuredRationale(rationaleInputFromBankItem(item, fieldId));
        if (!gen?.quality.ok) {
          failed++;
          console.warn(`  ✗ ${row.id.slice(0, 8)}… — quality ${gen?.quality.score ?? 0}`);
          await sleep(DELAY_MS);
          continue;
        }

        const applied = applyAssembledRationale(item, gen.assembled);
        const hash = bankItemContentHash(fieldId, row.subjectId, applied);
        const priorMeta =
          typeof row.generationMeta === "object" && row.generationMeta
            ? (row.generationMeta as Record<string, unknown>)
            : {};

        await withDbRetry(`update:${row.id.slice(0, 8)}`, () =>
          prisma.questionBankItem.update({
            where: { id: row.id },
            data: {
              explanation: applied.explanation,
              options: serializeBankOptions(applied),
              contentHash: hash,
              generationMeta: {
                ...priorMeta,
                rationaleEnrichedAt: new Date().toISOString(),
                rationaleModel: gen.model,
                rationaleQualityScore: gen.quality.score,
              },
            },
          })
        );

        enriched++;
        console.log(`  ✓ ${row.id.slice(0, 8)}… — score ${gen.quality.score}`);
      }

      await sleep(DELAY_MS);
    }
  }

  return { fieldId, label, scanned, enriched, skipped, failed };
}

async function main() {
  const { fields, limit, dryRun, serveOnly, force, missingEnriched } = parseArgs();
  if (!dryRun) requireOpenAiKey();

  const reports = [];
  for (const fieldId of fields) {
    reports.push(
      await enrichField(fieldId, { limit, dryRun, serveOnly, force, missingEnriched })
    );
  }

  const out = path.join(process.cwd(), "artifacts", "board-expert-rationale-report.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(
    out,
    JSON.stringify(
      { dryRun, serveOnly, missingEnriched, reports, completedAt: new Date().toISOString() },
      null,
      2
    )
  );

  const totalEnriched = reports.reduce((n, r) => n + r.enriched, 0);
  const totalFailed = reports.reduce((n, r) => n + r.failed, 0);
  console.log(`\nDone — enriched ${totalEnriched}, failed ${totalFailed}`);
  console.log(`Report: ${out}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
