import { getAllAnatomyStructures } from "@/lib/anatomy";
import { TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import type { AnatomyDiseaseLink } from "./types";
import { searchTermsForPathology, slugifyPathology } from "./synonyms";

type DrugMatch = {
  drugId: string;
  score: number;
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function scoreDrugForPathology(
  indications: string,
  therapeuticClass: string,
  terms: string[],
  structureKeywords: string[]
): number {
  const haystack = normalize(`${indications} ${therapeuticClass}`);
  let score = 0;

  for (const term of terms) {
    if (term.length < 3) continue;
    if (haystack.includes(term)) score += term.length >= 8 ? 12 : 8;
  }

  for (const kw of structureKeywords) {
    if (kw.length < 4) continue;
    if (haystack.includes(kw)) score += 3;
  }

  return score;
}

function matchDrugsForPathology(
  pathology: string,
  structureKeywords: string[]
): { matched: string[]; topScore: number } {
  const terms = searchTermsForPathology(pathology);
  const matches: DrugMatch[] = [];

  for (const drug of TOP_500_DRUGS) {
    const score = scoreDrugForPathology(
      drug.indications,
      drug.therapeuticClass,
      terms,
      structureKeywords
    );
    // Raised bar: weak substring hits are not shown as therapies.
    if (score >= 12) matches.push({ drugId: drug.id, score });
  }

  matches.sort((a, b) => b.score - a.score);
  const top = matches.slice(0, 5);
  return {
    matched: top.map((m) => m.drugId),
    topScore: top[0]?.score ?? 0,
  };
}

function curatedCoversPathology(
  curated: AnatomyDiseaseLink[],
  structureId: string,
  pathology: string
): boolean {
  const norm = pathology.toLowerCase();
  return curated.some(
    (c) =>
      c.structureIds.includes(structureId) &&
      (c.pathologyLabel?.toLowerCase() === norm ||
        c.name.toLowerCase() === norm ||
        c.name.toLowerCase().includes(norm))
  );
}

/**
 * Auto-link pathologies to Top 500 drugs via indication text matching.
 * Matches are always adjunct-only (never first-line) and flagged auto-matched.
 */
export function buildSupplementalDiseaseLinks(
  curated: AnatomyDiseaseLink[]
): AnatomyDiseaseLink[] {
  const supplemental: AnatomyDiseaseLink[] = [];

  for (const structure of getAllAnatomyStructures()) {
    const pathologies = structure.pathologies ?? [];
    if (pathologies.length === 0) continue;

    const keywords = [
      structure.name.toLowerCase(),
      structure.system,
      ...structure.keywords.map((k) => k.toLowerCase()),
    ];

    for (const pathology of pathologies) {
      if (curatedCoversPathology(curated, structure.id, pathology)) continue;

      const { matched, topScore } = matchDrugsForPathology(pathology, keywords);
      if (matched.length === 0 || topScore < 12) continue;

      supplemental.push({
        id: `gen-${structure.id}-${slugifyPathology(pathology)}`,
        name: pathology,
        structureIds: [structure.id],
        pathologyLabel: pathology,
        pathophysiology: structure.description.split(".")[0] + ".",
        presentation: [
          "Matched therapies (review) — not guideline-verified first-line",
          ...structure.clinicalFacts.slice(0, 1),
        ],
        firstLineDrugIds: [],
        adjunctDrugIds: matched,
        examPearl: structure.clinicalFacts[0],
        highYield: false,
        generated: true,
        evidenceLevel: "auto-matched",
      });
    }
  }

  return supplemental;
}

export function matchDrugsToPathologyForTest(
  pathology: string,
  structureKeywords: string[] = []
): { firstLine: string[]; adjunct: string[] } {
  const { matched } = matchDrugsForPathology(pathology, structureKeywords);
  // Test helper preserves historical shape; auto-matches are adjunct-only.
  return { firstLine: [], adjunct: matched };
}
