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
  "amiodarone",
  "fluconazole",
  "carbamazepine",
  "diltiazem",
  "oxycodone",
  "hydromorphone",
  "prasugrel",
  "valproic",
  "famotidine",
  "citalopram",
  "aprepitant",
  "clarithromycin",
  "ciprofloxacin",
  "ketoconazole",
  "rifampin",
  "lithium",
].sort((left, right) => right.length - left.length);

/** Brand, class, and salt names that must share the generic's sitting cap. */
const DRUG_ALIASES: { key: string; re: RegExp }[] = [
  {
    key: "insulin",
    re: /\b(?:insulins?|humalog|novolog|novolin|humulin|lantus|levemir|tresiba|basaglar|toujeo|apidra|fiasp|admelog|glargine|lispro|aspart|detemir|degludec|nph)\b/i,
  },
  { key: "warfarin", re: /\b(?:warfarin|coumadin|jantoven|vka|vitamin k antagonist)\b/i },
  { key: "sertraline", re: /\b(?:sertraline|zoloft)\b/i },
  { key: "metformin", re: /\b(?:metformin|glucophage)\b/i },
  { key: "lisinopril", re: /\b(?:lisinopril|prinivil|zestril)\b/i },
  { key: "amlodipine", re: /\b(?:amlodipine|norvasc)\b/i },
  { key: "metoprolol", re: /\b(?:metoprolol|lopressor|toprol)\b/i },
  { key: "gabapentin", re: /\b(?:gabapentin|neurontin)\b/i },
  { key: "furosemide", re: /\b(?:furosemide|lasix)\b/i },
  { key: "levothyroxine", re: /\b(?:levothyroxine|synthroid|levoxyl)\b/i },
  { key: "atorvastatin", re: /\b(?:atorvastatin|lipitor)\b/i },
  { key: "clopidogrel", re: /\b(?:clopidogrel|plavix)\b/i },
  { key: "apixaban", re: /\b(?:apixaban|eliquis)\b/i },
  { key: "rivaroxaban", re: /\b(?:rivaroxaban|xarelto)\b/i },
  { key: "dabigatran", re: /\b(?:dabigatran|pradaxa)\b/i },
  { key: "enoxaparin", re: /\b(?:enoxaparin|lovenox)\b/i },
  { key: "tiotropium", re: /\b(?:tiotropium|spiriva)\b/i },
  { key: "fluoxetine", re: /\b(?:fluoxetine|prozac)\b/i },
  { key: "paroxetine", re: /\b(?:paroxetine|paxil)\b/i },
  { key: "lorazepam", re: /\b(?:lorazepam|ativan)\b/i },
  { key: "clonazepam", re: /\b(?:clonazepam|klonopin)\b/i },
  { key: "phenytoin", re: /\b(?:phenytoin|dilantin)\b/i },
  { key: "digoxin", re: /\b(?:digoxin|lanoxin)\b/i },
  { key: "albuterol", re: /\b(?:albuterol|ventolin|proair|proventil)\b/i },
  { key: "omeprazole", re: /\b(?:omeprazole|prilosec)\b/i },
  { key: "heparin", re: /\b(?:heparins?|unfractionated heparin)\b/i },
  { key: "amiodarone", re: /\b(?:amiodarone|cordarone|pacerone)\b/i },
  { key: "fluconazole", re: /\b(?:fluconazole|diflucan)\b/i },
  { key: "carbamazepine", re: /\b(?:carbamazepine|tegretol)\b/i },
  { key: "diltiazem", re: /\b(?:diltiazem|cardizem|tiazac)\b/i },
  { key: "oxycodone", re: /\b(?:oxycodone|oxycontin|roxicodone|percocet)\b/i },
  { key: "hydromorphone", re: /\b(?:hydromorphone|dilaudid)\b/i },
  { key: "prasugrel", re: /\b(?:prasugrel|effient)\b/i },
  { key: "valproic", re: /\b(?:valproic(?: acid)?|valproate|divalproex|depakote|depakene)\b/i },
  { key: "famotidine", re: /\b(?:famotidine|pepcid)\b/i },
  { key: "citalopram", re: /\b(?:citalopram|celexa)\b/i },
  { key: "aprepitant", re: /\b(?:aprepitant|emend|fosaprepitant)\b/i },
  { key: "clarithromycin", re: /\b(?:clarithromycin|biaxin)\b/i },
  { key: "ciprofloxacin", re: /\b(?:ciprofloxacin|cipro)\b/i },
  { key: "ketoconazole", re: /\b(?:ketoconazole|nizoral)\b/i },
  { key: "rifampin", re: /\b(?:rifampin|rifampicin)\b/i },
  { key: "lithium", re: /\b(?:lithium|lithobid)\b/i },
];

const DRUG_SUFFIX =
  /\b([a-z]{5,}(?:statin|pril|sartan|olol|dipine|prazole|cillin|mycin|cycline|oxetine|traline|azepam|azolam|parin|xaban|gliptin|flozin|glutide|setron|dronate|lukast|terol))\b/gi;

/**
 * Suffix hits that are lipids, not drugs. "cholesterol" matches `terol`
 * (choles + terol). Anything ending in "sterol" is the same false positive.
 */
const DRUG_SUFFIX_STOP = new Set(["cholesterol", "sterol"]);

function isDrugSuffixStop(name: string): boolean {
  return DRUG_SUFFIX_STOP.has(name) || name.endsWith("sterol");
}

const MED_LIST_CUE =
  /\b(?:home (?:medications?|meds|regimen)|current (?:medications?|meds|regimen)|medications? include|medication list|medication reconciliation|med rec|outpatient medications?|scheduled medications?)\b/i;

/** Boggy fundus, atony, and PPH. Word order varies: "fundus boggy" and "boggy fundus". */
const POSTPARTUM_HEMORRHAGE_RE =
  /\bpost-?partum hemorrhage\b|\bpph\b|\buterine atony\b|\b(?:boggy|atonic)\b[^.]{0,48}\b(?:fundus|uterus)\b|\b(?:fundus|uterus)\b[^.]{0,48}\b(?:boggy|atonic)\b/i;
/** Every postpartum topic, including blues and engorgement, shares one cap. */
const POSTPARTUM_RE =
  /\bpost-?partum\b|\bpph\b|\buterine atony\b|\blochia\b|\b(?:boggy|atonic)\b[^.]{0,48}\b(?:fundus|uterus)\b|\b(?:fundus|uterus)\b[^.]{0,48}\b(?:boggy|atonic)\b/i;
const POSTPARTUM_PAD_RE =
  /\b(?:saturated|soaked)\b[^.]{0,40}\bpads?\b|\bpads?\b[^.]{0,40}\b(?:saturated|soaked)\b|\b\d+\s+pads?\s*(?:\/|per)\s*h/i;

