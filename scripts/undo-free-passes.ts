/**
 * Undo a free-pass insert.
 *
 * Default is a dry run. It prints a DELETE for unused codes and does not
 * connect to a database.
 *
 * A real delete requires BOTH:
 *   --apply
 *   CONFIRM_FREE_PASS_UNDO=undo-free-passes
 *
 * Codes with currentUses > 0 are never deleted. Restore from the backup JSON
 * written by scripts/insert-free-passes.ts if a row must be put back.
 *
 *   npx tsx scripts/undo-free-passes.ts --csv ./free-passes.csv
 *   npx tsx scripts/undo-free-passes.ts --csv ./free-passes.csv --backup ./backup.json
 */
import { readFileSync } from "node:fs";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function codesFromCsv(text: string): string[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines[0]?.toLowerCase().startsWith("code,")) {
    throw new Error("CSV header must start with code");
  }
  return lines.slice(1).map((line) => line.split(",")[0]?.trim().toUpperCase() ?? "").filter(Boolean);
}

const csvPath = arg("--csv");
const backupPath = arg("--backup");
const apply = process.argv.includes("--apply");

if (!csvPath) {
  console.error("Usage: npx tsx scripts/undo-free-passes.ts --csv <file.csv> [--backup <file.json>]");
  process.exit(1);
}

const codes = codesFromCsv(readFileSync(csvPath, "utf8"));
console.log(`Would delete up to ${codes.length} PromoCode rows where currentUses = 0 and compDays is set.`);
if (backupPath) {
  const backup = JSON.parse(readFileSync(backupPath, "utf8")) as
    | unknown[]
    | { promoCodes?: unknown[]; promoRedemptions?: unknown[] };
  const promoCodes = Array.isArray(backup)
    ? backup.length
    : Array.isArray(backup.promoCodes)
      ? backup.promoCodes.length
      : 0;
  const promoRedemptions = Array.isArray(backup)
    ? 0
    : Array.isArray(backup.promoRedemptions)
      ? backup.promoRedemptions.length
      : 0;
  console.log(
    `Backup file has ${promoCodes} promo codes and ${promoRedemptions} redemptions to restore manually if needed.`
  );
}
console.log("Redeemed codes (currentUses > 0) are left in place.");

if (!apply) {
  console.log("Dry run: no database connection was opened.");
  process.exit(0);
}

if (process.env.CONFIRM_FREE_PASS_UNDO !== "undo-free-passes") {
  console.error("Refusing to write. Set CONFIRM_FREE_PASS_UNDO=undo-free-passes and pass --apply.");
  process.exit(1);
}

async function applyUndo() {
  const { prisma } = await import("../src/lib/prisma");
  const redeemed = await prisma.promoCode.findMany({
    where: { code: { in: codes }, currentUses: { gt: 0 } },
    select: { code: true, currentUses: true },
  });
  const result = await prisma.promoCode.deleteMany({
    where: {
      code: { in: codes },
      currentUses: 0,
      compDays: { not: null },
    },
  });
  console.log(`Deleted ${result.count} unused codes.`);
  if (redeemed.length > 0) {
    console.log(`Left ${redeemed.length} redeemed codes in place.`);
  }
  await prisma.$disconnect();
}

void applyUndo().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
