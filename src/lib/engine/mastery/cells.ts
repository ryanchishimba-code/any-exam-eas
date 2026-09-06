/**
 * Skill Cell definitions for NCLEX — exam + Client Needs system + topic.
 * Backfills from the existing NCLEX topic registry (no perfect ontology required).
 */

import {
  clientNeeds2026,
  clientNeedsWeight,
  type NclexTrack,
} from "@/lib/nursing/client-needs-2026";
import {
  NCLEX_TOPIC_REGISTRY,
  NCLEX_CLIENT_NEEDS_DOMAINS,
} from "@/lib/exam-prep/nclex/topic-registry";
import { NAPLEX_TOPIC_REGISTRY } from "@/lib/exam-prep/naplex/topic-registry";
import {
  NAPLEX_OUTLINE_2025,
  isNaplexOutlineDomainId,
  naplexBlueprintWeight,
  naplexDomainById,
  naplexDomainByNumber,
} from "@/lib/pharmacy/naplex-outline-2025";
import type { SkillCellDef } from "./types";

export function skillCellKey(
  examSlug: string,
  systemKey: string,
  topicKey: string
): string {
  return `${examSlug}:${systemKey}:${topicKey}`;
}

/** Build Skill Cells for NCLEX-RN (default) from the topic registry. */
export function buildNclexSkillCells(track: NclexTrack = "rn"): SkillCellDef[] {
  const examSlug = "nclex";
  const needs = clientNeeds2026(track);
  const labelById = new Map(needs.map((n) => [n.id, n.label] as const));
  // Fall back to registry domain labels for ids shared with Study Hub.
  for (const d of NCLEX_CLIENT_NEEDS_DOMAINS) {
    if (!labelById.has(d.id)) labelById.set(d.id, d.label);
  }

  const cells: SkillCellDef[] = [];

  for (const [topicKey, meta] of Object.entries(NCLEX_TOPIC_REGISTRY)) {
    const systemKey = meta.clientNeedsDomain;
    if (systemKey === "ngn-strategy") continue;
    // PN uses coordinated-care instead of management-of-care for MoC topics.
    const mappedSystem =
      track === "pn" && systemKey === "management-of-care"
        ? "coordinated-care"
        : systemKey;
    if (!needs.some((n) => n.id === mappedSystem)) continue;

    cells.push({
      cellKey: skillCellKey(examSlug, mappedSystem, topicKey),
      examSlug,
      systemKey: mappedSystem,
      systemLabel: labelById.get(mappedSystem) ?? mappedSystem,
      topicKey,
      topicLabel: topicKey
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      blueprintWeight: clientNeedsWeight(mappedSystem, track),
    });
  }

  // Ensure every Client Needs system has at least one cell (system-level).
  for (const need of needs) {
    if (cells.some((c) => c.systemKey === need.id)) continue;
    cells.push({
      cellKey: skillCellKey(examSlug, need.id, "_system"),
      examSlug,
      systemKey: need.id,
      systemLabel: need.label,
      topicKey: "_system",
      topicLabel: need.label,
      blueprintWeight: need.weight,
    });
  }

  return cells;
}

/** Resolve a cell from question metadata (best-effort). */
export function resolveCellKeyFromQuestion(input: {
  examSlug?: string;
  blueprintDomain?: string | null;
  subjectId?: string | null;
  topicCategory?: string | null;
  clientNeeds?: string | null;
  naplexDomain?: number | null;
}): string | null {
  const examSlug = input.examSlug ?? "nclex";
  if (examSlug === "naplex") {
    return resolveNaplexCellKeyFromQuestion(input);
  }
  const topicKey =
    input.subjectId ||
    input.topicCategory ||
    (input.clientNeeds ? "_system" : null);
  if (!topicKey) return null;

  const registry = NCLEX_TOPIC_REGISTRY[topicKey];
  const systemKey =
    input.clientNeeds ||
    registry?.clientNeedsDomain ||
    input.blueprintDomain ||
    null;
  if (!systemKey || systemKey === "ngn-strategy") {
    if (registry?.clientNeedsDomain && registry.clientNeedsDomain !== "ngn-strategy") {
      return skillCellKey(examSlug, registry.clientNeedsDomain, topicKey);
    }
    return null;
  }
  return skillCellKey(examSlug, systemKey, topicKey);
}