const CONDITIONS: { key: string; re: RegExp }[] = [
  { key: "preeclampsia", re: /\bpreeclampsia\b|\blate decel\w*\b/i },
  { key: "hip-arthroplasty", re: /\b(?:total hip|hip)\s+(?:arthroplasty|replacement)\b|\bhip arthroplasty\b/i },
  { key: "postpartum-hemorrhage", re: POSTPARTUM_HEMORRHAGE_RE },
  { key: "postpartum", re: POSTPARTUM_RE },
  { key: "gestational-diabetes", re: /\bgestational diabetes\b/i },
  {
    key: "gallbladder",
    re: /\bgallbladder\b|\bcholecystitis\b|\bcholelithiasis\b|\b(?:laparoscopic cholecystectomy|lap(?:aroscopic)? chole|cholecystectomy)\b/i,
  },
  { key: "suicide", re: /\bsuicid\w*|\bself-harm\b/i },
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
  {
    key: "hypertension",
    re: /\b(?:hypertension|hypertensive|htn|high blood pressure)\b/i,
  },
  {
    key: "acs",
    re: /\b(?:chest pain|acute coronary(?: syndrome)?|acs|stemi|nstemi|unstable angina|myocardial infarction|coronary artery disease|cad)\b/i,
  },
  {
    key: "pressure-injury",
    re: /\b(?:pressure (?:injur(?:y|ies)|ulcers?)|decubitus(?: ulcer)?|bedsores?)\b/i,
  },
  {
    key: "mass-casualty",
    re: /\b(?:start triage|simple triage and rapid treatment|mass[- ]casualt(?:y|ies)|disaster triage|\bmci\b|triage tags?|(?:red|yellow|green|black) tags?)\b/i,
  },
  { key: "copd", re: /\bcopd\b|\bchronic obstructive\b/i },
  { key: "asthma", re: /\basthma(?:tic)?\b/i },
  { key: "dka", re: /\bdka\b|\bdiabetic ketoacidosis\b/i },
  {
    key: "type-2-diabetes",
    re: /\btype\s*(?:2|ii|two)\s+diabet(?:es|ic)\b|\bt2dm\b|\bniddm\b|\bdiabetes mellitus type\s*(?:2|ii)\b/i,
  },
  {
    key: "gi-bleed",
    re: /\b(?:upper\s+)?(?:gi|gastrointestinal)\s+bleed(?:ing)?\b|\bmelena\b|\bhematemesis\b|\bvomiting blood\b/i,
  },
  { key: "alcohol-withdrawal", re: /\balcohol withdrawal\b|\bdelirium tremens\b|\bciwa(?:-ar)?\b/i },
  {
    key: "depression",
    re: /\b(?<!respiratory )(?:adolescent depression|major depressive|depress(?:ed|ion|ive))\b/i,
  },
  {
    key: "arthritis-pain",
    re: /\bosteoarthrit(?:is|ic)\b|\brheumatoid arthritis\b|\barthritis pain\b/i,
  },
  { key: "immunization", re: /\bimmuniz(?:e|ation|ations|ing)\b|\bvaccin(?:e|es|ation|ations|ated)\b/i },
  { key: "postop-pain", re: /\bpost-?\s?op(?:erative)?\s+pain\b/i },
  { key: "neutropenia", re: /\bneutropeni(?:a|c)\b/i },
  { key: "cinv", re: /\bcinv\b|\bchemo(?:therapy)?-induced nausea\b/i },
  {
    key: "thyroid",
    re: /\bthyroid(?:ectomy)?\b|\bhypothyroid(?:ism)?\b|\bhyperthyroid(?:ism)?\b|\blevothyroxine\b/i,
  },
];

const OB_SPECIFIC = new Set(["preeclampsia", "gestational-diabetes", "postpartum-hemorrhage", "postpartum"]);
const OPIOID_RE =
  /\b(?:opioids?|opiates?|morphine|fentanyl|hydrocodone|oxycodone|hydromorphone|heroin|tramadol|methadone|buprenorphine)\b/i;
const OPIOID_CONTEXT_RE =
  /\b(?:substance use(?: disorder)?|substance abuse|opioid use disorder|\boud\b|\bsud\b|in recovery|opioid misuse|respiratory depression|pinpoint pupils|naloxone)\b/i;
const HTN_RE = /\b(?:hypertension|hypertensive|htn|high blood pressure)\b/i;
const ACS_RE =
  /\b(?:chest pain|acute coronary(?: syndrome)?|acs|stemi|nstemi|unstable angina|myocardial infarction|coronary artery disease|cad)\b/i;

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
  /\b(?:how many|how much|calculate|concentration|mg\s*\/\s*ml|tablets?|capsules?|what dose)\b/i;

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
  return canonicalDrugs(text)[0] ?? null;
}

function matchCondition(text: string): string | null {
  return sittingConditionMentions({ question: text, options: [], correctAnswer: "" })[0] ?? null;
}

function canonicalDrugs(text: string): string[] {
  if (!text.trim()) return [];
  const found: string[] = [];
  const seen = new Set<string>();
  const add = (key: string) => {
    const name = key.toLowerCase();
    if (seen.has(name)) return;
    seen.add(name);
    found.push(name);
  };
  for (const alias of DRUG_ALIASES) {
    if (alias.re.test(text)) add(alias.key);
  }
  for (const drug of DRUGS) {
    if (new RegExp(`\\b${escapeRegExp(drug)}\\b`, "i").test(text)) add(drug);
  }
  for (const match of text.toLowerCase().matchAll(new RegExp(DRUG_SUFFIX.source, "gi"))) {
    const name = match[1];
    if (!name || isDrugSuffixStop(name)) continue;
    if ([...seen].some((key) => name === key || name.includes(key))) continue;
    add(name);
  }
  return found.sort((left, right) => right.length - left.length || left.localeCompare(right));
}

function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function keyedAnswerText(item: SittingCapSource): string {
  const raw = item.correctAnswer?.trim() ?? "";
  if (!raw) return "";
  const options = item.options ?? [];
  return raw
    .split("|||")
    .map((part) => {
      const piece = part.trim();
      if (/^[A-H]$/i.test(piece) && options.length > 0) {
        const index = piece.toUpperCase().charCodeAt(0) - 65;
        return options[index] ?? piece;
      }
      return piece;
    })
    .join("\n");
}

function pushDrugs(target: string[], drugs: readonly string[]) {
  for (const drug of drugs) {
    if (!target.includes(drug)) target.push(drug);
  }
}

export type SittingDrugSplit = {
  /** Question, keyed answer, short subject fields, and scene lines when the question names no drug. */
  subject: string[];
  /** Drugs that appear only inside a medication-list sentence. */
  background: string[];
};

/**
 * Subject drugs spend the pharmacy subject cap. Medication-list drugs spend
 * a separate, looser background cap so a boilerplate "lisinopril, metformin,
 * atorvastatin" line does not use up the drugs the question is about.
 * A longer name in a home-medication list no longer hides the subject drug.
 */
