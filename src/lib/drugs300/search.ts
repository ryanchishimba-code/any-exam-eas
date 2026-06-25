import {
  classifyDrug,
  getDrugClassMeta,
  TOP_500_DRUGS,
  type DrugEntry,
} from "./catalog";
import type { FdaDrugReference } from "./schema";
import type { FdaDrugSearchIndex } from "./fda-reference";

export type DrugSearchTier = "curated" | "fda-reference";

export type DrugSearchHit = {
  id: string;
  tier: DrugSearchTier;
  rank: number | null;
  generic: string;
  brand: string;
  therapeuticClass: string;
  drugClassLabel: string;
  drugClassColor: string;
  score: number;
  fdaReference?: FdaDrugReference;
};

type IndexedCuratedDrug = {
  id: string;
  rank: number;
  generic: string;
  brand: string;
  therapeuticClass: string;
  drugClassLabel: string;
  drugClassColor: string;
  genericNorm: string;
  brandsNorm: string[];
  therapeuticNorm: string;
  classLabelNorm: string;
};

type IndexedFdaDrug = {
  id: string;
  generic: string;
  brand: string;
  genericNorm: string;
  brandsNorm: string[];
  routesNorm: string[];
  formsNorm: string[];
  reference: FdaDrugReference;
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function brandTokens(brand: string): string[] {
  return brand
    .split(/[,/]+/)
    .map((part) => normalize(part))
    .filter(Boolean);
}

function indexCuratedDrug(drug: DrugEntry): IndexedCuratedDrug {
  const classMeta = getDrugClassMeta(classifyDrug(drug.therapeuticClass));
  return {
    id: drug.id,
    rank: drug.rank,
    generic: drug.generic,
    brand: drug.brand,
    therapeuticClass: drug.therapeuticClass,
    drugClassLabel: classMeta.label,
    drugClassColor: classMeta.color,
    genericNorm: normalize(drug.generic),
    brandsNorm: brandTokens(drug.brand),
    therapeuticNorm: normalize(drug.therapeuticClass),
    classLabelNorm: normalize(classMeta.label),
  };
}

function indexFdaDrug(drug: FdaDrugReference): IndexedFdaDrug {
  return {
    id: drug.id,
    generic: drug.generic,
    brand: drug.brands.join(", "),
    genericNorm: normalize(drug.generic),
    brandsNorm: drug.brands.map((brand) => normalize(brand)),
    routesNorm: drug.routes.map((route) => normalize(route)),
    formsNorm: drug.dosageForms.map((form) => normalize(form)),
    reference: drug,
  };
}

const CURATED_SEARCH_INDEX: IndexedCuratedDrug[] = TOP_500_DRUGS.map(indexCuratedDrug);

function scoreCuratedDrug(drug: IndexedCuratedDrug, tokens: string[]): number {
  let score = 0;

  for (const token of tokens) {
    if (drug.genericNorm === token) score += 200;
    else if (drug.genericNorm.startsWith(token)) score += 120;
    else if (drug.genericNorm.includes(token)) score += 60;

    for (const brand of drug.brandsNorm) {
      if (brand === token) score += 150;
      else if (brand.startsWith(token)) score += 100;
      else if (brand.includes(token)) score += 50;
    }

    if (drug.therapeuticNorm.includes(token)) score += 35;
    if (drug.classLabelNorm.includes(token)) score += 30;
  }

  return score;
}

function scoreFdaDrug(drug: IndexedFdaDrug, tokens: string[]): number {
  let score = 0;

  for (const token of tokens) {
    if (drug.genericNorm === token) score += 180;
    else if (drug.genericNorm.startsWith(token)) score += 110;
    else if (drug.genericNorm.includes(token)) score += 55;

    for (const brand of drug.brandsNorm) {
      if (brand === token) score += 130;
      else if (brand.startsWith(token)) score += 90;
      else if (brand.includes(token)) score += 45;
    }

    if (drug.routesNorm.some((route) => route.includes(token))) score += 20;
    if (drug.formsNorm.some((form) => form.includes(token))) score += 15;
  }

  return score;
}

function curatedToHit(drug: IndexedCuratedDrug, score: number): DrugSearchHit {
  return {
    id: drug.id,
    tier: "curated",
    rank: drug.rank,
    generic: drug.generic,
    brand: drug.brand,
    therapeuticClass: drug.therapeuticClass,
    drugClassLabel: drug.drugClassLabel,
    drugClassColor: drug.drugClassColor,
    score,
  };
}

function fdaToHit(drug: IndexedFdaDrug, score: number): DrugSearchHit {
  return {
    id: drug.id,
    tier: "fda-reference",
    rank: null,
    generic: drug.generic,
    brand: drug.brand,
    therapeuticClass: "FDA reference",
    drugClassLabel: "FDA reference",
    drugClassColor: "#64748b",
    score,
    fdaReference: drug.reference,
  };
}

function buildFdaIndex(fdaIndex: FdaDrugSearchIndex): IndexedFdaDrug[] {
  return fdaIndex.drugs.map(indexFdaDrug);
}

export function searchDrugs(
  query: string,
  fdaIndex?: FdaDrugSearchIndex | null,
  limit = 8
): DrugSearchHit[] {
  const tokens = normalize(query)
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return [];

  const hits: DrugSearchHit[] = [];

  for (const drug of CURATED_SEARCH_INDEX) {
    const score = scoreCuratedDrug(drug, tokens);
    if (score <= 0) continue;
    hits.push(curatedToHit(drug, score + 25));
  }

  if (fdaIndex) {
    for (const drug of buildFdaIndex(fdaIndex)) {
      const score = scoreFdaDrug(drug, tokens);
      if (score <= 0) continue;
      hits.push(fdaToHit(drug, score));
    }
  }

  return hits
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.tier !== b.tier) return a.tier === "curated" ? -1 : 1;
      return (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, limit);
}

export function getDrugSearchHitById(
  id: string,
  fdaIndex?: FdaDrugSearchIndex | null
): DrugSearchHit | null {
  const curated = CURATED_SEARCH_INDEX.find((entry) => entry.id === id);
  if (curated) return curatedToHit(curated, 0);

  const fda = fdaIndex?.byId.get(id);
  if (!fda) return null;
  return fdaToHit(indexFdaDrug(fda), 0);
}

export function getCuratedDrugSearchHitById(id: string): DrugSearchHit | null {
  return getDrugSearchHitById(id);
}
