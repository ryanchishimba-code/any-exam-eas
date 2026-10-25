#!/usr/bin/env node
/**
 * Cardiac-emergencies cleanup (2026-10-25): retag 48 mis-tagged rows and hide 75 near-duplicates.
 * Source of truth: scripts/data/cardiac-cleanup-20261025/cardiac-scan.json
 *
 *   npx tsx scripts/apply-cardiac-cleanup-20261025.ts --dry-run
 *   npx tsx scripts/apply-cardiac-cleanup-20261025.ts --backup
 *   npx tsx scripts/apply-cardiac-cleanup-20261025.ts --apply
 *   npx tsx scripts/apply-cardiac-cleanup-20261025.ts --verify
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";
import { PrismaClient } from "@prisma/client";
import { allNclex2026TopicSlugs } from "../src/lib/exam-prep/nclex/blueprint-topics-2026";

loadEnvFiles();
ensureDatabaseUrlEnv();

const DATA_DIR = path.join(process.cwd(), "scripts/data/cardiac-cleanup-20261025");
const SCAN_PATH = path.join(DATA_DIR, "cardiac-scan.json");
const BACKUP_PATH = path.join(DATA_DIR, "backup.json");
const UNDO_PATH = path.join(DATA_DIR, "undo.json");
const APPLY_REPORT_PATH = path.join(DATA_DIR, "apply-report.json");

const FIELD_ID = "nursing";
const SOURCE_TOPIC = "cardiac-emergencies";
const EXPECTED_RETAG = 48;
const EXPECTED_HIDE = 75;
const EXPECTED_CLEAN_CARDIAC = 29;

const VALID_SLUGS = new Set(allNclex2026TopicSlugs());

type Scan = {
  wrongTag: { id: string; suggestedBlueprintTopic: string }[];
  nearDuplicateGroups: { keep: string; hide: string[] }[];
};

type UndoRow = {
  id: string;
  blueprintTopic: string | null;
  tags: string | null;
  active: boolean;
};

const prisma = new PrismaClient();

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--apply") && args.has("--dry-run")) {
    throw new Error("Pass either --apply or --dry-run, not both.");
  }
  return {
    dryRun: args.has("--dry-run") || (!args.has("--apply") && !args.has("--backup") && !args.has("--verify")),
    apply: args.has("--apply"),
    backup: args.has("--backup"),
    verify: args.has("--verify"),
  };
}

function loadScan(): Scan {
  const raw = JSON.parse(readFileSync(SCAN_PATH, "utf8")) as Scan;
  return raw;
}

function parseTags(tags: string | null): string[] {
  if (!tags?.trim()) return [];
  try {
    const parsed = JSON.parse(tags) as unknown;
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    /* fall through */
  }
  return tags
    .split(/[|,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function serializeTags(tags: string[]): string {
  return JSON.stringify([...new Set(tags)]);
}

function retagTags(tags: string | null, nextTopic: string): string {
  const list = parseTags(tags).filter((t) => t !== SOURCE_TOPIC && t !== "cardiac emergencies");
  if (!list.includes(nextTopic)) list.push(nextTopic);
  if (!list.includes("cardiac-cleanup-20261025")) list.push("cardiac-cleanup-20261025");
  return serializeTags(list);
}

function resolveTopic(suggested: string): { topic: string; mapped: boolean } {
  const trimmed = suggested.trim();
  if (VALID_SLUGS.has(trimmed)) return { topic: trimmed, mapped: false };
  throw new Error(`Suggested topic "${trimmed}" is not a valid NCLEX 2026 slug.`);
}

function buildPlan(scan: Scan) {
  const retags = scan.wrongTag.map((row) => {
    const { topic, mapped } = resolveTopic(row.suggestedBlueprintTopic);
    return { id: row.id, nextTopic: topic, suggested: row.suggestedBlueprintTopic, slugMapped: mapped };
  });

  const hideIds: string[] = [];
  const keepers = new Set<string>();
  for (const group of scan.nearDuplicateGroups) {
    keepers.add(group.keep);
    hideIds.push(...group.hide);
  }

  if (retags.length !== EXPECTED_RETAG) {
    throw new Error(`Plan abort: expected ${EXPECTED_RETAG} retags, got ${retags.length}.`);
  }
  if (hideIds.length !== EXPECTED_HIDE) {
    throw new Error(`Plan abort: expected ${EXPECTED_HIDE} hides, got ${hideIds.length}.`);
  }

  const retagIds = new Set(retags.map((r) => r.id));
  const hideSet = new Set(hideIds);
  for (const id of retagIds) {
    if (hideSet.has(id)) throw new Error(`Plan abort: id ${id} is both retag and hide.`);
  }
  for (const id of hideIds) {
    if (keepers.has(id)) throw new Error(`Plan abort: keeper ${id} also marked hide.`);
  }
  if (retagIds.size !== EXPECTED_RETAG) {
    throw new Error(`Plan abort: duplicate retag ids (${retagIds.size} unique).`);
  }
  if (hideSet.size !== EXPECTED_HIDE) {
    throw new Error(`Plan abort: duplicate hide ids (${hideSet.size} unique).`);
  }

  const affected = [...new Set([...retagIds, ...hideSet])];
  if (affected.length !== EXPECTED_RETAG + EXPECTED_HIDE) {
    throw new Error(`Plan abort: expected ${EXPECTED_RETAG + EXPECTED_HIDE} affected ids, got ${affected.length}.`);
  }

  return { retags, hideIds: [...hideSet], affected, slugMappings: retags.filter((r) => r.slugMapped) };
}

async function backupRows(ids: string[]) {
  const rows = await prisma.questionBankItem.findMany({
    where: { id: { in: ids } },
  });
  if (rows.length !== ids.length) {
    const found = new Set(rows.map((r) => r.id));
    const missing = ids.filter((id) => !found.has(id));
    throw new Error(`Backup abort: missing ${missing.length} ids: ${missing.slice(0, 5).join(", ")}`);
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    fieldId: FIELD_ID,
    idCount: ids.length,
    rows: rows.sort((a, b) => a.id.localeCompare(b.id)),
  };
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(BACKUP_PATH, JSON.stringify(payload, null, 2));
  console.log(`Wrote backup (${rows.length} rows) → ${BACKUP_PATH}`);
}

async function countLiveNursing(): Promise<number> {
  return prisma.questionBankItem.count({
    where: { fieldId: FIELD_ID, active: true, qaPassed: true },
  });
}

async function countLiveCardiacTagOnly(): Promise<number> {
  return prisma.questionBankItem.count({
    where: {
      fieldId: FIELD_ID,
      active: true,
      qaPassed: true,
      blueprintTopic: SOURCE_TOPIC,
    },
  });
}

async function dryRun(plan: ReturnType<typeof buildPlan>) {
  let wouldRetag = 0;
  let wouldHide = 0;
  let retagDone = 0;
  let hideDone = 0;
  for (const r of plan.retags) {
    const row = await prisma.questionBankItem.findUnique({
      where: { id: r.id },
      select: { id: true, fieldId: true, blueprintTopic: true, active: true, qaPassed: true },
    });
    if (!row || row.fieldId !== FIELD_ID) throw new Error(`Dry-run abort: retag id ${r.id} missing or wrong field.`);
    if (row.blueprintTopic === r.nextTopic) {
      retagDone += 1;
      continue;
    }
    if (row.blueprintTopic !== SOURCE_TOPIC) {
      throw new Error(
        `Dry-run abort: retag id ${r.id} has blueprintTopic=${row.blueprintTopic ?? "null"}, expected ${SOURCE_TOPIC} or ${r.nextTopic}.`
      );
    }
    wouldRetag += 1;
  }
  for (const id of plan.hideIds) {
    const row = await prisma.questionBankItem.findUnique({
      where: { id },
      select: { id: true, fieldId: true, active: true, blueprintTopic: true },
    });
    if (!row || row.fieldId !== FIELD_ID) throw new Error(`Dry-run abort: hide id ${id} missing or wrong field.`);
    if (!row.active) {
      hideDone += 1;
      continue;
    }
    wouldHide += 1;
  }

  console.log(
    `Dry-run: would retag ${wouldRetag}, already retagged ${retagDone} (plan ${plan.retags.length}); would hide ${wouldHide}, already hidden ${hideDone} (plan ${plan.hideIds.length}).`
  );
  if (retagDone + wouldRetag !== EXPECTED_RETAG || hideDone + wouldHide !== EXPECTED_HIDE) {
    throw new Error(
      `Dry-run abort: retag/hide state does not match plan (expected ${EXPECTED_RETAG} retag, ${EXPECTED_HIDE} hide).`
    );
  }
  if (wouldRetag > 0 || wouldHide > 0) {
    if (wouldRetag !== EXPECTED_RETAG || wouldHide !== EXPECTED_HIDE) {
      throw new Error(
        `Dry-run abort: partial apply detected (would retag ${wouldRetag}, would hide ${wouldHide}). Finish or undo first.`
      );
    }
  }
}

async function apply(plan: ReturnType<typeof buildPlan>) {
  const undo: UndoRow[] = [];
  const beforeLive = await countLiveNursing();
  const beforeCardiac = await countLiveCardiacTagOnly();

  await prisma.$transaction(async (tx) => {
    for (const r of plan.retags) {
      const row = await tx.questionBankItem.findUnique({ where: { id: r.id } });
      if (!row) throw new Error(`Apply abort: missing ${r.id}`);
      if (row.fieldId !== FIELD_ID) throw new Error(`Apply abort: ${r.id} wrong fieldId`);
      if (row.blueprintTopic === r.nextTopic) continue;
      if (row.blueprintTopic !== SOURCE_TOPIC) {
        throw new Error(`Apply abort: ${r.id} blueprintTopic=${row.blueprintTopic ?? "null"}`);
      }
      undo.push({
        id: row.id,
        blueprintTopic: row.blueprintTopic,
        tags: row.tags,
        active: row.active,
      });
      await tx.questionBankItem.update({
        where: { id: row.id },
        data: {
          blueprintTopic: r.nextTopic,
          tags: retagTags(row.tags, r.nextTopic),
          updatedAt: new Date(),
        },
      });
    }

    for (const id of plan.hideIds) {
      const row = await tx.questionBankItem.findUnique({ where: { id } });
      if (!row) throw new Error(`Apply abort: missing hide ${id}`);
      if (row.fieldId !== FIELD_ID) throw new Error(`Apply abort: hide ${id} wrong fieldId`);
      if (!row.active) continue;
      undo.push({
        id: row.id,
        blueprintTopic: row.blueprintTopic,
        tags: row.tags,
        active: row.active,
      });
      await tx.questionBankItem.update({
        where: { id },
        data: { active: false, updatedAt: new Date() },
      });
    }
  });

  const afterLive = await countLiveNursing();
  const afterCardiac = await countLiveCardiacTagOnly();

  const report = {
    appliedAt: new Date().toISOString(),
    before: { liveNursingQaPassed: beforeLive, liveCardiacEmergenciesTagOnly: beforeCardiac },
    after: { liveNursingQaPassed: afterLive, liveCardiacEmergenciesTagOnly: afterCardiac },
    undoRowCount: undo.length,
    slugMappings: plan.slugMappings,
  };

  writeFileSync(UNDO_PATH, JSON.stringify({ generatedAt: report.appliedAt, rows: undo }, null, 2));
  writeFileSync(APPLY_REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Wrote undo (${undo.length} rows) → ${UNDO_PATH}`);
  console.log(`Wrote apply report → ${APPLY_REPORT_PATH}`);
  console.log(JSON.stringify(report, null, 2));
}

async function verify(plan: ReturnType<typeof buildPlan>) {
  const cardiac = await countLiveCardiacTagOnly();
  const live = await countLiveNursing();

  const retagChecks = await prisma.questionBankItem.findMany({
    where: { id: { in: plan.retags.map((r) => r.id) } },
    select: { id: true, active: true, qaPassed: true, blueprintTopic: true },
  });
  const retagOk = retagChecks.every(
    (r) => r.active && r.qaPassed && plan.retags.find((p) => p.id === r.id)?.nextTopic === r.blueprintTopic
  );

  const hideChecks = await prisma.questionBankItem.findMany({
    where: { id: { in: plan.hideIds } },
    select: { id: true, active: true },
  });
  const hideOk = hideChecks.every((r) => !r.active);

  console.log(
    JSON.stringify(
      {
        liveCardiacEmergenciesTagOnly: cardiac,
        expectedCardiac: EXPECTED_CLEAN_CARDIAC,
        liveNursingQaPassed: live,
        retagLiveUnderNewTopics: retagOk,
        hidesInactive: hideOk,
      },
      null,
      2
    )
  );

  if (cardiac !== EXPECTED_CLEAN_CARDIAC) {
    throw new Error(`Verify failed: cardiac-emergencies live count ${cardiac}, expected ${EXPECTED_CLEAN_CARDIAC}.`);
  }
  if (!retagOk) throw new Error("Verify failed: retagged items not live under new topics.");
  if (!hideOk) throw new Error("Verify failed: some hide ids still active.");
}

async function main() {
  const args = parseArgs();
  const scan = loadScan();
  const plan = buildPlan(scan);

  if (plan.slugMappings.length) {
    console.log("Slug mappings:", plan.slugMappings);
  } else {
    console.log("Slug mappings: none (all suggested topics are valid NCLEX 2026 slugs).");
  }

  if (args.backup) {
    await backupRows(plan.affected);
    return;
  }

  if (args.verify) {
    await verify(plan);
    return;
  }

  if (args.dryRun) {
    await dryRun(plan);
    return;
  }

  if (args.apply) {
    await dryRun(plan);
    const pending =
      (await prisma.questionBankItem.count({
        where: {
          id: { in: plan.retags.map((r) => r.id) },
          blueprintTopic: SOURCE_TOPIC,
        },
      })) +
      (await prisma.questionBankItem.count({
        where: { id: { in: plan.hideIds }, active: true },
      }));
    if (pending > 0) {
      await apply(plan);
    } else {
      console.log("Apply: no pending retags or hides (already applied).");
    }
    await verify(plan);
    return;
  }

  throw new Error("No mode selected.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
