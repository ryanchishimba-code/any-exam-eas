/**
 * Order a gathered pool toward published blueprint weights before the sitting
 * caps run. NAPLEX uses the NABP five-domain outline (May 1, 2025): 25%
 * foundations, 25% medication-use process, 40% person-centered treatment
 * planning, 5% professional practice, 5% management. Law-only items stay on a
 * low ceiling because pharmacy law is an MPJE exam. Other boards are ordered
 * only when getExamBlueprint already has category weights.
 *
 * Targets are preferences. Items that do not fit are kept at the end so a
 * thin pool can still fill the length.
 */
import type { BankItem } from "@/lib/question-bank";
import { getExamBlueprint, type ExamBlueprint } from "@/lib/engine/blueprints";
import {
  NAPLEX_OUTLINE_2025,
  type NaplexOutlineDomainId,
} from "@/lib/pharmacy/naplex-outline-2025";

export type NaplexDiseaseId = "cardio" | "id" | "endocrine" | "renal" | "pulm" | "onc" | "psych";

export type NaplexSittingClass = {
  areaId: NaplexOutlineDomainId | "unclassified";
  disease: NaplexDiseaseId | null;
  lawOnly: boolean;
  subjectKey: string;
};

const DISEASE_FLOOR_AT_225: Record<NaplexDiseaseId, number> = {
  cardio: 16,
  id: 14,
  endocrine: 12,
  psych: 12,
  pulm: 8,
  renal: 6,
  onc: 6,
};

const DISEASE_SUBJECT: Record<string, NaplexDiseaseId> = {
  "cardiovascular-rx": "cardio",
  "infectious-disease-rx": "id",
  "endocrine-rx": "endocrine",
  "cns-rx": "psych",
};

const DISEASE_TOPIC: { id: NaplexDiseaseId; re: RegExp }[] = [
  { id: "endocrine", re: /\b(?:diabetes|sglt2|glp-?1|thyroid|insulin)\b/i },
  { id: "id", re: /\b(?:sepsis|pneumonia|stewardship|mrsa|pseudomonas|antibiotic)\b/i },
  { id: "pulm", re: /\b(?:asthma|copd)\b/i },
  { id: "cardio", re: /\b(?:heart failure|hypertension|anticoag|atrial fibrillation|\bacs\b|dyslipid)\b/i },
  { id: "psych", re: /\b(?:depress|ssri|epilep|seizure|schizophren|bipolar|antipsych)\b/i },
  { id: "onc", re: /\boncolog|chemotherapy|neutropenia/i },
  { id: "renal", re: /\b(?:ckd|dialysis|\baki\b|chronic kidney|renal dose)\b/i },
];

const MANAGEMENT_TOPIC =
  /\b(?:inventory|340b|formulary|drug shortage|workflow|reimbursement|billing)\b/i;
const PROCESS_TOPIC =
  /\b(?:verification|labeling|dispensing|reconcil|adherence|cold chain|auxiliary|administration device)\b/i;

/** Pharmacy-law rows. About 2% of the sitting, and never the professional-practice band by itself. */
export function naplexLawItemCeiling(limit: number): number {
  const n = Math.max(0, Math.floor(limit) || 0);
  if (n <= 0) return 0;
  return Math.max(1, Math.round(n * 0.02));
}

export function naplexDiseaseFloor(disease: NaplexDiseaseId, limit: number): number {
  const n = Math.max(0, Math.floor(limit) || 0);
  if (n <= 0) return 0;
  return Math.max(1, Math.round((DISEASE_FLOOR_AT_225[disease] * n) / 225));
}

function areaTargets(limit: number): Map<NaplexOutlineDomainId, number> {
  const counts = new Map<NaplexOutlineDomainId, number>();
  const parts = NAPLEX_OUTLINE_2025.map((area) => {
    const exact = (area.blueprintWeight / 100) * limit;
    return { id: area.id, floor: Math.floor(exact), frac: exact - Math.floor(exact) };
  });
  let used = 0;
  for (const part of parts) {
    counts.set(part.id, part.floor);
    used += part.floor;
  }
  const rest = [...parts].sort((left, right) => right.frac - left.frac);
  let leftover = limit - used;
  for (const part of rest) {
    if (leftover <= 0) break;
    counts.set(part.id, (counts.get(part.id) ?? 0) + 1);
    leftover -= 1;
  }
  return counts;
}

function blob(item: BankItem): string {
  return [item.subjectId, item.blueprintTopic, item.topicCategory, ...(item.tags ?? [])]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" \n ");
}

function diseaseFromText(text: string): NaplexDiseaseId | null {
  for (const row of DISEASE_TOPIC) {
    if (row.re.test(text)) return row.id;
  }
  return null;
}

