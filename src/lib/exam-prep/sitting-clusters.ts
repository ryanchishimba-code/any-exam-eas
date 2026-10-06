/**
 * Near-duplicate clusters for one sitting.
 * A family id groups rows only when several rows share it. Otherwise items
 * cluster on the clinical picture: condition, drug, and presenting symptoms
 * after names, ages, vitals, and doses are removed. Shared lead-in wording
 * ("which action first", "monitoring parameter") is not a cluster.
 */
import type { BankItem } from "@/lib/question-bank";
import { normalizeClinicalCaseText } from "@/lib/exam-prep/clinical-case-dedupe";

const FAMILY_META_KEYS = [
  "templateId",
  "templateFamilyId",
  "familyId",
  "stemTemplateId",
  "templateFamily",
] as const;

/** Identical wording after noise removal, not a shared sentence frame. */
const COPY_NEAR = 0.75;
const COPY_SHARED_MIN = 3;

/** Same lead-in, different scenario. Capped per sitting so one frame cannot fill the exam. */
export function questionFrame(question: string): string {
  const q = question.toLowerCase().replace(/\s+/g, " ");
  if (/highest priority|priority finding|most concerning|requires immediate/.test(q)) {
    return "priority-finding";
  }
  if (
    /take first|first action|priority action|priority nursing|nurse'?s priority|priority concern|should the (?:nurse|pharmacist) take first/.test(
      q
    )
  ) {
    return "action-first";
  }
  if (/most appropriate|next best step|best next/.test(q)) return "most-appropriate";
  if (/discharg/.test(q)) return "discharge";
  if (/counsel/.test(q)) return "counseling";
  if (/\bmonitor/.test(q)) return "monitoring";
  return "other";
}

const TOKEN_STOP = new Set([
  "which",
  "what",
  "when",
  "that",
  "this",
  "with",
  "from",
  "have",
  "been",
  "were",
  "your",
  "their",
  "about",
  "into",
  "after",
  "before",
  "should",
  "would",
  "could",
  "nurse",
  "client",
  "patient",
  "following",
  "most",
  "appropriate",
  "action",
  "take",
  "first",
  "best",
  "response",
  "select",
  "scenario",
  "year",
  "old",
  "male",
  "female",
  "history",
  "presents",
  "admitted",
  "experiencing",
  "current",
  "medications",
  "include",
  "upon",
  "assessment",
  "vital",
  "signs",
  "blood",
  "pressure",
  "heart",
  "rate",
  "respiratory",
  "breaths",
  "prescribed",
  "daily",
  "reports",
  "starting",
  "medication",
  "concerned",
  "while",
  "compliant",
  "regimen",
  "shows",
  "notes",
  "both",
  "lower",
  "extremities",
  "within",
  "normal",
  "limits",
  "monitoring",
  "parameter",
  "parameters",
  "required",
  "dose",
  "doses",
  "next",
  "counseling",
  "point",
  "points",
  "applies",
  "apply",
  "refilling",
  "refill",
  "refills",
  "baseline",
  "test",
  "tests",
  "prescription",
  "written",
  "toxicity",
  "actions",
  "visit",
  "different",
  "comorbidity",
  "case",
  "about",
  "taking",
  "takes",
  "starts",
  "starting",
  "older",
  "bedtime",
  "criterion",
  "criteria",
  "increased",
  "worsening",
  "potential",
  "evaluated",
  "being",
  "exertion",
  "fatigue",
  "complaints",
  "complaint",
  "clinic",
  "bilateral",
  "legs",
  "leg",
  "assessment",
  "experiencing",
  "current",
  "include",
  "prescribed",
  "daily",
  "reports",
  "concerned",
  "compliant",
  "regimen",
  "both",
  "lower",
  "extremities",
  "medication",
  "medications",
  "immediately",
  "arrange",
  "follow",
  "step",
  "level",
  "agent",
  "check",
  "ignore",
  "symptoms",
  "symptom",
  "medicines",
  "medicine",
  "discharge",
  "today",
  "pharmacist",
  "finding",
  "findings",
  "highest",
  "priority",
  "actions",
  "taken",
  "using",
  "during",
  "since",
  "because",
  "there",
  "these",
  "those",
  "also",
  "only",
  "than",
  "then",
  "each",
  "such",
  "over",
  "under",
  "very",
  "more",
  "some",
  "other",
  "another",
  "client",
]);

