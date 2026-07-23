#!/usr/bin/env node
/**
 * Quarantine USMLE ACS/STEMI template spam + subject mistags (spot-check finding).
 *
 * Rules:
 *  1) ACS-like stem + subjectId biostatistics|ethics → always quarantine
 *  2) ACS-like stem on other subjects → keep up to --keep-per-field (newest), quarantine rest
 *
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-usmle-acs-spam.mts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-usmle-acs-spam.mts --keep-per-field 40
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const REVIEW = "usmle_acs_spam_quarantine";

const FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

const ACS_RE =
  /\b(?:severe )?chest pain radiating|chest pain that started \d+ minutes|ST[- ](?:segment )?elevation|STEMI|plaque rupture|troponin(?:s)? (?:are |is )?(?:elevated|positive)|crushing (?:substernal )?chest pain|left arm(?:\.|,| and)|MONA\b/i;

const MISTAG_SUBJECTS = new Set(["biostatistics", "ethics"]);

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let keepPerField = 40;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--keep-per-field" && args[i + 1])
      keepPerField = Number.parseInt(args[++i]!, 10);
  }
  return { dryRun, keepPerField };
}

async function main() {
  const { dryRun, keepPerField } = parseArgs();
  const report: Record<
    string,
    { scanned: number; acsLike: number; mistag: number; excess: number; quarantined: number }
  > = {};

  console.log(
    `\nACS spam quarantine${dryRun ? " [dry-run]" : ""} · keep≤${keepPerField} non-mistag ACS/step\n`
  );

  for (const fieldId of FIELDS) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, qaPassed: true },
      select: {
        id: true,
        subjectId: true,
        question: true,
        scenario: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const mistagIds: string[] = [];
    const legitAcs: { id: string; updatedAt: Date }[] = [];

    for (const row of rows) {
      const stem = `${row.scenario ?? ""}\n${row.question}`;
      if (!ACS_RE.test(stem)) continue;
      const subj = (row.subjectId ?? "").trim();
      if (MISTAG_SUBJECTS.has(subj)) mistagIds.push(row.id);
      else legitAcs.push({ id: row.id, updatedAt: row.updatedAt });
    }

    // Keep newest keepPerField legit ACS; quarantine older excess
    const excessIds = legitAcs.slice(keepPerField).map((x) => x.id);
    const toQuarantine = [...new Set([...mistagIds, ...excessIds])];

    if (!dryRun && toQuarantine.length > 0) {
      // batch updates
      for (let i = 0; i < toQuarantine.length; i += 200) {
        const chunk = toQuarantine.slice(i, i + 200);
        await prisma.questionBankItem.updateMany({
          where: { id: { in: chunk } },
          data: {
            active: false,
            qaPassed: false,
            reviewStatus: REVIEW,
            updatedAt: new Date(),
          },
        });
      }
    }

    report[fieldId] = {
      scanned: rows.length,
      acsLike: mistagIds.length + legitAcs.length,
      mistag: mistagIds.length,
      excess: excessIds.length,
      quarantined: toQuarantine.length,
    };
    console.log(
      `${fieldId}: acs=${report[fieldId].acsLike} mistag=${report[fieldId].mistag} excess=${report[fieldId].excess} → ${dryRun ? "would q" : "q"} ${report[fieldId].quarantined}`
    );
  }

  const outDir = path.join(process.cwd(), "artifacts");
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "usmle-acs-spam-quarantine.json");
  writeFileSync(
    out,
    JSON.stringify({ dryRun, keepPerField, reviewStatus: REVIEW, checkedAt: new Date().toISOString(), report }, null, 2)
  );
  console.log(`Wrote ${out}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