/** Map one pharmacy row onto an NABP area and, when it is therapeutics, a disease state. */
export function classifyNaplexSittingItem(item: BankItem): NaplexSittingClass {
  const subject = (item.subjectId ?? "").trim().toLowerCase();
  const text = blob(item);
  const topicDisease = diseaseFromText(text);
  const subjectDisease = DISEASE_SUBJECT[subject] ?? null;
  const disease = topicDisease ?? subjectDisease;
  const lawSubject = subject === "pharmacy-law" || subject.includes("pharmacy law");
  if (lawSubject && !disease) {
    return { areaId: "naplex-area4-safety", disease: null, lawOnly: true, subjectKey: "pharmacy-law" };
  }
  if (disease) {
    return { areaId: "naplex-area3-treatment-planning", disease, lawOnly: false, subjectKey: disease };
  }
  if (MANAGEMENT_TOPIC.test(text)) {
    return { areaId: "naplex-area5-management", disease: null, lawOnly: false, subjectKey: "management" };
  }
  if (
    subject === "pharmacokinetics" ||
    subject === "pharmaceutics" ||
    subject === "compounding-calculations" ||
    subject === "pharmacology"
  ) {
    return { areaId: "naplex-area1-foundations", disease: null, lawOnly: false, subjectKey: subject };
  }
  if (subject === "patient-counseling" || subject === "otc-self-care") {
    const area = subject === "otc-self-care" ? "naplex-area3-treatment-planning" : "naplex-area2-therapeutics";
    return { areaId: area, disease: null, lawOnly: false, subjectKey: subject };
  }
  if (PROCESS_TOPIC.test(text)) {
    return { areaId: "naplex-area2-therapeutics", disease: null, lawOnly: false, subjectKey: subject || "process" };
  }
  const domain = (item.blueprintDomain ?? "").trim();
  if (NAPLEX_OUTLINE_2025.some((area) => area.id === domain)) {
    return {
      areaId: domain as NaplexOutlineDomainId,
      disease: null,
      lawOnly: false,
      subjectKey: subject || "other",
    };
  }
  return { areaId: "unclassified", disease: null, lawOnly: false, subjectKey: subject || "other" };
}

