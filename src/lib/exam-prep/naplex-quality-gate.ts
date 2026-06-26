import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { auditNaplexBankItem, resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";
import { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";
import { scoreNaplexBankItem } from "@/lib/engine/polish/naplex-polish";
import { isNaplexCuratedItem } from "@/lib/question-bank/naplex-curated";

/** Minimum quality score to serve in practice (UWorld-tier bar). */
export const NAPLEX_BEST_MIN_SCORE = 0.72;

/** Warn-level issues that block "best only" serving even if audit passes. */
const BLOCKING_WARN_CODES = new Set([
  "duplicate_vignette_in_stem",
  "naplex_stem_lead_in",
  "naplex_explanation_short",
  "naplex_controlled_substance_mismatch",
  "naplex_stem_option_mismatch",
]);

export type NaplexQualityVerdict = {
  ok: boolean;
  score: number;
  tier: "best" | "acceptable" | "reject";
  issues: string[];
};

export function assessNaplexItemQuality(
  item: BankItem,
  opts?: { source?: string | null }
): NaplexQualityVerdict {
  const normalized = normalizeNaplexBankItemFields(item);
  const score = scoreNaplexBankItem(normalized);
  const issues: string[] = [];

  const shared = auditBankItem(normalized, "pharmacy");
  const naplex = auditNaplexBankItem(normalized);

  if (!shared.ok) {
    issues.push(...shared.issues.filter((i) => i.severity === "error").map((i) => i.code));
  }
  if (!naplex.ok) {
    issues.push(...naplex.issues.filter((i) => i.severity === "error").map((i) => i.code));
  }

  for (const issue of shared.issues) {
    if (issue.severity === "warn" && BLOCKING_WARN_CODES.has(issue.code)) {
      issues.push(issue.code);
    }
  }
  for (const issue of naplex.issues) {
    if (issue.severity === "warn" && BLOCKING_WARN_CODES.has(issue.code)) {
      issues.push(issue.code);
    }
  }

  const vignette = resolveNaplexVignette(normalized);
  const itemType = normalized.itemType ?? "mcq";
  const nonMcqFormat = new Set([
    "select_all",
    "sata",
    "ordered_response",
    "constructed_response",
    "drag_drop",
    "k_type",
    "exhibit",
  ]);

  if (!nonMcqFormat.has(itemType)) {
    const stem = resolveNaplexStem(normalized);
    const hasExhibit = Boolean(normalized.ngnPayload?.table || normalized.ngnPayload?.kind === "exhibit");
    if ((!vignette || vignette.length < 40) && stem.length < 80 && !hasExhibit) {
      issues.push("missing_vignette");
    }
  } else if (itemType === "constructed_response" && (!vignette || vignette.length < 20)) {
    issues.push("missing_vignette");
  }

  const minExplanation =
    itemType === "constructed_response" ? 40 : itemType === "case_based" ? 80 : 100;
  if ((normalized.explanation?.trim().length ?? 0) < minExplanation) {
    issues.push("explanation_too_short");
  }

  const curated = isNaplexCuratedItem({
    tags: normalized.tags,
    source: opts?.source ?? null,
  });

  let tier: NaplexQualityVerdict["tier"] = "reject";
  const minAcceptableScore =
    itemType === "constructed_response" ? 0.5 : itemType === "select_all" || itemType === "sata" ? 0.55 : 0.62;

  if (issues.length === 0 && score >= NAPLEX_BEST_MIN_SCORE) {
    tier = curated || score >= 0.78 ? "best" : "acceptable";
  } else if (issues.length === 0 && score >= minAcceptableScore) {
    tier = "acceptable";
  }

  const ok = tier === "best" || tier === "acceptable";

  return {
    ok,
    score,
    tier,
    issues: [...new Set(issues)],
  };
}

/** Strict bar: only best-tier items should be served to students. */
export function isNaplexBestQuality(
  item: BankItem,
  opts?: { source?: string | null }
): boolean {
  const verdict = assessNaplexItemQuality(item, opts);
  return verdict.tier === "best";
}

export function passesNaplexServeGate(
  item: BankItem,
  opts?: { source?: string | null; bestOnly?: boolean }
): boolean {
  const verdict = assessNaplexItemQuality(item, opts);
  if (opts?.bestOnly) return verdict.tier === "best";
  return verdict.ok;
}
