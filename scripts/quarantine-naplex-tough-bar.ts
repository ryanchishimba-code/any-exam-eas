/**
 * Quarantine NAPLEX items that fail the tough NABP commercial bar:
 * physician-diagnostics-only stems, unsafe/missing-unit calcs from rating samples,
 * and wouldAppearOnNaplex=false criticals.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-naplex-tough-bar.ts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-naplex-tough-bar.ts --apply
 */
import { loadEnvFiles } from "./load-env";
loadEnvFiles();

import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");
const RATING = path.join(process.cwd(), "tmp", "naplex-nabp-tough-rating.json");

/** Physician / MD diagnostic stems — not pharmacist recommend/monitor/counsel. */
const PHYSICIAN_DIAG_STEM =
  /\b(most likely diagnosis|what is the diagnosis|which diagnosis|diagnostic impression|pathophysiology of this presentation)\b/i;

const PHYSICIAN_ACTION_STEM =
  /\b(what should the (physician|provider|MD|doctor) (do|order|prescribe)|the physician should)\b/i;

type Flagged = { id: string; reason: string; stem: string };

function loadToughFails(): Flagged[] {
  try {
    const raw = JSON.parse(readFileSync(RATING, "utf8")) as {
      itemScores?: Array<{
        id: string;
        score: number;
        wouldAppearOnNaplex?: boolean;
        criticalFlags?: string[];
        stem?: string;
      }>;
      samplesForReview?: Array<{ id: string; stem?: string }>;
    };
    const stemById = new Map(
      (raw.samplesForReview ?? []).map((s) => [s.id, s.stem ?? ""])
    );
    const out: Flagged[] = [];
    for (const it of raw.itemScores ?? []) {
      const flags = it.criticalFlags ?? [];
      const physician = flags.some((f) => /physician/i.test(f));
      const missingUnits = flags.some((f) => /missing units/i.test(f));
      const appearFalse = it.wouldAppearOnNaplex === false;
      const veryLow = it.score <= 5;
      if (!physician && !missingUnits && !appearFalse && !veryLow) continue;
      out.push({
        id: it.id,
        reason: appearFalse
          ? "would_not_appear"
          : physician
            ? "physician_scope"
            : missingUnits
              ? "missing_units"
              : "very_low_score",
        stem: (stemById.get(it.id) ?? "").slice(0, 140),
      });
    }
    return out;
  } catch {
    return [];
  }
}

async function quarantine(id: string, reviewStatus: string) {
  if (!apply) return;
  await prisma.questionBankItem.update({
    where: { id },
    data: {
      active: false,
      qaPassed: false,
      reviewStatus,
      updatedAt: new Date(),
    },
  });
}

async function main() {
  console.log(
    `\nNAPLEX tough-bar quarantine${apply ? " [apply]" : " [dry-run]"}\n`
  );

  const fromRating = loadToughFails();
  const seen = new Set<string>();
  const results: Flagged[] = [];

  for (const f of fromRating) {
    const row = await prisma.questionBankItem.findFirst({
      where: { id: f.id, fieldId: "pharmacy", active: true },
      select: { id: true, question: true },
    });
    if (!row) continue;
    seen.add(row.id);
    results.push({
      id: row.id,
      reason: f.reason,
      stem: row.question.slice(0, 140),
    });
    await quarantine(row.id, "naplex_tough_bar_quarantine");
  }

  // Bank scan: physician-only stems still in serve pool
  let lastId: string | undefined;
  let scanned = 0;
  while (results.length < 200) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        qaPassed: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: 300,
      select: { id: true, question: true },
    });
    if (!rows.length) break;
    for (const row of rows) {
      scanned++;
      lastId = row.id;
      if (seen.has(row.id)) continue;
      const q = row.question.trim();
      if (!PHYSICIAN_DIAG_STEM.test(q) && !PHYSICIAN_ACTION_STEM.test(q)) continue;
      seen.add(row.id);
      results.push({
        id: row.id,
        reason: "physician_stem_scan",
        stem: q.slice(0, 140),
      });
      await quarantine(row.id, "naplex_physician_scope_quarantine");
    }
    if (rows.length < 300) break;
  }

  console.log(`Scanned serve pool: ${scanned}`);
  console.log(
    `${apply ? "Quarantined" : "Would quarantine"}: ${results.length}`
  );
  for (const r of results.slice(0, 20)) {
    console.log(`  · [${r.reason}] ${r.id} — ${r.stem}`);
  }
  if (results.length > 20) console.log(`  … +${results.length - 20} more`);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