function subjectCeiling(subjectKey: string, limit: number): number {
  if (subjectKey === "pharmacy-law") return naplexLawItemCeiling(limit);
  if (subjectKey === "patient-counseling" || subjectKey === "pharmacology") {
    return Math.max(2, Math.round(limit * 0.08));
  }
  if (subjectKey === "pharmacokinetics" || subjectKey === "compounding-calculations") {
    return Math.max(2, Math.round(limit * 0.1));
  }
  if (subjectKey === "otc-self-care" || subjectKey === "pharmaceutics") {
    return Math.max(1, Math.round(limit * 0.06));
  }
  return Number.POSITIVE_INFINITY;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const random = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

type Tagged = { item: BankItem; slot: NaplexSittingClass };

function rankNaplex(items: readonly BankItem[], limit: number, seed: number): BankItem[] {
  const tagged = items.map((item) => ({ item, slot: classifyNaplexSittingItem(item) }));
  if (!tagged.some((row) => row.slot.areaId !== "unclassified")) return [...items];

  const buckets = new Map<string, Tagged[]>();
  const push = (key: string, row: Tagged) => {
    const list = buckets.get(key) ?? [];
    list.push(row);
    buckets.set(key, list);
  };
  for (const row of tagged) {
    if (row.slot.lawOnly) push("law", row);
    else if (row.slot.disease) push(`disease:${row.slot.disease}`, row);
    else push(row.slot.areaId, row);
  }
  for (const [key, list] of buckets) buckets.set(key, shuffle(list, seed ^ key.length));

  const targets = areaTargets(limit);
  const areaCounts = new Map<string, number>();
  const subjectCounts = new Map<string, number>();
  const chosen: BankItem[] = [];
  const used = new Set<BankItem>();

  const take = (row: Tagged | undefined, ignoreCeiling: boolean): boolean => {
    if (!row || used.has(row.item) || chosen.length >= items.length) return false;
    const ceiling = subjectCeiling(row.slot.subjectKey, limit);
    if (!ignoreCeiling && (subjectCounts.get(row.slot.subjectKey) ?? 0) >= ceiling) return false;
    if (!ignoreCeiling && row.slot.areaId !== "unclassified") {
      const cap = targets.get(row.slot.areaId as NaplexOutlineDomainId) ?? 0;
      // Allow a little headroom past the point weight so caps can still drop rows.
      if ((areaCounts.get(row.slot.areaId) ?? 0) >= cap + Math.max(2, Math.round(limit * 0.04))) return false;
    }
    used.add(row.item);
    chosen.push(row.item);
    subjectCounts.set(row.slot.subjectKey, (subjectCounts.get(row.slot.subjectKey) ?? 0) + 1);
    if (row.slot.areaId !== "unclassified") {
      areaCounts.set(row.slot.areaId, (areaCounts.get(row.slot.areaId) ?? 0) + 1);
    }
    return true;
  };

  const pull = (key: string, ignoreCeiling: boolean): boolean => {
    const list = buckets.get(key);
    if (!list) return false;
    while (list.length > 0) {
      const row = list.shift()!;
      if (take(row, ignoreCeiling)) return true;
    }
    return false;
  };

  const diseases = Object.keys(DISEASE_FLOOR_AT_225) as NaplexDiseaseId[];
  for (const disease of diseases) {
    const floor = Math.min(naplexDiseaseFloor(disease, limit), buckets.get(`disease:${disease}`)?.length ?? 0);
    for (let n = 0; n < floor; n++) pull(`disease:${disease}`, false);
  }

  const areaIds = NAPLEX_OUTLINE_2025.map((area) => area.id);
  let progress = true;
  while (progress && chosen.length < limit) {
    progress = false;
    for (const areaId of areaIds) {
      const cap = targets.get(areaId) ?? 0;
      if ((areaCounts.get(areaId) ?? 0) >= cap) continue;
      if (areaId === "naplex-area3-treatment-planning") {
        for (const disease of diseases) {
          if (pull(`disease:${disease}`, false)) {
            progress = true;
            break;
          }
        }
        if (progress) continue;
        if (pull("naplex-area3-treatment-planning", false)) progress = true;
        continue;
      }
      if (areaId === "naplex-area4-safety") {
        if (pull("naplex-area4-safety", false) || pull("law", false)) progress = true;
        continue;
      }
      if (pull(areaId, false)) progress = true;
    }
  }

  // Ceilings stay on the preferred prefix. Extra therapeutics, then other
  // non-law rows, then law, sit behind it so a short prefix can still fill.
  const unused = tagged.filter((row) => !used.has(row.item));
  const diseaseLeft = unused.filter((row) => row.slot.disease && !row.slot.lawOnly);
  const nonLaw = unused.filter((row) => !row.slot.lawOnly && !row.slot.disease);
  const law = unused.filter((row) => row.slot.lawOnly);
  return [
    ...chosen,
    ...diseaseLeft.map((row) => row.item),
    ...nonLaw.map((row) => row.item),
    ...law.map((row) => row.item),
  ];
}

function categoryOf(item: BankItem, blueprint: ExamBlueprint): string | null {
  const domain = item.blueprintDomain?.trim();
  if (domain && blueprint.categories.some((category) => category.id === domain)) return domain;
  const subject = item.subjectId?.trim().toLowerCase();
  if (!subject) return null;
  const match = blueprint.categories.find((category) =>
    (category.subjectIds ?? []).some((id) => id.toLowerCase() === subject)
  );
  return match?.id ?? null;
}

function rankGeneric(items: readonly BankItem[], limit: number, blueprint: ExamBlueprint, seed: number): BankItem[] {
  const groups = new Map<string, BankItem[]>();
  let classified = 0;
  for (const item of items) {
    const category = categoryOf(item, blueprint) ?? "unclassified";
    if (category !== "unclassified") classified += 1;
    const list = groups.get(category) ?? [];
    list.push(item);
    groups.set(category, list);
  }
  if (classified < 2) return [...items];
  for (const [key, list] of groups) groups.set(key, shuffle(list, seed ^ key.length));

  const weights = blueprint.categories.map((category) => ({
    id: category.id,
    exact: category.weight * limit,
  }));
  const targets = new Map<string, number>();
  let used = 0;
  for (const row of weights) {
    const floor = Math.floor(row.exact);
    targets.set(row.id, floor);
    used += floor;
  }
  const byFrac = [...weights].sort((left, right) => right.exact - Math.floor(right.exact) - (left.exact - Math.floor(left.exact)));
  let leftover = Math.max(0, limit - used);
  for (const row of byFrac) {
    if (leftover <= 0) break;
    targets.set(row.id, (targets.get(row.id) ?? 0) + 1);
    leftover -= 1;
  }

  const counts = new Map<string, number>();
  const chosen: BankItem[] = [];
  const seen = new Set<BankItem>();
  let progress = true;
  while (progress && chosen.length < limit) {
    progress = false;
    for (const category of blueprint.categories) {
      if ((counts.get(category.id) ?? 0) >= (targets.get(category.id) ?? 0)) continue;
      const list = groups.get(category.id);
      const next = list?.shift();
      if (!next || seen.has(next)) continue;
      seen.add(next);
      chosen.push(next);
      counts.set(category.id, (counts.get(category.id) ?? 0) + 1);
      progress = true;
    }
  }
  const tail = items.filter((item) => !seen.has(item));
  return [...chosen, ...tail];
}

/**
 * Preferred order for finalizeAssembledSitting. Unclassified pools keep their
 * incoming order so synthetic cap tests do not move.
 */
export function rankSittingByBlueprint(
  items: readonly BankItem[],
  limit: number,
  fieldId: string,
  seed = 0
): BankItem[] {
  const field = fieldId.trim().toLowerCase();
  if (field === "pharmacy" || field === "naplex") return rankNaplex(items, limit, seed);
  const blueprint = getExamBlueprint(field);
  if (!blueprint) return [...items];
  return rankGeneric(items, limit, blueprint, seed);
}