function readMetaId(meta: unknown): string | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const rec = meta as Record<string, unknown>;
  for (const key of FAMILY_META_KEYS) {
    const value = rec[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** Stored family id, when the bank or the generator recorded one. */
export function templateFamilyId(item: BankItem): string | null {
  const cluster = item.clusterId?.trim();
  if (cluster) return `cluster:${cluster}`;

  const fromGeneration = readMetaId(item.generationMeta);
  if (fromGeneration) return `family:${fromGeneration}`;

  const fromCuration = readMetaId(item.curationMeta);
  if (fromCuration) return `family:${fromCuration}`;

  const payload = item.ngnPayload;
  if (payload && typeof payload === "object") {
    const setId = payload.setId;
    if (payload.kind === "sequential" && typeof setId === "string" && setId.trim()) {
      return `seq:${setId.trim()}`;
    }
    const fromPayload = readMetaId(payload);
    if (fromPayload) return `family:${fromPayload}`;
  }

  return null;
}

export function sequentialSetId(item: BankItem): string | null {
  const payload = item.ngnPayload;
  if (!payload || typeof payload !== "object") return null;
  if (payload.kind !== "sequential") return null;
  const setId = payload.setId;
  return typeof setId === "string" && setId.trim() ? setId.trim() : null;
}

const PHRASE_FOLDS: ReadonlyArray<[RegExp, string]> = [
  [/\bheart failure\b/g, "heartfailure"],
  [/\bmyocardial infarction\b/g, "myocardialinfarction"],
  [/\bchest pain\b/g, "chestpain"],
  [/\bshortness of breath\b/g, "sob"],
  [/\bshort of breath\b/g, "sob"],
  [/\bdyspnea\b/g, "sob"],
  [/\bpitting edema\b/g, "swelling"],
  [/\bperipheral edema\b/g, "swelling"],
  [/\bedema\b/g, "swelling"],
  [/\boedema\b/g, "swelling"],
  [/\blower extremities\b/g, "legs"],
  [/\bmyalgias?\b/g, "musclepain"],
  [/\bmuscle (?:pain|aches|ache|weakness|soreness|symptoms)\b/g, "musclepain"],
  [/\bswelling (?:of|in) (?:his|her|their|the|both)?\s*(?:legs|ankles|feet|extremities)\b/g, "swelling"],
  [/\b(?:leg|ankle|pedal) swelling\b/g, "swelling"],
  [/\btotal hip(?: replacement| arthroplasty)?\b/g, "hipreplacement"],
  [/\bhip (?:replacement|arthroplasty|fracture)\b/g, "hipreplacement"],
  [/\boral contraceptives?\b/g, "oralcontraceptive"],
  [/\bchronic kidney disease\b/g, "kidneydisease"],
  [/\bkidney disease\b/g, "kidneydisease"],
  [/\bend-stage renal\b/g, "kidneydisease"],
  [/\bdisaster triage\b/g, "disastertriage"],
  [/\bmass casualty\b/g, "disastertriage"],
  [/\bhouse fire\b/g, "burnairway"],
  [/\bfacial burns\b/g, "burnairway"],
  [/\bhoarse voice\b/g, "burnairway"],
  [/\binhalation injury\b/g, "burnairway"],
  [/\bburn(?:s)? airway\b/g, "burnairway"],
  [/\bcongestive heart\b/g, "heartfailure"],
  [/\b(?:st-?segment elevation|stemi|non-?stemi|acute coronary syndrome)\b/g, "myocardialinfarction"],
];

const CONDITION_ANCHORS = new Set([
  "heartfailure",
  "myocardialinfarction",
  "chestpain",
  "kidneydisease",
  "hipreplacement",
  "oralcontraceptive",
  "disastertriage",
  "burnairway",
]);

const PRESENTATION_ANCHORS = new Set(["musclepain", "chestpain"]);

const SYMPTOM_ANCHORS = new Set([
  "sob",
  "swelling",
  "crackles",
  "wheeze",
  "hoarse",
  "proteinuria",
  "cyanosis",
  "musclepain",
]);

const DRUG_SUFFIX =
  /(?:mycin|cillin|olol|pril|sartan|dipine|statin|prazole|oxetine|azepam|caine|semide|parin|xaban|gliptin|gliflozin|cycline|floxacin|tidine|formin|traline|trigine|terol|phylline|dronate|lukast|tropium|navir|ciclovir|triptan|setron|thiazide|stigmine|profen|farin)$/;

const KNOWN_DRUGS = new Set([
  "insulin",
  "lithium",
  "aspirin",
  "digoxin",
  "warfarin",
  "heparin",
  "metformin",
  "furosemide",
  "gabapentin",
  "pregabalin",
  "morphine",
  "acetaminophen",
  "ibuprofen",
  "prednisone",
  "albuterol",
  "levothyroxine",
  "sertraline",
  "lamotrigine",
  "vancomycin",
  "atorvastatin",
  "lisinopril",
]);

/** Names, ages, vitals, and doses are template noise. Condition and drug words stay. */
export function normalizeScenarioText(text: string): string {
  let value = normalizeClinicalCaseText(text);
  value = value
    .replace(/\b(?:mr|mrs|ms|miss)\.?\s+[a-z]+\b/g, " ")
    .replace(/\b(?:bp|blood pressure)\s*\d+\s*\/\s*\d+(?:\s*mmhg)?\b/g, " ")
    .replace(
      /\b(?:hr|heart rate|pulse|rr|respiratory rate|temp(?:erature)?|spo2|o2 sat(?:uration)?)\s*(?:of\s*)?\d+(?:\.\d+)?(?:\s*(?:bpm|breaths\/min|%))?\b/g,
      " "
    )
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|meq|units?|%|mmhg|bpm)\b/g, " ")
    .replace(/\b\d+(?:\.\d+)?\b/g, " ")
    .replace(/\b(?:male|female|man|woman)\b/g, " ");
  for (const [pattern, token] of PHRASE_FOLDS) {
    value = value.replace(pattern, ` ${token} `);
  }
  return value.replace(/\s+/g, " ").trim();
}

