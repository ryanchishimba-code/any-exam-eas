/**
 * Generate single-use 30-day pass codes.
 * Does not connect to a database.
 *
 *   npx tsx scripts/generate-free-passes.ts --dry-run
 *   npx tsx scripts/generate-free-passes.ts --out /tmp/free-passes.csv
 *
 * --dry-run never writes a file, even when --out is set.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { freePassesToCsv, generateFreePassBatch } from "../src/lib/promo/free-pass-codes";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

const dryRun = process.argv.includes("--dry-run");
const out = arg("--out");

const codes = generateFreePassBatch();
const nursing = codes.filter((row) => row.audience === "nursing").length;
const pharmacy = codes.filter((row) => row.audience === "pharmacy").length;
const csv = freePassesToCsv(codes);

console.log(`Generated ${codes.length} codes (${nursing} nursing RN-, ${pharmacy} pharmacy RX-).`);
console.log("comp_days=30 max_uses=1. No database connection.");

if (dryRun) {
  console.log("Dry run: CSV was not written.");
  console.log(csv.split("\n").slice(0, 3).join("\n"));
  process.exit(0);
}

if (!out) {
  console.error("Pass --out <file.csv> to write the codes, or --dry-run to preview.");
  process.exit(1);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, csv, "utf8");
console.log(`Wrote ${out}`);
