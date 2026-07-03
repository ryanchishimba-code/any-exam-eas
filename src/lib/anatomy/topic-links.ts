import { expandTopicSlugAliases } from "@/lib/anatomy/topic-slug-aliases";
import { normalizeWeakAreaTopicKey } from "@/lib/library/weak-area-map";
import { ANATOMY_STRUCTURES } from "./structures";
import type { AnatomyStructure } from "./types";

export type AnatomyStructureLink = {
  id: string;
  name: string;
  system: AnatomyStructure["system"];
  highYield: boolean;
};

export type AnatomyDiseasePearl = {
  id: string;
  name: string;
  pearl?: string;
  structureIds: string[];
};

function normalizeTopicKey(topicKey: string): string {
  return normalizeWeakAreaTopicKey(topicKey);
}

function toStructureLink(structure: AnatomyStructure): AnatomyStructureLink {
  return {
    id: structure.id,
    name: structure.name,
    system: structure.system,
    highYield: structure.highYield,
  };
}

/** Topic aliases — review module slug → practice subject slug, cross-exam aliases. */
function topicAliasSlugs(topicKey: string): Set<string> {
  const normalized = normalizeTopicKey(topicKey);
  const aliases = expandTopicSlugAliases(normalized);

  const { REVIEW_MODULE_TOPICS } =
    require("@/lib/edtech/seeds/review-module-topics") as typeof import("@/lib/edtech/seeds/review-module-topics");
  const reviewModule = REVIEW_MODULE_TOPICS.find(
    (m) => m.slug === normalized || m.practiceTopicSlug === normalized
  );
  if (reviewModule) {
    aliases.add(reviewModule.slug);
    aliases.add(reviewModule.practiceTopicSlug);
  }

  return aliases;
}

function scoreStructureForTopic(
  structure: AnatomyStructure,
  aliases: Set<string>,
  memoryCardIds: Set<string>,
  explicitStructureIds: Set<string>
): number {
  let score = 0;

  if (explicitStructureIds.has(structure.id)) score += 20;
  if (aliases.has(structure.practiceTopicSlug)) score += 10;
  if (structure.highYieldTopicSlug && aliases.has(structure.highYieldTopicSlug)) score += 8;
  if (structure.highYield) score += 2;
  if (!structure.parentId) score += 1;

  for (const cardId of structure.memoryCardIds) {
    if (memoryCardIds.has(cardId)) score += 4;
  }

  return score;
}

function rankStructures(
  scored: { structure: AnatomyStructure; score: number }[],
  limit: number
): AnatomyStructureLink[] {
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.structure.name.localeCompare(b.structure.name);
    })
    .slice(0, limit)
    .map(({ structure }) => toStructureLink(structure));
}

/** Resolve structure links from explicit ids (preserves order, dedupes). */
export function getAnatomyStructuresForStructureIds(
  structureIds: string[],
  limit = 3
): AnatomyStructureLink[] {
  const byId = new Map(ANATOMY_STRUCTURES.map((s) => [s.id, s]));
  const seen = new Set<string>();
  const links: AnatomyStructureLink[] = [];

  for (const id of structureIds) {
    if (seen.has(id)) continue;
    const structure = byId.get(id);
    if (!structure) continue;
    seen.add(id);
    links.push(toStructureLink(structure));
    if (links.length >= limit) break;
  }

  return links;
}

export function mergeAnatomyStructureLinks(
  ...groups: AnatomyStructureLink[][]
): AnatomyStructureLink[] {
  const seen = new Set<string>();
  const merged: AnatomyStructureLink[] = [];
  for (const group of groups) {
    for (const link of group) {
      if (seen.has(link.id)) continue;
      seen.add(link.id);
      merged.push(link);
    }
  }
  return merged;
}

/** Clinical disease pearls for review modules (pathophys context in deep dives). */
export function getAnatomyDiseasePearlsForReviewModule(
  moduleSlug: string
): AnatomyDiseasePearl[] {
  const { getReviewModuleAnatomy } =
    require("@/lib/anatomy/review-module-anatomy") as typeof import("@/lib/anatomy/review-module-anatomy");
  const { getDiseaseLinkById } =
    require("@/lib/anatomy/clinical-links/registry") as typeof import("@/lib/anatomy/clinical-links/registry");
  const anatomy = getReviewModuleAnatomy(moduleSlug);
  if (!anatomy?.diseaseIds?.length) return [];

  const pearls: AnatomyDiseasePearl[] = [];
  for (const id of anatomy.diseaseIds) {
    const disease = getDiseaseLinkById(id);
    if (!disease) continue;
    pearls.push({
      id: disease.id,
      name: disease.name,
      pearl: disease.examPearl ?? disease.pathophysiology,
      structureIds: disease.structureIds,
    });
  }
  return pearls;
}

/** Explicit anatomy links registered for a review module slug. */
export function getAnatomyStructuresForReviewModule(
  moduleSlug: string,
  limit = 3
): AnatomyStructureLink[] {
  const { getReviewModuleAnatomy } =
    require("@/lib/anatomy/review-module-anatomy") as typeof import("@/lib/anatomy/review-module-anatomy");
  const anatomy = getReviewModuleAnatomy(moduleSlug);
  if (!anatomy?.structureIds.length) return [];
  return getAnatomyStructuresForStructureIds(anatomy.structureIds, limit);
}

/**
 * Resolve 3D anatomy structures relevant to a weak-area / review / practice topic.
 * Matches explicit ids, practiceTopicSlug, review-module registry, and memory-card overlap.
 */
export function getAnatomyStructuresForTopicSlug(
  topicKey: string,
  opts?: {
    memoryCardIds?: string[];
    structureIds?: string[];
    limit?: number;
  }
): AnatomyStructureLink[] {
  const aliases = topicAliasSlugs(topicKey);
  const cardIds = new Set(opts?.memoryCardIds ?? []);
  const explicitIds = new Set(opts?.structureIds ?? []);
  const limit = opts?.limit ?? 3;

  const moduleAnatomy = getAnatomyStructuresForReviewModule(normalizeTopicKey(topicKey), limit);
  const explicitLinks = getAnatomyStructuresForStructureIds([...explicitIds], limit);

  const inferred = rankStructures(
    ANATOMY_STRUCTURES.map((structure) => ({
      structure,
      score: scoreStructureForTopic(structure, aliases, cardIds, explicitIds),
    })),
    limit
  );

  return mergeAnatomyStructureLinks(explicitLinks, moduleAnatomy, inferred).slice(0, limit);
}

/** Reverse lookup — structures tied to memory cards via explicit ids or catalog overlap. */
export function getAnatomyStructuresForMemoryCardIds(
  cardIds: string[],
  opts?: { structureIds?: string[]; limit?: number }
): AnatomyStructureLink[] {
  const limit = opts?.limit ?? 3;
  const explicit = getAnatomyStructuresForStructureIds(opts?.structureIds ?? [], limit);
  if (cardIds.length === 0) return explicit;

  const cardSet = new Set(cardIds);
  const fromCards = ANATOMY_STRUCTURES.filter((s) =>
    s.memoryCardIds.some((id) => cardSet.has(id))
  )
    .sort((a, b) => {
      const overlap = (s: AnatomyStructure) =>
        s.memoryCardIds.filter((id) => cardSet.has(id)).length;
      const diff = overlap(b) - overlap(a);
      if (diff !== 0) return diff;
      if (a.highYield !== b.highYield) return a.highYield ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map(toStructureLink);

  return mergeAnatomyStructureLinks(explicit, fromCards).slice(0, limit);
}
