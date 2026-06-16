/**
 * A+ MPJE editorial gate — scenario vignettes, board-style lead-ins, cited rationale.
 * Score tiers align with physician-educator review rubric:
 *   best (≥8.5) serve | acceptable (6.5–8.4) rewrite queue | reject (<6.5) archive
 */
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";

export const MPJE_BEST_MIN_SCORE = 8.5;
export const MPJE_ACCEPTABLE_MIN_SCORE = 6.5;

const LEAD_IN_PATTERN =
  /(?:most appropriate|most likely|required|prohibited|which of the following|what is the pharmacist|what action|what should|may the pharmacist|must the pharmacist|is it permissible|best describes|how should)/i;

const AGE_PATTERN = /\b\d{1,3}[- ]year[- ]old\b|\b\d{1,3}\s*y\/o\b/i;
const SCENARIO_PATTERN = /\bscenario:\s*/i;
const GENERIC_TEMPLATE_PATTERN =
  /Which federal regulatory requirement takes priority|Which action aligns with the state pharmacy practice act|What is the pharmacist's most appropriate ethical and professional response\?/i;

export type MpjeQualityVerdict = {
  ok: boolean;
  score: number;
  tier: "best" | "acceptable" | "reject";
  issues: string[];
};

export function resolveMpjeVignette(item: BankItem): string {
  const explicit = item.vignette?.trim() || item.scenario?.trim() || "";
  if (explicit) return explicit;
  const q = item.question?.trim() ?? "";
  if (q.includes("\n\n")) {
    const head = q.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 40) return head;
  }
  if (SCENARIO_PATTERN.test(q)) {
    const match = q.match(/^[\s\S]*?(?=What is|Which|How|May|Must|Under|Before|A pharmacist)/i);
    if (match && match[0]!.trim().length >= 40) return match[0]!.trim();
  }
  return "";
}

export function resolveMpjeStem(item: BankItem): string {
  const vignette = resolveMpjeVignette(item);
  const q = item.question?.trim() ?? "";
  if (vignette && q.startsWith(vignette)) {
    return q.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
  }
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    if (parts.length >= 2 && (parts[0]?.length ?? 0) >= 40) {
      return parts.slice(1).join("\n\n").trim();
    }
  }
  return q;
}

function isCuratedMpjeItem(item: BankItem, source?: string | null): boolean {
  const tags = item.tags ?? [];
  return (
    tags.includes("physician-educator") ||
    tags.includes("curated") ||
    tags.includes("physician-educator-batch-01") ||
    source === "seed" && tags.includes("state-substantive")
  );
}

function hasPatientScenario(item: BankItem): boolean {
  const vignette = resolveMpjeVignette(item);
  const stem = resolveMpjeStem(item);
  const blob = `${vignette}\n${stem}\n${item.question ?? ""}`;
  return AGE_PATTERN.test(blob) || SCENARIO_PATTERN.test(blob) || /\bpatient\b/i.test(blob);
}

