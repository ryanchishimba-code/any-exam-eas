/**
 * NAPLEX full-exam item quality assessment — wraps board QA gates.
 */
import type { BankItem } from "@/lib/question-bank";
import { polishNaplexBankItem } from "@/lib/engine/polish/naplex-polish";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../naplex-quality-gate";
import { naplexBankItemIsServeReady } from "../naplex-serve-gate";

export type NaplexFullExamQcReport = {
  ok: boolean;
  tier: "best" | "acceptable" | "reject";
  score: number;
  issues: string[];
};

const NAPLEX_2026_PREFIX = "naplex-2026-";

export function assessNaplexFullExamItem(
  item: BankItem,
  index: number
): NaplexFullExamQcReport {
  const issues: string[] = [];
  const subjectId = item.subjectId ?? "pharmacology";
  const polished = polishNaplexBankItem(item, subjectId, subjectId, index);
  const normalized = polished.item;

  const verdict = assessNaplexItemQuality(normalized, { source: "ai-curated" });
  if (verdict.tier === "reject") {
    issues.push(...verdict.issues);
  }

  if (!naplexBankItemIsServeReady(normalized, { source: "ai-curated" })) {
    issues.push("serve_gate_fail");
  }

  const explanation = normalized.explanation?.trim() ?? "";
  const itemType = normalized.itemType ?? "vignette";
  const minExplanation =
    itemType === "constructed_response" ? 80 : itemType === "select_all" ? 120 : 140;

  if (explanation.length < minExplanation) issues.push("explanation_too_short");

  const hasDistractorTeaching =
    /why (each|other|the other) (option|choice|distractor)/i.test(explanation) ||
    /incorrect because/i.test(explanation) ||
    Boolean(normalized.distractorRationale);

  if (itemType !== "constructed_response" && !hasDistractorTeaching) {
    issues.push("missing_distractor_rationales");
  }

  const vignette = normalized.vignette?.trim() ?? "";
  if (itemType !== "constructed_response" && vignette.length < 40) {
    issues.push("missing_vignette");
  }

  const domain = normalized.blueprintDomain ?? "";
  if (!domain.startsWith(NAPLEX_2026_PREFIX)) {
    issues.push("blueprint_domain_2026");
  }

  const uniqueIssues = [...new Set(issues)];
  const bestOk = isNaplexBestQuality(normalized, { source: "ai-curated" });
  const ok = uniqueIssues.length === 0 && bestOk;

  return {
    ok,
    tier: ok ? "best" : verdict.tier,
    score: verdict.score,
    issues: uniqueIssues,
  };
}

export function naplexFullExamItemPasses(item: BankItem, index: number): boolean {
  return assessNaplexFullExamItem(item, index).ok;
}
