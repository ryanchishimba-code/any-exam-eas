/**
 * AANP FNP bank item quality assessment — editorial + blueprint alignment.
 */
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "../bank-audit";
import { usmleBankItemIsServeReady, splitUsmleBankItem } from "../usmle-clinical-gate";
import { AANP_FNP_SUBJECTS } from "@/lib/subjects/aanp-fnp/subjects";
import {
  AANP_FNP_AGE_GROUP_WEIGHTS,
  AANP_FNP_DOMAIN_WEIGHTS,
  type AanpFnpReviewStatus,
} from "./types";

export type AanpFnpQcReport = {
  serveReady: boolean;
  blueprintAligned: boolean;
  difficultyRating: number;
  qcScore: number;
  reviewStatus: AanpFnpReviewStatus;
  flags: string[];
  issues: string[];
};

const VALID_SUBJECTS = new Set(AANP_FNP_SUBJECTS.map((s) => s.id));
const VALID_DOMAINS = new Set(Object.keys(AANP_FNP_DOMAIN_WEIGHTS));
const VALID_AGE_GROUPS = new Set(Object.keys(AANP_FNP_AGE_GROUP_WEIGHTS));

export function assessAanpFnpBankItem(
  item: BankItem,
  opts: { fieldId?: string; source?: string | null } = {}
): AanpFnpQcReport {
  const fieldId = opts.fieldId ?? "aanp-fnp";
  const flags: string[] = [];
  const issues: string[] = [];

  const bankAudit = auditBankItem(item, fieldId);
  if (!bankAudit.ok) {
    issues.push(...bankAudit.issues.filter((i) => i.severity === "error").map((i) => i.message));
  }

  const serveReady = usmleBankItemIsServeReady(item, fieldId);
  if (!serveReady) {
    flags.push("clinical_gate_fail");
    issues.push("Item does not pass clinical vignette serve gate.");
  }

  const subjectId = item.subjectId ?? item.topicCategory ?? "";
  const blueprintAligned = VALID_SUBJECTS.has(subjectId);
  if (!blueprintAligned) {
    flags.push("invalid_subject");
    issues.push(`Invalid AANP FNP subject: ${subjectId}`);
  }

  const domain =
    item.blueprintDomain ??
    (item.ngnPayload?.blueprintDomain as string | undefined);
  if (domain && !VALID_DOMAINS.has(domain)) {
    flags.push("invalid_domain");
    issues.push(`Invalid blueprint domain: ${domain}`);
  }

  const ageGroup =
    item.patientAgeGroup ??
    (item.ngnPayload?.patientAgeGroup as string | undefined);
  if (ageGroup && !VALID_AGE_GROUPS.has(ageGroup)) {
    flags.push("invalid_age_group");
    issues.push(`Invalid patient age group: ${ageGroup}`);
  }

  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette || vignette.length < 80) {
    flags.push("short_vignette");
    issues.push("Vignette too short for AANP FNP clinical item.");
  }
  if (!stem || stem.length < 20) {
    flags.push("short_stem");
    issues.push("Question stem too short.");
  }

  const difficultyRating = item.difficulty ?? 3;
  let qcScore = 100;
  if (!serveReady) qcScore -= 40;
  if (!blueprintAligned) qcScore -= 25;
  if (flags.includes("short_vignette")) qcScore -= 15;
  if (flags.includes("invalid_domain")) qcScore -= 10;
  if (flags.includes("invalid_age_group")) qcScore -= 5;
  qcScore = Math.max(0, qcScore);

  const reviewStatus: AanpFnpReviewStatus =
    qcScore >= 80 && serveReady ? "approved" : qcScore >= 50 ? "flagged" : "rejected";

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

export function aanpFnpBankItemIsServeReady(item: BankItem, fieldId = "aanp-fnp"): boolean {
  return assessAanpFnpBankItem(item, { fieldId }).serveReady;
}
