#!/usr/bin/env node
/**
 * Give NGN cases NP001 and NP008 ageMonths 4 on new published catalog versions.
 *
 * Both histories say 4-month-old and patient.age is 0. Students see the highest
 * published version, so this inserts the next case version and copies that
 * version's items. Stems, options, keys, rationales, and the chart are copied.
 * NN001 and NN002 are newborns and are not changed. Previous versions stay.
 *
 * Default is a dry run. Nothing is written.
 *
 *   npx tsx scripts/ngn/set-np001-age-months.ts
 *   NGN_INFANT_AGE_CONFIRM=NP001,NP008 npx tsx scripts/ngn/set-np001-age-months.ts --apply --production --backup-dir /tmp/infant-age
 *
 * --apply requires NGN_INFANT_AGE_CONFIRM=NP001,NP008.
 * --production is required for the approved production write. Without it,
 * --apply still refuses when VERCEL_ENV=production.
 * This script never reads or writes QuestionBankItem.
 * Rollback SQL is written and is not executed.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INFANT_AGE_CONFIRM,
  infantAgeRollbackSql,
  patientWithAgeMonths,
  planInfantAgeCatalog,
  type InfantAgeInsert,
  type InfantAgePlan,
} from "../../src/lib/assessment/infant-age-catalog";
import { loadEnvFiles } from "../load-env";

type AgeZeroRow = {
  id: string;
  version: number;
  status: string;
  display_name: string | null;
  history: string | null;
};

type CaseRow = {
  id: string;
  version: number;
  batchId: string;
  boardProfile: string;
  status: string;
  title: string;
  primaryClientNeed: string;
  setting: string;
  patient: unknown;
  timepoints: unknown;
  chart: unknown;
  revealRule: string;
  references: unknown;
  manualCorrection: boolean;
  supersedesId: string | null;
};

type ItemRow = {
  id: string;
  version: number;
  batchId: string;
  caseId: string | null;
  caseVersion: number | null;
  caseStep: number | null;
  itemType: string;
  cjmmFunction: unknown;
  timepoint: string | null;
  responseFormat: string;
  scoringRule: string;
  maxPoints: number;
  stem: string;
  payload: unknown;
  exhibit: unknown;
  rationale: unknown;
  clientNeeds: unknown;
  references: unknown;
  rnFlags: unknown;
  status: string;
  manualCorrection: boolean;
  supersedesId: string | null;
};

type Db = {
  $transaction: <T>(fn: (tx: Db) => Promise<T>) => Promise<T>;
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
  ngnCase: {
    findMany: () => Promise<CaseRow[]>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  ngnItem: {
    findMany: () => Promise<ItemRow[]>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  $disconnect: () => Promise<void>;
};

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function narrativeOf(patient: unknown, chart: unknown): string {
  const history =
    patient && typeof patient === "object" && !Array.isArray(patient) && typeof (patient as { history?: unknown }).history === "string"
      ? (patient as { history: string }).history
      : "";
  return `${history}\n${JSON.stringify(chart ?? "")}`;
}

function printPlan(plan: InfantAgePlan) {
  if (plan.action === "noop") {
    console.log(`noop: ${plan.reason}`);
    return;
  }
  if (plan.action === "error") {
    console.log(`error: ${plan.message}`);
    return;
  }
  console.log(
    `insert ngn_case ${plan.caseId} v${plan.caseVersion} from v${plan.fromCaseVersion} with ageMonths ${plan.ageMonths}`
  );
  for (const item of plan.items) {
    console.log(`insert ngn_item ${item.id} v${item.version} from v${item.fromVersion} caseVersion ${plan.caseVersion}`);
  }
}

function printAgeZero(rows: AgeZeroRow[]) {
  console.log(`published-or-not cases with patient.age 0: ${rows.length}`);
  for (const row of rows) {
    console.log(`  ${row.id} v${row.version} ${row.status} ${row.display_name ?? ""} — ${(row.history ?? "").replace(/\s+/g, " ")}`);
  }
}

async function loadRows(db: Db): Promise<{ cases: CaseRow[]; items: ItemRow[]; ageZero: AgeZeroRow[] }> {
  const [cases, items, ageZero] = await Promise.all([
    db.ngnCase.findMany(),
    db.ngnItem.findMany(),
    db.$queryRaw<AgeZeroRow[]>`
      SELECT id, version, status,
             patient->>'displayName' AS display_name,
             left(coalesce(patient->>'history', ''), 140) AS history
      FROM ngn_case
      WHERE coalesce(patient->>'age', '') ~ '^[0-9]+$'
        AND (patient->>'age')::int = 0
      ORDER BY id, version
    `,
  ]);
  return { cases, items, ageZero };
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  return process.argv[index + 1];
}

function planFrom(cases: CaseRow[], items: ItemRow[]): InfantAgePlan[] {
  const narratives: Record<string, string> = {};
  for (const id of ["NP001", "NP008"]) {
    const published = cases
      .filter((row) => row.id === id && row.status === "published")
      .sort((a, b) => b.version - a.version)[0];
    narratives[id] = published ? narrativeOf(published.patient, published.chart) : "";
  }
  return planInfantAgeCatalog({ cases, items, narratives });
}

function insertsOf(plans: readonly InfantAgePlan[]): InfantAgeInsert[] {
  return plans.filter((plan): plan is InfantAgeInsert => plan.action === "insert");
}

async function applyPlans(db: Db, plans: readonly InfantAgeInsert[], cases: CaseRow[], items: ItemRow[]) {
  await db.$transaction(async (tx) => {
    for (const plan of plans) {
      await applyPlan(tx, plan, cases, items);
    }
  });
}

async function applyPlan(db: Db, plan: InfantAgeInsert, cases: CaseRow[], items: ItemRow[]) {
  const source = cases.find((row) => row.id === plan.caseId && row.version === plan.fromCaseVersion);
  if (!source) throw new Error(`Missing source case ${plan.caseId} v${plan.fromCaseVersion}.`);
  {
    await db.ngnCase.create({
      data: {
        id: source.id,
        version: plan.caseVersion,
        batchId: source.batchId,
        boardProfile: source.boardProfile,
        status: source.status,
        title: source.title,
        primaryClientNeed: source.primaryClientNeed,
        setting: source.setting,
        patient: patientWithAgeMonths(source.patient, plan.ageMonths),
        timepoints: source.timepoints,
        chart: source.chart,
        revealRule: source.revealRule,
        references: source.references,
        manualCorrection: true,
        supersedesId: source.supersedesId,
      },
    });
    for (const planned of plan.items) {
      const item = items.find((row) => row.id === planned.id && row.version === planned.fromVersion);
      if (!item) throw new Error(`Missing source item ${planned.id} v${planned.fromVersion}.`);
      await db.ngnItem.create({
        data: {
          id: item.id,
          version: planned.version,
          batchId: item.batchId,
          caseId: item.caseId,
          caseVersion: plan.caseVersion,
          caseStep: item.caseStep,
          itemType: item.itemType,
          cjmmFunction: item.cjmmFunction,
          timepoint: item.timepoint,
          responseFormat: item.responseFormat,
          scoringRule: item.scoringRule,
          maxPoints: item.maxPoints,
          stem: item.stem,
          payload: item.payload,
          exhibit: item.exhibit,
          rationale: item.rationale,
          clientNeeds: item.clientNeeds,
          references: item.references,
          rnFlags: item.rnFlags,
          status: item.status,
          manualCorrection: true,
          supersedesId: item.supersedesId,
        },
      });
    }
  }
}

function writeRollback(plans: readonly InfantAgeInsert[], dir: string) {
  mkdirSync(dir, { recursive: true });
  const sqlPath = join(dir, "infant-age-months-rollback.sql");
  writeFileSync(sqlPath, infantAgeRollbackSql(plans));
  console.log(`rollback SQL saved (not executed): ${sqlPath}`);
  return sqlPath;
}

function writeBackup(cases: CaseRow[], items: ItemRow[], plans: readonly InfantAgeInsert[], dir: string) {
  mkdirSync(dir, { recursive: true });
  const backup = {
    savedAt: new Date().toISOString(),
    cases: plans.map((plan) => cases.find((row) => row.id === plan.caseId && row.version === plan.fromCaseVersion)),
    items: plans.flatMap((plan) =>
      plan.items.map((item) => items.find((row) => row.id === item.id && row.version === item.fromVersion))
    ),
  };
  const path = join(dir, "infant-age-months-backup.json");
  writeFileSync(path, JSON.stringify(backup, null, 2));
  console.log(`backup saved: ${path}`);
  return path;
}

async function main() {
  const apply = hasFlag("--apply");
  const production = hasFlag("--production");
  if (apply && hasFlag("--dry-run")) fail("Pass either --dry-run or --apply, not both.");
  console.log(
    `NP001 and NP008 ageMonths catalog versions — ${apply ? "APPLY" : "DRY RUN (no database writes)"}`
  );

  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set. Nothing was written.");

  if (apply && process.env.VERCEL_ENV === "production" && !production) {
    fail("Refusing --apply when VERCEL_ENV=production without --production. Nothing was written.");
  }
  if (apply && process.env.NGN_INFANT_AGE_CONFIRM !== INFANT_AGE_CONFIRM) {
    fail(`Refusing --apply. Set NGN_INFANT_AGE_CONFIRM=${INFANT_AGE_CONFIRM} to confirm. Nothing was written.`);
  }
  if (apply && production && process.env.NGN_INFANT_AGE_CONFIRM !== INFANT_AGE_CONFIRM) {
    fail("Refusing production apply. Nothing was written.");
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient() as unknown as Db;
  try {
    const { cases, items, ageZero } = await loadRows(prisma);
    printAgeZero(ageZero);
    const plans = planFrom(cases, items);
    for (const plan of plans) printPlan(plan);
    const errors = plans.filter((plan) => plan.action === "error");
    if (errors.length > 0) {
      throw new Error(errors.map((plan) => (plan.action === "error" ? plan.message : "")).join(" "));
    }
    const inserts = insertsOf(plans);
    const backupDir = argValue("--backup-dir");
    if (backupDir && inserts.length > 0) {
      writeBackup(cases, items, inserts, backupDir);
      writeRollback(inserts, backupDir);
    } else if (inserts.length > 0) {
      console.log(infantAgeRollbackSql(inserts));
      console.log("Rollback SQL printed only. It was not executed.");
    }
    if (!apply || inserts.length === 0) {
      console.log(apply ? "Nothing to write." : "Dry run complete. No rows were written.");
      return;
    }
    if (!backupDir) fail("Refusing --apply without --backup-dir. Nothing was written.");
    await applyPlans(prisma, inserts, cases, items);
    const after = await loadRows(prisma);
    const check = planFrom(after.cases, after.items);
    const pending = check.filter((plan) => plan.action !== "noop");
    if (pending.length > 0) {
      throw new Error(`Apply finished but a case is still not ageMonths 4 (${pending.map((plan) => plan.action).join(", ")}).`);
    }
    console.log("apply complete. NP001 and NP008 published catalog versions now have ageMonths 4. NN001 and NN002 were not changed. No QuestionBankItem rows were written. Rollback SQL was not executed.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
