/**
 * Board-generic coverage heatmap.
 *
 * One shape for readiness bars, Today's block / the week plan, and Qbank
 * untouched / low chips. Domain labels and weights come from the caller,
 * which loads them from the board blueprint. Nursing uses Client Needs;
 * every other field uses Blueprint topics. Question counts, when present,
 * are the active-inventory category counts marketing and the Qbank header
 * already show. Nothing here predicts a licensure result.
 */

import { getExamBlueprint } from "@/lib/engine/blueprints";

/** Domains at or above this blueprint share are high-weight. Same bar as Today's block. */
export const COVERAGE_HIGH_WEIGHT_PCT = 10;

/** Bank coverage under this percent is "very low" once the student has started the domain. */
export const COVERAGE_VERY_LOW_PCT = 15;

const CHIP_LIMIT = 5;
const MS_DAY = 86_400_000;

export type CoverageDomainStatus = "untouched" | "low" | "partial" | "covered";

export type CoverageTopicInput = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  attempts: number;
  accuracyPct: number | null;
  /**
   * Seen ÷ available (0–100) when the caller already computed push coverage.
   * Used when a fresh seen/available pair is not both known.
   */
  coveragePct?: number;
  /** Distinct items with a saved attempt in this domain. */
  seen?: number;
  /** Active items from the serve path, before inventory overrides it. */
  available?: number;
  subjectIds?: string[];
  practiceHref?: string;
};

export type CoverageInventoryCategory = {
  id: string;
  label: string;
  count: number;
};

export type CoverageDomain = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  attempts: number;
  accuracyPct: number | null;
  seen: number;
  /** Active questions. Matches inventory when that snapshot was passed in. */
  available: number;
  /** 0–100. Item coverage, not accuracy. */
  bankCoveragePct: number;
  /** Bar fill. Empty when the domain has no saved answers. */
  fillPct: number;
  status: CoverageDomainStatus;
  untouched: boolean;
  veryLow: boolean;
  highWeight: boolean;
  /** False for an inventory bucket that is not on the board blueprint. */
  onBlueprint: boolean;
  subjectIds: string[];
  practiceHref: string;
};

export type CoverageChipKind = "untouched" | "weak";

export type CoverageChip = {
  kind: CoverageChipKind;
  domainId: string;
  label: string;
  /** Subject the Qbank picker can select. */
  subjectId: string;
  blueprintWeightPct: number;
  available: number;
  bankCoveragePct: number;
};

export type CoverageHeatmap = {
  /** Nursing is Client Needs. Every other board is Blueprint topics. */
  domainsLabel: "Client Needs" | "Blueprint topics";
  /** Priority order. The first blueprint domain is Today's coverage gap. */
  domains: CoverageDomain[];
  topGapId: string | null;
  /**
   * Blueprint-weighted share of domains with at least one saved attempt.
   * This is the readiness coverage factor.
   */
  touchCoveragePct: number;
  /** Blueprint-weighted average of bank coverage. Null when every weight is 0. */
  bankCoveragePct: number | null;
  /** Sum of blueprint-domain question counts. */
  categoryQuestionTotal: number;
  /** Inventory questions whose category is not on the board blueprint. */
  unmappedQuestionTotal: number;
  /** Active questions across topics, when the caller passed the bank total. */
  topicQuestionTotal: number | null;
  /**
   * True when inventory categories are absent, or every inventory category
   * count and label is on this heatmap and the topic total is at least that sum.
   */
  countsAgree: boolean;
  chips: CoverageChip[];
};

export function domainsLabelForField(fieldId: string): CoverageHeatmap["domainsLabel"] {
  return fieldId === "nursing" ? "Client Needs" : "Blueprint topics";
}

export function touchCoveragePct(
  topics: { blueprintWeightPct: number; attempts: number }[]
): number {
  const weight = topics.reduce((sum, topic) => sum + Math.max(0, topic.blueprintWeightPct), 0);
  if (weight <= 0) return 0;
  const touched = topics.reduce(
    (sum, topic) => sum + (topic.attempts > 0 ? Math.max(0, topic.blueprintWeightPct) : 0),
    0
  );
  return Math.round((touched / weight) * 100);
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function coverageRatio(seen: number, available: number): number {
  if (available <= 0) return 0;
  return clampPct((seen / available) * 100);
}

function utcDayIndex(now: Date): number {
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / MS_DAY
  );
}

