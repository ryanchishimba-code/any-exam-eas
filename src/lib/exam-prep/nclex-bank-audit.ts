/**
 * Editorial audit for NCLEX (nursing field) bank items — vignette/stem alignment,
 * stable-vs-unstable contradictions, and delegation/priority mismatches.
 */
import type { BankItem } from "@/lib/question-bank";
import { hasOrphanDeicticStem } from "@/lib/engine/prompts/vignette";

export type NclexAuditIssue = {
  code: string;
  message: string;
  severity: "error" | "warn";
};

export type NclexAuditReport = {
  ok: boolean;
  issues: NclexAuditIssue[];
};

export type NclexAuditItemReport = NclexAuditReport & {
  itemId?: string;
  subjectId?: string;
};

const UNSTABLE_VITAL_CUES =
  /SpO₂?\s*(?:8[0-9]|7[0-9])%|peak flow\s*(?:[1-4]?\d)%\s*of personal best|intercostal retractions|speaking in short phrases|RR\s*(?:3[0-9]|[4-9]\d)|altered mental|GCS\s*\d+\s*\/|BP\s*(?:7[0-9]|8[0-9])\s*\/\s*(?:4[0-9]|5[0-9])|lactate\s*[3-9]/i;

const STABLE_ASSERTION = /stable after initial assessment|alert and oriented|pain rated [12]\/10|asymptomatic|due for routine|discharge teaching only/i;

export function resolveNclexVignette(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  if (vignette) return vignette;
  const q = item.question?.trim() ?? "";
  if (q.includes("\n\n")) {
    const head = q.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 30) return head;
  }
  return "";
}

export function resolveNclexStem(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const q = item.question?.trim() ?? "";
  if (vignette && q.startsWith(vignette)) {
    return q.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
  }
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    if (parts.length >= 2 && (parts[0]?.length ?? 0) >= 30) {
      return parts.slice(1).join("\n\n").trim();
    }
  }
  return q;
}

export function auditNclexBankItem(item: BankItem): NclexAuditReport {
  const issues: NclexAuditIssue[] = [];
  const push = (severity: NclexAuditIssue["severity"], code: string, message: string) =>
    issues.push({ severity, code, message });

  const vignette = resolveNclexVignette(item);
  const stem = resolveNclexStem(item);
  const blob = `${vignette}\n${stem}`;

  if (STABLE_ASSERTION.test(blob) && UNSTABLE_VITAL_CUES.test(vignette || blob)) {
    push(
      "error",
      "stable_unstable_mismatch",
      "Vignette claims stability but documents unstable vitals or respiratory distress cues."
    );
  }

  if (/delegate|UAP|unlicensed assistive personnel/i.test(stem)) {
    if (!/UAP|unlicensed assistive personnel|assign tasks to/i.test(blob)) {
      push(
        "error",
        "delegation_context_missing",
        "Delegation stem lacks UAP assignment context in the vignette."
      );
    }
    if (/Handoff report —/i.test(vignette)) {
      push(
        "error",
        "delegation_prioritization_mismatch",
        "Multi-client handoff vignette paired with a single-client delegation stem."
      );
    }
    if (/shift handoff|handoff report|During handoff/i.test(vignette)) {
      push(
        "error",
        "delegation_handoff_mismatch",
        "Shift handoff vignette paired with a delegation stem."
      );
    }
  }

  if (/assessed first|see first|highest priority/i.test(stem) && /assign tasks to UAP/i.test(vignette)) {
    push(
      "error",
      "priority_delegation_mismatch",
      "Priority lead-in paired with a delegation-only vignette."
    );
  }

  if (
    /Pediatric|pediatric/i.test(vignette) &&
    /\b(?:1[89]|[2-9]\d)-year-old (?:man|woman)\b/.test(vignette) &&
    /asthma|wheeze|retractions/i.test(vignette)
  ) {
    push(
      "warn",
      "pediatric_age_mismatch",
      "Pediatric setting with adult age label — likely polish age bump artifact."
    );
  }

  if (vignette && stem && stem.includes(vignette.slice(0, Math.min(60, vignette.length)))) {
    push("warn", "duplicate_vignette_in_stem", "Question stem repeats vignette text already shown above.");
  }

  if (!vignette && stem.length > 120 && !/Handoff report/i.test(stem)) {
    push("warn", "missing_vignette_split", "Long clinical text may belong in scenario, not the stem alone.");
  }

  if (hasOrphanDeicticStem({ question: stem, vignette })) {
    push("error", "orphan_deictic_stem", 'Stem references "these findings" without an preceding vignette.');
  }

  if (item.options.length === 4 && !item.options.includes(item.correctAnswer)) {
    push("error", "correct_not_in_options", "correctAnswer must match one option exactly.");
  }

  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, issues };
}

export function auditNclexBankItems(items: BankItem[]): {
  ok: boolean;
  total: number;
  errorCount: number;
  warnCount: number;
  byCode: Record<string, number>;
  samples: Array<{ index: number; subjectId?: string; issues: NclexAuditIssue[] }>;
} {
  let errorCount = 0;
  let warnCount = 0;
  const byCode: Record<string, number> = {};
  const samples: Array<{ index: number; subjectId?: string; issues: NclexAuditIssue[] }> = [];

  for (let i = 0; i < items.length; i++) {
    const report = auditNclexBankItem(items[i]!);
    for (const issue of report.issues) {
      byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
      if (issue.severity === "error") errorCount++;
      else warnCount++;
    }
    if (report.issues.some((x) => x.severity === "error") && samples.length < 25) {
      samples.push({ index: i, subjectId: items[i]?.subjectId, issues: report.issues });
    }
  }

  return {
    ok: errorCount === 0,
    total: items.length,
    errorCount,
    warnCount,
    byCode,
    samples,
  };
}

export function summarizeNclexAudit(results: NclexAuditItemReport[]): {
  total: number;
  pass: number;
  fail: number;
  bySeverity: Record<string, number>;
  byCode: Record<string, number>;
} {
  let pass = 0;
  let fail = 0;
  const bySeverity: Record<string, number> = {};
  const byCode: Record<string, number> = {};

  for (const result of results) {
    if (result.ok) pass++;
    else fail++;

    for (const issue of result.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1;
      byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;
    }
  }

  return { total: results.length, pass, fail, bySeverity, byCode };
}