function scoreMpjeItem(item: BankItem, issues: string[]): number {
  const itemType = item.itemType ?? "mcq";
  const vignette = resolveMpjeVignette(item);
  const stem = resolveMpjeStem(item);
  const explanation = item.explanation?.trim() ?? "";
  const nonMcq = new Set(["k_type", "select_all", "sata", "ordered_response"]);

  let score = 5;

  if (nonMcq.has(itemType)) {
    if (vignette.length >= 40 || hasPatientScenario(item)) score += 1.5;
    if (explanation.length >= 80) score += 1;
    if (explanation.length >= 150) score += 0.5;
    if (item.references?.length) score += 0.5;
    if (isCuratedMpjeItem(item)) score += 1;
    if (explanation.length < 60) score -= 2;
    if (!vignette && !hasPatientScenario(item)) score -= 1;
  } else {
    if (vignette.length >= 60 || (hasPatientScenario(item) && stem.length >= 20)) score += 1.5;
    if (LEAD_IN_PATTERN.test(stem) && stem.includes("?")) score += 1;
    else if (stem.includes("?")) score += 0.5;
    if (explanation.length >= 100) score += 0.5;
    if (explanation.length >= 180) score += 0.5;
    if (explanation.length >= 250) score += 0.5;
    if (item.references?.length) score += 0.5;
    if (/why other|incorrect:|distractor|key takeaway/i.test(explanation)) score += 0.5;
    if (isCuratedMpjeItem(item)) score += 1;

    if (!hasPatientScenario(item) && vignette.length < 40) score -= 2;
    if (!LEAD_IN_PATTERN.test(stem)) score -= 1;
    if (explanation.length < 100) score -= 1.5;
    if (GENERIC_TEMPLATE_PATTERN.test(stem) || GENERIC_TEMPLATE_PATTERN.test(item.question ?? "")) {
      score -= 3;
    }
  }

  if (issues.length > 0) score -= Math.min(3, issues.length * 0.75);

  return Math.round(Math.min(10, Math.max(1, score)) * 10) / 10;
}

export function assessMpjeItemQuality(
  item: BankItem,
  opts?: { source?: string | null }
): MpjeQualityVerdict {
  const issues: string[] = [];
  const itemType = item.itemType ?? "mcq";
  const vignette = resolveMpjeVignette(item);
  const stem = resolveMpjeStem(item);
  const explanation = item.explanation?.trim() ?? "";
  const nonMcq = new Set(["k_type", "select_all", "sata", "ordered_response"]);

  const audit = auditBankItem(item, "aanp-fnp");
  if (!audit.ok) {
    issues.push(...audit.issues.filter((i) => i.severity === "error").map((i) => i.code));
  }

  if (nonMcq.has(itemType)) {
    if (explanation.length < 60) issues.push("explanation_too_short");
    if (!vignette && !hasPatientScenario(item)) issues.push("missing_scenario");
  } else {
    if (explanation.length < 100) issues.push("explanation_too_short");
    if (!hasPatientScenario(item) && vignette.length < 40) issues.push("missing_scenario");
    if (!LEAD_IN_PATTERN.test(stem)) issues.push("missing_lead_in");
    if (!stem.includes("?")) issues.push("missing_question_mark");
  }

  if (GENERIC_TEMPLATE_PATTERN.test(stem) || GENERIC_TEMPLATE_PATTERN.test(item.question ?? "")) {
    issues.push("generic_template");
  }

  const curated = isCuratedMpjeItem(item, opts?.source);
  if (curated && itemType !== "k_type" && itemType !== "select_all" && itemType !== "sata") {
    if (!AGE_PATTERN.test(`${vignette}\n${stem}`) && hasPatientScenario(item)) {
      // soft — patient scenario without age is ok for curated items
    }
  }

  const uniqueIssues = [...new Set(issues)];
  const score = scoreMpjeItem(item, uniqueIssues);

  let tier: MpjeQualityVerdict["tier"] = "reject";
  if (score >= MPJE_BEST_MIN_SCORE && audit.ok && !uniqueIssues.includes("generic_template")) {
    tier = "best";
  } else if (score >= MPJE_ACCEPTABLE_MIN_SCORE && audit.ok) {
    tier = "acceptable";
  }

  return {
    ok: tier !== "reject",
    score,
    tier,
    issues: uniqueIssues,
  };
}

/** Strict bar: only A+ best-tier items are served to students. */
export function isMpjeBestQuality(
  item: BankItem,
  opts?: { source?: string | null }
): boolean {
  return assessMpjeItemQuality(item, opts).tier === "best";
}

export function passesMpjeServeGate(
  item: BankItem,
  opts?: { source?: string | null; hasDbId?: boolean }
): boolean {
  if (opts?.hasDbId === false) return false;
  return isMpjeBestQuality(item, opts);
}
