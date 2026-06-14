import { getAnatomyStructure } from "../systems/catalog";
import { ANATOMY_PROCEDURES } from "./curated";
import type { AnatomyProcedure } from "./types";

export { ANATOMY_PROCEDURES };

export function getProcedureById(id: string): AnatomyProcedure | undefined {
  return ANATOMY_PROCEDURES.find((p) => p.id === id);
}

export function getProceduresForStructure(structureId: string): AnatomyProcedure[] {
  const structure = getAnatomyStructure(structureId);
  const parentId = structure?.parentId;
  return ANATOMY_PROCEDURES.filter(
    (p) =>
      p.structureIds.includes(structureId) ||
      (parentId && p.structureIds.includes(parentId)) ||
      p.subregionIds?.includes(structureId)
  );
}

export function getHighYieldProcedures(): AnatomyProcedure[] {
  return ANATOMY_PROCEDURES.filter((p) => p.highYield);
}

export function getProceduresForSubregion(subregionId: string): AnatomyProcedure[] {
  return ANATOMY_PROCEDURES.filter(
    (p) => p.subregionIds?.includes(subregionId) || p.structureIds.includes(subregionId)
  );
}

export function searchProcedures(query: string, opts?: { highYieldOnly?: boolean }): AnatomyProcedure[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ANATOMY_PROCEDURES.filter((p) => {
    if (opts?.highYieldOnly && !p.highYield) return false;
    const haystack = [
      p.name,
      p.indication,
      p.examPearl,
      ...(p.aliases ?? []),
      ...p.complications,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function assertProcedureCatalogIntegrity(): string[] {
  const issues: string[] = [];
  for (const proc of ANATOMY_PROCEDURES) {
    if (proc.structureIds.length === 0) {
      issues.push(`procedure:${proc.id}:no-structures`);
    }
    for (const sid of proc.structureIds) {
      if (!getAnatomyStructure(sid)) {
        issues.push(`procedure:${proc.id}:structure:${sid}`);
      }
    }
    for (const subId of proc.subregionIds ?? []) {
      if (!getAnatomyStructure(subId)) {
        issues.push(`procedure:${proc.id}:subregion:${subId}`);
      }
    }
  }
  return issues;
}
