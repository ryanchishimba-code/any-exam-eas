/**
 * NPTE-PT bank item quality assessment — editorial + blueprint alignment.
 */
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "../bank-audit";
import { splitUsmleBankItem } from "../usmle-clinical-gate";
import { nptePtBankItemIsServeReady } from "./clinical-gate";
import { isNptePtCuratedItem } from "@/lib/question-bank/npte-pt-curated";
import { NPTE_PT_SUBJECTS } from "@/lib/subjects/npte-pt/subjects";
import { NPTE_PT_TASK_CATEGORIES } from "@/lib/edtech/learning-hub/npte-pt-learning-paths";
import { NPTE_PT_MIN_QC_SCORE, type NptePtReviewStatus } from "./types";

export type NptePtQcReport = {
  serveReady: boolean;
  blueprintAligned: boolean;
  difficultyRating: number;
  qcScore: number;
  reviewStatus: NptePtReviewStatus;
  flags: string[];
  issues: string[];
};

const VALID_SUBJECTS = new Set(NPTE_PT_SUBJECTS.map((s) => s.id));
const VALID_TASKS = new Set<string>(NPTE_PT_TASK_CATEGORIES.map((t) => t.id));

export function assessNptePtBankItem(
  item: BankItem,
  opts: { fieldId?: string; source?: string | null } = {}
): NptePtQcReport {
  const fieldId = opts.fieldId ?? "npte-pt";
  const flags: string[] = [];
  const issues: string[] = [];

  const bankAudit = auditBankItem(item, fieldId);
  if (!bankAudit.ok) {
    issues.push(...bankAudit.issues.filter((i) => i.severity === "error").map((i) => i.message));
  }

  const serveReady = nptePtBankItemIsServeReady(item, opts.source ?? item.source);
  if (!serveReady) {
    flags.push("clinical_gate_fail");
    issues.push("Item does not pass clinical vignette serve gate.");
  }

  const subjectId = item.subjectId ?? item.topicCategory ?? "";
  const blueprintAligned = VALID_SUBJECTS.has(subjectId);
  if (!blueprintAligned) {
    flags.push("invalid_content_category");
    issues.push(`Invalid NPTE-PT content category: ${subjectId}`);
  }

  const taskCategory =
    (item.ngnPayload?.taskCategory as string | undefined) ??
    (item as BankItem & { taskCategory?: string }).taskCategory;
  if (taskCategory && !VALID_TASKS.has(taskCategory)) {
    flags.push("invalid_task_category");
    issues.push(`Invalid task category: ${taskCategory}`);
  }

  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette || vignette.length < 80) {
    flags.push("thin_vignette");
  }
  if (!stem.endsWith("?")) {
    flags.push("stem_format");
  }

  const explanation = item.explanation?.trim() ?? "";
  if (explanation.length < 100) {
    flags.push("short_explanation");
  }

  let qcScore = 5;
  if (serveReady) qcScore += 2;
  if (blueprintAligned) qcScore += 1;
  if (taskCategory) qcScore += 0.5;
  if (explanation.length >= 200) qcScore += 0.5;
  if (isNptePtCuratedItem(item)) qcScore += 1;
  if (flags.length > 0) qcScore -= flags.length * 0.5;
  qcScore = Math.max(0, Math.min(10, qcScore));

  const difficultyRating = item.difficulty ?? 3;

  let reviewStatus: NptePtReviewStatus = "pending";
  if (isNptePtCuratedItem(item) && serveReady) {
    reviewStatus = "approved";
  } else if (qcScore >= NPTE_PT_MIN_QC_SCORE && serveReady) {
    reviewStatus = "approved";
  } else if (qcScore < 5 || !serveReady) {
    reviewStatus = "flagged";
  }

  return {
    serveReady,
    blueprintAligned,
    difficultyRating,
    qcScore,
    reviewStatus,
    flags,
    issues,
  };
}

export function isNptePtBestQuality(
  item: BankItem,
  opts: { minScore?: number } = {}
): boolean {
  const minScore = opts.minScore ?? NPTE_PT_MIN_QC_SCORE;
  const report = assessNptePtBankItem(item);
  return report.serveReady && report.qcScore >= minScore && report.blueprintAligned;
}
