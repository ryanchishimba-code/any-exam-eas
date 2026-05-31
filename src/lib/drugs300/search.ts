import {
  classifyDrug,
  getDrugClassMeta,
  TOP_500_DRUGS,
  type DrugEntry,
} from "./catalog";

export type DrugSearchHit = {
  id: string;
  rank: number;
  generic: string;
  brand: string;
  therapeuticClass: string;
  drugClassLabel: string;
  drugClassColor: string;
  score: number;
};

type IndexedDrug = {
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

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function brandTokens(brand: string): string[] {
  return brand
    .split(/[,/]+/)
    .map((part) => normalize(part))
    .filter(Boolean);
}

function indexDrug(drug: DrugEntry): IndexedDrug {
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

const DRUG_SEARCH_INDEX: IndexedDrug[] = TOP_500_DRUGS.map(indexDrug);

function scoreIndexedDrug(drug: IndexedDrug, tokens: string[]): number {
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

function indexedToHit(drug: IndexedDrug, score: number): DrugSearchHit {
  return {
    id: drug.id,
    rank: drug.rank,
    generic: drug.generic,
    brand: drug.brand,
    therapeuticClass: drug.therapeuticClass,
    drugClassLabel: drug.drugClassLabel,
    drugClassColor: drug.drugClassColor,
    score,
  };
}

export function searchDrugs(
  query: string,
  catalog: IndexedDrug[] = DRUG_SEARCH_INDEX,
  limit = 8
): DrugSearchHit[] {
  const tokens = normalize(query)
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return [];

  const hits: DrugSearchHit[] = [];

  for (const drug of catalog) {
    const score = scoreIndexedDrug(drug, tokens);
    if (score <= 0) continue;
    hits.push(indexedToHit(drug, score));
  }

  return hits
    .sort((a, b) => b.score - a.score || a.rank - b.rank)
    .slice(0, limit);
}

export function getDrugSearchHitById(id: string): DrugSearchHit | null {
  const drug = DRUG_SEARCH_INDEX.find((entry) => entry.id === id);
  if (!drug) return null;
  return indexedToHit(drug, 0);
}
