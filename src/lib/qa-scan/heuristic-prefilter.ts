import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { bankItemPassesIngestGate } from "@/lib/exam-prep/bank-ingest-gate";
import { auditNaplexBankItem } from "@/lib/exam-prep/naplex-bank-audit";
import { auditNclexBankItem } from "@/lib/exam-prep/nclex-bank-audit";
import { auditUsmleQaEditor } from "@/lib/exam-prep/usmle-qa-editor";
import type { BankItem } from "@/lib/question-bank";
import type { HeuristicIssue } from "./types";

export type HeuristicPrefilterResult = {
  ok: boolean;
  issues: HeuristicIssue[];
};

/** Cheap rule-based QA before any LLM call. */
export function runHeuristicPrefilter(
  item: BankItem,
  fieldId: string,
  source: string
): HeuristicPrefilterResult {
  const issues: HeuristicIssue[] = [];

  const shared = auditBankItem(item, fieldId);
  for (const issue of shared.issues) {
    issues.push({ code: issue.code, severity: issue.severity, message: issue.message });
  }

  if (fieldId === "pharmacy") {
    for (const issue of auditNaplexBankItem(item).issues) {
      issues.push({ code: issue.code, severity: issue.severity, message: issue.message });
    }
  } else if (fieldId === "nursing") {
    for (const issue of auditNclexBankItem(item).issues) {
      issues.push({ code: issue.code, severity: issue.severity, message: issue.message });
    }
  } else if (fieldId.startsWith("usmle")) {
    const usmle = auditUsmleQaEditor(item, { fieldId, source, itemId: undefined });
    for (const issue of usmle.issues) {
      issues.push({
        code: issue.code,
        severity: issue.severity === "info" ? "warn" : issue.severity,
        message: issue.message,
      });
    }
    if (usmle.overallScore < 6) {
      issues.push({
        code: "usmle_qa_low_score",
        severity: "warn",
        message: `USMLE editorial score ${usmle.overallScore}/10 below review threshold`,
      });
    }
  }

  const ingestOk = bankItemPassesIngestGate(fieldId, item, source);
  if (!ingestOk) {
    issues.push({
      code: "ingest_gate_fail",
      severity: "error",
      message: "Item fails field ingest/serve structural gate",
    });
  }

  const hasError = issues.some((i) => i.severity === "error");
  return { ok: !hasError && ingestOk, issues };
}