function priorityScore(domain: {
  onBlueprint: boolean;
  blueprintWeightPct: number;
  bankCoveragePct: number;
  attempts: number;
  accuracyPct: number | null;
  available: number;
  inventoryProvided: boolean;
}): number {
  if (!domain.onBlueprint) return -1;
  if (domain.inventoryProvided && domain.available <= 0 && domain.attempts <= 0) return 0;
  const weight = Math.max(domain.blueprintWeightPct, 1);
  const coverageGap = 100 - clampPct(domain.bankCoveragePct);
  const accuracyGap =
    domain.attempts === 0 ? 100 : 100 - clampPct(domain.accuracyPct ?? 50);
  return weight * (0.65 * coverageGap + 0.35 * accuracyGap);
}

function statusFor(domain: {
  untouched: boolean;
  veryLow: boolean;
  highWeight: boolean;
  attempts: number;
  bankCoveragePct: number;
}): CoverageDomainStatus {
  if (domain.untouched) return "untouched";
  if (domain.veryLow) return "low";
  if (domain.highWeight && domain.attempts < 8 && domain.bankCoveragePct < 60) return "low";
  if (domain.bankCoveragePct >= 60 && (!domain.highWeight || domain.attempts >= 8)) {
    return "covered";
  }
  return "partial";
}

function resolveBank(input: {
  inventoryProvided: boolean;
  inventoryAvailable: number | null;
  seen: number | null;
  available: number;
  attempts: number;
  coveragePct: number;
}): { seen: number; available: number; bankCoveragePct: number } {
  const seen = Math.max(0, input.seen ?? 0);
  if (input.inventoryProvided) {
    const available = Math.max(0, input.inventoryAvailable ?? 0);
    if (available > 0 && input.seen != null && input.seen > 0) {
      return { seen, available, bankCoveragePct: coverageRatio(seen, available) };
    }
    if (available > 0 && input.attempts > 0) {
      return { seen, available, bankCoveragePct: clampPct(input.coveragePct) };
    }
    return { seen, available, bankCoveragePct: 0 };
  }
  const available = Math.max(0, input.available);
  if (available > 0 && input.seen != null && input.seen > 0) {
    return { seen, available, bankCoveragePct: coverageRatio(seen, available) };
  }
  return { seen, available, bankCoveragePct: clampPct(input.coveragePct) };
}

