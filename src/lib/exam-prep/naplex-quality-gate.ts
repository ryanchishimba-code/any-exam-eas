import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { auditNaplexBankItem, resolveNaplexVignette } from "./naplex-bank-audit";
import { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";
import { scoreNaplexBankItem } from "@/lib/engine/polish/naplex-polish";
import { isNaplexCuratedItem } from "@/lib/question-bank/naplex-curated";

/** Minimum quality score to serve in practice (UWorld-tier bar). */
export const NAPLEX_BEST_MIN_SCORE = 0.72;

/** Warn-level issues that block "best only" serving even if audit passes. */
const BLOCKING_WARN_CODES = new Set([
  "duplicate_vignette_in_stem",
  "naplex_missing_clinical_data",
  "naplex_stem_lead_in",
  "naplex_explanation_short",
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
  if (!vignette || vignette.length < 40) {
    issues.push("missing_vignette");
  }
  if ((normalized.explanation?.trim().length ?? 0) < 120) {
    issues.push("explanation_too_short");
  }

  const curated = isNaplexCuratedItem({
    tags: normalized.tags,
    source: opts?.source ?? null,
  });

  let tier: NaplexQualityVerdict["tier"] = "reject";
  if (issues.length === 0 && score >= NAPLEX_BEST_MIN_SCORE) {
    tier = curated || score >= 0.78 ? "best" : "acceptable";
  } else if (issues.length === 0 && score >= 0.62) {
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
