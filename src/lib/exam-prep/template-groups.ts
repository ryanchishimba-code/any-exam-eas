/**
 * Template groups for one sitting.
 * Near-duplicate clustering catches identical choices. These keys catch the
 * copies that only change an age or a few words: the same question template
 * with the same keyed concept, or the same drug/condition and the same ask.
 */
import type { BankItem } from "@/lib/question-bank";

const DRUG_SUFFIX =
  /\b([a-z]{4,}(?:statin|pril|sartan|olol|dipine|prazole|cillin|mycin|cycline|oxetine|azepam|azolam|parin|xaban|gliptin|flozin|glutide))\b/g;

const KNOWN_DRUGS = [
  "warfarin",
  "insulin",
  "heparin",
  "metformin",
  "aspirin",
  "levodopa",
  "carbidopa",
  "digoxin",
  "furosemide",
  "lisinopril",
  "amlodipine",
  "metformin",
  "clonidine",
  "clonazepam",
  "apixaban",
  "rivaroxaban",
  "zolpidem",
  "acetaminophen",
  "ibuprofen",
  "albuterol",
  "prednisone",
  "potassium",
];

const CONDITIONS: { id: string; re: RegExp }[] = [
  { id: "myalgia", re: /\bmyalgias?\b|\bmuscle (?:pain|ache|aches|soreness|weakness)\b/ },
  { id: "inr", re: /\binr\b/ },
  { id: "ldl", re: /\bldl\b/ },
  { id: "low-supply", re: /\blow (?:milk )?supply\b|\binsufficient milk\b|\bnot enough milk\b/ },
  { id: "breastfeeding", re: /\bbreastfeed|\blactation\b|\bbreast milk\b|\bmilk supply\b/ },
  { id: "gtt", re: /\bglucose tolerance\b|\bgtt\b|\bgestational diabetes\b/ },
  { id: "fasting-glucose", re: /\bfasting (?:glucose|blood sugar|plasma glucose|bg)\b/ },
  { id: "hypokalemia", re: /\bhypokalem|\bpotassium\b|\bserum k\b/ },
  { id: "cdiff", re: /\bc\.?\s*diff|\bclostridioides\b|\bclostridium difficile\b/ },
  { id: "hand-hygiene", re: /\bhand hygiene\b|\bsoap and water\b|\bwash(?:ing)? hands\b/ },
  { id: "pancreatitis", re: /\bpancreatitis\b/ },
  { id: "alcohol", re: /\balcohol\b|\bethanol\b|\bdrinking binge\b/ },
  { id: "fatigue", re: /\bfatigue\b|\btired\b/ },
  { id: "weight-loss", re: /\bweight loss\b|\blost \d+\s*(?:lb|pound)|\b\d+\s*(?:lb|pound)s?\b/ },
  { id: "spo2", re: /\bspo2\b|\boxygen saturation\b/ },
  { id: "nebulizer", re: /\bnebuliz/ },
  { id: "copd", re: /\bcopd\b|\bchronic obstructive\b/ },
  { id: "asthma", re: /\basthma\b/ },
  { id: "albuterol", re: /\balbuterol\b/ },
  { id: "sjw", re: /\bst\.?\s*john'?s?\s*wort\b/ },
  { id: "ssri", re: /\bssri\b|\bsertraline\b|\bfluoxetine\b|\bparoxetine\b/ },
  { id: "dpi", re: /\bdry[- ]powder\b|\bdiskus\b|\bdpi\b/ },
  { id: "micronized", re: /\bmicronized\b/ },
  { id: "belongings", re: /\bbelongings\b/ },
  { id: "boggy-fundus", re: /\bboggy fundus\b|\bfundus\b[^.]{0,40}\bboggy\b|\bboggy\b[^.]{0,40}\b(?:fundus|uterus)\b|\bpostpartum hemorrhage\b|\buterine atony\b|\bpph\b/ },
  { id: "burns", re: /\bburns?\b|\btbsa\b/ },
  { id: "glucose-250", re: /\bglucose\b|\bblood sugar\b/ },
];

/** Labels that describe a whole disease, not one vignette. They need a shared number. */
const BROAD_CASE = new Set([
  "asthma",
  "albuterol",
  "copd",
  "spo2",
  "nebulizer",
  "fatigue",
  "glucose-250",
  "burns",
]);

const SCENE_STOP = new Set([
  "the", "and", "for", "with", "that", "this", "from", "have", "has", "was", "were", "are",
  "been", "being", "into", "over", "after", "before", "about", "which", "what", "when",
  "your", "their", "client", "patient", "nurse", "year", "old", "who", "she", "her", "his",
  "him", "they", "them", "presents", "presented", "reports", "reported", "history",
]);

const INTENTS: { id: string; re: RegExp }[] = [
  { id: "immediate-follow-up", re: /immediate follow-?up|requires? (?:immediate )?follow-?up/ },
  { id: "further-teaching", re: /further teaching|additional teaching|need for teaching/ },
  { id: "therapeutic", re: /therapeutic (?:response|communication)/ },
  { id: "priority", re: /\bpriority\b/ },
  { id: "adverse", re: /adverse effect|side effect|toxicity/ },
  { id: "iv-push", re: /iv push|push rate|mg per minute|mg\/min/ },
  { id: "periprocedure-hold", re: /hold (?:before|prior|the dose)|peri-?procedure|before (?:surgery|the procedure)/ },
  { id: "lasa", re: /look-alike|sound-alike|name pair|confused with/ },
];

function itemText(item: BankItem): string {
  return [item.vignette, item.scenario, item.question].filter(Boolean).join(" ").toLowerCase();
}

function questionLine(item: BankItem): string {
  return (item.question ?? "").toLowerCase();
}

/**
 * Ages drop out so "65-year-old" and "72-year-old" share a template.
 * Other numbers stay: "INR of 4.5" still matches "INR of 4.50", and
 * "check level 3" stays distinct from "check level 17".
 */
export function normalizeTemplateText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\s*-?\s*(?:year|yr|week|day|month|hour)s?\s*-?\s*old\b/g, " ")
    .replace(/\b(\d+)\.(\d+?)0+\b/g, "$1.$2")
    .replace(/\b(\d+)\.0+\b/g, "$1")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function drugsIn(text: string): string[] {
  const found = new Set<string>();
  for (const name of KNOWN_DRUGS) {
    if (text.includes(name)) found.add(name);
  }
  for (const match of text.matchAll(DRUG_SUFFIX)) {
    const name = match[1];
    if (name) found.add(name);
  }
  return [...found];
}

