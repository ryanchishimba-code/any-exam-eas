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
];

const DRUG_SUFFIX =
  /\b([a-z]{5,}(?:statin|pril|sartan|olol|dipine|prazole|cillin|mycin|cycline|oxetine|traline|azepam|azolam|parin|xaban|gliptin|flozin|glutide|setron|dronate|lukast|terol))\b/gi;

const MED_LIST_CUE =
  /\b(?:home (?:medications?|meds|regimen)|current (?:medications?|meds|regimen)|medications? include|medication list|medication reconciliation|med rec|outpatient medications?|scheduled medications?)\b/i;

const CONDITIONS: { key: string; re: RegExp }[] = [
  { key: "preeclampsia", re: /\bpreeclampsia\b|\blate decel\w*\b/i },
  { key: "hip-arthroplasty", re: /\b(?:total hip|hip)\s+(?:arthroplasty|replacement)\b|\bhip arthroplasty\b/i },
  { key: "postpartum-hemorrhage", re: /\bpost-?partum hemorrhage\b|\bpph\b/i },
  { key: "gestational-diabetes", re: /\bgestational diabetes\b/i },
  {
    key: "gallbladder",
    re: /\bgallbladder\b|\bcholecystitis\b|\bcholelithiasis\b|\b(?:laparoscopic cholecystectomy|lap(?:aroscopic)? chole|cholecystectomy)\b/i,
  },
  { key: "suicide", re: /\bsuicid\w*|\bself-harm\b|\b(?<!respiratory )depress(?:ed|ion|ive)s?\b/i },
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
];

const OB_SPECIFIC = new Set(["preeclampsia", "gestational-diabetes", "postpartum-hemorrhage"]);
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
    if (!name) continue;
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

/**
 * Drugs that count toward the pharmacy cap.
 * Every drug in the question, the keyed answer, or a short subject field counts.
 * A longer name in a home-medication list no longer hides the subject drug,
 * and that list does not itself spend the cap.
 */
