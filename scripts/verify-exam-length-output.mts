#!/usr/bin/env node
/**
 * Verify every board exam produces the designed question count at 50, 100, and full
 * using the production timed-exam assembly path.
 *
 * Usage:
 *   npx tsx scripts/verify-exam-length-output.mts
 *   npx tsx scripts/verify-exam-length-output.mts --exam=nclex
 *   npx tsx scripts/verify-exam-length-output.mts --quick   # 50 only
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { EXAM_CATALOG, EXAM_SLUGS, type ExamSlug } from "../src/lib/edtech/exams";
import { buildSessionConfig } from "../src/lib/full-exam/config";
import { assembleTimedExamSessionItems } from "../src/lib/exam-prep/compose/assemble-timed-exam-session";
import {
  bankItemToSessionRaw,
} from "../src/lib/exam-prep/prepare-bank-session";
import { countActiveQuestions } from "../src/lib/question-bank-db";
import {
  assertExamSessionReady,
  finalizeExamSessionQuestions,
  resolveExamBankSampleCount,
} from "../src/lib/questions/finalize-exam-session";
import type { FullExamLengthPreset } from "../src/types/full-exam";

const prisma = new PrismaClient();

type Row = {
  slug: ExamSlug;
  preset: FullExamLengthPreset;
  requested: number;
  returned: number;
  source: string;
  tier?: string;
  activeInBank: number;
  ok: boolean;
  detail: string;
  ms: number;
};

async function verifyExamLength(
  examSlug: ExamSlug,
  lengthPreset: FullExamLengthPreset
): Promise<Row> {
  const started = Date.now();
  const exam = EXAM_CATALOG[examSlug];
  const fieldId = exam.fieldId;
  const field = fieldId;

  const sessionConfig = buildSessionConfig(examSlug, lengthPreset, true);
  const limit = sessionConfig.questionCount;
  const sampleCount = resolveExamBankSampleCount(fieldId, limit, true);

  try {
    const assembled = await assembleTimedExamSessionItems({
      fieldId,
      field,
      limit,
      sampleCount,
    });

    if (!assembled) {
      return {
        slug: examSlug,
        preset: lengthPreset,
        requested: limit,
        returned: 0,
        source: "none",
        activeInBank: await countActiveQuestions(fieldId),
        ok: false,
        detail: "Assembly returned no items",
        ms: Date.now() - started,
      };
    }

    const rawInputs = assembled.items.map((item, i) => ({
      ...bankItemToSessionRaw(fieldId, field, item.subjectId ?? "__mixed__", item, i),
      field,
      subjectId: item.subjectId ?? "__mixed__",
      bankItemId: item.id,
    }));

    const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, limit, { fieldId });
    assertExamSessionReady(quality, fieldId);

    const returned = prepared.length;
    const ok = returned === limit;

    return {
      slug: examSlug,
      preset: lengthPreset,
      requested: limit,
      returned,
      source: assembled.source,
      tier: assembled.tierId,
      activeInBank: await countActiveQuestions(fieldId),
      ok,
      detail: ok
        ? `${returned}/${limit} via ${assembled.source}${assembled.tierId ? ` (${assembled.tierId})` : ""}`
        : `Only ${returned}/${limit}`,
      ms: Date.now() - started,
    };
  } catch (e) {
    return {
      slug: examSlug,
      preset: lengthPreset,
      requested: limit,
      returned: 0,
      source: "error",
      activeInBank: await countActiveQuestions(fieldId),
      ok: false,
      detail: (e instanceof Error ? e.message : String(e)).slice(0, 220),
      ms: Date.now() - started,
    };
  }
}

async function main() {
  const quick = process.argv.includes("--quick");
  const presets: FullExamLengthPreset[] = quick ? ["50"] : ["50", "100", "full"];
  const onlySlug = process.argv.find((a) => a.startsWith("--exam="))?.split("=")[1] as
    | ExamSlug
    | undefined;
  const slugs = onlySlug && EXAM_SLUGS.includes(onlySlug) ? [onlySlug] : EXAM_SLUGS;

  console.log("\n=== Exam length output verification (production path) ===\n");

  const rows: Row[] = [];

  for (const slug of slugs) {
    for (const preset of presets) {
      process.stdout.write(`  ${slug} (${preset})… `);
      const row = await verifyExamLength(slug, preset);
      rows.push(row);
      console.log(row.ok ? "PASS" : "FAIL", `— ${row.detail} (${row.ms}ms)`);
    }
  }

  await prisma.$disconnect();

  console.log("\n--- Summary ---\n");
  console.log(
    "Exam".padEnd(12),
    "Preset".padEnd(8),
    "Result".padEnd(8),
    "Count".padEnd(14),
    "Source".padEnd(12),
    "Detail"
  );
  console.log("-".repeat(96));

  for (const r of rows) {
    console.log(
      r.slug.padEnd(12),
      r.preset.padEnd(8),
      (r.ok ? "PASS" : "FAIL").padEnd(8),
      `${r.returned}/${r.requested}`.padEnd(14),
      r.source.padEnd(12),
      r.detail
    );
  }

  const failed = rows.filter((r) => !r.ok);
  console.log(`\n${rows.length - failed.length}/${rows.length} checks passed`);

  if (failed.length > 0) {
    console.log("\nFailed:");
    for (const r of failed) {
      console.log(`  • ${r.slug} (${r.preset}): ${r.detail}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
