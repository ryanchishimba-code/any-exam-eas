/**
 * Map legacy NAPLEX five-domain slugs (2025 outline) and subjectIds
 * to NABP 2026 six-area blueprint domains for quota audits and migration.
 */
import type { NaplexBlueprintAreaId } from "./types";

const RX_SUBJECTS = new Set([
  "cardiovascular-rx",
  "infectious-disease-rx",
  "endocrine-rx",
  "cns-rx",
  "oncology-rx",
]);

const DISPENSING_SUBJECTS = new Set([
  "compounding-calculations",
  "pharmaceutics",
  "pharmacokinetics",
]);

const LEGACY_DIRECT_MAP: Record<string, NaplexBlueprintAreaId> = {
  "naplex-area3-treatment-planning": "naplex-2026-pharmacotherapy",
  "naplex-area4-safety": "naplex-2026-patient-centered-care",
  "naplex-area5-management": "naplex-2026-pharmacist-tasks",
};

function subjectFallback(subjectId?: string | null): NaplexBlueprintAreaId {
  const sid = subjectId?.trim() ?? "";
  if (RX_SUBJECTS.has(sid)) return "naplex-2026-pharmacotherapy";
  if (DISPENSING_SUBJECTS.has(sid)) return "naplex-2026-medication-dispensing";
  if (sid === "otc-self-care") return "naplex-2026-health-wellness";
  if (sid === "pharmacy-law") return "naplex-2026-pharmacist-tasks";
  if (sid === "patient-counseling") return "naplex-2026-patient-centered-care";
  if (sid === "pharmacology" || sid === "pharmacokinetics") {
    return "naplex-2026-drug-information";
  }
  return "naplex-2026-pharmacotherapy";
}

function mapLegacyDomain(
  legacy: string,
  subjectId?: string | null,
  itemType?: string | null
): NaplexBlueprintAreaId {
  const direct = LEGACY_DIRECT_MAP[legacy];
  if (direct) return direct;

  if (legacy === "naplex-area1-foundations") {
    if (DISPENSING_SUBJECTS.has(subjectId ?? "") || itemType === "constructed_response") {
      return "naplex-2026-medication-dispensing";
    }
    return "naplex-2026-drug-information";
  }

  if (legacy === "naplex-area2-therapeutics") {
    if (DISPENSING_SUBJECTS.has(subjectId ?? "")) {
      return "naplex-2026-medication-dispensing";
    }
    if (subjectId === "pharmacy-law") return "naplex-2026-pharmacist-tasks";
    if (RX_SUBJECTS.has(subjectId ?? "")) return "naplex-2026-pharmacotherapy";
    return "naplex-2026-patient-centered-care";
  }

  return subjectFallback(subjectId);
}

/** Resolve any stored blueprintDomain to a 2026 six-area slug. */
export function resolveNaplex2026BlueprintDomain(params: {
  blueprintDomain?: string | null;
  subjectId?: string | null;
  itemType?: string | null;
}): NaplexBlueprintAreaId {
  const domain = params.blueprintDomain?.trim() ?? "";
  if (domain.startsWith("naplex-2026-")) {
    return domain as NaplexBlueprintAreaId;
  }
  if (domain.startsWith("naplex-area")) {
    return mapLegacyDomain(domain, params.subjectId, params.itemType);
  }
  return subjectFallback(params.subjectId);
}

/** Aggregate raw DB counts (mixed legacy + 2026 keys) into 2026 blueprint buckets. */
export function aggregateNaplex2026BlueprintCounts(
  rows: Array<{
    blueprintDomain?: string | null;
    subjectId?: string | null;
    itemType?: string | null;
    count: number;
  }>
): Record<NaplexBlueprintAreaId, number> {
  const totals = {} as Record<NaplexBlueprintAreaId, number>;
  for (const row of rows) {
    const area = resolveNaplex2026BlueprintDomain(row);
    totals[area] = (totals[area] ?? 0) + row.count;
  }
  return totals;
}

/** True when a row should be updated to a canonical 2026 domain slug. */
export function naplexBlueprintDomainNeedsMigration(params: {
  blueprintDomain?: string | null;
  subjectId?: string | null;
  itemType?: string | null;
}): boolean {
  const current = params.blueprintDomain?.trim() ?? "";
  if (!current || !current.startsWith("naplex-")) return true;
  if (current.startsWith("naplex-2026-")) return false;
  const resolved = resolveNaplex2026BlueprintDomain(params);
  return resolved !== current;
}

export function targetNaplex2026BlueprintDomain(params: {
  blueprintDomain?: string | null;
  subjectId?: string | null;
  itemType?: string | null;
}): NaplexBlueprintAreaId {
  return resolveNaplex2026BlueprintDomain(params);
}
