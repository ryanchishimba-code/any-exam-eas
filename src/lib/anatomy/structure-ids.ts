import { ANATOMY_STRUCTURES } from "./structures";

const VALID_STRUCTURE_IDS = new Set(ANATOMY_STRUCTURES.map((s) => s.id));

export function isValidAnatomyStructureId(id: string): boolean {
  return VALID_STRUCTURE_IDS.has(id);
}

export function assertValidAnatomyStructureIds(ids: string[], context: string): void {
  for (const id of ids) {
    if (!VALID_STRUCTURE_IDS.has(id)) {
      throw new Error(`${context}: unknown anatomy structure id "${id}"`);
    }
  }
}
