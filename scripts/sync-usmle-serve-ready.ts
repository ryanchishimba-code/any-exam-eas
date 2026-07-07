#!/usr/bin/env node
/**
 * Sync USMLE bank rows for production serve: qaPassed ↔ exam-ready pool,
 * valid subjectId/topicCategory/stepLevel aligned with website topic filters.
 *
 * Usage:
 *   npm run db:sync-usmle-serve-ready
 *   npm run db:sync-usmle-serve-ready -- --trust-active   # skip per-item audit (fast)
 *   npm run db:sync-usmle-serve-ready -- --subjects-only  # remap orphan subjectIds only
 *   npm run db:sync-usmle-serve-ready -- --dry-run
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { usmleFieldIdToStepLevel } from "../src/lib/exam-prep/usmle/steps";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { getSubjectsForFieldId, getSubjectArea } from "../src/lib/subjects/registry";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const BATCH = 400;
const UPDATE_CHUNK = 500;

const dryRun = process.argv.includes("--dry-run");
const trustActive = process.argv.includes("--trust-active");
const subjectsOnly = process.argv.includes("--subjects-only");

const SUBJECT_ALIASES: Record<string, Record<string, string>> = {
  "usmle-step-1": {
    immunology: "microbiology",
    "microbiology-immunology": "microbiology",
    biochem: "biochemistry",
    pharma: "pharmacology",
    path: "pathology",
    physio: "physiology",
  },
  "usmle-step-2": {
    "internal medicine": "internal-medicine",
    im: "internal-medicine",
    ob: "obgyn",
    "ob-gyn": "obgyn",
    em: "emergency-medicine",
    neuro: "neurology",
    cardio: "cardiology",
    pulm: "pulmonology",
    renal: "nephrology",
    peds: "pediatrics",
    psych: "psychiatry",
    biostats: "internal-medicine",
    biostatistics: "internal-medicine",
    ethics: "internal-medicine",
  },
  "usmle-step-3": {
    "internal medicine": "internal-medicine",
    im: "internal-medicine",
    ob: "obgyn",
    "ob-gyn": "obgyn",
    em: "emergency-medicine",
    neuro: "neurology",
    cardio: "cardiology",
    pulm: "pulmonology",
    renal: "nephrology",
    peds: "pediatrics",
    psych: "psychiatry",
    biostats: "internal-medicine",
    biostatistics: "internal-medicine",
    ethics: "internal-medicine",
    pharmacology: "internal-medicine",
    pharma: "internal-medicine",
    endocrinology: "internal-medicine",
    gastroenterology: "internal-medicine",
    ophthalmology: "internal-medicine",
    "infectious-disease": "internal-medicine",
    obstetrics: "obgyn",
    surgery: "emergency-medicine",
  },
};

function resolveSubjectId(fieldId: string, subjectId: string): string {
  const subjects = getSubjectsForFieldId(fieldId);
  const valid = new Set(subjects.map((s) => s.id));
  if (valid.has(subjectId)) return subjectId;

  const normalized = subjectId.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
  if (valid.has(normalized)) return normalized;

  const alias = SUBJECT_ALIASES[fieldId]?.[normalized] ?? SUBJECT_ALIASES[fieldId]?.[subjectId.toLowerCase()];
  if (alias && valid.has(alias)) return alias;

  const byLabel = subjects.find(
    (s) => s.label.toLowerCase() === subjectId.toLowerCase().replace(/-/g, " ")
  );
  if (byLabel) return byLabel.id;

  return fieldId === "usmle-step-1" ? "pathology" : "internal-medicine";
}

type RowPatch = {
  qaPassed?: boolean;
  active?: boolean;
  subjectId?: string;
  topicCategory?: string;
  stepLevel?: string;
  qaAuditedAt?: Date;
};

function patchKey(patch: RowPatch): string {
  return JSON.stringify(patch, (_, v) => (v instanceof Date ? v.toISOString() : v));
}

async function applyPatches(groups: Map<string, { patch: RowPatch; ids: string[] }>) {
  for (const { patch, ids } of groups.values()) {
    for (let i = 0; i < ids.length; i += UPDATE_CHUNK) {
      const chunk = ids.slice(i, i + UPDATE_CHUNK);
      if (dryRun) continue;
      await prisma.questionBankItem.updateMany({
        where: { id: { in: chunk } },
        data: patch,
      });
    }
  }
}

async function syncField(fieldId: (typeof USMLE_FIELDS)[number]) {
  const stepLevel = usmleFieldIdToStepLevel(fieldId);
  const validSubjects = new Set(getSubjectsForFieldId(fieldId).map((s) => s.id));

  let lastId: string | undefined;
  let processed = 0;
  let subjectFixed = 0;
  let retired = 0;
  let qaToggled = 0;
  const orphanBefore = new Map<string, number>();

  const patchGroups = new Map<string, { patch: RowPatch; ids: string[] }>();

  function queuePatch(id: string, patch: RowPatch) {
    const key = patchKey(patch);
    const existing = patchGroups.get(key);
    if (existing) existing.ids.push(id);
    else patchGroups.set(key, { patch, ids: [id] });
  }

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId,
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;
    lastId = rows[rows.length - 1]!.id;

    for (const row of rows) {
      processed++;
      if (!validSubjects.has(row.subjectId)) {
        orphanBefore.set(row.subjectId, (orphanBefore.get(row.subjectId) ?? 0) + 1);
      }

      const subjectId = resolveSubjectId(fieldId, row.subjectId);
      const subjectArea = getSubjectArea(fieldId, subjectId);
      const topicCategory = subjectArea?.label ?? row.topicCategory ?? subjectId;

      const patch: RowPatch = {};
      if (subjectId !== row.subjectId) {
        patch.subjectId = subjectId;
        subjectFixed++;
      }
      if (topicCategory !== row.topicCategory) patch.topicCategory = topicCategory;
      if (stepLevel && row.stepLevel !== stepLevel) patch.stepLevel = stepLevel;

      if (subjectsOnly) {
        // subject/topic/stepLevel patches only — handled below
      } else if (trustActive) {
        if (!row.qaPassed) {
          patch.qaPassed = true;
          patch.qaAuditedAt = new Date();
          qaToggled++;
        }
      } else {
        const item = enrichBankItemFromRow(row);
        const shouldServe = usmleBankItemIsServeReady(item, fieldId);
        if (row.qaPassed !== shouldServe) {
          patch.qaPassed = shouldServe;
          qaToggled++;
        }
        if (!shouldServe) {
          patch.active = false;
          patch.qaPassed = false;
          retired++;
        } else {
          patch.qaAuditedAt = new Date();
        }
      }

      if (Object.keys(patch).length === 0) continue;
      queuePatch(row.id, patch);
    }

    if (patchGroups.size >= 20) {
      await applyPatches(patchGroups);
      patchGroups.clear();
    }
  }

  await applyPatches(patchGroups);

  const served = await prisma.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true },
  });

  const orphanServed = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId, active: true, qaPassed: true },
    _count: { id: true },
  });
  const orphansRemaining = orphanServed.filter((r) => !validSubjects.has(r.subjectId));

  console.log(`  ${fieldId}: ${served} serve-ready (${processed} active scanned)`);
  if (subjectFixed) console.log(`    subject/topic fixes: ${subjectFixed}`);
  if (retired) console.log(`    retired (not exam-ready): ${retired}`);
  if (qaToggled) console.log(`    qaPassed updates: ${qaToggled}`);
  if (orphanBefore.size) {
    console.log(
      `    orphan subjects remapped: ${[...orphanBefore.entries()].map(([k, n]) => `${k}(${n})`).join(", ")}`
    );
  }
  if (orphansRemaining.length) {
    console.log(
      `    ⚠ orphan subjectIds still served: ${orphansRemaining.map((r) => `${r.subjectId}(${r._count.id})`).join(", ")}`
    );
  }

  return { served, orphansRemaining: orphansRemaining.length };
}

async function main() {
  const mode = subjectsOnly ? "subjects-only" : trustActive ? "trust-active" : "exam-ready audit";
  console.log(`\nUSMLE serve sync (${mode})${dryRun ? " [dry-run]" : ""}\n`);

  if (!dryRun) {
    await prisma.questionBankItem.updateMany({
      where: { fieldId: { in: [...USMLE_FIELDS] }, active: false },
      data: { qaPassed: false },
    });
  }

  let totalServed = 0;
  for (const fieldId of USMLE_FIELDS) {
    const { served } = await syncField(fieldId);
    totalServed += served;
  }

  console.log(`\nTotal serve-ready: ${totalServed.toLocaleString()}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