function isAnchorToken(token: string): boolean {
  return (
    CONDITION_ANCHORS.has(token) ||
    PRESENTATION_ANCHORS.has(token) ||
    SYMPTOM_ANCHORS.has(token) ||
    KNOWN_DRUGS.has(token) ||
    DRUG_SUFFIX.test(token)
  );
}

export function stemTokens(text: string): string[] {
  const norm = normalizeScenarioText(text);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const token of norm.split(/[^a-z0-9]+/)) {
    if (!token || seen.has(token)) continue;
    if (!isAnchorToken(token) && (token.length <= 3 || TOKEN_STOP.has(token))) continue;
    seen.add(token);
    out.push(token);
  }
  return out;
}

function tokenJaccard(a: readonly string[], b: readonly string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const sb = new Set(b);
  let inter = 0;
  for (const token of a) {
    if (sb.has(token)) inter += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union > 0 ? inter / union : 0;
}

function itemStem(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const question = item.question?.trim() ?? "";
  return vignette ? `${vignette} ${question}` : question;
}

type ScenarioSig = {
  tokens: string[];
  conditions: Set<string>;
  drugs: Set<string>;
  presentations: Set<string>;
  symptoms: Set<string>;
};

function isDrugToken(token: string): boolean {
  return KNOWN_DRUGS.has(token) || DRUG_SUFFIX.test(token);
}

function scenarioSignature(text: string): ScenarioSig {
  const tokens = stemTokens(text);
  const conditions = new Set<string>();
  const drugs = new Set<string>();
  const presentations = new Set<string>();
  const symptoms = new Set<string>();
  for (const token of tokens) {
    if (CONDITION_ANCHORS.has(token)) conditions.add(token);
    if (PRESENTATION_ANCHORS.has(token)) presentations.add(token);
    if (SYMPTOM_ANCHORS.has(token)) symptoms.add(token);
    if (isDrugToken(token)) drugs.add(token);
  }
  return { tokens, conditions, drugs, presentations, symptoms };
}

function primaryDrug(text: string, question: string): string | null {
  const firstSentence = text.split(/(?<=[.?!])\s+/)[0] ?? text;
  const fromFirst = stemTokens(firstSentence).filter(isDrugToken);
  if (fromFirst.length === 1) return fromFirst[0]!;
  const fromQuestion = stemTokens(question).filter(isDrugToken);
  return fromQuestion.length === 1 ? fromQuestion[0]! : null;
}

/**
 * Keys for one scenario. Items share a cluster when a key matches.
 * A medication listed later in the history is not a key, so polypharmacy
 * vignettes do not chain together through a common drug.
 */
export function scenarioKeys(item: BankItem): string[] {
  if (sequentialSetId(item)) return [];
  const text = itemStem(item);
  const signature = scenarioSignature(text);
  const keys: string[] = [];
  const opening = new Set(stemTokens(text.split(/(?<=[.?!])\s+/)[0] ?? text));
  const hasSob = signature.symptoms.has("sob");
  const hasSwelling = signature.symptoms.has("swelling");
  const symptomPicture = [hasSob ? "sob" : "", hasSwelling ? "swelling" : ""].filter(Boolean);
  let scenario: string | null = null;
  if (hasSob && hasSwelling && signature.conditions.has("heartfailure")) {
    scenario = "cond:heartfailure|sx:sob+swelling";
  } else if (hasSob && hasSwelling && signature.conditions.size > 0) {
    const condition = [...signature.conditions].sort().join("+");
    scenario = `cond:${condition}|sx:sob+swelling`;
  } else if (opening.has("chestpain") || opening.has("myocardialinfarction")) {
    scenario = "topic:acs";
  } else if (opening.has("hipreplacement")) {
    scenario = "topic:hipreplacement";
  } else if (opening.has("disastertriage")) {
    scenario = "topic:disastertriage";
  } else if (opening.has("burnairway")) {
    scenario = "topic:burnairway";
  } else {
    const drug = primaryDrug(text, item.question ?? "");
    if (drug && (signature.presentations.size > 0 || symptomPicture.length >= 2)) {
      const picture = [...signature.presentations, ...symptomPicture].sort().join("+");
      scenario = `drug:${drug}|${picture}`;
    }
  }
  if (scenario) keys.push(scenario);
  if (signature.tokens.length >= 2) keys.push(`copy:${signature.tokens.join(" ")}`);
  return keys;
}

function contentNear(a: BankItem, b: BankItem): boolean {
  if (sequentialSetId(a) || sequentialSetId(b)) return false;
  const left = new Set(scenarioKeys(a));
  for (const key of scenarioKeys(b)) {
    if (left.has(key)) return true;
  }
  const leftTokens = stemTokens(itemStem(a));
  const rightTokens = stemTokens(itemStem(b));
  if (tokenJaccard(leftTokens, rightTokens) < COPY_NEAR) return false;
  const other = new Set(rightTokens);
  let shared = 0;
  for (const token of leftTokens) {
    if (other.has(token)) shared += 1;
  }
  return shared >= COPY_SHARED_MIN;
}

/** True when two rows are the same template with light wording, age, or dose edits. */
export function itemsAreNearDuplicates(a: BankItem, b: BankItem): boolean {
  const setA = sequentialSetId(a);
  const setB = sequentialSetId(b);
  if (setA || setB) return Boolean(setA && setA === setB);
  const familyA = templateFamilyId(a);
  const familyB = templateFamilyId(b);
  if (familyA && familyB && familyA === familyB) return true;
  return contentNear(a, b);
}

/**
 * One cluster id per pool index.
 * A family id groups rows only when more than one row carries it. A unique
 * cluster id is not a template, so those rows still cluster on the scenario.
 * Two different shared families are not merged by wording.
 */
export function assignSittingClusters(items: readonly BankItem[]): string[] {
  const parent = items.map((_, index) => index);
  const find = (index: number): number => {
    let root = index;
    while (parent[root] !== root) root = parent[root]!;
    let cursor = index;
    while (parent[cursor] !== root) {
      const next = parent[cursor]!;
      parent[cursor] = root;
      cursor = next;
    }
    return root;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };

  const families = items.map((item) => templateFamilyId(item));
  const familyCounts = new Map<string, number>();
  for (const family of families) {
    if (!family) continue;
    familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
  }
  const sharedFamily = (index: number): string | null => {
    const family = families[index];
    if (!family || (familyCounts.get(family) ?? 0) < 2) return null;
    return family;
  };

  const byFamily = new Map<string, number>();
  for (let i = 0; i < items.length; i++) {
    const family = sharedFamily(i);
    if (!family) continue;
    const prior = byFamily.get(family);
    if (prior == null) byFamily.set(family, i);
    else union(prior, i);
  }

  const buckets = new Map<string, number[]>();
  items.forEach((item, index) => {
    for (const key of scenarioKeys(item)) {
      const list = buckets.get(key);
      if (list) list.push(index);
      else buckets.set(key, [index]);
    }
  });

  for (const group of buckets.values()) {
    if (group.length < 2) continue;
    const head = group[0]!;
    for (let i = 1; i < group.length; i++) {
      const other = group[i]!;
      if (find(head) === find(other)) continue;
      const familyA = sharedFamily(head);
      const familyB = sharedFamily(other);
      if (familyA && familyB && familyA !== familyB) continue;
      union(head, other);
    }
  }

  const labels = new Map<number, string>();
  let serial = 0;
  return items.map((_, index) => {
    const root = find(index);
    let label = labels.get(root);
    if (!label) {
      const family = families[root];
      const shared = family != null && (familyCounts.get(family) ?? 0) >= 2;
      label = shared ? family : `near:${serial}`;
      if (!shared) serial += 1;
      labels.set(root, label);
    }
    return label;
  });
}
