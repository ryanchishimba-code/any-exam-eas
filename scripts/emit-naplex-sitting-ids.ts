#!/usr/bin/env node
/**
 * Emit NAPLEX sitting item ids the way the live fast gather does, then
 * finalizeAssembledSitting. Read-only. The same file runs against main
 * (before blueprint ranking and the concept cap) and against this branch
 * when tsx is pointed at that tree's tsconfig.
 *
 *   N=24 LENGTHS=50,100,225 npx tsx scripts/emit-naplex-sitting-ids.ts
 *
 * Writes JSONL to stdout. Does not print question text.
 */
import fs from "node:fs";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { collectFastTimedPool } from "@/lib/exam-prep/compose/assemble-timed-exam-session";
import {
  finalizeAssembledSitting,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
} from "@/lib/exam-prep/sitting-selection";
import { retainStudentEligibleBankItems } from "@/lib/exam-prep/student-eligibility";
import type { BankItem } from "@/lib/question-bank";

const N = Number(process.env.N ?? 24);
const SAMPLE = process.env.PHARM_SAMPLE ?? "/tmp/pharm-sample.json";
const LENGTHS = (process.env.LENGTHS ?? "50,100,225")
  .split(",")
  .map((part) => Number(part.trim()))
  .filter((value) => Number.isFinite(value) && value > 0);

function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function loadSample(path: string): BankItem[] {
  const rows = JSON.parse(fs.readFileSync(path, "utf8")) as Array<Record<string, unknown>>;
  const items = rows.map((row) => {
    const generationMeta = typeof row.gm === "string" && row.gm ? JSON.parse(row.gm) : row.generationMeta ?? null;
    const item = enrichBankItemFromRow({
      id: String(row.id),
      subjectId: String(row.subjectId ?? ""),
      question: String(row.question ?? ""),
      options: typeof row.options === "string" ? row.options : JSON.stringify(row.options ?? []),
      correctAnswer: String(row.correctAnswer ?? ""),
      explanation: typeof row.explanation === "string" ? row.explanation : "",
      solutionSteps: null,
      tags: typeof row.tags === "string" ? row.tags : JSON.stringify(row.tags ?? []),
      itemType: typeof row.itemType === "string" ? row.itemType : "mcq",
      scenario: typeof row.scenario === "string" ? row.scenario : "",
      topicCategory: typeof row.topicCategory === "string" ? row.topicCategory : null,
      blueprintTopic: typeof row.blueprintTopic === "string" ? row.blueprintTopic : null,
      taskCategory: typeof row.taskCategory === "string" ? row.taskCategory : null,
      generationMeta,
      source: typeof row.source === "string" ? row.source : null,
      qaPassed: true,
      active: true,
      fieldId: "pharmacy",
      curationMeta: typeof row.cm === "string" && row.cm ? JSON.parse(row.cm) : row.curationMeta ?? null,
    } as never) as BankItem;
    if (typeof row.cluster_id === "string" && row.cluster_id) item.clusterId = row.cluster_id;
    item.qaPassed = true;
    item.active = true;
    return item;
  });
  return retainStudentEligibleBankItems(items);
}

async function emitLength(eligible: readonly BankItem[], limit: number) {
  const sprint = Math.max(Math.ceil(limit * 1.6), limit + 80);
  const rowCap = Math.min(2000, Math.max(sprint * 3, limit * 4));
  const calcs = eligible.filter((item) => isPharmacyCalculationItem(item));
  const calcSample = Math.max(pharmacyCalculationQuota(limit) * 3, 12);
  for (let trial = 0; trial < N; trial++) {
    const random = rng(1_000 + limit * 1000 + trial);
    const order = shuffle(eligible, random);
    let cursor = 0;
    const started = performance.now();
    const fastItems = await collectFastTimedPool({
      limit,
      rowCap,
      sprintTarget: sprint,
      pull: async (count) => {
        const batch = order.slice(cursor, cursor + count);
        cursor += count;
        return batch;
      },
    });
    const extra = shuffle(calcs, random)
      .slice(0, calcSample)
      .filter((calc) => !fastItems.some((item) => item.id === calc.id));
    const pool = [...fastItems, ...extra];
    const out = finalizeAssembledSitting({
      pool,
      limit,
      fieldId: "pharmacy",
      seed: (2_000 + trial) >>> 0,
      includeNgn: false,
    });
    const ms = Math.round(performance.now() - started);
    if ((trial + 1) % 5 === 0 || trial + 1 === N) {
      fs.writeSync(2, `limit=${limit} ${trial + 1}/${N} kept=${out.items.length} relax=${out.capStats.relaxLevel ?? 0} ms=${ms}\n`);
    }
    const line = {
      limit,
      trial,
      kept: out.items.length,
      relax: out.capStats.relaxLevel ?? 0,
      ms,
      ids: out.items.map((item) => item.id),
    };
    fs.writeSync(1, `${JSON.stringify(line)}\n`);
  }
}

async function main() {
  const eligible = loadSample(SAMPLE);
  fs.writeSync(2, `eligible=${eligible.length} N=${N} lengths=${LENGTHS.join(",")}\n`);
  for (const limit of LENGTHS) {
    await emitLength(eligible, limit);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