export function sittingDrugSplit(item: SittingCapSource): SittingDrugSplit {
  const question = item.question ?? "";
  const subject: string[] = [];
  const background: string[] = [];
  const questionDrugs = canonicalDrugs(question);
  pushDrugs(subject, questionDrugs);
  pushDrugs(subject, canonicalDrugs(keyedAnswerText(item)));
  const scene = [item.scenario, item.vignette].filter(Boolean).join("\n");
  for (const sentence of sentencesOf(scene)) {
    const medList = MED_LIST_CUE.test(sentence);
    if (medList) {
      pushDrugs(background, canonicalDrugs(sentence));
      continue;
    }
    if (questionDrugs.length > 0) continue;
    pushDrugs(subject, canonicalDrugs(sentence));
  }
  for (const field of mainSubjectTexts(item)) {
    if (field.length > 60) continue;
    if (field.split(/\s+/).length > 4) continue;
    pushDrugs(subject, canonicalDrugs(field));
  }
  const subjectSet = new Set(subject);
  return { subject, background: background.filter((drug) => !subjectSet.has(drug)) };
}

/**
 * Every drug that still counts somewhere: subject drugs first, then
 * background med-list drugs. Callers that need the split use sittingDrugSplit.
 */
export function sittingDrugMentions(item: SittingCapSource): string[] {
  const split = sittingDrugSplit(item);
  const mentions: string[] = [];
  pushDrugs(mentions, split.subject);
  pushDrugs(mentions, split.background);
  return mentions;
}

export function isNursingSittingField(fieldId: string): boolean {
  return fieldId === "nursing" || fieldId.startsWith("nclex");
}

/**
 * Base pharmacy subject-drug allowance. Length 50 stays at 2.
 * Longer sittings use pharmacyDrugCap, which scales this per 50 items.
 */
export const PHARMACY_DRUG_CAP = 2;

/** Med-list-only drugs. Looser than the subject cap so boilerplate lists do not starve the sitting. */
export const PHARMACY_BACKGROUND_DRUG_BASE = 4;

/**
 * max(base, ceil(base * length / 50)).
 * A 50-item sitting keeps the base. A 225-item sitting is 4.5× that, rounded up.
 */
export function perFiftyCap(base: number, length: number): number {
  const safeBase = Number.isFinite(base) ? Math.max(0, base) : 0;
  const safeLength = Math.max(0, Math.floor(length) || 0);
  return Math.max(safeBase, Math.ceil((safeBase * safeLength) / 50));
}

/** Subject-drug cap: 50→2, 100→4, 225→9. */
export function pharmacyDrugCap(length: number): number {
  return perFiftyCap(PHARMACY_DRUG_CAP, length);
}

/** Background med-list cap: 50→4, 100→8, 225→18. */
export function pharmacyBackgroundDrugCap(length: number): number {
  return perFiftyCap(PHARMACY_BACKGROUND_DRUG_BASE, length);
}

/** template:* keys and calc-template asks: 50→1, 100→2, 225→5. */
export function templateRepeatCap(length: number): number {
  return perFiftyCap(1, length);
}

/**
 * NCLEX conditions stay on the short-sitting rule through 85, the CAT minimum
 * the cap of 3 was written for: min(3, the 4% entity share). Above 85 the
 * allowance is max(3, ceil(3 * length / 85)), so a fixed 150-item exam is 6
 * rather than staying at 3 for every longer form.
 */
export function nursingConditionCap(sittingLength: number): number {
  const length = Math.max(0, Math.floor(sittingLength) || 0);
  if (length <= 85) return Math.min(3, entityShareCap(length));
  return Math.max(3, Math.ceil((3 * length) / 85));
}

export type SittingCapLimits = {
  relaxLevel: number;
  templateCap: number;
  narrowCap: number;
  subjectDrugCap: number;
  /** Infinity once the ladder turns the background med-list cap off. */
  backgroundDrugCap: number;
  conditionCap: number;
};

/**
 * Strict caps at level 0. Higher levels are cumulative:
 * L1 template ×2, L2 narrow +1 per 50, L3 background cap off,
 * L4 subject drug +1 per 50, L5 condition +1.
 * Cluster, case, vitals, ask, eligibility, calc quota, and sequential sets
 * are not in this object because they never relax.
 */
export function sittingCapLimits(limit: number, relaxLevel = 0): SittingCapLimits {
  const level = Math.max(0, Math.min(5, Math.floor(relaxLevel) || 0));
  const perFifty = perFiftyCap(1, limit);
  return {
    relaxLevel: level,
    templateCap: templateRepeatCap(limit) * (level >= 1 ? 2 : 1),
    narrowCap: narrowTopicShareCap(limit) + (level >= 2 ? perFifty : 0),
    subjectDrugCap: pharmacyDrugCap(limit) + (level >= 4 ? perFifty : 0),
    backgroundDrugCap: level >= 3 ? Number.POSITIVE_INFINITY : pharmacyBackgroundDrugCap(limit),
    conditionCap: nursingConditionCap(limit) + (level >= 5 ? 1 : 0),
  };
}

const SUBJECT_META_KEYS = ["mainSubject", "primarySubject", "mainDrug", "drug", "entity", "concept"] as const;

type SittingCapSource = Pick<
  BankItem,
  | "question"
  | "vignette"
  | "scenario"
  | "options"
  | "correctAnswer"
  | "subjectId"
  | "topicCategory"
  | "blueprintTopic"
  | "tags"
  | "itemType"
  | "generationMeta"
  | "curationMeta"
  | "ngnPayload"
> & {
  /** Vitals sometimes live on the rendered chart rather than the stem. */
  chartData?: Record<string, unknown> | null;
};

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

/** Primary subject drug. Background medication-list names are not primary. */
export function sittingDrugMention(item: SittingCapSource): string | null {
  return sittingDrugSplit(item).subject[0] ?? null;
}

const SKIP_PAYLOAD_KEY =
  /explanation|rationale|correct|answer|option|distractor|kind|score|model|reference|citation|^id$|tags?/i;

