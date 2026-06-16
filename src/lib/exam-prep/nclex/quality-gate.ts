/**
 * NCLEX full-exam item quality assessment — wraps board QA gates.
 */
import type { BankItem } from "@/lib/question-bank";
import { assessNclexItemQuality } from "../nclex-quality-gate";
import { assessNclexCuratedSeedItem } from "../nclex-curated-seeds-quality";
import { nclexBankItemIsServeReady } from "../nclex-serve-gate";
import type { EnrichedBankItem } from "../seed-helpers";

export type NclexFullExamQcReport = {
  ok: boolean;
  tier: "best" | "acceptable" | "reject";
  score: number;
  issues: string[];
};

export function assessNclexFullExamItem(
  item: BankItem,
  index: number
): NclexFullExamQcReport {
  const issues: string[] = [];

  const verdict = assessNclexItemQuality(item, { source: "ai-curated" });
  if (verdict.tier === "reject") {
    issues.push(...verdict.issues);
  }

  if (!nclexBankItemIsServeReady(item)) {
    issues.push("serve_gate_fail");
  }

  const explanation = item.explanation?.trim() ?? "";
  if (explanation.length < 120) issues.push("explanation_too_short");
  if (!/Why other options are incorrect/i.test(explanation)) {
    issues.push("missing_distractor_rationales");
  }

  const vignette = item.vignette?.trim() ?? "";
  if (vignette.length < 40) issues.push("missing_vignette");

  const enriched = item as EnrichedBankItem;
  const seedIssues = assessNclexCuratedSeedItem(enriched, index);
  for (const si of seedIssues) {
    if (!issues.includes(si.code)) issues.push(si.code);
  }

  const uniqueIssues = [...new Set(issues)];
  const ok = uniqueIssues.length === 0 && verdict.tier === "best";

  return {
    ok,
    tier: ok ? "best" : verdict.tier,
    score: verdict.score,
    issues: uniqueIssues,
  };
}

export function nclexFullExamItemPasses(item: BankItem, index: number): boolean {
  return assessNclexFullExamItem(item, index).ok;
}
