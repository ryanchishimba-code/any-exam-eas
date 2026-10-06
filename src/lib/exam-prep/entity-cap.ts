import type { BankItem } from "@/lib/question-bank";
import { assignSittingClusters, sequentialSetId } from "@/lib/exam-prep/sitting-clusters";

/**
 * Share cap for a drug or condition named in the stem.
 * Unlike the narrow-topic ceiling of 4, this follows max(2, 4%) at every length.
 */
export function entityShareCap(sittingLength: number): number {
  const length = Math.max(0, Math.floor(sittingLength) || 0);
  if (length <= 0) return 2;
  return Math.max(2, Math.ceil(length * 0.04));
}

/** NCLEX dosage items stay near 8–10% of the sitting. */
export function nursingDosageShareCap(sittingLength: number): number {
  const length = Math.max(0, Math.floor(sittingLength) || 0);
  if (length <= 0) return 2;
  return Math.max(2, Math.round(length * 0.09));
}

const DRUGS = [
  "acetaminophen",
  "albuterol",
  "amlodipine",
  "apixaban",
  "aspirin",
  "atorvastatin",
  "carbidopa",
  "carvedilol",
  "cephalexin",
  "clonazepam",
  "clonidine",
  "dabigatran",
  "digoxin",
  "donepezil",
  "enoxaparin",
  "fluoxetine",
  "furosemide",
  "glipizide",
  "heparin",
  "ibuprofen",
  "insulin",
  "lamotrigine",
  "levodopa",
  "levofloxacin",
  "levothyroxine",
  "liraglutide",
  "lisinopril",
  "lorazepam",
  "losartan",
  "metformin",
  "methotrexate",
  "metoprolol",
  "morphine",
  "naloxone",
  "omeprazole",
  "paroxetine",
  "phenytoin",
  "prednisone",
  "rivaroxaban",
  "rosuvastatin",
  "sertraline",
  "simvastatin",
  "spironolactone",
  "tiotropium",
  "vancomycin",
  "warfarin",
  "zolpidem",
].sort((left, right) => right.length - left.length);

const CONDITIONS: { key: string; re: RegExp }[] = [
  { key: "cholecystectomy", re: /\b(?:laparoscopic cholecystectomy|lap(?:aroscopic)? chole|cholecystectomy)\b/i },
  { key: "suicide", re: /\bsuicid\w*|\bself-harm\b/i },
  { key: "preeclampsia", re: /\bpreeclampsia\b/i },
  { key: "gestational-diabetes", re: /\bgestational diabetes\b/i },
  { key: "heart-failure", re: /\bheart failure\b/i },
  { key: "ckd", re: /\bchronic kidney disease\b|\bckd\b/i },
  { key: "c-diff", re: /\bc\.?\s*diff\w*|\bclostridioides\b/i },
  { key: "early-deceleration", re: /\bearly decelerat\w*\b/i },
  { key: "bowel-obstruction", re: /\bileus\b|\bbowel obstruction\b/i },
  { key: "burns", re: /\bparkland\b|\btbsa\b|\bpartial-thickness burns\b/i },
  { key: "sepsis", re: /\bsepsis\b|\bseptic\b/i },
  { key: "hypoglycemia", re: /\bhypoglycemi\w*\b/i },
  { key: "pca", re: /\bpca\b|\bpatient-controlled analgesia\b/i },
];

const ASKS: { key: string; re: RegExp }[] = [
  { key: "loading-dose", re: /\bloading dose\b/i },
  { key: "volume-distribution", re: /\bvolume of distribution\b|\bvd\b/i },
  { key: "inr", re: /\binr\b/i },
  { key: "contraceptive", re: /\boral contraceptive\b|\bbirth control\b|\bocp\b/i },
  { key: "steady-state", re: /\bsteady[ -]state\b/i },
  { key: "trough", re: /\btrough\b/i },
  { key: "iv-rate", re: /\bml\/hr\b|\bwhat rate\b|\binfusion rate\b|\bdrops per minute\b|\bgtt\b/i },
  { key: "tablet-count", re: /\bhow many tablets\b/i },
  { key: "weight-dose", re: /\bmg\/kg\b|\bweight-based\b|\bwhat dose\s*\(\s*mg\s*\)/i },
  { key: "counseling", re: /\bcounsel(?:ing|ling)?\b/i },
];

