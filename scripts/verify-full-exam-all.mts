#!/usr/bin/env node
/**
 * Verify full-length timed exam assembly for every board exam slug.
 * Mirrors /api/questions?mode=timed&scope=field (full-exam simulator path).
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { EXAM_CATALOG, EXAM_SLUGS, type ExamSlug } from "../src/lib/edtech/exams";
import { buildSessionConfig } from "../src/lib/full-exam/config";
import { countActiveQuestions } from "../src/lib/question-bank-db";
import { gatherTimedExamBankItems } from "../src/lib/questions/timed-exam-sampling";
import {
  assertExamSessionReady,
  finalizeExamSessionQuestions,
  resolveExamBankSampleCount,
} from "../src/lib/questions/finalize-exam-session";
import {
  bankItemToSessionRaw,
  prepareBankItemsForSession,
} from "../src/lib/exam-prep/prepare-bank-session";
import { nclexItemPassesTimedExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import {
  naplexItemPassesTimedExamGate,
  prepareNaplexBankItem,
} from "../src/lib/exam-prep/naplex-serve-gate";
import { nptePtItemPassesTimedExamGate } from "../src/lib/exam-prep/npte-pt-serve-gate";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { isUsmleField } from "../src/lib/exam-prep/usmle-bank-bridge";
import type { FullExamLengthPreset } from "../src/types/full-exam";

const prisma = new PrismaClient();

type ExamResult = {
  slug: ExamSlug;
  preset: FullExamLengthPreset;
  requested: number;
  returned: number;
  activeInBank: number;
  ok: boolean;
  detail: string;
  ms: number;
};

async function assembleFullExam(
  examSlug: ExamSlug,
  preset: FullExamLengthPreset,
  maxAttempts = 3
): Promise<Omit<ExamResult, "slug" | "preset">> {
  const started = Date.now();
  const exam = EXAM_CATALOG[examSlug];
  const fieldId = exam.fieldId;
  const field = fieldId;
  const config = buildSessionConfig(examSlug, preset, true);
  const limit = config.questionCount;
  const timedExam = true;

  const activeInBank = await countActiveQuestions(fieldId);
  const sampleCount = resolveExamBankSampleCount(fieldId, limit, timedExam);

  let lastDetail = "Unknown error";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let items: Awaited<ReturnType<typeof gatherTimedExamBankItems>>;

      if (fieldId === "nursing") {
        items = await gatherTimedExamBankItems({
          fieldId,
          limit,
          filterFn: nclexItemPassesTimedExamGate,
          initialSampleCount: sampleCount,
        });
      } else if (fieldId === "pharmacy") {
        items = (
          await gatherTimedExamBankItems({
            fieldId,
            limit,
            filterFn: naplexItemPassesTimedExamGate,
            initialSampleCount: sampleCount,
          })
        ).map(prepareNaplexBankItem);
      } else if (fieldId === "npte-pt") {
        items = await gatherTimedExamBankItems({
          fieldId,
          limit,
          filterFn: nptePtItemPassesTimedExamGate,
          initialSampleCount: sampleCount,
        });
      } else if (
        isUsmleField(fieldId) ||
        fieldId === "pance" ||
        fieldId === "aanp-fnp"
      ) {
        items = await gatherTimedExamBankItems({
          fieldId,
          limit,
          filterFn: (item) => usmleBankItemIsServeReady(item, fieldId),
          initialSampleCount: sampleCount,
        });
      } else {
        return {
          requested: limit,
          returned: 0,
          activeInBank,
          ok: false,
          detail: "Unknown field — no gather path",
          ms: Date.now() - started,
        };
      }

      if (items.length === 0) {
        lastDetail = "No bank items after gather";
        continue;
      }

      items = prepareBankItemsForSession({
        fieldId,
        field,
        items,
        limit,
        poolLimit: items.length,
      });

      const rawInputs = items.map((item, i) => ({
        ...bankItemToSessionRaw(fieldId, field, item.subjectId ?? "__mixed__", item, i),
        field,
        subjectId: item.subjectId ?? "__mixed__",
        bankItemId: item.id,
      }));

      const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, limit);
      assertExamSessionReady(quality, fieldId);

      const returned = prepared.length;
      const ok = returned === limit;
      const attemptNote = attempt > 1 ? ` (attempt ${attempt})` : "";

      return {
        requested: limit,
        returned,
        activeInBank,
        ok,
        detail: ok
          ? `${returned}/${limit} questions · quality OK${attemptNote}`
          : `Only ${returned}/${limit} assembled${attemptNote}`,
        ms: Date.now() - started,
      };
    } catch (e) {
      lastDetail =
        (e instanceof Error ? e.message : String(e)).slice(0, 200) +
        (attempt < maxAttempts ? ` · retry ${attempt}/${maxAttempts}` : "");
    }
  }

  return {
    requested: limit,
    returned: 0,
    activeInBank,
    ok: false,
    detail: lastDetail,
    ms: Date.now() - started,
  };
}

async function main() {
  const presets: FullExamLengthPreset[] = process.argv.includes("--quick")
    ? ["50"]
    : ["full"];

  const onlySlug = process.argv.find((a) => a.startsWith("--exam="))?.split("=")[1] as
    | ExamSlug
    | undefined;
  const slugs = onlySlug && EXAM_SLUGS.includes(onlySlug) ? [onlySlug] : EXAM_SLUGS;

  console.log("\n=== Full exam assembly verification (all exams) ===\n");

  const results: ExamResult[] = [];

  for (const slug of slugs) {
    for (const preset of presets) {
      process.stdout.write(`  ${slug} (${preset})… `);
      const r = await assembleFullExam(slug, preset);
      results.push({ slug, preset, ...r });
      console.log(r.ok ? "PASS" : "FAIL", `— ${r.detail} (${r.ms}ms)`);
    }
  }

  await prisma.$disconnect();

  console.log("\n--- Summary ---\n");
  console.log(
    "Exam".padEnd(12),
    "Preset".padEnd(8),
    "Result".padEnd(8),
    "Count".padEnd(14),
    "Bank active".padEnd(12),
    "Detail"
  );
  console.log("-".repeat(90));

  for (const r of results) {
    console.log(
      r.slug.padEnd(12),
      r.preset.padEnd(8),
      (r.ok ? "PASS" : "FAIL").padEnd(8),
      `${r.returned}/${r.requested}`.padEnd(14),
      String(r.activeInBank).padEnd(12),
      r.detail
    );
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);

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
