#!/usr/bin/env node
/**
 * NAPLEX fast-compose simulation.
 *
 * Models the live fast gather by calling collectFastTimedPool with a mocked
 * pull over a local pharmacy sample, then the same calc merge and
 * finalizeAssembledSitting the assembler uses. Does not read or write the
 * database.
 *
 *   cp path/to/pharm-sample.json /tmp/pharm-sample.json
 *   N=500 npx tsx scripts/simulate-naplex-fast-compose.ts
 *
 * The sample path defaults to /tmp/pharm-sample.json (PHARM_SAMPLE overrides).
 */
import fs from "node:fs";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import {
  collectFastTimedPool,
  fastGatherClusterGoal,
  fastGatherItemGoal,
} from "@/lib/exam-prep/compose/assemble-timed-exam-session";
import {
  PHARMACY_DRUG_CAP,
  sittingDrugMentions,
  sittingRepeatKeys,
} from "@/lib/exam-prep/entity-cap";
import {
  finalizeAssembledSitting,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
} from "@/lib/exam-prep/sitting-selection";
import { retainStudentEligibleBankItems } from "@/lib/exam-prep/student-eligibility";
import type { BankItem } from "@/lib/question-bank";

const samplePath = process.env.PHARM_SAMPLE ?? "/tmp/pharm-sample.json";
const rows = JSON.parse(fs.readFileSync(samplePath, "utf8")) as Array<Record<string, unknown>>;

const items = rows.map((row) => {
  const generationMeta = typeof row.gm === "string" && row.gm ? JSON.parse(row.gm) : null;
  const item = enrichBankItemFromRow({
    id: row.id,
    subjectId: row.subjectId,
    question: row.question,
    options: row.options,
    correctAnswer: row.correctAnswer,
    explanation: "",
    solutionSteps: null,
    tags: row.tags,
    itemType: row.itemType,
    scenario: row.scenario,
    topicCategory: row.topicCategory,
    blueprintTopic: row.blueprintTopic,
    taskCategory: row.taskCategory,
    generationMeta,
    source: row.source,
    qaPassed: true,
    active: true,
    fieldId: "pharmacy",
    curationMeta: typeof row.cm === "string" && row.cm ? JSON.parse(row.cm) : null,
  } as never) as BankItem;
  if (typeof row.quality_score === "number") item.qualityScore = row.quality_score;
  if (typeof row.cluster_id === "string" && row.cluster_id) item.clusterId = row.cluster_id;
  item.qaPassed = true;
  item.active = true;
  return item;
});

const eligible = retainStudentEligibleBankItems(items);
const calcs = eligible.filter((item) => isPharmacyCalculationItem(item));

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

const LIMIT = Number(process.env.LIMIT ?? 50);
const N = Number(process.env.N ?? 500);
const SPRINT = Number(process.env.SPRINT ?? Math.max(Math.ceil(LIMIT * 1.6), LIMIT + 80));
const ROW_CAP = Math.min(2000, Math.max(SPRINT * 3, LIMIT * 4));
const CALC_SAMPLE = Math.max(pharmacyCalculationQuota(LIMIT) * 3, 12);

async function main() {
let fails = 0;
let poolTotal = 0;
let drugViolations = 0;
let templateViolations = 0;
let maxDrug = 0;
let maxTemplate = 0;
const sizes: number[] = [];

for (let trial = 0; trial < N; trial++) {
  const random = rng(1000 + trial);
  const order = shuffle(eligible, random);
  let cursor = 0;
  const fastItems = await collectFastTimedPool({
    limit: LIMIT,
    rowCap: ROW_CAP,
    sprintTarget: SPRINT,
    pull: async (count) => {
      const batch = order.slice(cursor, cursor + count);
      cursor += count;
      return batch;
    },
  });
  const extra = shuffle(calcs, random)
    .slice(0, CALC_SAMPLE)
    .filter((calc) => !fastItems.some((item) => item.id === calc.id));
  const pool = [...fastItems, ...extra];
  poolTotal += pool.length;
  const out = finalizeAssembledSitting({
    pool,
    limit: LIMIT,
    fieldId: "pharmacy",
    seed: (2000 + trial) >>> 0,
    includeNgn: false,
  });
  sizes.push(out.items.length);
  if (out.items.length < LIMIT) fails += 1;

  const drugCounts = new Map<string, number>();
  const templateCounts = new Map<string, number>();
  for (const item of out.items) {
    for (const drug of sittingDrugMentions(item)) {
      drugCounts.set(drug, (drugCounts.get(drug) ?? 0) + 1);
    }
    for (const key of sittingRepeatKeys(item, "pharmacy")) {
      if (!key.startsWith("template:")) continue;
      templateCounts.set(key, (templateCounts.get(key) ?? 0) + 1);
    }
  }
  for (const count of drugCounts.values()) {
    if (count > maxDrug) maxDrug = count;
    if (count > PHARMACY_DRUG_CAP) drugViolations += 1;
  }
  for (const count of templateCounts.values()) {
    if (count > maxTemplate) maxTemplate = count;
    if (count > 1) templateViolations += 1;
  }
}

sizes.sort((left, right) => left - right);
console.log(
  JSON.stringify({
    eligible: eligible.length,
    calcs: calcs.length,
    N,
    LIMIT,
    SPRINT,
    ROW_CAP,
    clusterGoal: fastGatherClusterGoal(LIMIT),
    itemGoal: fastGatherItemGoal(LIMIT, SPRINT, ROW_CAP),
    seedStart: 1000,
    avgPool: poolTotal / N,
    fails,
    failRate: fails / N,
    min: sizes[0] ?? 0,
    p10: sizes[Math.floor(N * 0.1)] ?? 0,
    median: sizes[Math.floor(N / 2)] ?? 0,
    drugCap: PHARMACY_DRUG_CAP,
    drugViolations,
    templateViolations,
    maxDrug,
    maxTemplate,
  })
);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