export function buildCoverageHeatmap(input: {
  fieldId: string;
  now?: Date;
  topics?: CoverageTopicInput[];
  inventoryCategories?: CoverageInventoryCategory[] | null;
  topicQuestionTotal?: number | null;
  bankSubjectIds?: readonly string[];
}): CoverageHeatmap {
  const now = input.now ?? new Date();
  const topics = input.topics ?? [];
  const blueprint = getExamBlueprint(input.fieldId);
  // An empty category list means the snapshot had no blueprint rows, not that
  // every domain has zero questions. Keep the caller's coverage percent.
  const inventory =
    input.inventoryCategories && input.inventoryCategories.length > 0
      ? input.inventoryCategories
      : null;
  const inventoryProvided = inventory != null;
  const inventoryById = new Map((inventory ?? []).map((category) => [category.id, category]));
  const bankIds = input.bankSubjectIds;

  const built: Array<{ domain: CoverageDomain; score: number }> = topics.map((topic) => {
    const official = blueprint?.categories.find((category) => category.id === topic.id);
    const subjectIds =
      topic.subjectIds && topic.subjectIds.length > 0
        ? topic.subjectIds
        : official?.subjectIds && official.subjectIds.length > 0
          ? official.subjectIds
          : [topic.id];
    const inventoryRow = inventoryById.get(topic.id) ?? null;
    const bank = resolveBank({
      inventoryProvided,
      inventoryAvailable: inventoryRow ? inventoryRow.count : inventoryProvided ? 0 : null,
      seen: topic.seen ?? null,
      available: topic.available ?? 0,
      attempts: topic.attempts,
      coveragePct: topic.coveragePct ?? 0,
    });
    const attempts = Math.max(0, Math.round(topic.attempts) || 0);
    const untouched = attempts <= 0;
    const veryLow = !untouched && bank.bankCoveragePct < COVERAGE_VERY_LOW_PCT;
    const blueprintWeightPct = Math.max(0, topic.blueprintWeightPct);
    const highWeight = blueprintWeightPct >= COVERAGE_HIGH_WEIGHT_PCT;
    const domain: CoverageDomain = {
      id: topic.id,
      label: topic.label,
      blueprintWeightPct,
      attempts,
      accuracyPct: topic.accuracyPct,
      seen: bank.seen,
      available: bank.available,
      bankCoveragePct: bank.bankCoveragePct,
      fillPct: untouched ? 0 : bank.bankCoveragePct,
      status: "partial",
      untouched,
      veryLow,
      highWeight,
      onBlueprint: true,
      subjectIds,
      practiceHref: topic.practiceHref ?? "",
    };
    domain.status = statusFor(domain);
    return {
      domain,
      score: priorityScore({ ...domain, inventoryProvided }),
    };
  });

  const knownIds = new Set(built.map((row) => row.domain.id));
  const unmappedQuestionTotal = inventory
    ? inventory.reduce(
        (sum, category) =>
          knownIds.has(category.id) ? sum : sum + Math.max(0, Math.round(category.count) || 0),
        0
      )
    : 0;

  built.sort(
    (a, b) => b.score - a.score || a.domain.label.localeCompare(b.domain.label)
  );
  const topScore = built[0]?.score ?? 0;
  const tied = built.filter((row) => row.domain.onBlueprint && Math.abs(row.score - topScore) < 0.001);
  const rotate = tied.length > 1 ? utcDayIndex(now) % tied.length : 0;
  const lead = tied[rotate]?.domain ?? built.find((row) => row.domain.onBlueprint)?.domain ?? null;
  const rest = built
    .map((row) => row.domain)
    .filter((domain) => domain.id !== lead?.id);
  const domains = lead ? [lead, ...rest] : rest;
  const topGapId = lead?.id ?? null;

  const chips: CoverageChip[] = [];
  for (const domain of domains) {
    if (!domain.onBlueprint) continue;
    if (inventoryProvided && domain.available <= 0 && domain.untouched) continue;
    let kind: CoverageChipKind | null = null;
    if (domain.untouched) kind = "untouched";
    else if (
      domain.veryLow ||
      (domain.highWeight && domain.accuracyPct != null && domain.accuracyPct < 60)
    ) {
      kind = "weak";
    }
    if (!kind) continue;
    const subjectId =
      (bankIds?.length
        ? domain.subjectIds.find((id) => bankIds.includes(id))
        : domain.subjectIds[0]) ?? null;
    if (!subjectId) continue;
    if (bankIds?.length && !bankIds.includes(subjectId)) continue;
    chips.push({
      kind,
      domainId: domain.id,
      label: domain.label,
      subjectId,
      blueprintWeightPct: domain.blueprintWeightPct,
      available: domain.available,
      bankCoveragePct: domain.bankCoveragePct,
    });
    if (chips.length >= CHIP_LIMIT) break;
  }

  const categoryQuestionTotal = domains.reduce((sum, domain) => sum + domain.available, 0);
  const topicQuestionTotal =
    input.topicQuestionTotal != null && Number.isFinite(input.topicQuestionTotal)
      ? Math.max(0, Math.round(input.topicQuestionTotal))
      : null;

  let countsAgree = true;
  if (inventory) {
    for (const category of inventory) {
      if (!knownIds.has(category.id)) continue;
      const domain = domains.find((row) => row.id === category.id);
      if (!domain || domain.available !== Math.max(0, category.count)) {
        countsAgree = false;
        break;
      }
      if (domain.label !== category.label) {
        countsAgree = false;
        break;
      }
    }
    const mappedSum = inventory.reduce(
      (sum, category) => (knownIds.has(category.id) ? sum + Math.max(0, category.count) : sum),
      0
    );
    if (categoryQuestionTotal !== mappedSum) countsAgree = false;
    if (topicQuestionTotal != null && topicQuestionTotal < mappedSum + unmappedQuestionTotal) {
      countsAgree = false;
    }
  }

  const weight = domains.reduce((sum, domain) => sum + Math.max(0, domain.blueprintWeightPct), 0);
  const bankCoveragePct =
    weight > 0
      ? Math.round(
          domains.reduce(
            (sum, domain) => sum + domain.bankCoveragePct * Math.max(0, domain.blueprintWeightPct),
            0
          ) / weight
        )
      : null;

  return {
    domainsLabel: domainsLabelForField(input.fieldId),
    domains,
    topGapId,
    touchCoveragePct: touchCoveragePct(domains),
    bankCoveragePct,
    categoryQuestionTotal,
    unmappedQuestionTotal,
    topicQuestionTotal,
    countsAgree,
    chips,
  };
}