/**
 * Skill Cells for NAPLEX — exam + NABP 2025 content domain + topic.
 * Weights come from naplex-outline-2025 (Domain 3 = 40).
 */
export function buildNaplexSkillCells(): SkillCellDef[] {
  const examSlug = "naplex";
  const cells: SkillCellDef[] = [];
  const labelById = new Map(
    NAPLEX_OUTLINE_2025.map((d) => [d.id, d.label] as const)
  );

  for (const [topicKey, meta] of Object.entries(NAPLEX_TOPIC_REGISTRY)) {
    const systemKey = meta.contentDomain;
    const domain = naplexDomainById(systemKey);
    cells.push({
      cellKey: skillCellKey(examSlug, systemKey, topicKey),
      examSlug,
      systemKey,
      systemLabel: labelById.get(systemKey) ?? systemKey,
      topicKey,
      topicLabel: topicKey
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      blueprintWeight: domain?.blueprintWeight ?? naplexBlueprintWeight(systemKey),
    });
  }

  // Ensure every outline domain has at least one system-level cell.
  for (const domain of NAPLEX_OUTLINE_2025) {
    if (cells.some((c) => c.systemKey === domain.id)) continue;
    cells.push({
      cellKey: skillCellKey(examSlug, domain.id, "_system"),
      examSlug,
      systemKey: domain.id,
      systemLabel: domain.label,
      topicKey: "_system",
      topicLabel: domain.label,
      blueprintWeight: domain.blueprintWeight,
    });
  }

  return cells;
}

/** Best-effort NAPLEX cell key from bank metadata / tags. */
export function resolveNaplexCellKeyFromQuestion(input: {
  blueprintDomain?: string | null;
  subjectId?: string | null;
  topicCategory?: string | null;
  naplexDomain?: number | null;
}): string | null {
  const topicKey = input.subjectId || input.topicCategory || "_system";
  const fromRegistry = NAPLEX_TOPIC_REGISTRY[topicKey];
  if (fromRegistry) {
    return skillCellKey("naplex", fromRegistry.contentDomain, topicKey);
  }

  if (input.blueprintDomain && isNaplexOutlineDomainId(input.blueprintDomain)) {
    return skillCellKey("naplex", input.blueprintDomain, topicKey);
  }

  // Legacy 6-area / misc blueprintDomain → map via outline id prefix or Domain 3 default.
  const bd = input.blueprintDomain ?? "";
  if (bd.includes("area1") || bd.includes("foundation") || bd.includes("calc")) {
    return skillCellKey("naplex", "naplex-area1-foundations", topicKey);
  }
  if (bd.includes("area2") || bd.includes("medication-use") || bd.includes("dispens")) {
    return skillCellKey("naplex", "naplex-area2-therapeutics", topicKey);
  }
  if (bd.includes("area4") || bd.includes("professional") || bd.includes("ethic")) {
    return skillCellKey("naplex", "naplex-area4-safety", topicKey);
  }
  if (bd.includes("area5") || bd.includes("management") || bd.includes("leadership")) {
    return skillCellKey("naplex", "naplex-area5-management", topicKey);
  }
  if (input.naplexDomain && input.naplexDomain >= 1 && input.naplexDomain <= 5) {
    const domain = naplexDomainByNumber(input.naplexDomain);
    if (domain) return skillCellKey("naplex", domain.id, topicKey);
  }

  // Person-Centered Assessment is the largest share — safe default.
  return skillCellKey("naplex", "naplex-area3-treatment-planning", topicKey);
}