function conditionsIn(text: string): string[] {
  return CONDITIONS.filter((row) => row.re.test(text)).map((row) => row.id);
}

function intentId(text: string): string | null {
  return INTENTS.find((row) => row.re.test(text))?.id ?? null;
}

function sceneSource(item: BankItem): string {
  const vignette = [item.vignette, item.scenario].filter(Boolean).join(" ");
  if (vignette.trim().length >= 40) return vignette;
  return [vignette, item.question].filter(Boolean).join(" ");
}

function rareCasePair(clinical: readonly string[]): boolean {
  const set = new Set(clinical);
  return (
    (set.has("cdiff") && set.has("hand-hygiene")) ||
    (set.has("pancreatitis") && set.has("alcohol")) ||
    (set.has("fatigue") && set.has("weight-loss")) ||
    (set.has("ssri") && set.has("sjw")) ||
    set.has("micronized") ||
    set.has("dpi") ||
    set.has("belongings") ||
    set.has("boggy-fundus")
  );
}

/** Same case written two ways: shared drugs, conditions, and the numbers that define it. */
export function scenarioSimilarityKey(item: BankItem): string | null {
  const text = sceneSource(item).toLowerCase();
  const anchors = [...new Set([...drugsIn(text), ...conditionsIn(text)])];
  const numbers = [...text.matchAll(/\b\d+(?:\.\d+)?\b/g)]
    .map((match) => match[0])
    .filter((value) => {
      const n = Number(value);
      return n >= 2 && n < 1000;
    });
  const facts = [...anchors, ...numbers.map((value) => `n${value}`)].sort();
  const clinical = facts.filter((fact) => !fact.startsWith("n"));
  if (clinical.length < 2 && !rareCasePair(clinical)) return null;
  // Two common labels (asthma + albuterol) are not one case unless a number or a rare pair is shared.
  if (numbers.length === 0 && !rareCasePair(clinical)) return null;
  if (facts.length < 2 && !rareCasePair(clinical)) return null;
  return `scene:${facts.join("+")}`;
}

/**
 * Normalized vignette text. Different questions on the same paragraph share it.
 * Short or generic scenes stay ungrouped so distinct items do not collapse.
 */
export function normalizedScenarioKey(item: BankItem): string | null {
  const vignette = [item.vignette, item.scenario].filter(Boolean).join(" ");
  if (vignette.trim().length < 40) return null;
  const tokens = normalizeTemplateText(vignette)
    .split(" ")
    .filter((token) => token.length > 2 && !SCENE_STOP.has(token));
  if (tokens.length < 6) return null;
  const distinctive = tokens.some((token) => /\d/.test(token) || drugsIn(token).length > 0 || conditionsIn(token).length > 0);
  if (!distinctive) return null;
  return `vignette:${tokens.join(" ")}`;
}

/**
 * Group ids for this row. Empty when the item has no template signal.
 * Callers keep at most one item from each id in a sitting.
 */
export function templateGroupKeys(item: BankItem): string[] {
  const keys: string[] = [];
  const question = normalizeTemplateText(questionLine(item));
  const concept = normalizeTemplateText(item.correctAnswer ?? "");
  if (question.length >= 12 && concept.length >= 3) {
    keys.push(`tpl:${question}::${concept}`);
  }

  const text = itemText(item);
  const anchors = [...new Set([...drugsIn(text), ...conditionsIn(text)])].sort();
  const intent = intentId(`${questionLine(item)} ${text}`);
  if (intent && anchors.length > 0) {
    keys.push(`ask:${anchors.join("+")}::${intent}`);
  }
  if (/\bclonidine\b/.test(text) && /\bclonazepam\b/.test(text)) {
    keys.push("case:clonidine+clonazepam");
  }
  // Drug plus a specific finding (atorvastatin + myalgia) is one case even when
  // the ask is reworded. A broad pair such as asthma + albuterol is not.
  const drugs = drugsIn(text);
  const findings = conditionsIn(text).filter((id) => !BROAD_CASE.has(id));
  if (rareCasePair(anchors) || (drugs.length > 0 && findings.length > 0 && anchors.length >= 2)) {
    keys.push(`case:${anchors.join("+")}`);
  }
  const scene = scenarioSimilarityKey(item);
  if (scene) keys.push(scene);
  const vignette = normalizedScenarioKey(item);
  if (vignette) keys.push(vignette);
  return keys;
}
