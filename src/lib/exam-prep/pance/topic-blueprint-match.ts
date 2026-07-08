/**
 * Content-based matching for PANCE Study Hub blueprint labels.
 * Registry labels (e.g. "ACS", "heart failure") may differ from DB blueprintTopic tags.
 */
import type { BankItem } from "@/lib/question-bank";

function itemText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    ...(item.options ?? []),
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeBlueprintLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s/<>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function panceBlueprintLabelsMatch(stored: string, allowed: string): boolean {
  const a = normalizeBlueprintLabel(stored);
  const b = normalizeBlueprintLabel(allowed);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  const aWords = new Set(a.split(" ").filter((w) => w.length > 2));
  const bWords = b.split(" ").filter((w) => w.length > 2);
  if (bWords.length === 0) return false;
  const overlap = bWords.filter((w) => aWords.has(w)).length;
  return overlap >= Math.min(2, bWords.length);
}

const PANCE_BLUEPRINT_KEYWORDS: { label: string; pattern: RegExp }[] = [
  { label: "ACS", pattern: /\b(?:STEMI|NSTEMI|ACS|acute coronary|troponin|chest pain)\b/i },
  { label: "heart failure", pattern: /\b(?:heart failure|HFrEF|HFpEF|GDMT|furosemide)\b/i },
  { label: "hypertension", pattern: /\b(?:hypertension|blood pressure|ACE inhibitor|amlodipine)\b/i },
  { label: "AFib", pattern: /\b(?:atrial fibrillation|AFib|anticoagul|rate control)\b/i },
  { label: "PE/DVT", pattern: /\b(?:pulmonary embol|DVT|PE\b|anticoagul|Wells score)\b/i },
  { label: "asthma", pattern: /\b(?:asthma|albuterol|bronchodilator|peak flow)\b/i },
  { label: "COPD", pattern: /\b(?:COPD|emphysema|chronic bronchitis|GOLD)\b/i },
  { label: "pneumonia", pattern: /\b(?:pneumonia|CAP|consolidation|antibiotic.*pneumonia)\b/i },
  { label: "diabetes", pattern: /\b(?:diabetes|DKA|HHS|insulin|metformin|A1c|HbA1c)\b/i },
  { label: "stroke", pattern: /\b(?:stroke|tPA|alteplase|TIA|NIHSS)\b/i },
  { label: "sepsis", pattern: /\b(?:sepsis|septic shock|lactate|vasopressor)\b/i },
  { label: "UTI", pattern: /\b(?:UTI|urinary tract|dysuria|pyelonephritis|cystitis)\b/i },
  { label: "depression", pattern: /\b(?:depression|SSRI|PHQ|suicidal ideation)\b/i },
  { label: "melanoma", pattern: /\b(?:melanoma|ABCDE|skin cancer|biopsy.*lesion)\b/i },
  { label: "cellulitis", pattern: /\b(?:cellulitis|abscess|skin infection|MRSA)\b/i },
  { label: "informed consent", pattern: /\b(?:informed consent|capacity|autonomy|shared decision)\b/i },
  { label: "prescription sig", pattern: /\b(?:sig code|abbreviation|BID|TID|PRN|prescription order)\b/i },
  { label: "osteoarthritis", pattern: /\b(?:osteoarthritis|OA\b|joint pain|NSAID)\b/i },
  { label: "low back pain", pattern: /\b(?:low back pain|radiculopathy|sciatica|red flag.*back)\b/i },
  { label: "GERD", pattern: /\b(?:GERD|reflux|PPI|omeprazole|heartburn)\b/i },
  { label: "IBD", pattern: /\b(?:Crohn|ulcerative colitis|IBD|inflammatory bowel)\b/i },
  { label: "opioid", pattern: /\b(?:opioid|controlled substance|DEA|PDMP|Schedule II|naloxone)\b/i },
  { label: "MRSA", pattern: /\b(?:MRSA|vancomycin|CA-MRSA)\b/i },
  { label: "HIV", pattern: /\b(?:HIV|PrEP|ART|antiretroviral|CD4)\b/i },
  { label: "antibiotic", pattern: /\b(?:antibiotic|empiric|coverage|stewardship)\b/i },
  { label: "shock", pattern: /\b(?:shock|hypotension|vasopressor|septic)\b/i },
];

const KEYWORD_BY_LABEL = new Map(PANCE_BLUEPRINT_KEYWORDS.map((e) => [e.label, e.pattern]));

function labelToPattern(label: string): RegExp {
  const known = KEYWORD_BY_LABEL.get(label);
  if (known) return known;
  const words = label.split(/[\s/]+/).filter((w) => w.length > 2);
  if (words.length === 0) return new RegExp(label.replace(/[^\w]/g, "."), "i");
  return new RegExp(words.map((w) => `\\b${w.replace(/[^\w]/g, "")}`).join("|"), "i");
}

export function matchesPanceBlueprintTopic(item: BankItem, blueprintLabel: string): boolean {
  const text = itemText(item);
  const stored = item.blueprintTopic?.trim();
  if (stored && panceBlueprintLabelsMatch(stored, blueprintLabel)) return true;
  return labelToPattern(blueprintLabel).test(text);
}

export function filterItemsForPanceBlueprintTopics(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean; topicSlug?: string }
): BankItem[] {
  if (blueprintTopics.length === 0) return items;

  return items.filter((item) => {
    const stored = item.blueprintTopic?.trim();
    if (stored && blueprintTopics.some((label) => panceBlueprintLabelsMatch(stored, label))) {
      return true;
    }
    if (!opts?.contentMatch) return false;
    return blueprintTopics.some((label) => matchesPanceBlueprintTopic(item, label));
  });
}
