/**
 * Content-based matching for NAPLEX Study Hub blueprint topics.
 * Registry labels (e.g. "heart failure GDMT") may differ from DB blueprintTopic tags.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  isNaplexCalcTopicSlug,
  isNaplexCalculationItem,
  matchesNaplexCalcSubtopic,
} from "./calc-topic-qa";

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

/** Fuzzy match between DB blueprintTopic and registry label. */
export function naplexBlueprintLabelsMatch(stored: string, allowed: string): boolean {
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

/** Registry blueprint labels → vignette/stem keyword patterns. */
const NAPLEX_BLUEPRINT_KEYWORDS: { label: string; pattern: RegExp }[] = [
  { label: "heart failure GDMT", pattern: /\bheart failure|\bGDMT|\bHFrEF|\bHFpEF|\bsacubitril|\bEntresto|\bspironolactone|\beplerenone|\bSGLT2/i },
  { label: "anticoagulation DOACs", pattern: /\b(?:DOAC|warfarin|apixaban|rivaroxaban|edoxaban|dabigatran|anticoagul|INR|bleeding risk)\b/i },
  { label: "diabetes pharmacotherapy", pattern: /\b(?:diabetes|metformin|insulin|glargine|GLP-1|SGLT2|hypoglycemia|A1C|HbA1c)\b/i },
  { label: "antibiotic stewardship", pattern: /\b(?:antibiotic|antimicrobial|stewardship|de-escalat|culture|MRSA|vancomycin|pip\/tazo|cef|azithro)\b/i },
  { label: "controlled substances", pattern: /\b(?:controlled substance|DEA|PDMP|Schedule II|opioid prescribing|buprenorphine|naloxone)\b/i },
  {
    label: "calculations",
    pattern: /\b(?:calculate|how many|how much|at what rate|mg\/kg|mcg\/kg|tablets?|mL\/hr|concentration|alligation|day supply)\b/i,
  },
  { label: "IV rates", pattern: /\b(?:mL\/hr|infusion (?:rate|pump)|drip rate|IV rate|mcg\/kg\/min|mg\/kg\/min)\b/i },
  { label: "asthma COPD inhalers", pattern: /\b(?:asthma|COPD|inhaler|albuterol|ICS|LABA|tiotropium|peak flow|bronchodilator)\b/i },
  { label: "psychotropic monitoring", pattern: /\b(?:lithium|valproate|clozapine|antipsychotic|antidepressant|serotonin syndrome|ECG.*(?:QT|qtc)|therapeutic level)\b/i },
  {
    label: "renal dose adjustment",
    pattern: /\b(?:CrCl|creatinine clearance|Cockcroft|renal (?:dose|impairment|adjust)|CKD|dialysis|eGFR|SCr|serum creatinine)\b/i,
  },
  { label: "toxicology antidotes", pattern: /\b(?:antidote|NAC|acetaminophen (?:overdose|toxicity)|naloxone|flumazenil|digoxin Fab|fomepizole|toxicology|overdose|poison(?:ing)?|salicylate toxicity|methanol|ethylene glycol|iron poisoning)\b/i },
  {
    label: "special populations",
    pattern: /\b(?:pregnancy|lactation|breastfeed|geriatric|elderly|BEERS|pediatric|neonat|OB\b|trimester)\b/i,
  },
  { label: "TDM", pattern: /\b(?:TDM|therapeutic drug monitoring|trough level|peak level|AUC|vancomycin level|phenytoin level|digoxin level|lithium level|theophylline level|aminoglycoside.*(?:peak|trough)|subtherapeutic|supratherapeutic|therapeutic range)\b/i },
  { label: "GERD PUD IBD", pattern: /\b(?:GERD|PUD|IBD|Crohn|ulcerative colitis|PPI|H\. pylori|omeprazole)\b/i },
  { label: "NNT/ARR", pattern: /\b(?:NNT|NNH|ARR|absolute risk|relative risk|number needed)\b/i },
  { label: "biostatistics", pattern: /\b(?:biostatistic|confidence interval|p-value|meta-analysis|cohort study|RCT)\b/i },
  { label: "hypertension guidelines", pattern: /\b(?:hypertension|ACE inhibitor|ARB|amlodipine|thiazide|blood pressure|JNC|ACC\/AHA)\b/i },
  { label: "CYP interactions", pattern: /\b(?:CYP|cytochrome|drug interaction|QT prolongation|strong inhibitor|strong inducer)\b/i },
  { label: "medication safety", pattern: /\b(?:medication safety|ISMP|high-alert|look-alike|sound-alike|error prevention|LASA|adverse (?:drug )?reaction|anaphylaxis|angioedema|rhabdomyolysis|agranulocytosis|Stevens-Johnson|hepatotoxicity)\b/i },
  { label: "patient counseling", pattern: /\b(?:counsel|counseling|patient education|adherence|side effect|how to take|missed dose)\b/i },
  { label: "immunizations", pattern: /\b(?:immuniz|vaccin|MMR|influenza vaccine|pneumococcal|Shingrix|HPV vaccine|Tdap|Prevnar|VIS\b|vaccine schedule|live vaccine|inactivated vaccine)\b/i },
  { label: "compounding", pattern: /\b(?:compound|compounding|alligation|C1V1|reconstitut|triturat|suppository|ointment)\b/i },
  { label: "USP compounding", pattern: /\b(?:USP <797>|USP <795>|beyond-use|BUD|sterile compounding|nonsterile compounding)\b/i },
  { label: "OTC self-care", pattern: /\b(?:OTC|over-the-counter|self-care|pseudoephedrine|diphenhydramine|loperamide)\b/i },
  { label: "HIV prophylaxis", pattern: /\b(?:HIV|PrEP|PEP\b|ART\b|antiretroviral|CD4|viral load|opportunistic infection|tenofovir|emtricitabine|bictegravir|dolutegravir|abacavir|lamivudine|PJP|pneumocystis|toxoplasma)\b/i },
  { label: "dispensing verification", pattern: /\b(?:dispens|prescription verification|sig code|abbreviation|labeling|DAW|refill)\b/i },
  { label: "PK/PD", pattern: /\b(?:pharmacokinetic|pharmacodynamic|half-life|clearance|volume of distribution|bioavailability|protein binding)\b/i },
  { label: "dyslipidemia", pattern: /\b(?:statin|dyslipidemia|LDL|HDL|triglyceride|ezetimibe|PCSK9)\b/i },
  { label: "oncology toxicities", pattern: /\b(?:chemotherapy|neutropenia|emesis|cisplatin|doxorubicin|filgrastim|oncology)\b/i },
  { label: "epilepsy", pattern: /\b(?:seizure|epilepsy|phenytoin|levetiracetam|valproate|carbamazepine|lamotrigine)\b/i },
  { label: "thyroid", pattern: /\b(?:hypothyroid|hyperthyroid|levothyroxine|Synthroid|methimazole|propylthiouracil|TSH\b|T4\b|T3\b|thyroid (?:storm|nodule|replacement))\b/i },
  { label: "pain opioids", pattern: /\b(?:opioid|morphine|hydrocodone|oxycodone|pain management|naloxone|PDMP)\b/i },
  { label: "pediatrics", pattern: /\b(?:pediatric|infant|child|neonat|mg\/kg|weight-based|school-age)\b/i },
  { label: "hepatitis liver", pattern: /\b(?:hepatitis|liver disease|cirrhosis|HCV|HBV|ascites|hepatic encephalopathy|variceal|sofosbuvir|ledipasvir|ribavirin|NAFLD|NASH)\b/i },
  { label: "pharmacogenomics", pattern: /\b(?:pharmacogenomic|CYP2D6|CYP2C19|HLA-B|TPMT|genotype-guided)\b/i },
  { label: "ISMP high-alert", pattern: /\b(?:ISMP|high-alert|insulin|heparin|chemotherapy|neuromuscular block)\b/i },
  { label: "HIPAA", pattern: /\b(?:HIPAA|protected health information|PHI|privacy|breach notification)\b/i },
  { label: "ethics", pattern: /\b(?:ethical|autonomy|beneficence|conflict of interest|moral|professional responsibility)\b/i },
  { label: "inventory", pattern: /\b(?:inventory|stock|par level|ordering|wholesaler|340B)\b/i },
  { label: "formulary", pattern: /\b(?:formulary|P&T|therapeutic interchange|preferred agent)\b/i },
  { label: "reimbursement", pattern: /\b(?:reimbursement|copay|prior authorization|Medicare Part D|AWP|MAC pricing|DIR fee|NADAC|340B)\b/i },
  { label: "contraception", pattern: /\b(?:contracept|oral contraceptive|OCP\b|IUD|emergency contraception|plan B|levonorgestrel|ulipristal|Ella\b|depo|progestin-only|birth control)\b/i },
  { label: "pneumonia CAP", pattern: /\b(?:pneumonia|CAP|community-acquired|CURB-65|azithromycin|ceftriaxone)\b/i },
];

const KEYWORD_BY_LABEL = new Map(NAPLEX_BLUEPRINT_KEYWORDS.map((e) => [e.label, e.pattern]));

const BLUEPRINT_EXCLUSIONS: Partial<Record<string, RegExp>> = {
  calculations: /\b(?:which (?:recommendation|action|medication)|most appropriate counseling)\b/i,
  "renal dose adjustment": /\b(?:heart failure GDMT|asthma inhaler)\b/i,
  pediatrics: /\b(?:postmenopausal|geriatric BEERS in 8\d-year)\b/i,
  "heart failure GDMT": /\b(?:CrCl|creatinine clearance|Cockcroft)\b/i,
};

export type NaplexBlueprintMatchOpts = {
  topicSlug?: string;
};

/** True when item content aligns with a Study Hub blueprint label. */
export function matchesNaplexBlueprintTopic(
  item: BankItem,
  blueprintLabel: string,
  opts?: NaplexBlueprintMatchOpts
): boolean {
  if (
    opts?.topicSlug &&
    isNaplexCalcTopicSlug(opts.topicSlug) &&
    blueprintLabel === "calculations"
  ) {
    return isNaplexCalculationItem(item) && matchesNaplexCalcSubtopic(item, opts.topicSlug);
  }

  if (
    opts?.topicSlug === "calculations-creatinine-clearance" &&
    blueprintLabel === "renal dose adjustment"
  ) {
    return matchesNaplexCalcSubtopic(item, opts.topicSlug);
  }

  if (
    opts?.topicSlug === "calculations-drip-rates" &&
    (blueprintLabel === "IV rates" || blueprintLabel === "calculations")
  ) {
    return matchesNaplexCalcSubtopic(item, opts.topicSlug);
  }

  if (
    opts?.topicSlug === "compounding-basics" &&
    (blueprintLabel === "compounding" || blueprintLabel === "USP compounding")
  ) {
    return matchesNaplexCalcSubtopic(item, opts.topicSlug);
  }

  const text = itemText(item);
  const exclusion = BLUEPRINT_EXCLUSIONS[blueprintLabel];
  if (exclusion?.test(text)) return false;

  const stored = item.blueprintTopic?.trim();
  if (stored && naplexBlueprintLabelsMatch(stored, blueprintLabel)) return true;

  const pattern = KEYWORD_BY_LABEL.get(blueprintLabel);
  const contentMatch = pattern ? pattern.test(text) : false;
  if (!contentMatch) return false;

  if (blueprintLabel === "calculations" && opts?.topicSlug && isNaplexCalcTopicSlug(opts.topicSlug)) {
    return matchesNaplexCalcSubtopic(item, opts.topicSlug);
  }

  if (opts?.topicSlug === "calculations-workshop" && blueprintLabel === "calculations") {
    return isNaplexCalculationItem(item);
  }

  return true;
}

/** Keep items matching any allowed blueprint label (tag or content). */
export function filterItemsForNaplexBlueprintTopics(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean; topicSlug?: string }
): BankItem[] {
  if (blueprintTopics.length === 0) return items;

  return items.filter((item) => {
    const stored = item.blueprintTopic?.trim();
    if (stored && blueprintTopics.some((label) => naplexBlueprintLabelsMatch(stored, label))) {
      return true;
    }
    if (!opts?.contentMatch) return false;
    return blueprintTopics.some((label) =>
      matchesNaplexBlueprintTopic(item, label, { topicSlug: opts?.topicSlug })
    );
  });
}

export function countNaplexBlueprintTopicMatches(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean; topicSlug?: string }
): number {
  return filterItemsForNaplexBlueprintTopics(items, blueprintTopics, opts).length;
}
