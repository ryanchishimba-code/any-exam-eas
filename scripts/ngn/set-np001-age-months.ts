#!/usr/bin/env node
/**
 * Give NGN case NP001 an age-in-months value on a new catalog version.
 *
 * The published case stores patient.age 0. The history and chart say
 * 4-month-old. Students see the highest published version, so this inserts
 * the next case version with patient.ageMonths = 4 and copies that version's
 * items onto it. Stems, options, keys, rationales, and the chart are copied.
 * The previous published version is left in place.
 *
 * Default is a dry run. Nothing is written.
 *
 *   npx tsx scripts/ngn/set-np001-age-months.ts
 *   NGN_INFANT_AGE_CONFIRM=NP001 npx tsx scripts/ngn/set-np001-age-months.ts --apply
 *
 * --apply refuses to run when VERCEL_ENV=production. Do not point DATABASE_URL
 * at production. This script never reads or writes QuestionBankItem.
 */
import { patientWithAgeMonths, planNp001AgeMonths, type InfantAgePlan } from "../../src/lib/assessment/infant-age-catalog";
import { loadEnvFiles } from "../load-env";

const CONFIRM = "NP001";

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

function planFrom(cases: CaseRow[], items: ItemRow[]): InfantAgePlan {
  const published = cases
    .filter((row) => row.id === "NP001" && row.status === "published")
    .sort((a, b) => b.version - a.version)[0];
  const narrative = published ? narrativeOf(published.patient, published.chart) : "";
  return planNp001AgeMonths({ cases, items, narrative });
}

async function applyPlan(db: Db, plan: Extract<InfantAgePlan, { action: "insert" }>, cases: CaseRow[], items: ItemRow[]) {
  const source = cases.find((row) => row.id === plan.caseId && row.version === plan.fromCaseVersion);
  if (!source) throw new Error(`Missing source case ${plan.caseId} v${plan.fromCaseVersion}.`);
  await db.$transaction(async (tx) => {
    await tx.ngnCase.create({
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
      await tx.ngnItem.create({
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
  });
}

async function main() {
  const apply = hasFlag("--apply");
  if (apply && hasFlag("--dry-run")) fail("Pass either --dry-run or --apply, not both.");
  console.log(`NP001 ageMonths catalog version — ${apply ? "APPLY" : "DRY RUN (no database writes)"}`);

  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set. Nothing was written.");

  if (apply && process.env.VERCEL_ENV === "production") {
    fail("Refusing --apply when VERCEL_ENV=production. Nothing was written.");
  }
  if (apply && process.env.NGN_INFANT_AGE_CONFIRM !== CONFIRM) {
    fail(`Refusing --apply. Set NGN_INFANT_AGE_CONFIRM=${CONFIRM} to confirm. Nothing was written.`);
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient() as unknown as Db;
  try {
    const { cases, items, ageZero } = await loadRows(prisma);
    printAgeZero(ageZero);
    const plan = planFrom(cases, items);
    printPlan(plan);
    if (plan.action === "error") throw new Error(plan.message);
    if (!apply || plan.action === "noop") {
      console.log(apply ? "Nothing to write." : "Dry run complete. No rows were written.");
      return;
    }
    await applyPlan(prisma, plan, cases, items);
    const after = await loadRows(prisma);
    const check = planFrom(after.cases, after.items);
    if (check.action !== "noop") {
      throw new Error(`Apply finished but the published case is not ageMonths 4 (${check.action}).`);
    }
    console.log("apply complete. NP001 published catalog version now has ageMonths 4. No QuestionBankItem rows were written.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
