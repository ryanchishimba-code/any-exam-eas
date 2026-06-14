import { ANATOMY_STRUCTURES } from "../../structures";
import { ANATOMY_SYSTEM_LABELS, type AnatomyLayer, type AnatomyStructure, type AnatomySystem } from "../../types";

const byId = new Map(ANATOMY_STRUCTURES.map((s) => [s.id, s]));
const byMeshId = new Map(ANATOMY_STRUCTURES.map((s) => [s.meshId, s]));

export function getAnatomyStructure(id: string): AnatomyStructure | undefined {
  return byId.get(id);
}

/** Resolve catalog entry by mesh group id (3D scene / atlas meshId). */
export function getAnatomyStructureByMeshId(meshId: string): AnatomyStructure | undefined {
  return byMeshId.get(meshId);
}

export function getAllAnatomyStructures(): AnatomyStructure[] {
  return ANATOMY_STRUCTURES;
}

/** Top-level organs only — excludes sub-regions nested under parent organs. */
export function getTopLevelAnatomyStructures(): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => !s.parentId);
}

export function getSubregionsForStructure(parentId: string): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => s.parentId === parentId);
}

export function isAnatomySubregion(structure: AnatomyStructure): boolean {
  return Boolean(structure.parentId);
}

export function searchAnatomyStructures(
  query: string,
  opts?: {
    highYieldOnly?: boolean;
    system?: AnatomySystem | "all";
    layer?: AnatomyLayer | "all";
  }
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

const SYSTEM_ORDER = Object.keys(ANATOMY_SYSTEM_LABELS) as AnatomySystem[];

/** Group structures by organ system in canonical display order. */
export function groupStructuresBySystem(
  structures: AnatomyStructure[]
): { system: AnatomySystem; structures: AnatomyStructure[] }[] {
  const buckets = new Map<AnatomySystem, AnatomyStructure[]>();
  for (const s of structures) {
    const list = buckets.get(s.system) ?? [];
    list.push(s);
    buckets.set(s.system, list);
  }
  return SYSTEM_ORDER.filter((system) => buckets.has(system)).map((system) => ({
    system,
    structures: buckets.get(system)!,
  }));
}

export function getHighYieldStructures(): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => s.highYield);
}

export function structureVisibleInLayers(
  structure: AnatomyStructure,
  visibleLayers: Set<AnatomyLayer>
): boolean {
  return visibleLayers.has(structure.layer);
}

export function getAnatomyStructuresForMemoryCard(cardId: string): AnatomyStructure[] {
  return ANATOMY_STRUCTURES.filter((s) => s.memoryCardIds.includes(cardId));
}
