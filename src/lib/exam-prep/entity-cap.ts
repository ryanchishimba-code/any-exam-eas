import type { BankItem } from "@/lib/question-bank";
import { narrowTopicKeyFromBankItem, narrowTopicShareCap } from "@/lib/exam-prep/narrow-topic";
import { assignSittingClusters, sequentialSetId } from "@/lib/exam-prep/sitting-clusters";
import { isServableToStudents } from "@/lib/exam-prep/student-eligibility";

/**
 * Share cap for a drug or condition named in the stem.
 * Unlike the narrow-topic ceiling of 4, this follows max(2, 4%) at every length.
 * Rounding keeps a 50-item sitting at 2 and an 85-item sitting at 3.
 */
export function entityShareCap(sittingLength: number): number {
  const length = Math.max(0, Math.floor(sittingLength) || 0);
  if (length <= 0) return 2;
  return Math.max(2, Math.round(length * 0.04));
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
  "amoxicillin",
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
  "clopidogrel",
  "gabapentin",
  "gentamicin",
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
  { key: "preeclampsia", re: /\bpreeclampsia\b|\blate decel\w*\b/i },
  { key: "hip-arthroplasty", re: /\b(?:total hip|hip)\s+(?:arthroplasty|replacement)\b|\bhip arthroplasty\b/i },
  { key: "postpartum-hemorrhage", re: /\bpost-?partum hemorrhage\b|\bpph\b/i },
  { key: "gestational-diabetes", re: /\bgestational diabetes\b/i },
  {
    key: "gallbladder",
    re: /\bgallbladder\b|\bcholecystitis\b|\bcholelithiasis\b|\b(?:laparoscopic cholecystectomy|lap(?:aroscopic)? chole|cholecystectomy)\b/i,
  },
  { key: "suicide", re: /\bsuicid\w*|\bself-harm\b|\bdepress\w*/i },
  { key: "pregnancy", re: /\bpregnan\w*|\bprenatal\b|\bantenatal\b|\btrimester\b/i },
  { key: "anaphylaxis", re: /\banaphylax\w*/i },
  { key: "heart-failure", re: /\bheart failure\b/i },
  { key: "ckd", re: /\bchronic kidney disease\b|\bckd\b/i },
  { key: "c-diff", re: /\bc\.?\s*diff\w*|\bclostridioides\b/i },
  { key: "early-deceleration", re: /\bearly decelerat\w*\b/i },
  { key: "bowel-obstruction", re: /\bileus\b|\bbowel obstruction\b/i },
  { key: "burns", re: /\bburns?\b|\bparkland\b|\btbsa\b|\bpartial-thickness\b/i },
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

const CALC_ITEM =
  /\b(?:calculate|how many|how much|round to|ml\/hr|mg\/kg|mg\/\s*ml|concentration|infusion rate|drops per|\bgtt\b|\bauc\b|alligation|isotonicity|e-value|percent strength|w\/v|w\/w)\b/i;

const CALC_TEMPLATE =
  /\b(?:how many|how much|calculate|concentration|mg\s*\/\s*ml|tablets?|capsules?)\b/i;

/** About 8% of a pharmacy sitting, clamped to 6–10% and at least 2 when the exam is long enough. */
export function pharmacyCalculationQuota(limit: number): number {
  const length = Math.max(0, Math.floor(limit));
  if (length <= 0) return 0;
  const low = Math.max(2, Math.round(length * 0.06));
  const high = Math.max(low, Math.round(length * 0.1));
  const target = Math.round(length * 0.08);
  return Math.min(length, high, Math.max(low, target));
}

export function isPharmacyNumericEntry(item: Pick<BankItem, "itemType">): boolean {
  const type = (item.itemType ?? "").toLowerCase();
  return type === "constructed_response" || type === "calculation" || type === "short_answer";
}

export function isPharmacyCalculationItem(item: BankItem): boolean {
  if (!isPharmacyNumericEntry(item)) return false;
  if (!/\d/.test(String(item.correctAnswer ?? ""))) return false;
  const text = [item.question, item.vignette, item.scenario].filter(Boolean).join("\n");
  return CALC_ITEM.test(text);
}

/** Same calculation wording with different numbers is one ask. */
export function calcTemplateAsk(question: string): string | null {
  if (!CALC_TEMPLATE.test(question)) return null;
  const stripped = question
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[^a-z# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length < 16) return null;
  return stripped;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function itemClinicalText(item: Pick<BankItem, "question" | "vignette" | "scenario">): string {
  return [item.scenario, item.vignette, item.question].filter(Boolean).join("\n");
}

export function askSignature(text: string): string | null {
  return ASKS.find((ask) => ask.re.test(text))?.key ?? null;
}

/** Number-stripped calc templates outrank a generic ask such as "tablet-count". */
export function sittingAskKey(text: string): string | null {
  return calcTemplateAsk(text) ?? askSignature(text);
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

/** Pharmacy sittings keep each drug to two items, including mentions outside the calc reserve. */
export const PHARMACY_DRUG_CAP = 2;

/** NCLEX conditions stop at 3, and never above the 4% entity cap on a shorter sitting. */
export function nursingConditionCap(sittingLength: number): number {
  return Math.min(3, entityShareCap(sittingLength));
}

const SUBJECT_META_KEYS = ["mainSubject", "primarySubject", "mainDrug", "drug", "entity", "concept"] as const;

type SittingCapSource = Pick<
  BankItem,
  | "question"
  | "vignette"
  | "scenario"
  | "subjectId"
  | "topicCategory"
  | "blueprintTopic"
  | "tags"
  | "generationMeta"
  | "curationMeta"
  | "ngnPayload"
>;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** Metadata that names the item's subject, before falling back to stem tokens. */
function mainSubjectTexts(item: SittingCapSource): string[] {
  const texts: string[] = [];
  for (const meta of [item.generationMeta, item.curationMeta, item.ngnPayload]) {
    const record = asRecord(meta);
    if (!record) continue;
    for (const key of SUBJECT_META_KEYS) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) texts.push(value);
    }
  }
  for (const value of [item.subjectId, item.blueprintTopic, item.topicCategory]) {
    if (typeof value === "string" && value.trim()) texts.push(value.replace(/[-_]/g, " "));
  }
  for (const tag of item.tags ?? []) {
    if (tag.trim()) texts.push(tag.replace(/[-_]/g, " "));
  }
  return texts;
}

/**
 * Drug counted toward the pharmacy cap.
 * A main-subject field wins. Otherwise the longest drug in the question wins,
 * then the longest drug in the vignette — the same token list as the calc pool.
 */
export function sittingDrugMention(item: SittingCapSource): string | null {
  for (const text of mainSubjectTexts(item)) {
    const drug = matchDrug(text);
    if (drug) return drug;
  }
  return matchDrug(item.question ?? "") ?? matchDrug(itemClinicalText(item));
}

/** Condition counted toward the NCLEX cap. Specific obstetric keys are listed before pregnancy. */
export function sittingConditionMention(item: SittingCapSource): string | null {
  for (const text of mainSubjectTexts(item)) {
    const condition = matchCondition(text);
    if (condition) return condition;
  }
  return matchCondition(itemClinicalText(item));
}

const AGE_PHRASE = /\b\d+(?:\.\d+)?\s*-?\s*(?:year|yr)s?\s*-?\s*old\b/gi;
const ROOM_PHRASE = /\broom\s+#?\d+\b/gi;

function caseSentence(item: SittingCapSource): string {
  const scene = [item.scenario, item.vignette].filter(Boolean).join(" ").trim();
  if (scene.length < 40) return "";
  return scene.split(/(?<=[.!?])\s+/)[0] ?? scene;
}

/** Same opening case. Ages and room numbers drop out; other digits stay so distinct doses do not collapse. */
export function sittingCaseFingerprint(item: SittingCapSource): string | null {
  const sentence = caseSentence(item);
  if (!sentence) return null;
  const tokens = sentence
    .toLowerCase()
    .replace(AGE_PHRASE, " ")
    .replace(ROOM_PHRASE, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
  if (tokens.length < 5) return null;
  return `case:${tokens.slice(0, 14).join(" ")}`;
}

function normalizedAsk(question: string): string {
  return question
    .toLowerCase()
    .replace(AGE_PHRASE, " ")
    .replace(ROOM_PHRASE, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Keys that may appear once per sitting: the case opening, a number-stripped
 * calc template, and the same ask about the same drug or condition.
 */
export function sittingRepeatKeys(item: SittingCapSource, fieldId: string): string[] {
  const keys: string[] = [];
  const scene = sittingCaseFingerprint(item);
  if (scene) keys.push(scene);
  const calc = calcTemplateAsk(item.question ?? "");
  if (calc) keys.push(`calc:${calc}`);
  const ask = normalizedAsk(item.question ?? "");
  const anchor =
    (isNursingSittingField(fieldId) ? sittingConditionMention(item) : null) ??
    (fieldId === "pharmacy" ? sittingDrugMention(item) : null);
  if (anchor && ask.length >= 24) keys.push(`ask:${anchor}:${ask}`);
  return keys;
}

/** Caps the CAT picker applies on every adaptive pick, including later refills. */
export function sittingCapTags(
  item: SittingCapSource,
  fieldId: string
): { drugKeys: string[]; conditionKey: string | null; repeatKeys: string[] } {
  const drug = fieldId === "pharmacy" ? sittingDrugMention(item) : null;
  const condition = isNursingSittingField(fieldId) ? sittingConditionMention(item) : null;
  return {
    drugKeys: drug ? [drug] : [],
    conditionKey: condition,
    repeatKeys: sittingRepeatKeys(item, fieldId),
  };
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
  fieldId: string,
  seenIds?: ReadonlySet<string>
): BankItem[] {
  const entityCap = entityShareCap(limit);
  const dosageMax = isNursingSittingField(fieldId) ? nursingDosageShareCap(limit) : Number.POSITIVE_INFINITY;
  const calcMax = fieldId === "pharmacy" ? pharmacyCalculationQuota(limit) : Number.POSITIVE_INFINITY;
  const narrowCap = narrowTopicShareCap(limit);
  const entityCounts = new Map<string, number>();
  const drugCounts = new Map<string, number>();
  const conditionCounts = new Map<string, number>();
  const askCounts = new Map<string, number>();
  const templateCounts = new Map<string, number>();
  const narrowCounts = new Map<string, number>();
  const usedRepeats = new Set<string>();
  const conditionCap = nursingConditionCap(limit);
  let dosage = 0;
  let calcs = 0;
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
    if (!isServableToStudents(item)) return false;
    if (sequentialSetId(item)) {
      if (id) used.add(id);
      kept.push(item);
      return true;
    }
    const cluster = clusterByItem.get(item) ?? (id ? clusterById.get(id) : undefined);
    if (cluster && usedClusters.has(cluster)) return false;
    const text = itemClinicalText(item);
    const entity = sittingEntityKey(text, fieldId);
    const ask = sittingAskKey(item.question) ?? (entity ? askSignature(text) : null);
    const template = calcTemplateAsk(item.question);
    const dose = isNursingSittingField(fieldId) && isNursingDosageItem(text);
    const numeric = fieldId === "pharmacy" && isPharmacyNumericEntry(item);
    const narrow = narrowTopicKeyFromBankItem(item);
    const drug = fieldId === "pharmacy" ? sittingDrugMention(item) : null;
    const condition = isNursingSittingField(fieldId) ? sittingConditionMention(item) : null;
    const repeats = sittingRepeatKeys(item, fieldId);
    const entityLimit =
      fieldId === "pharmacy" && entity?.startsWith("drug:")
        ? PHARMACY_DRUG_CAP
        : entity?.startsWith("condition:")
          ? conditionCap
          : entityCap;
    if (entity && (entityCounts.get(entity) ?? 0) >= entityLimit) return false;
    if (drug && (drugCounts.get(drug) ?? 0) >= PHARMACY_DRUG_CAP) return false;
    if (condition && (conditionCounts.get(condition) ?? 0) >= conditionCap) return false;
    if (repeats.some((key) => usedRepeats.has(key))) return false;
    if (entity && ask && (askCounts.get(`${entity}:${ask}`) ?? 0) >= 1) return false;
    if (template && (templateCounts.get(template) ?? 0) >= 1) return false;
    if (dose && dosage >= dosageMax) return false;
    if (numeric && calcs >= calcMax) return false;
    if (narrow && (narrowCounts.get(narrow) ?? 0) >= narrowCap) return false;
    if (entity) entityCounts.set(entity, (entityCounts.get(entity) ?? 0) + 1);
    if (drug) drugCounts.set(drug, (drugCounts.get(drug) ?? 0) + 1);
    if (condition) conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
    for (const key of repeats) usedRepeats.add(key);
    if (entity && ask) askCounts.set(`${entity}:${ask}`, 1);
    if (template) templateCounts.set(template, 1);
    if (dose) dosage += 1;
    if (numeric) calcs += 1;
    if (narrow) narrowCounts.set(narrow, (narrowCounts.get(narrow) ?? 0) + 1);
    if (cluster) usedClusters.add(cluster);
    if (id) used.add(id);
    kept.push(item);
    return true;
  };

  if (fieldId === "pharmacy" && calcMax > 0) {
    const reserve = (source: readonly BankItem[]) => {
      for (const item of source) {
        if (calcs >= calcMax || kept.length >= limit) break;
        if (!isPharmacyCalculationItem(item)) continue;
        accept(item);
      }
    };
    reserve(items);
    if (calcs < calcMax && kept.length < limit) reserve(pool);
  }

  for (const item of items) {
    if (kept.length >= limit) break;
    accept(item);
  }
  if (kept.length < limit) {
    const unseenFirst = !seenIds?.size
      ? pool
      : [...pool].sort((left, right) => {
          const leftSeen = left.id && seenIds.has(left.id) ? 1 : 0;
          const rightSeen = right.id && seenIds.has(right.id) ? 1 : 0;
          return leftSeen - rightSeen;
        });
    for (const item of unseenFirst) {
      if (kept.length >= limit) break;
      accept(item);
    }
  }
  return kept.slice(0, limit);
}
