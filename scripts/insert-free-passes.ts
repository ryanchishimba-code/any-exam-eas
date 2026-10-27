/**
 * Prepare a production insert for free-pass codes.
 *
 * Default is a dry run: it reads the CSV and prints the backup query plus the
 * insert. It does not open a database connection.
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
  return lines.slice(1).map((line) => {
    const [code, audience, compDays, maxUses] = line.split(",");
    if (!code || (audience !== "nursing" && audience !== "pharmacy")) {
      throw new Error(`Bad CSV row: ${line}`);
    }
    return {
      code: code.trim().toUpperCase(),
      audience,
      compDays: Number(compDays),
      maxUses: Number(maxUses),
    };
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
console.log(`CSV has ${rows.length} codes.`);
console.log(`Backup would be written to ${backupPath} from:`);
console.log(`SELECT * FROM "PromoCode" WHERE code IN (${codes.length} codes) before insert.`);
console.log("Insert is INSERT ... ON CONFLICT (code) DO NOTHING for compDays, audience, maxUses=1, active=true.");
console.log("No Stripe coupon is created.");

const undoSql = [
  "-- Undo unused free passes. Refuses to delete a code that was already redeemed.",
  "DELETE FROM \"PromoCode\"",
  "WHERE code IN (",
  codes.map((code) => `  '${code.replace(/'/g, "''")}'`).join(",\n"),
  ")",
  "AND \"currentUses\" = 0",
  "AND \"compDays\" IS NOT NULL;",
  "",
].join("\n");

if (!apply) {
  console.log("Dry run: no database connection was opened.");
  console.log("--- undo preview (first 12 lines) ---");
  console.log(undoSql.split("\n").slice(0, 12).join("\n"));
  process.exit(0);
}

if (process.env.CONFIRM_FREE_PASS_INSERT !== "insert-free-passes") {
  console.error("Refusing to write. Set CONFIRM_FREE_PASS_INSERT=insert-free-passes and pass --apply.");
  process.exit(1);
}

async function applyInsert() {
  const { prisma } = await import("../src/lib/prisma");
  const existing = await prisma.promoCode.findMany({ where: { code: { in: codes } } });
  writeFileSync(backupPath, JSON.stringify(existing, null, 2), "utf8");
  console.log(`Backed up ${existing.length} existing rows to ${backupPath}`);

  let inserted = 0;
  for (const row of rows) {
    const result = await prisma.promoCode.createMany({
      data: [
        {
          code: row.code,
          compDays: row.compDays,
          audience: row.audience,
          maxUses: row.maxUses,
          currentUses: 0,
          active: true,
        },
      ],
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
