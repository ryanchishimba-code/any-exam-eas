/**
 * Calculation-specific QA for NAPLEX Study Hub topic practice.
 * Item matching lives in naplex-calc-match.ts so practice start does not
 * load the format-audit graph.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  calculationContextSupportsStem,
  detectNaplexFormatIssues,
  orphanGenericCalcStemIssue,
} from "../naplex-format-coherence";
import {
  isNaplexCalculationItem,
  matchesNaplexCalcSubtopic,
} from "./naplex-calc-match";

export {
  isNaplexCalcTopicSlug,
  isNaplexCalculationItem,
  matchesNaplexCalcSubtopic,
  NAPLEX_CALC_TOPIC_SLUGS,
} from "./naplex-calc-match";
export type { NaplexCalcTopicSlug } from "./naplex-calc-match";

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
