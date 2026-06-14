import { ANATOMY_STRUCTURES } from "@/lib/anatomy/structures";
import { searchProcedures } from "@/lib/anatomy/procedures";
import { getPrimaryStructureIdForProcedure } from "@/lib/anatomy/procedure-recommendations";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { searchDrugs, type DrugSearchHit } from "@/lib/drugs300/search";
import type { ExamSlug } from "@/types/edtech";
import type { MemoryCard } from "./types";
import { queryMemoryCards } from "./memory-cards";

export type HubReviewModuleHit = {
  slug: string;
  title: string;
  overview: string;
  practiceTopicSlug: string;
};

export type HubAnatomyHit = {
  id: string;
  name: string;
  system: string;
  description: string;
};

export type HubProcedureHit = {
  id: string;
  name: string;
  indication: string;
  structureId: string;
};

export type HubSearchResults = {
  cards: MemoryCard[];
  drugs: DrugSearchHit[];
  modules: HubReviewModuleHit[];
  anatomy: HubAnatomyHit[];
  procedures: HubProcedureHit[];
};

function matchesQuery(parts: string[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return false;
  const haystack = parts.join(" ").toLowerCase();
  return haystack.includes(q);
}

function searchReviewModules(examSlug: ExamSlug, query: string): HubReviewModuleHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return REVIEW_MODULE_TOPICS.filter((m) => m.examSlug === examSlug)
    .filter((m) =>
      matchesQuery([m.slug, m.title, m.overview, m.practiceTopicSlug, ...m.keyConcepts], q)
    )
    .slice(0, 4)
    .map((m) => ({
      slug: m.slug,
      title: m.title,
      overview: m.overview,
      practiceTopicSlug: m.practiceTopicSlug,
    }));
}

function searchAnatomyStructures(query: string): HubAnatomyHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return ANATOMY_STRUCTURES.filter((s) =>
    matchesQuery(
      [s.id, s.name, s.system, s.description, ...s.keywords, ...(s.pathologies ?? [])],
      q
    )
  )
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      name: s.name,
      system: s.system,
      description: s.description,
    }));
}

function searchHubProcedures(query: string): HubProcedureHit[] {
  return searchProcedures(query)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      indication: p.indication,
      structureId:
        p.subregionIds?.[0] ?? p.structureIds[0] ?? getPrimaryStructureIdForProcedure(p.id) ?? "",
    }))
    .filter((p) => p.structureId);
}

export function searchReferenceHub(
  cards: MemoryCard[],
  examSlug: ExamSlug,
  query: string
): HubSearchResults {
  const q = query.trim();
  if (q.length < 2) {
    return { cards: [], drugs: [], modules: [], anatomy: [], procedures: [] };
  }
  return {
    cards: queryMemoryCards(cards, { query: q }).slice(0, 6),
    drugs: searchDrugs(q, undefined, 5),
    modules: searchReviewModules(examSlug, q),
    anatomy: searchAnatomyStructures(q),
    procedures: searchHubProcedures(q),
  };
}

export function hubSearchHasResults(results: HubSearchResults): boolean {
  return (
    results.cards.length > 0 ||
    results.drugs.length > 0 ||
    results.modules.length > 0 ||
    results.anatomy.length > 0 ||
    results.procedures.length > 0
  );
}

/** Match Top 500 drugs mentioned in card tags/title for sheet quick links. */
export function relatedDrugsForMemoryCard(card: MemoryCard, limit = 4): DrugSearchHit[] {
  const terms = [...card.tags, card.title, card.topic];
  const seen = new Set<string>();
  const hits: DrugSearchHit[] = [];

  for (const term of terms) {
    if (term.length < 4) continue;
    for (const hit of searchDrugs(term, undefined, 2)) {
      if (seen.has(hit.id)) continue;
      seen.add(hit.id);
      hits.push(hit);
      if (hits.length >= limit) return hits;
    }
  }

  return hits;
}