function flattenClinicalValue(value: unknown, depth: number): string {
  if (depth > 5 || value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    return value
      .map((entry) => flattenClinicalValue(entry, depth + 1))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !SKIP_PAYLOAD_KEY.test(key))
      .map(([, entry]) => flattenClinicalValue(entry, depth + 1))
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function clinicalBlob(item: SittingCapSource): string {
  const extras = [item.ngnPayload, item.chartData]
    .map((source) => flattenClinicalValue(source, 0))
    .filter(Boolean)
    .join("\n")
    .slice(0, 2000);
  return [item.scenario, item.vignette, item.question, extras].filter(Boolean).join("\n");
}

const NGN_CHOICE_FIELD =
  /^(?:actions?|monitors?|parameters?|conditionOptions|options|tokens|segments|highlights|distractors|dropdowns)$/i;

/** Bow-tie and cloze rows. Their option columns are not the case subject. */
export function isBowTieOrCloze(item: SittingCapSource): boolean {
  const type = (item.itemType ?? "").trim().toLowerCase();
  if (
    type === "ngn_bowtie" ||
    type === "bow_tie" ||
    type === "bowtie" ||
    type === "ngn_dropdown" ||
    type === "dropdown" ||
    type === "dropdown_cloze" ||
    type === "cloze" ||
    type === "ngn_cloze"
  ) {
    return true;
  }
  const kind = String(asRecord(item.ngnPayload)?.kind ?? "")
    .trim()
    .toLowerCase();
  return kind === "bow_tie" || kind === "bowtie" || kind === "dropdown" || kind === "dropdown_cloze" || kind === "cloze";
}

function keyedDropdownTexts(payload: Record<string, unknown>): string[] {
  if (!Array.isArray(payload.dropdowns)) return [];
  const texts: string[] = [];
  for (const entry of payload.dropdowns) {
    const row = asRecord(entry);
    if (!row || !Array.isArray(row.options)) continue;
    const key = typeof row.key === "string" ? row.key : "";
    for (const option of row.options) {
      if (typeof option === "string") {
        if (option === key) texts.push(option);
        continue;
      }
      const opt = asRecord(option);
      if (!opt || typeof opt.text !== "string") continue;
      const id = typeof opt.id === "string" ? opt.id : "";
      if (id === key || opt.text === key) texts.push(opt.text);
    }
  }
  return texts;
}

/**
 * Stem used for condition and vital caps.
 * Bow-tie and cloze choice columns stay out, so a distractor condition or a
 * chart option does not spend a cap the item's own case did not earn.
 * The keyed condition, cloze template, and patient chart still count.
 */
function capClinicalText(item: SittingCapSource): string {
  if (!isBowTieOrCloze(item)) return clinicalBlob(item);
  const parts = [item.scenario, item.vignette, item.question].filter((part): part is string => Boolean(part?.trim()));
  const payload = asRecord(item.ngnPayload);
  if (payload) {
    if (typeof payload.condition === "string" && payload.condition.trim()) parts.push(payload.condition);
    if (typeof payload.template === "string" && payload.template.trim()) parts.push(payload.template);
    parts.push(...keyedDropdownTexts(payload));
  }
  const chart = asRecord(item.chartData);
  if (chart) {
    for (const [key, value] of Object.entries(chart)) {
      if (NGN_CHOICE_FIELD.test(key)) continue;
      if (/option|actions|monitors|parameters/i.test(key)) continue;
      const flat = flattenClinicalValue(value, 0);
      if (flat) parts.push(flat);
    }
  }
  return parts.join("\n");
}

function conditionFields(item: SittingCapSource): string[] {
  return mainSubjectTexts(item).filter((field) => field.length <= 80 && field.split(/\s+/).length <= 6);
}

function opioidRisk(text: string): boolean {
  return OPIOID_RE.test(text) && OPIOID_CONTEXT_RE.test(text);
}

function hypertensionIsHistoryOnly(text: string): boolean {
  if (!HTN_RE.test(text)) return false;
  const stripped = text.replace(
    /\b(?:history of|hx of|past medical history of|pmh(?::| of)|known|longstanding|diagnosed with)\s+(?:chronic\s+)?(?:hypertension|hypertensive|htn|high blood pressure)\b/gi,
    " "
  );
  return !HTN_RE.test(stripped);
}

function acsIsHistoryOnly(text: string): boolean {
  if (!ACS_RE.test(text)) return false;
  const stripped = text.replace(
    /\b(?:history of|hx of|past medical history of|pmh(?::| of)|known|longstanding|diagnosed with|prior)\s+(?:chronic\s+)?(?:chest pain|acute coronary(?: syndrome)?|acs|stemi|nstemi|unstable angina|myocardial infarction|coronary artery disease|cad)\b/gi,
    " "
  );
  return !ACS_RE.test(stripped);
}

function hasHypertensiveReading(text: string): boolean {
  for (const match of text.matchAll(/\b(\d{2,3})\s*\/\s*(\d{2,3})\b/g)) {
    const sys = Number(match[1]);
    const dia = Number(match[2]);
    if (sys >= 140 && sys <= 260 && dia >= 40 && dia <= 160 && dia < sys) return true;
  }
  return false;
}

/** High blood pressure is the subject when the stem never names hypertension. */
function impliedHypertension(text: string, question: string): boolean {
  if (!hasHypertensiveReading(text)) return false;
  if (/\b(?:headaches?|blurred vision|blurry vision|vision changes)\b/i.test(text)) return true;
  return /\b(?:highest priority|priority finding|which finding)\b/i.test(question);
}

function heavyPostpartumBleed(text: string): boolean {
  if (!POSTPARTUM_PAD_RE.test(text)) return false;
  return /\b(?:post-?partum|\bpph\b|vaginal delivery|after delivery|post-?delivery)\b/i.test(text);
}

function addConditionMatches(keys: Set<string>, source: string) {
  for (const condition of CONDITIONS) {
    if (condition.key === "hypertension") continue;
    if (condition.re.test(source)) keys.add(condition.key);
  }
  if (opioidRisk(source)) keys.add("opioid-sud");
  if (heavyPostpartumBleed(source)) {
    keys.add("postpartum-hemorrhage");
    keys.add("postpartum");
  }
  if (
    /\boverwhelmed\b/i.test(source) &&
    /\btearful\b/i.test(source) &&
    /\b(?:post-?partum|delivered\b|after (?:a )?vaginal delivery)\b/i.test(source)
  ) {
    keys.add("postpartum");
  }
  if (keys.has("postpartum-hemorrhage")) keys.add("postpartum");
}

/** A history clause is not the subject when the stem is about something else. */
function postpartumIsHistoryOnly(text: string): boolean {
  if (!POSTPARTUM_RE.test(text) && !POSTPARTUM_HEMORRHAGE_RE.test(text)) return false;
  const stripped = text.replace(
    /\b(?:history of|hx of|past medical history of|pmh(?::| of)|known|prior)\s+(?:(?:post-?partum|pph)\b[^.]{0,48})/gi,
    " "
  );
  return !POSTPARTUM_RE.test(stripped) && !POSTPARTUM_HEMORRHAGE_RE.test(stripped) && !heavyPostpartumBleed(stripped);
}

function orderedConditionKeys(keys: ReadonlySet<string>): string[] {
  const listed = CONDITIONS.map((condition) => condition.key).filter((key) => keys.has(key));
  if (keys.has("opioid-sud") && !listed.includes("opioid-sud")) listed.push("opioid-sud");
  return listed;
}

/**
 * Conditions counted toward the NCLEX cap.
 * The stem wins over a single metadata label. Obstetric keys still suppress pregnancy,
 * and a history-only mention does not spend the cap when another condition is the subject.
 */
export function sittingConditionMentions(item: SittingCapSource): string[] {
  const text = capClinicalText(item);
  const question = item.question ?? "";
  const fields = conditionFields(item);
  const keys = new Set<string>();
  addConditionMatches(keys, text);
  const stemConditionCount = keys.size;
  const explicitHypertension = HTN_RE.test(text) && !hypertensionIsHistoryOnly(text);
  const stemImpliesHypertension = impliedHypertension(text, question) && stemConditionCount === 0;
  const stemHistoryHypertension = stemConditionCount === 0 && hypertensionIsHistoryOnly(text);
  // A metadata label is only the subject when the stem itself names nothing.
  // Otherwise "preeclampsia" in metadata hid hypertension that the vitals carried.
  if (stemConditionCount === 0 && !explicitHypertension && !stemImpliesHypertension && !stemHistoryHypertension) {
    for (const field of fields) addConditionMatches(keys, field);
  }

  const metadataHypertension = keys.size === 0 && fields.some((field) => HTN_RE.test(field));
  if (explicitHypertension || stemImpliesHypertension || stemHistoryHypertension || metadataHypertension) {
    keys.add("hypertension");
  }
  if (keys.has("preeclampsia")) keys.delete("hypertension");
  if ([...keys].some((key) => OB_SPECIFIC.has(key))) keys.delete("pregnancy");
  if (keys.has("acs") && acsIsHistoryOnly(text) && [...keys].some((key) => key !== "acs")) keys.delete("acs");
  if (
    postpartumIsHistoryOnly(text) &&
    [...keys].some((key) => key !== "postpartum" && key !== "postpartum-hemorrhage")
  ) {
    keys.delete("postpartum");
    keys.delete("postpartum-hemorrhage");
  }
  return orderedConditionKeys(keys);
}

/** Condition counted toward the NCLEX cap. Specific obstetric keys are listed before pregnancy. */
export function sittingConditionMention(item: SittingCapSource): string | null {
  return sittingConditionMentions(item)[0] ?? null;
}

function caseNarrative(item: SittingCapSource): string {
  const scene = [item.scenario, item.vignette].filter(Boolean).join(" ").trim();
  if (scene.length >= 40) return scene;
  const question = item.question?.trim() ?? "";
  if (
    question.length >= 40 &&
    /\b(?:year|yr|yo)s?\s*-?\s*old\b|\b\d{1,3}[mf]\b|\bblood pressure\b|\bbp\b|\bspo2\b|\bheart rate\b/i.test(question)
  ) {
    return question;
  }
  return scene;
}

function openingTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\s*-?\s*(?:year|yr|yo)s?\s*-?\s*old\b|\b\d{1,3}\s*(?:yo|y\/o)\b|\b\d{1,3}[mf]\b/gi, " ")
    .replace(/\b(?:male|female|man|woman|boy|girl|gentleman|lady)\b/gi, " ")
    .replace(/\b(?:room|bay|bed)\s+#?\d+\b/gi, " ")
    .replace(/\bchart\s+#?[a-z0-9]+\b/gi, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function openingClause(text: string): string {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  let clause = parts[0] ?? text;
  if (openingTokens(clause).length < 5 && parts[1]) clause = `${clause} ${parts[1]}`;
  return clause;
}

/**
 * Same opening case. Age, sex, room, and chart labels drop out.
 * Other digits stay so a different dose or gestational week does not collapse.
 */
export function sittingCaseFingerprint(item: SittingCapSource): string | null {
  const narrative = caseNarrative(item);
  if (narrative.length < 40) return null;
  const tokens = openingTokens(openingClause(narrative));
  if (tokens.length < 5) return null;
  return `case:${tokens.slice(0, 14).join(" ")}`;
}

function vitalAbnormal(kind: string, value: string): boolean {
  if (kind === "bp") {
    const [sys, dia] = value.split("/").map(Number);
    return sys <= 100 || sys >= 140 || dia <= 60 || dia >= 90;
  }
  const reading = Number(value);
  if (kind === "hr") return reading >= 110 || reading <= 55;
  if (kind === "rr") return reading >= 22 || reading <= 10;
  if (kind === "spo2") return reading <= 94;
  if (kind === "hgb") return reading <= 11 || reading >= 17;
  if (kind === "pef") return reading <= 80;
  return false;
}

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";

function normalizeVitalText(text: string): string {
  return text.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (char) => String(SUBSCRIPTS.indexOf(char)));
}