const DOSAGE_ITEM =
  /\bhow many\b[^.\n]{0,60}\b(?:ml|milliliters|tablets|capsules|milligrams|drops)\b|\bml\/hr\b|\bmg\/kg\b|\bround to the nearest\b|\binfusion rate\b|\bwhat rate\b|\bwhat dose\s*\(\s*mg\s*\)/i;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function itemClinicalText(item: Pick<BankItem, "question" | "vignette" | "scenario">): string {
  return [item.scenario, item.vignette, item.question].filter(Boolean).join("\n");
}

export function askSignature(text: string): string | null {
  return ASKS.find((ask) => ask.re.test(text))?.key ?? null;
}

export function isNursingDosageItem(text: string): boolean {
  return DOSAGE_ITEM.test(text);
}

function matchDrug(text: string): string | null {
  for (const drug of DRUGS) {
    if (new RegExp(`\\b${escapeRegExp(drug)}\\b`, "i").test(text)) return drug;
  }
  return null;
}

function matchCondition(text: string): string | null {
  return CONDITIONS.find((condition) => condition.re.test(text))?.key ?? null;
}

export function isNursingSittingField(fieldId: string): boolean {
  return fieldId === "nursing" || fieldId.startsWith("nclex");
}

/** Drug wins over a co-mentioned condition. Generic calc templates key off the ask. */
export function sittingEntityKey(text: string, fieldId: string): string | null {
  const drug = matchDrug(text);
  if (drug) return `drug:${drug}`;
  const condition = matchCondition(text);
  if (condition) return `condition:${condition}`;
  if (isNursingSittingField(fieldId) && isNursingDosageItem(text)) {
    const ask = askSignature(text);
    if (ask) return `calc:${ask}`;
  }
  return null;
}

export function enforceEntityAndDosageCap(
  items: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number,
  fieldId: string
): BankItem[] {
  const entityCap = entityShareCap(limit);
  const dosageMax = isNursingSittingField(fieldId) ? nursingDosageShareCap(limit) : Number.POSITIVE_INFINITY;
  const entityCounts = new Map<string, number>();
  const askCounts = new Map<string, number>();
  let dosage = 0;
  const kept: BankItem[] = [];
  const used = new Set<string>();
  const clusterIds = assignSittingClusters([...pool]);
  const clusterByItem = new Map<BankItem, string>();
  const clusterById = new Map<string, string>();
  pool.forEach((item, index) => {
    const cluster = clusterIds[index] ?? `pool-${index}`;
    clusterByItem.set(item, cluster);
    const id = item.id?.trim();
    if (id) clusterById.set(id, cluster);
  });
  const usedClusters = new Set<string>();

  const accept = (item: BankItem): boolean => {
    const id = item.id?.trim();
    if (id && used.has(id)) return false;
    if (sequentialSetId(item)) {
      if (id) used.add(id);
      kept.push(item);
      return true;
    }
    const cluster = clusterByItem.get(item) ?? (id ? clusterById.get(id) : undefined);
    if (cluster && usedClusters.has(cluster)) return false;
    const text = itemClinicalText(item);
    const entity = sittingEntityKey(text, fieldId);
    const ask = entity ? askSignature(text) : null;
    const dose = isNursingSittingField(fieldId) && isNursingDosageItem(text);
    if (entity && (entityCounts.get(entity) ?? 0) >= entityCap) return false;
    if (entity && ask && (askCounts.get(`${entity}:${ask}`) ?? 0) >= 1) return false;
    if (dose && dosage >= dosageMax) return false;
    if (entity) entityCounts.set(entity, (entityCounts.get(entity) ?? 0) + 1);
    if (entity && ask) askCounts.set(`${entity}:${ask}`, 1);
    if (dose) dosage += 1;
    if (cluster) usedClusters.add(cluster);
    if (id) used.add(id);
    kept.push(item);
    return true;
  };

  for (const item of items) {
    if (kept.length >= limit) break;
    accept(item);
  }
  if (kept.length < limit) {
    for (const item of pool) {
      if (kept.length >= limit) break;
      accept(item);
    }
  }
  return kept.slice(0, limit);
}
