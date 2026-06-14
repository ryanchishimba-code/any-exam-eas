import type { BankItem } from "@/lib/question-bank";
import type { ExamReference } from "./types";
import {
  getDefaultReferencesForField,
  getGuidelineRulesForField,
  type GuidelineRule,
} from "./guideline-registry";

const GENERIC_REF_LABEL =
  /^(guidelines?|per guidelines?|clinical guidelines?|evidence[- ]based guidelines?|standard of care)$/i;

const GENERIC_ONLY_EXPLANATION =
  /\b(?:per|follow(?:s|ing)?)\s+(?:current\s+)?guidelines?\b/i;

const SOCIETY_IN_EXPLANATION =
  /\b(?:NCSBN|CDC|AHA|ACC\/AHA|ACC|ADA|IDSA|ISMP|ACOG|AAP|APA|Surviving Sepsis|Joint Commission|Brain Trauma|FDA|DEA|USP)\b/i;

export type GuidelineEnrichmentResult = {
  item: BankItem;
  changed: boolean;
  matchedRuleIds: string[];
  referencesAdded: boolean;
  explanationAugmented: boolean;
};

function itemText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    ...(item.options ?? []),
    item.correctAnswer,
    item.tags?.join(" "),
    item.topicCategory,
  ]
    .filter(Boolean)
    .join("\n");
}

function scoreRule(rule: GuidelineRule, text: string, subjectId?: string): number {
  if (!rule.keywords.test(text)) return 0;
  if (rule.strictSubject && rule.subjectIds?.length) {
    if (!subjectId || !rule.subjectIds.includes(subjectId)) return 0;
  }
  let score = rule.priority;
  if (rule.subjectIds?.length && subjectId && rule.subjectIds.includes(subjectId)) {
    score += 4;
  }
  return score;
}

export function matchGuidelineRules(
  fieldId: string,
  item: BankItem
): GuidelineRule[] {
  const rules = getGuidelineRulesForField(fieldId);
  const text = itemText(item);
  const subjectId = item.subjectId;

  return rules
    .map((rule) => ({ rule, score: scoreRule(rule, text, subjectId) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.rule);
}

function dedupeReferences(refs: ExamReference[]): ExamReference[] {
  const seen = new Set<string>();
  const out: ExamReference[] = [];
  for (const ref of refs) {
    const key = ref.label.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ref);
  }
  return out;
}

export function resolveGuidelineReferences(
  fieldId: string,
  item: BankItem,
  maxRefs = 2
): { references: ExamReference[]; matchedRuleIds: string[]; clinicalLine?: string } {
  const matched = matchGuidelineRules(fieldId, item);
  const refs: ExamReference[] = [];
  const matchedRuleIds: string[] = [];

  for (const rule of matched) {
    if (matchedRuleIds.length >= 2) break;
    matchedRuleIds.push(rule.id);
    refs.push(...rule.references);
  }

  if (refs.length === 0) {
    const defaults = getDefaultReferencesForField(fieldId);
    const allRules = getGuidelineRulesForField(fieldId);
    const fallbackRule =
      matched.length === 0
        ? allRules.find((r) => r.subjectIds?.includes(item.subjectId ?? ""))
        : undefined;
    const fallbackRefs = fallbackRule?.references ?? defaults;
    return {
      references: dedupeReferences(fallbackRefs).slice(0, maxRefs),
      matchedRuleIds: fallbackRule ? [fallbackRule.id] : ["default"],
      clinicalLine: fallbackRule?.clinicalLine,
    };
  }

  const topRule = matched[0];
  return {
    references: dedupeReferences(refs).slice(0, maxRefs),
    matchedRuleIds,
    clinicalLine: topRule?.clinicalLine,
  };
}

export function hasStructuredGuidelineReferences(item: BankItem): boolean {
  const refs = item.references;
  if (!refs?.length) return false;
  return refs.some(
    (r) => (r.label?.trim().length ?? 0) >= 8 && !GENERIC_REF_LABEL.test(r.label.trim())
  );
}

export function explanationHasSocietyTieIn(explanation: string): boolean {
  const text = explanation.trim();
  if (!text) return false;
  return SOCIETY_IN_EXPLANATION.test(text);
}

function explanationMentionsReference(explanation: string, ref: ExamReference): boolean {
  const lower = explanation.toLowerCase();
  const label = ref.label.toLowerCase();
  if (lower.includes(label)) return true;
  const short = label.split(/[—–-]/)[0]?.trim();
  if (short && short.length >= 4 && lower.includes(short)) return true;
  if (ref.citation && lower.includes(ref.citation.toLowerCase().slice(0, 24))) return true;
  return false;
}

function appendClinicalBasis(
  explanation: string,
  refs: ExamReference[],
  clinicalLine?: string
): string {
  const base = explanation.trim();
  if (explanationHasSocietyTieIn(base)) return base;
  if (refs.some((r) => explanationMentionsReference(base, r))) return base;

  const basis =
    clinicalLine ??
    refs
      .map((r) => (r.citation ? `${r.label}: ${r.citation}` : r.label))
      .join("; ");

  if (/Why other options are incorrect/i.test(base)) {
    const [head, tail] = base.split(/Why other options are incorrect/i);
    return `${head.trim()}\n\nClinical basis: ${basis}\n\nWhy other options are incorrect${tail ?? ""}`;
  }

  return `${base}\n\nClinical basis: ${basis}`;
}

export function enrichBankItemGuidelines(
  item: BankItem,
  fieldId: string,
  opts?: { augmentExplanation?: boolean; maxRefs?: number }
): GuidelineEnrichmentResult {
  const augmentExplanation = opts?.augmentExplanation ?? true;
  const maxRefs = opts?.maxRefs ?? 2;

  if (hasStructuredGuidelineReferences(item)) {
    return {
      item,
      changed: false,
      matchedRuleIds: [],
      referencesAdded: false,
      explanationAugmented: false,
    };
  }

  const { references, matchedRuleIds, clinicalLine } = resolveGuidelineReferences(
    fieldId,
    item,
    maxRefs
  );

  let explanation = item.explanation ?? "";
  let explanationAugmented = false;

  if (
    augmentExplanation &&
    references.length > 0 &&
    (GENERIC_ONLY_EXPLANATION.test(explanation) || !explanationHasSocietyTieIn(explanation))
  ) {
    const next = appendClinicalBasis(explanation, references, clinicalLine);
    if (next !== explanation) {
      explanation = next;
      explanationAugmented = true;
    }
  }

  const enriched: BankItem = {
    ...item,
    references,
    explanation,
  };

  return {
    item: enriched,
    changed: true,
    matchedRuleIds,
    referencesAdded: true,
    explanationAugmented,
  };
}
