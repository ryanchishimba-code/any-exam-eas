import type { MemoryCard } from "@/lib/reference/types";
import { ANATOMY_STRUCTURES } from "./structures";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "./types";

const byId = new Map(ANATOMY_STRUCTURES.map((s) => [s.id, s]));

export function getAnatomyStructure(id: string): AnatomyStructure | undefined {
  return byId.get(id);
}

export function getAllAnatomyStructures(): AnatomyStructure[] {
  return ANATOMY_STRUCTURES;
}

export function searchAnatomyStructures(
  query: string,
  opts?: { highYieldOnly?: boolean; system?: AnatomySystem | "all"; layer?: AnatomyLayer | "all" }
): AnatomyStructure[] {
  const q = query.trim().toLowerCase();
  return ANATOMY_STRUCTURES.filter((s) => {
    if (opts?.highYieldOnly && !s.highYield) return false;
    if (opts?.system && opts.system !== "all" && s.system !== opts.system) return false;
    if (opts?.layer && opts.layer !== "all" && s.layer !== opts.layer) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q)) ||
      s.description.toLowerCase().includes(q)
    );
  });
}

export function getStructuresForSystem(system: AnatomySystem): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => s.system === system);
}

export function getHighYieldStructures(): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => s.highYield);
}

/** Resolve memory cards linked to a structure id. */
export function getMemoryCardsForStructure(
  cards: MemoryCard[],
  structureId: string
): MemoryCard[] {
  const structure = byId.get(structureId);
  if (!structure || structure.memoryCardIds.length === 0) return [];
  const cardMap = new Map(cards.map((c) => [c.id, c]));
  return structure.memoryCardIds
    .map((id) => cardMap.get(id))
    .filter((c): c is MemoryCard => Boolean(c));
}

/** Reverse lookup: structures that reference a memory card id. */
export function getAnatomyStructuresForMemoryCard(cardId: string): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => s.memoryCardIds.includes(cardId));
}

/** Structures visible when a layer toggle is on. */
export function structureVisibleInLayers(
  structure: AnatomyStructure,
  visibleLayers: Set<AnatomyLayer>
): boolean {
  return visibleLayers.has(structure.layer);
}

export function isBioDigitalAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_BIODIGITAL_APP_ID?.trim());
}
