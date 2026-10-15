/**
 * Plan a new published catalog version that records months for infant case NP001.
 * The served catalog is the highest published case version, so the months value
 * has to land on a new version (and its items) rather than an in-place edit.
 */

export const NP001_CASE_ID = "NP001";
export const NP008_CASE_ID = "NP008";
export const NP001_AGE_MONTHS = 4;

/** Infants whose chart says 4-month-old. Newborns NN001 and NN002 stay age 0. */
export const INFANT_AGE_CASES = [
  { id: NP001_CASE_ID, ageMonths: NP001_AGE_MONTHS },
  { id: NP008_CASE_ID, ageMonths: NP001_AGE_MONTHS },
] as const;

export const INFANT_AGE_CONFIRM = "NP001,NP008";

export type InfantAgeCaseSource = {
  id: string;
  version: number;
  status: string;
  patient: unknown;
};

export type InfantAgeItemSource = {
  id: string;
  version: number;
  caseId: string | null;
  caseVersion: number | null;
  status: string;
};

export type InfantAgeInsert = {
  action: "insert";
  caseId: string;
  fromCaseVersion: number;
  caseVersion: number;
  ageMonths: number;
  items: { id: string; fromVersion: number; version: number }[];
};

export type InfantAgePlan =
  | { action: "noop"; reason: string }
  | { action: "error"; message: string }
  | InfantAgeInsert;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function narrativeMentionsMonthOld(narrative: string, months: number): boolean {
  return new RegExp(`\\b${months}-month-old\\b`, "i").test(narrative);
}

function highest(rows: readonly { version: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.version), 0);
}

function latestPublished(cases: readonly InfantAgeCaseSource[], caseId: string): InfantAgeCaseSource | null {
  let best: InfantAgeCaseSource | null = null;
  for (const row of cases) {
    if (row.id !== caseId || row.status !== "published") continue;
    if (!best || row.version > best.version) best = row;
  }
  return best;
}

/**
 * Decide the next NP001 case version.
 * `narrative` is the history plus chart text the operator already stored.
 */
export function planNp001AgeMonths(input: {
  cases: readonly InfantAgeCaseSource[];
  items: readonly InfantAgeItemSource[];
  narrative: string;
  caseId?: string;
  ageMonths?: number;
}): InfantAgePlan {
  const caseId = input.caseId ?? NP001_CASE_ID;
  const ageMonths = input.ageMonths ?? NP001_AGE_MONTHS;
  const source = latestPublished(input.cases, caseId);
  if (!source) return { action: "error", message: `No published ${caseId} case to version.` };

  const patient = asRecord(source.patient);
  const age = patient?.age;
  if (typeof age !== "number" || age !== 0) {
    return { action: "error", message: `${caseId} v${source.version} age is ${String(age)}, not 0.` };
  }
  if (!narrativeMentionsMonthOld(input.narrative, ageMonths)) {
    return {
      action: "error",
      message: `${caseId} history/chart does not say ${ageMonths}-month-old. Refusing to stamp months.`,
    };
  }
  if (patient?.ageMonths === ageMonths) {
    return { action: "noop", reason: `${caseId} v${source.version} already has ageMonths ${ageMonths}.` };
  }
  if (patient?.ageMonths != null) {
    return {
      action: "error",
      message: `${caseId} v${source.version} already has ageMonths ${String(patient.ageMonths)}.`,
    };
  }

  const members = new Map<string, InfantAgeItemSource>();
  for (const item of input.items) {
    if (item.caseId !== caseId || item.caseVersion !== source.version) continue;
    const current = members.get(item.id);
    if (!current || item.version > current.version) members.set(item.id, item);
  }
  if (members.size === 0) {
    return { action: "error", message: `${caseId} v${source.version} has no items to copy.` };
  }
  for (const item of members.values()) {
    if (item.status !== "published") {
      return { action: "error", message: `${item.id} v${item.version} is ${item.status}, not published.` };
    }
  }

  const caseVersion = highest(input.cases.filter((row) => row.id === caseId)) + 1;
  const items = [...members.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((item) => ({
      id: item.id,
      fromVersion: item.version,
      version: highest(input.items.filter((row) => row.id === item.id)) + 1,
    }));

  return {
    action: "insert",
    caseId,
    fromCaseVersion: source.version,
    caseVersion,
    ageMonths,
    items,
  };
}

export function patientWithAgeMonths(patient: unknown, ageMonths: number): Record<string, unknown> {
  const source = asRecord(patient) ?? {};
  return { ...source, ageMonths };
}

/** Plan NP001 and NP008 together. Each case is versioned from the same snapshot. */
export function planInfantAgeCatalog(input: {
  cases: readonly InfantAgeCaseSource[];
  items: readonly InfantAgeItemSource[];
  narratives: Record<string, string>;
  targets?: readonly { id: string; ageMonths: number }[];
}): InfantAgePlan[] {
  const targets = input.targets ?? INFANT_AGE_CASES;
  return targets.map((target) =>
    planNp001AgeMonths({
      cases: input.cases,
      items: input.items,
      narrative: input.narratives[target.id] ?? "",
      caseId: target.id,
      ageMonths: target.ageMonths,
    })
  );
}

function sqlLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/** Deletes the inserted versions only. Not executed by the planner. */
export function infantAgeRollbackSql(plans: readonly InfantAgeInsert[]): string {
  const itemRows = plans.flatMap((plan) =>
    plan.items.map((item) => `  (${sqlLiteral(item.id)}, ${item.version})`)
  );
  const caseRows = plans.map((plan) => `  (${sqlLiteral(plan.caseId)}, ${plan.caseVersion})`);
  return [
    "-- Rollback the infant ageMonths catalog versions. Do not run unless reverting that insert.",
    "-- Leaves NN001 and NN002 untouched. Deletes new item versions before their case versions.",
    "BEGIN;",
    "DELETE FROM ngn_item",
    "WHERE (id, version) IN (",
    `${itemRows.join(",\n")}`,
    ");",
    "DELETE FROM ngn_case",
    "WHERE (id, version) IN (",
    `${caseRows.join(",\n")}`,
    ");",
    "COMMIT;",
    "",
  ].join("\n");
}