function pushReading(parts: [string, string][], kind: string, re: RegExp, text: string) {
  if (parts.some(([listed]) => listed === kind)) return;
  const match = text.match(re);
  if (!match?.[1]) return;
  const reading = Number(match[1]);
  if (!Number.isFinite(reading)) return;
  parts.push([kind, String(reading)]);
}

/**
 * Labeled blood pressure wins over the first fraction in the stem.
 * A peak-flow ratio such as 90/200 is not a blood pressure, and it must not
 * hide the real reading that follows it.
 */
function labeledBloodPressure(text: string): string | null {
  const fractions = [...text.matchAll(/\b(\d{2,3})\s*\/\s*(\d{2,3})\b/g)];
  const valid = fractions.filter((match) => {
    const sys = Number(match[1]);
    const dia = Number(match[2]);
    return sys >= 60 && sys <= 260 && dia >= 30 && dia <= 160 && dia < sys;
  });
  const context = (match: RegExpMatchArray) =>
    text.slice(Math.max(0, (match.index ?? 0) - 32), match.index ?? 0);
  const labeled = valid.find((match) => /\b(?:bp|blood pressure)\b/i.test(context(match)));
  const notPeak = valid.find((match) => !/\b(?:peak|pef|pefr|personal best|i:e)\b/i.test(context(match)));
  const chosen = labeled ?? notPeak;
  if (!chosen) return null;
  return `${Number(chosen[1])}/${Number(chosen[2])}`;
}

