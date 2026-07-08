/**
 * Calculation-specific QA for NAPLEX Study Hub topic practice.
 */
import type { BankItem } from "@/lib/question-bank";
import { resolveNaplexStem, resolveNaplexVignette } from "../naplex-bank-audit";
import {
  calculationContextSupportsStem,
  detectNaplexFormatIssues,
  orphanGenericCalcStemIssue,
} from "../naplex-format-coherence";

const CALC_LEAD_IN =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

export const NAPLEX_CALC_TOPIC_SLUGS = [
  "calculations-workshop",
  "calculations-drip-rates",
  "calculations-creatinine-clearance",
  "compounding-basics",
] as const;

export type NaplexCalcTopicSlug = (typeof NAPLEX_CALC_TOPIC_SLUGS)[number];

const MCQ_ONLY_LEAD_IN =
  /\b(?:which (?:finding|action|medication|intervention|recommendation|counseling|monitoring|drug|alternative|statement|laboratory|adjustment|therapeutic)|most appropriate|best choice|best next|next best step|what is the most appropriate)\b/i;

export function isNaplexCalculationItem(item: BankItem): boolean {
  const stem = resolveNaplexStem(item);
  const tagList = (item.tags ?? []).map((t) => t.toLowerCase());
  const hasCalcTag = tagList.some((t) => t === "calculation" || t === "case-calculation");
  const calcStem = CALC_LEAD_IN.test(stem);

  if (item.itemType !== "constructed_response" && !hasCalcTag && !calcStem) {
    return false;
  }

  if (MCQ_ONLY_LEAD_IN.test(stem) && !calcStem) return false;

  if (item.itemType === "constructed_response") {
    return calcStem || hasCalcTag;
  }
  if (hasCalcTag) return true;
  if (calcStem) return true;
  return false;
}

const IV_RATE_PATTERN =
  /\b(?:mL\/hr|ml\/hr|infusion (?:rate|pump)|drip rate|IV rate|mcg\/kg\/min|mg\/kg\/min|drops per minute|gtt\/min)\b/i;

const CRCL_PATTERN =
  /\b(?:CrCl|creatinine clearance|Cockcroft[- ]Gault|cockcroft|renal dose|adjust(?:ed|ment)? (?:for|in) renal|eGFR|SCr|serum creatinine)\b/i;

const COMPOUNDING_PATTERN =
  /\b(?:compounding|alligation|C1V1|USP <797>|USP <795>|beyond-use|BUD|reconstitut|triturat|mortar|ointment base|suppository mold)\b/i;

/** True when a calc item fits the Study Hub calc subtopic (drip vs CrCl vs compounding). */
export function matchesNaplexCalcSubtopic(item: BankItem, topicSlug: string): boolean {
  if (!isNaplexCalculationItem(item)) {
    if (topicSlug === "compounding-basics") {
      const text = [resolveNaplexVignette(item), resolveNaplexStem(item), item.question]
        .filter(Boolean)
        .join(" ");
      return COMPOUNDING_PATTERN.test(text);
    }
    return false;
  }

  const text = [resolveNaplexVignette(item), resolveNaplexStem(item), item.question]
    .filter(Boolean)
    .join(" ");

  switch (topicSlug) {
    case "calculations-drip-rates":
      return (
        isNaplexCalculationItem(item) &&
        (IV_RATE_PATTERN.test(text) || /at what rate|infusion pump|mL\/hr/i.test(resolveNaplexStem(item)))
      );
    case "calculations-creatinine-clearance": {
      const stem = resolveNaplexStem(item);
      const blob = [resolveNaplexVignette(item), stem, item.question].filter(Boolean).join(" ");
      if (!/\b(?:CrCl|creatinine clearance|Cockcroft)/i.test(blob)) return false;
      if (isNaplexCalculationItem(item)) return true;
      return /\b(?:CrCl|creatinine clearance|Cockcroft)/i.test(stem);
    }
    case "compounding-basics":
      return COMPOUNDING_PATTERN.test(text) || /how many (?:tablets|capsules)|concentration in mg\/mL/i.test(text);
    case "calculations-workshop":
      return true;
    default:
      return true;
  }
}

export type NaplexCalcQaResult = {
  isCalc: boolean;
  subtopicMatch: boolean;
  solvable: boolean;
  formatOk: boolean;
  issues: string[];
};

/** Score a bank item for NAPLEX calculation topic practice QA. */
export function assessNaplexCalcTopicItem(
  item: BankItem,
  topicSlug: string
): NaplexCalcQaResult {
  const isCalc = isNaplexCalculationItem(item);
  const subtopicMatch = matchesNaplexCalcSubtopic(item, topicSlug);
  const solvable = isCalc ? calculationContextSupportsStem(item) : subtopicMatch;
  const formatIssues = detectNaplexFormatIssues(item);
  const orphan = orphanGenericCalcStemIssue(item);
  const issues = [
    ...formatIssues.map((i) => i.code),
    ...(orphan?.codes ?? []),
  ];
  const formatOk = !orphan && formatIssues.every((i) => i.severity !== "error");

  return {
    isCalc,
    subtopicMatch,
    solvable,
    formatOk,
    issues,
  };
}

export function isNaplexCalcTopicSlug(slug: string): slug is NaplexCalcTopicSlug {
  return (NAPLEX_CALC_TOPIC_SLUGS as readonly string[]).includes(slug);
}
