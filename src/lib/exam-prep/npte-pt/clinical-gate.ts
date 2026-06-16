/**
 * NPTE-PT clinical vignette gate — PT objective data (ROM, MMT, gait) instead of USMLE labs-only heuristics.
 */
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "../bank-audit";
import { auditUsmleQaEditor } from "../usmle-qa-editor";
import {
  normalizeUsmleBankItemFields,
  splitUsmleBankItem,
} from "../usmle-clinical-gate";
import { isNptePtCuratedItem } from "@/lib/question-bank/npte-pt-curated";
import { NPTE_PT_SUBJECTS } from "@/lib/subjects/npte-pt/subjects";

const VALID_SUBJECTS = new Set(NPTE_PT_SUBJECTS.map((s) => s.id));

const AGE_PATTERN = /\b\d{1,3}[- ](?:year|month|week|day)[- ]old\b/i;

/** PT vignettes: vitals/labs plus ROM (°), MMT (/5), goniometry, distances, scores. */
const PT_OBJECTIVE_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|mmHg|bpm|\/min|× 10|g\/dL|mIU\/mL|°C|°F|°|U\/L|mm|cm|kg|lb|m\/s|m\b|MET|L\/min|cm H₂O|SpO₂|FEV|Borg|W|sec|seconds|pads|%)|\d+\/\d+|\d+\.\d+|GCS\s*\d+|ROM|MMT|goniomet|manual muscle|reflex|sensation|gait|ambul|transfer|strength|edema|swelling|flexion|extension|abduction|WBC|creatinine|BP|HR|SpO2|SpO₂/i;

const HISTORY_PATTERN =
  /history|pmh|past medical|diagnosed|years ago|post-op|postoperative|admitted|known|medication|medications|allerg|surgery|hospitalized|presents with|reports|complains|chronic|s\/p|status post|referred|outpatient|skilled nursing|rehab/i;

const NON_CLINICAL_SUBJECTS = new Set([
  "professional-responsibilities",
  "research-evidence",
]);

/** Heuristic: PT case vignette has enough context for judgment testing. */
export function nptePtVignetteIsRich(text: string, subjectId?: string): boolean {
  const t = text.trim();
  if (t.length < 80) return false;
  if (t.split(/[.!?]+/).filter(Boolean).length < 2) return false;

  if (NON_CLINICAL_SUBJECTS.has(subjectId ?? "")) {
    return t.length >= 100 && HISTORY_PATTERN.test(t);
  }

  const hasAge = AGE_PATTERN.test(t);
  const hasObjective = PT_OBJECTIVE_PATTERN.test(t);
  const hasHistory = HISTORY_PATTERN.test(t);
  return hasAge && (hasObjective || hasHistory);
}

export function nptePtBankItemHasClinicalScenario(item: BankItem): boolean {
  const normalized = normalizeUsmleBankItemFields(item);
  const { vignette, stem } = splitUsmleBankItem(normalized);
  if (!vignette || stem.length < 12) return false;
  const subjectId = normalized.subjectId ?? normalized.topicCategory ?? "";
  return nptePtVignetteIsRich(vignette, subjectId);
}

/** Serve-time / ingest gate for NPTE-PT rows. */
export function nptePtBankItemIsServeReady(
  item: BankItem,
  source?: string | null
): boolean {
  const normalized = normalizeUsmleBankItemFields(item);
  if (isNptePtCuratedItem(normalized)) return true;
  if (!auditBankItem(normalized, "npte-pt").ok) return false;
  if (!nptePtBankItemHasClinicalScenario(normalized)) return false;

  const { stem } = splitUsmleBankItem(normalized);
  if (!stem.endsWith("?")) return false;

  const subjectId = normalized.subjectId ?? normalized.topicCategory ?? "";
  if (!VALID_SUBJECTS.has(subjectId)) return false;

  const explanation = normalized.explanation?.trim() ?? "";
  if (explanation.length < 100) return false;

  const resolvedSource = source ?? normalized.source ?? null;
  if (resolvedSource === "generated") {
    return true;
  }

  const report = auditUsmleQaEditor(normalized, {
    fieldId: "npte-pt",
    source: "polished",
    itemId: normalized.id,
    difficulty: normalized.difficulty ?? null,
  });
  return report.examReady;
}