function abnormalVitalParts(item: SittingCapSource): [string, string][] {
  const text = normalizeVitalText(capClinicalText(item));
  if (text.length < 40) return [];
  const parts: [string, string][] = [];
  const bp = labeledBloodPressure(text);
  if (bp) parts.push(["bp", bp]);
  const withoutPulseOx = text.replace(/\bpulse\s*ox(?:imetry)?\b/gi, "pulseox");
  const separator = String.raw`\s*(?:(?:level|count|value)\s+)?(?:of|is|was|:|=)?\s*`;
  pushReading(parts, "hr", new RegExp(String.raw`\b(?:hr|heart rate|pulse)${separator}(\d{2,3})\b`, "i"), withoutPulseOx);
  pushReading(parts, "hr", /\b(\d{2,3})\s*(?:bpm|beats\s*\/\s*min)\b/i, withoutPulseOx);
  pushReading(
    parts,
    "rr",
    new RegExp(String.raw`\b(?:rr|respirations|respiratory rate)${separator}(\d{1,2})\b`, "i"),
    text
  );
  pushReading(parts, "rr", /\b(\d{1,2})\s*(?:breaths\s*\/\s*min|breaths per minute)\b/i, text);
  pushReading(
    parts,
    "spo2",
    new RegExp(
      String.raw`\b(?:spo2|sao2|oxygen sat(?:uration)?|o2 sat(?:uration)?|pulseox|sats?)${separator}(\d{2,3})\s*%?`,
      "i"
    ),
    withoutPulseOx
  );
  pushReading(
    parts,
    "hgb",
    new RegExp(String.raw`\b(?:hgb|hemoglobin)${separator}(\d{1,2}(?:\.\d+)?)\b`, "i"),
    text
  );
  pushReading(
    parts,
    "pef",
    /\b(\d{1,3})\s*(?:%|percent)\s*of\s*(?:his |her |their |the )?(?:personal best|predicted)\b/i,
    text
  );
  pushReading(
    parts,
    "pef",
    new RegExp(
      String.raw`\b(?:peak(?:\s+expiratory)?\s+flow(?:\s+rate)?|pefr?)${separator}(\d{1,3})\s*(?:%|percent)\b`,
      "i"
    ),
    text
  );
  return parts.filter(([kind, value]) => vitalAbnormal(kind, value));
}

function formatVitalKey(parts: readonly [string, string][], prefix: string): string | null {
  if (parts.length < 3) return null;
  const ordered = [...parts].sort((left, right) => left[0].localeCompare(right[0]));
  return `${prefix}:${ordered.map(([kind, value]) => `${kind}=${value}`).join(",")}`;
}

/**
 * Same abnormal vitals and labs are one case, even when the opening sentence
 * was rewritten. Normal filler vitals do not collide. Peak-flow percent is its
 * own field and is never read as SpO2. SpO₂, SaO2, and "oxygen sat" match.
 */
export function sittingVitalFingerprint(item: SittingCapSource): string | null {
  return formatVitalKey(abnormalVitalParts(item), "vitals");
}

function normalizedAsk(question: string): string {
  return question
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\s*-?\s*(?:year|yr|yo)s?\s*-?\s*old\b/gi, " ")
    .replace(/\broom\s+#?\d+\b/gi, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RX_STOP = new Set([
  "a", "an", "the", "of", "for", "in", "on", "and", "or", "with", "to", "is", "are", "was", "were",
  "about", "also", "she", "he", "her", "his", "him", "takes", "taking", "prescribed", "receiving",
  "despite", "has", "have", "been", "this", "that", "who", "which", "from", "into", "over", "after",
  "before", "patient", "pharmacist", "receives", "received", "asked", "asks", "question", "should",
  "would", "could", "most", "appropriate", "best", "next", "what", "when", "your", "their", "does",
  "did", "than", "then", "per", "day", "daily", "times", "time", "plus", "three", "severe",
]);

const MED_CASE_SUFFIX =
  /\b[a-z]{5,}(?:statin|pril|sartan|olol|dipine|prazole|cillin|mycin|cycline|oxetine|traline|azepam|azolam|parin|xaban|gliptin|flozin|glutide|setron|asone|isone|dronate|lukast|terol)\b/gi;

function normalizeMedAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .replace(/^(?:add|start|initiate|recommend|give|prescribe|use)\s+/, "")
    .replace(/\b(?:the|a|an)\b/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Same medication scenario with no abnormal vitals.
 * The key is exact, not a similarity score: age, sex, room, dose numbers, and
 * drug names are removed, then the remaining clinical tokens must be identical
 * and the keyed answer must normalize to the same text. At least four clinical
 * tokens are required. An extra drug such as pantoprazole therefore cannot split
 * the pair. This is stricter than the board composer's 0.45 unigram Jaccard,
 * which is not used during sitting selection because that cutoff was wide
 * enough to starve a 50-question form.
 */
function medicationCaseKey(item: SittingCapSource): string | null {
  const answer = normalizeMedAnswer(keyedAnswerText(item));
  if (answer.length < 8 || !/[a-z]{3,}/.test(answer)) return null;
  if (/^\d+(?:\.\d+)?(?:\s*(?:mg|ml|mcg|g|units?|tablets?|capsules?))?$/.test(answer)) return null;
  let text = [item.scenario, item.vignette].filter(Boolean).join(" ").trim();
  if (text.length < 40) text = clinicalBlob(item);
  text = text
    .replace(/(?:^|[.!?]\s+)(?:which|what|how)\b[^?]*\?\s*$/i, " ")
    .toLowerCase();
  text = text
    .replace(/\brenal impairment\b|\bimpaired renal function\b|\bchronic kidney disease\b|\bckd(?:\s*stage\s*[0-9iv]+)?\b/g, " renal ")
    .replace(/\boff-label\b/g, " offlabel ")
    .replace(/\b\d+(?:\.\d+)?\s*-?\s*(?:year|yr|yo)s?\s*-?\s*old\b|\b\d{1,3}[mf]\b/g, " ")
    .replace(/\b(?:male|female|man|woman|boy|girl|gentleman|lady)\b/g, " ")
    .replace(/\b(?:room|bay|bed)\s+#?\d+\b/g, " ")
    .replace(/\bchart\s+#?[a-z0-9]+\b/g, " ");
  for (const drug of canonicalDrugs(text)) {
    text = text.replace(new RegExp(`\\b${escapeRegExp(drug)}\\b`, "gi"), " ");
  }
  text = text.replace(MED_CASE_SUFFIX, " ").replace(/\d+(?:\.\d+)?/g, " ");
  const tokens = [
    ...new Set(text.split(/[^a-z]+/).filter((token) => token.length > 3 && !RX_STOP.has(token))),
  ].sort();
  if (tokens.length < 4) return null;
  return `rxcase:${tokens.join(" ")}::${answer}`;
}

function sentencesOutsideMedList(text: string): string {
  return sentencesOf(text)
    .filter((sentence) => !MED_LIST_CUE.test(sentence))
    .join(" ");
}

function distractorRepeatKey(item: SittingCapSource): string | null {
  const options = item.options ?? [];
  if (options.length < 3) return null;
  const answer = keyedAnswerText(item).trim().toLowerCase().replace(/\s+/g, " ");
  const long = options
    .map((option) => option.trim().toLowerCase().replace(/\s+/g, " "))
    .filter((option) => option && option !== answer && option.length >= 48);
  if (long.length < 2) return null;
  return `distractors:${[...long].sort().join("|")}`;
}

/** Distinctive asks that stay one-per-sitting even when the drug or the keyed sentence changes. */
function sittingTemplateKeys(item: SittingCapSource, fieldId: string): string[] {
  const question = item.question ?? "";
  const answer = keyedAnswerText(item);
  const stem = clinicalBlob(item);
  const ask = `${question}\n${answer}`;
  const keys: string[] = [];
  if (fieldId === "pharmacy") {
    const outside = sentencesOutsideMedList(stem);
    if (/\bloading dose\b/i.test(question)) keys.push("template:loading-dose");
    if (/\b(?:volume of distribution|\bvd\b)/i.test(question) && /\b(?:ckd|chronic kidney|renal)\b/i.test(stem)) {
      keys.push("template:ckd-vd");
    }
    if (
      /\blamotrigine\b/i.test(stem) &&
      /\b(?:oral contraceptives?|ethinyl|norgestimate|birth control|\bocps?\b)\b/i.test(stem)
    ) {
      keys.push("template:lamotrigine-oc");
    }
    if (
      /\bmetoprolol\b/i.test(outside) &&
      /\b(?:with (?:a )?(?:high-fat )?(?:food|meals?)|take with food|concerned about food|food interaction|bioavailability)\b/i.test(
        `${outside}\n${answer}`
      )
    ) {
      keys.push("template:metoprolol-food");
    }
    if (
      /\b(?:apixaban|rivaroxaban|dabigatran|eliquis|xarelto)\b/i.test(stem) &&
      /\b(?:hip|surgery|pre-?operative|pre-?op)\b/i.test(stem) &&
      /\b(?:hold|discontinue|withhold|stop)\b[\s\S]{0,48}\b(?:48|before|prior|pre-?op)/i.test(ask)
    ) {
      keys.push("template:hold-doac-surgery");
    }
    if (/\b(?:alarm|reminder)\b/i.test(ask) && /\b(?:forget|forgets|forgot|adherence|missed|misses|doses)\b/i.test(stem)) {
      keys.push("template:adherence-alarm");
    }
    if (
      /\bsteady[ -]state\b/i.test(ask) ||
      (/\bhalf-?\s*lives?\b/i.test(question) && /\b(?:steady|reach)\b/i.test(ask))
    ) {
      keys.push("template:steady-state");
    }
    if (
      /\bwarfarin\b/i.test(stem) &&
      /\b(?:interact\w*|increase the inr|decrease the inr|affects? the inr)\b/i.test(ask)
    ) {
      keys.push("template:warfarin-interaction");
    }
    if (
      /\b(?:kidney|renal|crcl|creatinine clearance|ckd)\b/i.test(stem) &&
      /\b(?:lower|decrease|reduce|adjust)\w*\b[^.\n]{0,60}\bdose\b|\bdose (?:reduction|decrease|adjustment)\b|\bextend\w*\b[^.\n]{0,40}\binterval\b/i.test(
        ask
      )
    ) {
      keys.push("template:renal-dose-lower");
    }
    const regimen = medicationCaseKey(item);
    if (regimen) keys.push(regimen);
  }
  if (isNursingSittingField(fieldId)) {
    if (
      /\b(?:warfarin|vitamin k)\b/i.test(stem) &&
      /\b(?:leafy|dietary|vitamin k)\b/i.test(ask) &&
      /\b(?:warfarin|vitamin k|leafy)\b/i.test(ask)
    ) {
      keys.push("template:warfarin-diet");
    }
    if (
      /\bgown and gloves\b/i.test(ask) ||
      (/\bcontact precautions?\b/i.test(stem) && /\bgown\b/i.test(ask) && /\bgloves\b/i.test(ask))
    ) {
      keys.push("template:contact-gown-gloves");
    }
    const perDose =
      /\bper (?:administration|dose)\b/i.test(question) || /\bwhat dose\s*\(\s*mg\s*\)/i.test(question);
    if (/\bmg\s*\/\s*kg\b/i.test(stem) && perDose) {
      keys.push("template:mgkg-per-admin");
    }
    if (
      /\boverwhelmed\b/i.test(stem) &&
      /\btearful\b/i.test(stem) &&
      /\b(?:post-?partum|delivered\b|after (?:a )?vaginal delivery)\b/i.test(stem)
    ) {
      keys.push("template:postpartum-blues");
    }
    if (POSTPARTUM_HEMORRHAGE_RE.test(stem) || heavyPostpartumBleed(stem)) {
      keys.push("template:boggy-hemorrhage");
    }
  }
  const distractors = distractorRepeatKey(item);
  if (distractors) keys.push(distractors);
  return keys;
}

/**
 * Keys that may appear once per sitting: the case opening, an abnormal vital
 * set, a number-stripped calc template, the same ask about the same drug or
 * condition, and the narrower template keys above.
 * Blood pressure, heart rate, and respiratory rate also form a core key so a
 * SpO2 or peak-flow spelling difference cannot split an otherwise identical set.
 */
export function sittingRepeatKeys(item: SittingCapSource, fieldId: string): string[] {
  const keys: string[] = [];
  const scene = sittingCaseFingerprint(item);
  if (scene) keys.push(scene);
  const readings = abnormalVitalParts(item);
  const vitals = formatVitalKey(readings, "vitals");
  if (vitals) keys.push(vitals);
  const core = formatVitalKey(
    readings.filter(([kind]) => kind === "bp" || kind === "hr" || kind === "rr"),
    "vitals-core"
  );
  if (core) keys.push(core);
  const calc = calcTemplateAsk(item.question ?? "");
  if (calc) keys.push(`calc:${calc}`);
  const ask = normalizedAsk(item.question ?? "");
  const anchors = isNursingSittingField(fieldId)
    ? sittingConditionMentions(item)
    : fieldId === "pharmacy"
      ? sittingDrugSplit(item).subject
      : [];
  if (ask.length >= 24) {
    for (const anchor of anchors) keys.push(`ask:${anchor}:${ask}`);
  }
  for (const key of sittingTemplateKeys(item, fieldId)) keys.push(key);
  return keys;
}

/** Caps the CAT picker applies on every adaptive pick, including later refills. */
export function sittingCapTags(
  item: SittingCapSource,
  fieldId: string
): { drugKeys: string[]; conditionKey: string | null; conditionKeys: string[]; repeatKeys: string[] } {
  const drugKeys = fieldId === "pharmacy" ? sittingDrugSplit(item).subject : [];
  const conditionKeys = isNursingSittingField(fieldId) ? sittingConditionMentions(item) : [];
  return {
    drugKeys,
    conditionKey: conditionKeys[0] ?? null,
    conditionKeys,
    repeatKeys: sittingRepeatKeys(item, fieldId),
  };
}

/**
 * Entity key aligned with the salient drug or condition, not the longest
 * medication-list name. Dosage asks still key when no condition is present.
 */
export function sittingCapEntityKey(item: SittingCapSource, fieldId: string): string | null {
  if (fieldId === "pharmacy") {
    const drug = sittingDrugSplit(item).subject[0];
    if (drug) return `drug:${drug}`;
    return null;
  }
  if (isNursingSittingField(fieldId)) {
    const condition = sittingConditionMentions(item)[0];
    if (condition) return `condition:${condition}`;
  }
  return sittingEntityKey(itemClinicalText(item), fieldId);
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

export type CapRejectionStats = {
  poolSize: number;
  kept: number;
  rejections: Record<string, number>;
  /** 0 is the strict pass. 1–5 are the cumulative relaxation ladder. */
  relaxLevel?: number;
  /** Strict pass, kept beside the level that was actually used. */
  strict?: { kept: number; rejections: Record<string, number> };
};

function scaledRepeatKey(key: string): boolean {
  return key.startsWith("template:") || key.startsWith("calc:");
}

export function enforceEntityAndDosageCap(
  items: readonly BankItem[],
  pool: readonly BankItem[],
  limit: number,
  fieldId: string,
  seenIds?: ReadonlySet<string>,
  stats?: CapRejectionStats,
  limits: SittingCapLimits = sittingCapLimits(limit, 0)
): BankItem[] {
  const entityCap = entityShareCap(limit);
  const dosageMax = isNursingSittingField(fieldId) ? nursingDosageShareCap(limit) : Number.POSITIVE_INFINITY;
  const calcMax = fieldId === "pharmacy" ? pharmacyCalculationQuota(limit) : Number.POSITIVE_INFINITY;
  const narrowCap = limits.narrowCap;
  const subjectDrugCap = limits.subjectDrugCap;
  const backgroundDrugCap = limits.backgroundDrugCap;
  const templateCap = limits.templateCap;
  const conditionCap = limits.conditionCap;
  const entityCounts = new Map<string, number>();
  const subjectDrugCounts = new Map<string, number>();
  const backgroundDrugCounts = new Map<string, number>();
  const conditionCounts = new Map<string, number>();
  const askCounts = new Map<string, number>();
  const templateCounts = new Map<string, number>();
  const narrowCounts = new Map<string, number>();
  const repeatCounts = new Map<string, number>();
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
  const rejectionCounts = new Map<string, number>();
  const notedRejections = new Set<string>();
  const noteRejection = (item: BankItem, reason: string) => {
    const id = item.id?.trim() || item.question;
    if (notedRejections.has(id)) return;
    notedRejections.add(id);
    rejectionCounts.set(reason, (rejectionCounts.get(reason) ?? 0) + 1);
  };

  const accept = (item: BankItem): boolean => {
    const id = item.id?.trim();
    if (id && used.has(id)) return false;
    if (!isServableToStudents(item)) {
      noteRejection(item, "ineligible");
      return false;
    }
    if (sequentialSetId(item)) {
      if (id) used.add(id);
      kept.push(item);
      return true;
    }
    const cluster = clusterByItem.get(item) ?? (id ? clusterById.get(id) : undefined);
    if (cluster && usedClusters.has(cluster)) {
      noteRejection(item, "cluster");
      return false;
    }
    const text = itemClinicalText(item);
    const entity = sittingCapEntityKey(item, fieldId);
    const ask = sittingAskKey(item.question) ?? (entity ? askSignature(text) : null);
    const template = calcTemplateAsk(item.question);
    const dose = isNursingSittingField(fieldId) && isNursingDosageItem(text);
    const numeric = fieldId === "pharmacy" && isPharmacyNumericEntry(item);
    const narrow = narrowTopicKeyFromBankItem(item);
    const drugSplit = fieldId === "pharmacy" ? sittingDrugSplit(item) : { subject: [], background: [] };
    const conditions = isNursingSittingField(fieldId) ? sittingConditionMentions(item) : [];
    const repeats = sittingRepeatKeys(item, fieldId);
    const entityLimit =
      fieldId === "pharmacy" && entity?.startsWith("drug:")
        ? subjectDrugCap
        : entity?.startsWith("condition:")
          ? conditionCap
          : entityCap;
    if (entity && (entityCounts.get(entity) ?? 0) >= entityLimit) {
      noteRejection(item, entity.startsWith("condition:") ? "condition" : entity.startsWith("drug:") ? "drug" : "entity");
      return false;
    }
    if (drugSplit.subject.some((drug) => (subjectDrugCounts.get(drug) ?? 0) >= subjectDrugCap)) {
      noteRejection(item, "drug");
      return false;
    }
    if (
      drugSplit.background.some((drug) => (backgroundDrugCounts.get(drug) ?? 0) >= backgroundDrugCap)
    ) {
      noteRejection(item, "drug");
      return false;
    }
    if (conditions.some((condition) => (conditionCounts.get(condition) ?? 0) >= conditionCap)) {
      noteRejection(item, "condition");
      return false;
    }
    const repeatHit = repeats.find((key) => (repeatCounts.get(key) ?? 0) >= (scaledRepeatKey(key) ? templateCap : 1));
    if (repeatHit) {
      noteRejection(item, `repeat:${repeatHit.split(":")[0]}`);
      return false;
    }
    if (entity && ask && (askCounts.get(`${entity}:${ask}`) ?? 0) >= 1) {
      noteRejection(item, "entity-ask");
      return false;
    }
    if (template && (templateCounts.get(template) ?? 0) >= templateCap) {
      noteRejection(item, "template");
      return false;
    }
    if (dose && dosage >= dosageMax) {
      noteRejection(item, "dosage");
      return false;
    }
    if (numeric && calcs >= calcMax) {
      noteRejection(item, "calc");
      return false;
    }
    if (narrow && (narrowCounts.get(narrow) ?? 0) >= narrowCap) {
      noteRejection(item, "narrow");
      return false;
    }
    if (entity) entityCounts.set(entity, (entityCounts.get(entity) ?? 0) + 1);
    for (const drug of drugSplit.subject) subjectDrugCounts.set(drug, (subjectDrugCounts.get(drug) ?? 0) + 1);
    for (const drug of drugSplit.background) {
      backgroundDrugCounts.set(drug, (backgroundDrugCounts.get(drug) ?? 0) + 1);
    }
    for (const condition of conditions) conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
    for (const key of repeats) repeatCounts.set(key, (repeatCounts.get(key) ?? 0) + 1);
    if (entity && ask) askCounts.set(`${entity}:${ask}`, 1);
    if (template) templateCounts.set(template, (templateCounts.get(template) ?? 0) + 1);
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

  const priorityNgn = items.filter((item) => isBowTieOrCloze(item));
  const regular = items.filter((item) => !isBowTieOrCloze(item));
  for (const item of [...priorityNgn, ...regular]) {
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
  const incoming = new Map<BankItem, number>();
  items.forEach((item, index) => {
    if (!incoming.has(item)) incoming.set(item, index);
  });
  kept.sort((left, right) => {
    const leftIndex = incoming.get(left);
    const rightIndex = incoming.get(right);
    if (leftIndex == null && rightIndex == null) return 0;
    if (leftIndex == null) return 1;
    if (rightIndex == null) return -1;
    return leftIndex - rightIndex;
  });
  const sliced = kept.slice(0, limit);
  if (stats) {
    stats.poolSize = pool.length;
    stats.kept = sliced.length;
    stats.rejections = Object.fromEntries(rejectionCounts);
    stats.relaxLevel = limits.relaxLevel;
  }
  return sliced;
}
