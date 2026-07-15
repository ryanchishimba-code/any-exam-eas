import { ANATOMY_STRUCTURES } from "./structures";

/** Full published catalog (core + subregions + bones). */
const VALID_STRUCTURE_IDS = new Set(ANATOMY_STRUCTURES.map((s) => s.id));

export function isValidAnatomyStructureId(id: string): boolean {
  return VALID_STRUCTURE_IDS.has(id);
}

export function listAnatomyStructureIds(): string[] {
  return [...VALID_STRUCTURE_IDS];
}

export function assertValidAnatomyStructureIds(ids: string[], context: string): void {
  for (const id of ids) {
    if (!VALID_STRUCTURE_IDS.has(id)) {
      throw new Error(`${context}: unknown anatomy structure id "${id}"`);
    }
  }
}

/** Soft filter — drops unknown ids (used for deep-link sanitation). */
export function filterValidAnatomyStructureIds(ids: string[]): string[] {
  return ids.filter((id) => VALID_STRUCTURE_IDS.has(id));
}
