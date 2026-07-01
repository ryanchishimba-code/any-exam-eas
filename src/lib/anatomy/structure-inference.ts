import { ANATOMY_STRUCTURES } from "./structures";
import type { AnatomyStructureLink } from "./topic-links";
import { mergeAnatomyStructureLinks } from "./topic-links";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function wordBoundaryMatch(haystack: string, term: string): boolean {
  const t = term.trim().toLowerCase();
  if (t.length < 3) return false;
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
}

function toLink(structure: (typeof ANATOMY_STRUCTURES)[number]): AnatomyStructureLink {
  return {
    id: structure.id,
    name: structure.name,
    system: structure.system,
    highYield: structure.highYield,
  };
}

function scoreStructure(structure: (typeof ANATOMY_STRUCTURES)[number], haystack: string): number {
  let score = 0;
  const name = structure.name.toLowerCase();

  if (wordBoundaryMatch(haystack, name)) score += 16;
  else {
    for (const part of name.split(/\s+/)) {
      if (part.length >= 4 && wordBoundaryMatch(haystack, part)) score += 10;
    }
  }

  for (const keyword of structure.keywords) {
    if (wordBoundaryMatch(haystack, keyword)) score += keyword.length >= 6 ? 7 : 4;
  }

  if (structure.highYield) score += 2;
  if (structure.parentId) score -= 1;

  return score;
}

/**
 * Infer relevant anatomy structures from question stem, rationale, or tags.
 * Uses name/keyword matching — complements explicit payload structureIds.
 */
export function inferAnatomyStructuresFromText(
  text: string,
  opts?: { limit?: number; minScore?: number }
): AnatomyStructureLink[] {
  const limit = opts?.limit ?? 3;
  const minScore = opts?.minScore ?? 6;
  const haystack = normalize(text);
  if (!haystack.trim()) return [];

  const scored = ANATOMY_STRUCTURES.map((structure) => ({
    structure,
    score: scoreStructure(structure, haystack),
  }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.structure.highYield !== b.structure.highYield) {
        return a.structure.highYield ? -1 : 1;
      }
      return a.structure.name.localeCompare(b.structure.name);
    })
    .slice(0, limit)
    .map(({ structure }) => toLink(structure));

  return mergeAnatomyStructureLinks(scored).slice(0, limit);
}
