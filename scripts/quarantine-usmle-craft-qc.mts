#!/usr/bin/env node
/**
 * P0 QC: quarantine craft mismatches + near-duplicate stem clusters (USMLE S1–S3).
 *
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-usmle-craft-qc.mts --dry-run
 *   bash scripts/run-with-node.sh npx tsx scripts/quarantine-usmle-craft-qc.mts --keep-per-cluster 2
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const REVIEW = "usmle_craft_qc_quarantine";
const FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
/** Typed Step3 formats share short lead-ins — clone clustering would wipe CCS/abstract/drug_ad banks. */
const SKIP_CLONE_ITEM_TYPES = new Set(["abstract", "drug_ad", "ccs_prompt"]);

/** Spot-check style mismatches */
const ENZYME_HORMONE_RE =
  /which (?:of the following )?(?:enzyme|enzymatic)|enzyme deficiency/i;
const INSULIN_DKA_RE = /\b(?:DKA|diabetic ketoacidosis|insulin)\b/i;
const MICROBE_WITHOUT_UA_RE =
  /which (?:of the following )?(?:microorganism|organism|pathogen)/i;
const UTI_CLUE_RE = /\b(?:dysuria|urinalysis|UA\b|pyuria|nitrite|leukocyte esterase|UTI|cystitis|flank pain)\b/i;
const ACS_RE =
  /\b(?:chest pain radiating|STEMI|ST[- ]elevation|plaque rupture|crushing (?:substernal )?chest pain)\b/i;
const BIOSTATS_ETHICS = new Set(["biostatistics", "ethics"]);

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let keepPerCluster = 2;
  let maxExcessPerField = 400;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--keep-per-cluster" && args[i + 1])
      keepPerCluster = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--max-excess" && args[i + 1])
      maxExcessPerField = Number.parseInt(args[++i]!, 10);
  }
  return { dryRun, keepPerCluster: Math.max(1, keepPerCluster), maxExcessPerField };
}

function normalizeStem(scenario: string | null, question: string): string {
  const q = question.replace(/\s+/g, " ").trim().toLowerCase();
  const sc = (scenario ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  // Generic stems ("next step?") need vignette identity; specific stems can key on question alone.
  if (q.length < 90) {
    return `${sc.slice(0, 140)}||${q}`;
  }
  return `${sc.slice(0, 60)}||${q.slice(0, 160)}`;
}

function clusterKey(norm: string): string {
  return createHash("sha1").update(norm).digest("hex").slice(0, 16);
}

function isMismatch(stem: string, subjectId: string, question: string): string | null {
  const subj = subjectId.trim();
  if (ACS_RE.test(stem) && BIOSTATS_ETHICS.has(subj)) return "acs_mistag";
  if (ENZYME_HORMONE_RE.test(question) && INSULIN_DKA_RE.test(stem)) return "enzyme_hormone";
  if (MICROBE_WITHOUT_UA_RE.test(question) && !UTI_CLUE_RE.test(stem)) return "microbe_no_ua";
  return null;
}

async function quarantineIds(ids: string[], dryRun: boolean) {
  if (ids.length === 0) return 0;
  if (dryRun) return ids.length;
  let n = 0;
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const res = await prisma.questionBankItem.updateMany({
      where: { id: { in: chunk } },
      data: {
        active: false,
        qaPassed: false,
        reviewStatus: REVIEW,
        updatedAt: new Date(),
      },
    });
    n += res.count;
  }
  return n;
}

async function main() {
  const { dryRun, keepPerCluster, maxExcessPerField } = parseArgs();
  const report: Record<
    string,
    {
      scanned: number;
      mismatch: Record<string, number>;
      clusterExcess: number;
      bigClusters: number;
      quarantined: number;
    }
  > = {};

  console.log(
    `\nCraft QC quarantine${dryRun ? " [dry-run]" : ""} · keep≤${keepPerCluster}/cluster · maxExcess=${maxExcessPerField}/field\n`
  );

  for (const fieldId of FIELDS) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, qaPassed: true },
      select: {
        id: true,
        subjectId: true,
        itemType: true,
        question: true,
        scenario: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const mismatchIds: string[] = [];
    const mismatchCounts: Record<string, number> = {};
    const clusters = new Map<string, string[]>();

    for (const row of rows) {
      const stem = `${row.scenario ?? ""}\n${row.question}`;
      const reason = isMismatch(stem, row.subjectId ?? "", row.question);
      if (reason) {
        mismatchIds.push(row.id);
        mismatchCounts[reason] = (mismatchCounts[reason] ?? 0) + 1;
        continue;
      }
      // Keep typed formats out of stem-clone caps (P3 serve targets).
      if (SKIP_CLONE_ITEM_TYPES.has(row.itemType ?? "")) continue;
      const key = clusterKey(normalizeStem(row.scenario, row.question));
      const list = clusters.get(key) ?? [];
      list.push(row.id);
      clusters.set(key, list);
    }

    // Largest clone clusters first; cap excess quarantine per field
    const ranked = [...clusters.values()]
      .filter((ids) => ids.length >= 4)
      .sort((a, b) => b.length - a.length);

    const excessIds: string[] = [];
    for (const ids of ranked) {
      if (excessIds.length >= maxExcessPerField) break;
      const drop = ids.slice(keepPerCluster);
      for (const id of drop) {
        if (excessIds.length >= maxExcessPerField) break;
        excessIds.push(id);
      }
    }

    const toQ = [...new Set([...mismatchIds, ...excessIds])];
    const quarantined = await quarantineIds(toQ, dryRun);

    report[fieldId] = {
      scanned: rows.length,
      mismatch: mismatchCounts,
      clusterExcess: excessIds.length,
      bigClusters: ranked.length,
      quarantined,
    };
    console.log(
      `${fieldId}: mismatch=${mismatchIds.length} (${JSON.stringify(mismatchCounts)}) cloneClusters=${ranked.length} excessCap=${excessIds.length} → ${dryRun ? "would q" : "q"} ${quarantined}`
    );
  }

  const outDir = path.join(process.cwd(), "artifacts");
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "usmle-craft-qc-quarantine.json");
  writeFileSync(
    out,
    JSON.stringify(
      {
        dryRun,
        keepPerCluster,
        maxExcessPerField,
        reviewStatus: REVIEW,
        checkedAt: new Date().toISOString(),
        report,
      },
      null,
      2
    )
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