export function sittingDrugMentions(item: SittingCapSource): string[] {
  const question = item.question ?? "";
  const mentions: string[] = [];
  pushDrugs(mentions, canonicalDrugs(question));
  pushDrugs(mentions, canonicalDrugs(keyedAnswerText(item)));
  if (canonicalDrugs(question).length === 0) {
    const scene = [item.scenario, item.vignette].filter(Boolean).join("\n");
    for (const sentence of sentencesOf(scene)) {
      if (MED_LIST_CUE.test(sentence)) continue;
      pushDrugs(mentions, canonicalDrugs(sentence));
    }
  }
  for (const field of mainSubjectTexts(item)) {
    if (field.length > 60) continue;
    if (field.split(/\s+/).length > 4) continue;
    pushDrugs(mentions, canonicalDrugs(field));
  }
  return mentions;
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
  | "options"
  | "correctAnswer"
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

/** Primary salient drug. Background medication-list names are not primary. */
export function sittingDrugMention(item: SittingCapSource): string | null {
  return sittingDrugMentions(item)[0] ?? null;
}

function clinicalBlob(item: SittingCapSource): string {
  return [item.scenario, item.vignette, item.question].filter(Boolean).join("\n");
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
  const text = clinicalBlob(item);
  const question = item.question ?? "";
  const fields = conditionFields(item);
  const keys = new Set<string>();
  for (const condition of CONDITIONS) {
    if (condition.key === "hypertension") continue;
    if (condition.re.test(text)) keys.add(condition.key);
  }
  if (opioidRisk(text)) keys.add("opioid-sud");
  const stemConditionCount = keys.size;
  const explicitHypertension = HTN_RE.test(text) && !hypertensionIsHistoryOnly(text);
  const stemImpliesHypertension = impliedHypertension(text, question) && stemConditionCount === 0;
  const stemHistoryHypertension = stemConditionCount === 0 && hypertensionIsHistoryOnly(text);
  // A metadata label is only the subject when the stem itself names nothing.
  // Otherwise "preeclampsia" in metadata hid hypertension that the vitals carried.
  if (stemConditionCount === 0 && !explicitHypertension && !stemImpliesHypertension && !stemHistoryHypertension) {
    for (const field of fields) {
      for (const condition of CONDITIONS) {
        if (condition.key === "hypertension") continue;
        if (condition.re.test(field)) keys.add(condition.key);
      }
      if (opioidRisk(field)) keys.add("opioid-sud");
    }
  }

  const metadataHypertension = keys.size === 0 && fields.some((field) => HTN_RE.test(field));
  if (explicitHypertension || stemImpliesHypertension || stemHistoryHypertension || metadataHypertension) {
    keys.add("hypertension");
  }
  if (keys.has("preeclampsia")) keys.delete("hypertension");
  if ([...keys].some((key) => OB_SPECIFIC.has(key))) keys.delete("pregnancy");
  if (keys.has("acs") && acsIsHistoryOnly(text) && [...keys].some((key) => key !== "acs")) keys.delete("acs");
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
  return false;
}

/**
 * Same abnormal vitals and labs are one case, even when the opening sentence
 * was rewritten. Normal filler vitals do not collide.
 */
export function sittingVitalFingerprint(item: SittingCapSource): string | null {
  const text = clinicalBlob(item);
  if (text.length < 40) return null;
  const parts: [string, string][] = [];
  const bp = text.match(/\b(\d{2,3})\s*\/\s*(\d{2,3})\b/);
  if (bp) {
    const sys = Number(bp[1]);
    const dia = Number(bp[2]);
    if (sys >= 60 && sys <= 260 && dia >= 30 && dia <= 160 && dia < sys) parts.push(["bp", `${sys}/${dia}`]);
  }
  const labeled = (kind: string, re: RegExp) => {
    const match = text.match(re);
    if (!match?.[1]) return;
    const reading = Number(match[1]);
    if (!Number.isFinite(reading)) return;
    parts.push([kind, String(reading)]);
  };
  labeled("hr", /\b(?:hr|heart rate|pulse)\s*(?:of|is|was|:)?\s*(\d{2,3})\b/i);
  labeled("rr", /\b(?:rr|respirations|respiratory rate)\s*(?:of|is|was|:)?\s*(\d{1,2})\b/i);
  labeled("spo2", /\b(?:spo2|oxygen saturation|o2 sat(?:uration)?)\s*(?:of|is|was|:)?\s*(\d{2,3})\s*%?/i);
  labeled("hgb", /\b(?:hgb|hemoglobin)\s*(?:of|is|was|:)?\s*(\d{1,2}(?:\.\d+)?)\b/i);
  const abnormal = parts.filter(([kind, value]) => vitalAbnormal(kind, value));
  if (abnormal.length < 3) return null;
  abnormal.sort((left, right) => left[0].localeCompare(right[0]));
  return `vitals:${abnormal.map(([kind, value]) => `${kind}=${value}`).join(",")}`;
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

/**
 * Keys that may appear once per sitting: the case opening, an abnormal vital
 * set, a number-stripped calc template, and the same ask about the same drug
 * or condition.
 */
export function sittingRepeatKeys(item: SittingCapSource, fieldId: string): string[] {
  const keys: string[] = [];
  const scene = sittingCaseFingerprint(item);
  if (scene) keys.push(scene);
  const vitals = sittingVitalFingerprint(item);
  if (vitals) keys.push(vitals);
  const calc = calcTemplateAsk(item.question ?? "");
  if (calc) keys.push(`calc:${calc}`);
  const ask = normalizedAsk(item.question ?? "");
  const anchors = isNursingSittingField(fieldId)
    ? sittingConditionMentions(item)
    : fieldId === "pharmacy"
      ? sittingDrugMentions(item)
      : [];
  if (ask.length >= 24) {
    for (const anchor of anchors) keys.push(`ask:${anchor}:${ask}`);
  }
  return keys;
}

/** Caps the CAT picker applies on every adaptive pick, including later refills. */
export function sittingCapTags(
  item: SittingCapSource,
  fieldId: string
): { drugKeys: string[]; conditionKey: string | null; conditionKeys: string[]; repeatKeys: string[] } {
  const drugKeys = fieldId === "pharmacy" ? sittingDrugMentions(item) : [];
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
    const drug = sittingDrugMentions(item)[0];
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
    const entity = sittingCapEntityKey(item, fieldId);
    const ask = sittingAskKey(item.question) ?? (entity ? askSignature(text) : null);
    const template = calcTemplateAsk(item.question);
    const dose = isNursingSittingField(fieldId) && isNursingDosageItem(text);
    const numeric = fieldId === "pharmacy" && isPharmacyNumericEntry(item);
    const narrow = narrowTopicKeyFromBankItem(item);
    const drugs = fieldId === "pharmacy" ? sittingDrugMentions(item) : [];
    const conditions = isNursingSittingField(fieldId) ? sittingConditionMentions(item) : [];
    const repeats = sittingRepeatKeys(item, fieldId);
    const entityLimit =
      fieldId === "pharmacy" && entity?.startsWith("drug:")
        ? PHARMACY_DRUG_CAP
        : entity?.startsWith("condition:")
          ? conditionCap
          : entityCap;
    if (entity && (entityCounts.get(entity) ?? 0) >= entityLimit) return false;
    if (drugs.some((drug) => (drugCounts.get(drug) ?? 0) >= PHARMACY_DRUG_CAP)) return false;
    if (conditions.some((condition) => (conditionCounts.get(condition) ?? 0) >= conditionCap)) return false;
    if (repeats.some((key) => usedRepeats.has(key))) return false;
    if (entity && ask && (askCounts.get(`${entity}:${ask}`) ?? 0) >= 1) return false;
    if (template && (templateCounts.get(template) ?? 0) >= 1) return false;
    if (dose && dosage >= dosageMax) return false;
    if (numeric && calcs >= calcMax) return false;
    if (narrow && (narrowCounts.get(narrow) ?? 0) >= narrowCap) return false;
    if (entity) entityCounts.set(entity, (entityCounts.get(entity) ?? 0) + 1);
    for (const drug of drugs) drugCounts.set(drug, (drugCounts.get(drug) ?? 0) + 1);
    for (const condition of conditions) conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
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
