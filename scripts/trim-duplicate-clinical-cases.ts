#!/usr/bin/env node
/**
 * Retire duplicate clinical cases (keep best per vignette) and optionally cap
 * identical question stems. Targets template-heavy banks (NCLEX, PANCE, …).
 *
 *   npm run db:trim-duplicate-cases:dry
 *   npm run db:trim-duplicate-cases -- --fields nursing,pance
 *   npm run db:trim-duplicate-cases -- --fields nursing --stem-cap 80
 *   npm run db:trim-duplicate-cases -- --fields all --stem-cap-nursing 80
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import type { BankItem } from "../src/lib/question-bank";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  applyStemCap,
  buildRankedRow,
  pickBestPerSessionDedupeKey,
  summarizeDedupe,
  type RankedBankRow,
} from "../src/lib/exam-prep/clinical-case-dedupe";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { nclexBankItemIsServeReady } from "../src/lib/exam-prep/nclex-serve-gate";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { naplexBankItemIsServeReady, prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { assessPanceBankItem } from "../src/lib/exam-prep/pance/quality-gate";
import { assessAanpFnpBankItem } from "../src/lib/exam-prep/aanp-fnp/quality-gate";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { nptePtBankItemIsServeReady } from "../src/lib/exam-prep/npte-pt/clinical-gate";

const prisma = new PrismaClient();
const BATCH = 500;
const RETIRE_CHUNK = 500;
const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "trim-duplicate-clinical-cases.json");

type FieldSpec = {
  fieldId: string;
  label: string;
  defaultStemCap: number;
  rank: (item: BankItem, source: string | null) => { rank: number; serveReady: boolean };
};

const FIELD_SPECS: Record<string, FieldSpec> = {
  nursing: {
    fieldId: "nursing",
    label: "NCLEX",
    defaultStemCap: 3,
    rank: (item, source) => {
      const verdict = assessNclexItemQuality(item, { source });
      const serveReady = nclexBankItemIsServeReady(item, { source });
      const tier = verdict.tier === "best" ? 3 : verdict.tier === "acceptable" ? 2 : 0;
      return {
        serveReady,
        rank: tier * 1000 + verdict.score * 100 - verdict.issues.length + (serveReady ? 50 : 0),
      };
    },
  },
  pance: {
    fieldId: "pance",
    label: "PANCE",
    defaultStemCap: 0,
    rank: (item) => {
      const qc = assessPanceBankItem(item);
      return {
        serveReady: qc.serveReady,
        rank: qc.qcScore * 100 + (qc.serveReady ? 200 : 0) - qc.flags.length * 15,
      };
    },
  },
  pharmacy: {
    fieldId: "pharmacy",
    label: "NAPLEX",
    defaultStemCap: 60,
    rank: (item, source) => {
      const prepared = prepareNaplexBankItem(item);
      const verdict = assessNaplexItemQuality(prepared, { source: source ?? prepared.source ?? null });
      const serveReady = naplexBankItemIsServeReady(prepared, { source: source ?? prepared.source ?? null });
      const tier = verdict.tier === "best" ? 3 : verdict.tier === "acceptable" ? 2 : 0;
      return {
        serveReady,
        rank: tier * 1000 + verdict.score * 100 - verdict.issues.length + (serveReady ? 50 : 0),
      };
    },
  },
  "usmle-step-2": {
    fieldId: "usmle-step-2",
    label: "USMLE Step 2 CK",
    defaultStemCap: 40,
    rank: (item, source) => {
      const serveReady = usmleBankItemIsServeReady(item, "usmle-step-2");
      const report = auditUsmleQaEditor(item, {
        fieldId: "usmle-step-2",
        source,
        itemId: item.id,
        difficulty: item.difficulty ?? null,
      });
      return {
        serveReady,
        rank: (report.overallScore ?? 0) * 100 + (report.examReady ? 300 : 0) - report.issues.filter((i) => i.severity === "error").length * 20,
      };
    },
  },
  "usmle-step-1": {
    fieldId: "usmle-step-1",
    label: "USMLE Step 1",
    defaultStemCap: 40,
    rank: (item, source) => {
      const serveReady = usmleBankItemIsServeReady(item, "usmle-step-1");
      const report = auditUsmleQaEditor(item, {
        fieldId: "usmle-step-1",
        source,
        itemId: item.id,
        difficulty: item.difficulty ?? null,
      });
      return {
        serveReady,
        rank: (report.overallScore ?? 0) * 100 + (report.examReady ? 300 : 0) - report.issues.filter((i) => i.severity === "error").length * 20,
      };
    },
  },
  "usmle-step-3": {
    fieldId: "usmle-step-3",
    label: "USMLE Step 3",
    defaultStemCap: 40,
    rank: (item, source) => {
      const serveReady = usmleBankItemIsServeReady(item, "usmle-step-3");
      const report = auditUsmleQaEditor(item, {
        fieldId: "usmle-step-3",
        source,
        itemId: item.id,
        difficulty: item.difficulty ?? null,
      });
      return {
        serveReady,
        rank: (report.overallScore ?? 0) * 100 + (report.examReady ? 300 : 0) - report.issues.filter((i) => i.severity === "error").length * 20,
      };
    },
  },
  "aanp-fnp": {
    fieldId: "aanp-fnp",
    label: "AANP FNP",
    defaultStemCap: 50,
    rank: (item) => {
      const qc = assessAanpFnpBankItem(item);
      return {
        serveReady: qc.serveReady,
        rank: qc.qcScore * 100 + (qc.serveReady ? 200 : 0) - qc.flags.length * 15,
      };
    },
  },
  "npte-pt": {
    fieldId: "npte-pt",
    label: "NPTE-PT",
    defaultStemCap: 0,
    rank: (item, source) => {
      const serveReady = nptePtBankItemIsServeReady(item, source);
      return { serveReady, rank: (serveReady ? 500 : 0) + (item.explanation?.length ?? 0) / 10 };
    },
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let fields = "nursing,pance";
  let stemCapOverride: number | undefined;
  const stemCapByField: Record<string, number> = {};

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--dry-run") dryRun = true;
    else if (a === "--fields" && args[i + 1]) fields = args[++i]!;
    else if (a === "--stem-cap" && args[i + 1]) stemCapOverride = Number.parseInt(args[++i]!, 10);
    else if (a.startsWith("--stem-cap-") && args[i + 1]) {
      const key = a.slice("--stem-cap-".length);
      stemCapByField[key] = Number.parseInt(args[++i]!, 10);
    }
  }

  const fieldIds =
    fields === "all"
      ? Object.keys(FIELD_SPECS)
      : fields.split(",").map((f) => f.trim()).filter(Boolean);

  return { dryRun, fieldIds, stemCapOverride, stemCapByField };
}

async function loadActiveRows(fieldId: string) {
  const rows: RankedBankRow[] = [];
  let lastId: string | undefined;
  const spec = FIELD_SPECS[fieldId]!;

  while (true) {
    const batch = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (!batch.length) break;

    for (const row of batch) {
      const item = enrichBankItemFromRow(row);
      const { rank, serveReady } = spec.rank(item, row.source ?? null);
      rows.push(buildRankedRow(row.id, item, rank, serveReady));
    }

    lastId = batch[batch.length - 1]!.id;
  }

  return rows;
}

async function deactivateBankIds(ids: string[], dryRun: boolean) {
  if (dryRun || ids.length === 0) return;
  const now = new Date();
  for (let i = 0; i < ids.length; i += RETIRE_CHUNK) {
    const chunk = ids.slice(i, i + RETIRE_CHUNK);
    await prisma.questionBankItem.updateMany({
      where: { id: { in: chunk } },
      data: { active: false, qaPassed: false, qaAuditedAt: now },
    });
  }
}

async function markKeptServeReady(ids: string[], dryRun: boolean) {
  if (dryRun || ids.length === 0) return;
  const now = new Date();
  for (let i = 0; i < ids.length; i += RETIRE_CHUNK) {
    const chunk = ids.slice(i, i + RETIRE_CHUNK);
    await prisma.questionBankItem.updateMany({
      where: { id: { in: chunk } },
      data: { active: true, qaPassed: true, qaAuditedAt: now },
    });
  }
}

function stemCapForField(
  fieldId: string,
  override: number | undefined,
  byField: Record<string, number>
): number {
  if (byField[fieldId] != null) return byField[fieldId]!;
  if (override != null) return override;
  return FIELD_SPECS[fieldId]?.defaultStemCap ?? 0;
}

async function trimField(
  fieldId: string,
  dryRun: boolean,
  stemCapOverride: number | undefined,
  stemCapByField: Record<string, number>
) {
  const spec = FIELD_SPECS[fieldId];
  if (!spec) throw new Error(`Unknown field: ${fieldId}`);

  const stemCap = stemCapForField(fieldId, stemCapOverride, stemCapByField);
  console.log(`\n=== ${spec.label} (${fieldId}) ===`);

  const allRows = await loadActiveRows(fieldId);
  console.log(`  active rows scanned: ${allRows.length}`);

  const casePass = pickBestPerSessionDedupeKey(allRows);
  let keep = casePass.keep;
  let retire = [...casePass.retire];

  const afterCase = summarizeDedupe(allRows.length, keep, retire);
  console.log(
    `  after session dedupe (vignette + stem + choices): keep ${afterCase.kept}, retire ${afterCase.retired} (${afterCase.uniqueClinicalCases} unique keys)`
  );

  if (stemCap > 0) {
    const stemPass = applyStemCap(keep, stemCap);
    keep = stemPass.keep;
    retire = [...retire, ...stemPass.retire];
    const afterStem = summarizeDedupe(allRows.length, keep, retire);
    console.log(
      `  after stem cap (${stemCap}/stem): keep ${afterStem.kept}, total retire ${afterStem.retired} (${afterStem.uniqueStems} unique stems)`
    );
  }

  const keepIds = new Set(keep.filter((r) => r.serveReady).map((r) => r.id));
  const notServeReadyKeep = keep.filter((r) => !r.serveReady).map((r) => r.id);
  const idsToRetire = [
    ...new Set([
      ...retire.map((r) => r.id),
      ...notServeReadyKeep,
      ...allRows.filter((r) => !keepIds.has(r.id)).map((r) => r.id),
    ]),
  ];

  const summary = summarizeDedupe(
    allRows.length,
    keep.filter((r) => keepIds.has(r.id)),
    idsToRetire.map((id) => allRows.find((r) => r.id === id)!).filter(Boolean)
  );

  if (!dryRun) {
    await deactivateBankIds(idsToRetire, dryRun);
    await markKeptServeReady([...keepIds], dryRun);
    console.log(`  ✓ retired ${idsToRetire.length}, kept ${keepIds.size} serve-ready`);
  } else {
    console.log(`  [dry-run] would retire ${idsToRetire.length}, keep ${keepIds.size}`);
  }

  return {
    fieldId,
    label: spec.label,
    stemCap,
    ...summary,
    topRetiredCases: retire
      .slice(0, 5)
      .map((r) => ({ id: r.id, caseKey: r.clinicalCaseKey.slice(0, 72), rank: r.rank })),
  };
}

async function main() {
  const { dryRun, fieldIds, stemCapOverride, stemCapByField } = parseArgs();
  console.log(`\nTrim duplicate clinical cases${dryRun ? " [dry-run]" : ""}`);
  console.log(`Fields: ${fieldIds.join(", ")}`);

  const reports = [];
  for (const fieldId of fieldIds) {
    if (!FIELD_SPECS[fieldId]) {
      console.warn(`Skipping unknown field: ${fieldId}`);
      continue;
    }
    reports.push(await trimField(fieldId, dryRun, stemCapOverride, stemCapByField));
  }

  mkdirSync(join(ROOT, "artifacts"), { recursive: true });
  writeFileSync(
    LOG,
    JSON.stringify({ at: new Date().toISOString(), dryRun, reports }, null, 2)
  );
  console.log(`\nReport: ${LOG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
