#!/usr/bin/env node
/**
 * Print before/after sitting metrics for the synthetic 2026-10-05 failure mode.
 * Does not read or write the question bank.
 *
 *   npx tsx scripts/simulate-sitting-assembly.ts
 */
import { compareSitting, simulateCatNgnCount } from "../src/lib/exam-prep/sitting-simulation";
import { finalizeAssembledSitting } from "../src/lib/exam-prep/sitting-selection";
import { simulatedBoards } from "../src/lib/exam-prep/sitting-simulation";

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function line(label: string, metrics: ReturnType<typeof compareSitting>["before"], catNgn?: number) {
  const positions = metrics.keyPosition.map((share, index) => `${index + 1}:${pct(share)}`).join(" ");
  console.log(
    `${label} n=${metrics.count} dup=${pct(metrics.dupRate)} repeat=${pct(metrics.repeatRate)} ngn=${metrics.ngnCount} key=[${positions}]` +
      (catNgn == null ? "" : ` cat87-ngn=${catNgn}`)
  );
}

const boards = simulatedBoards();
const naplex = compareSitting(boards.naplex);
const nclex = compareSitting(boards.nclex);
const nclexItems = finalizeAssembledSitting({
  pool: boards.nclex.wide,
  limit: boards.nclex.limit,
  fieldId: "nursing",
  seenIds: boards.nclex.seenIds,
  seed: 42,
  includeNgn: true,
}).items;

console.log("Simulated sittings (synthetic bank, not production rows)");
line("NAPLEX before", naplex.before);
line("NAPLEX after ", naplex.after);
line("NCLEX  before", nclex.before);
line("NCLEX  after ", nclex.after, simulateCatNgnCount(nclexItems, 87));
