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
  "acetaminophen",
  "ibuprofen",
  "albuterol",
  "prednisone",
  "potassium",
];

const CONDITIONS: { id: string; re: RegExp }[] = [
  { id: "myalgia", re: /\bmyalgias?\b|\bmuscle (?:pain|ache|aches|soreness|weakness)\b/ },
  { id: "inr", re: /\binr\b/ },
  { id: "low-supply", re: /\blow (?:milk )?supply\b|\binsufficient milk\b|\bnot enough milk\b/ },
  { id: "breastfeeding", re: /\bbreastfeed|\blactation\b|\bbreast milk\b|\bmilk supply\b/ },
  { id: "gtt", re: /\bglucose tolerance\b|\bgtt\b|\bgestational diabetes\b/ },
  { id: "fasting-glucose", re: /\bfasting (?:glucose|blood sugar|plasma glucose|bg)\b/ },
  { id: "hypokalemia", re: /\bhypokalem|\bpotassium\b|\bserum k\b/ },
];

const INTENTS: { id: string; re: RegExp }[] = [
  { id: "immediate-follow-up", re: /immediate follow-?up|requires? (?:immediate )?follow-?up/ },
  { id: "further-teaching", re: /further teaching|additional teaching|need for teaching/ },
  { id: "therapeutic", re: /therapeutic (?:response|communication)/ },
  { id: "priority", re: /\bpriority\b/ },
  { id: "adverse", re: /adverse effect|side effect|toxicity/ },
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
  // Same drug and the same finding, even when the ask is reworded.
  if (anchors.length >= 2) {
    keys.push(`case:${anchors.join("+")}`);
  }
  return keys;
}
