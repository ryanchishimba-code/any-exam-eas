/**
 * Prepare a production insert for free-pass codes.
 *
 * Default is a dry run: it counts the CSV and describes the backup. It does
 * not open a database connection and it does not print codes.
 *
 * A real insert requires BOTH:
 *   --apply
 *   CONFIRM_FREE_PASS_INSERT=insert-free-passes
 *
 * Do not set that confirmation against production unless the owner asked.
 * This file is the prepared script only.
 *
 *   npx tsx scripts/insert-free-passes.ts --csv ./free-passes.csv
 *   npx tsx scripts/insert-free-passes.ts --csv ./free-passes.csv --backup ./backup.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { freePassInsertData } from "../src/lib/promo/marketing-phase";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

type CsvRow = { code: string; audience: string; compDays: number; maxUses: number };

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const header = lines[0]?.toLowerCase();
  if (!header?.startsWith("code,audience,comp_days,max_uses")) {
    throw new Error("CSV header must be code,audience,comp_days,max_uses");
  }
  return lines.slice(1).map((line, index) => {
    const [rawCode, audience, compDays, maxUses] = line.split(",");
    const code = rawCode?.trim().toUpperCase() ?? "";
    const prefix = audience === "nursing" ? "RN-" : audience === "pharmacy" ? "RX-" : "";
    const days = Number(compDays);
    const uses = Number(maxUses);
    if (!code || !prefix || !code.startsWith(prefix) || !Number.isFinite(days) || !Number.isFinite(uses)) {
      throw new Error(`Bad CSV row at line ${index + 2}`);
    }
    return { code, audience, compDays: days, maxUses: uses };
  });
}

const csvPath = arg("--csv");
const backupPath = arg("--backup") ?? "./tmp/free-pass-backup.json";
const apply = process.argv.includes("--apply");

if (!csvPath) {
  console.error("Usage: npx tsx scripts/insert-free-passes.ts --csv <file.csv> [--backup <file.json>]");
  console.error("Dry run is the default. --apply is refused unless CONFIRM_FREE_PASS_INSERT=insert-free-passes.");
  process.exit(1);
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const codes = rows.map((row) => row.code);
const unique = new Set(codes);
if (unique.size !== codes.length) {
  throw new Error(`CSV has ${codes.length - unique.size} duplicate codes.`);
}
const nursing = rows.filter((row) => row.audience === "nursing").length;
const pharmacy = rows.filter((row) => row.audience === "pharmacy").length;
console.log(`CSV has ${rows.length} unique codes (${nursing} nursing, ${pharmacy} pharmacy).`);
console.log("Each inserted row is tagged campaign Marketing Phase 1.");
console.log(`Backup path: ${backupPath} (full PromoCode and PromoRedemption tables).`);
console.log("Existing codes are left unchanged. No Stripe coupon is created.");
console.log("Undo deletes only rows with currentUses = 0 and compDays set. Codes are not printed.");

if (!apply) {
  console.log("Dry run: no database connection was opened.");
  process.exit(0);
}

if (process.env.CONFIRM_FREE_PASS_INSERT !== "insert-free-passes") {
  console.error("Refusing to write. Set CONFIRM_FREE_PASS_INSERT=insert-free-passes and pass --apply.");
  process.exit(1);
}

async function applyInsert() {
  const { prisma } = await import("../src/lib/prisma");
  const [promoCodes, promoRedemptions] = await Promise.all([
    prisma.promoCode.findMany(),
    prisma.promoRedemption.findMany(),
  ]);
  writeFileSync(
    backupPath,
    JSON.stringify(
      { takenAt: new Date().toISOString(), promoCodes, promoRedemptions },
      null,
      2
    ),
    "utf8"
  );
  console.log(
    `Backed up ${promoCodes.length} promo codes and ${promoRedemptions.length} redemptions to ${backupPath}`
  );

  let inserted = 0;
  for (const row of rows) {
    const result = await prisma.promoCode.createMany({
      data: [freePassInsertData(row)],
      skipDuplicates: true,
    });
    inserted += result.count;
  }
  console.log(`Inserted ${inserted} codes. Existing codes were left unchanged.`);
  await prisma.$disconnect();
}

void applyInsert().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
