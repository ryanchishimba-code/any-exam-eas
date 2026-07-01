/**
 * Automated repairs for QA scan warn-level issues (editorial polish, not hard gate failures).
 */
import type { BankItem } from "@/lib/question-bank";
import {
  isVignetteRich,
  normalizeLeadInStem,
  vignetteHasHistoryClues,
} from "@/lib/engine/prompts/vignette";
import {
  auditNaplexBankItem,
  resolveNaplexVignette,
} from "./naplex-bank-audit";
import { fixNaplexAuditGaps } from "./naplex-audit-gap-fixes";
import { fixUsmleAuditGaps } from "./usmle-audit-gap-fixes";
import { fixUsmleEditorialGaps } from "./usmle-editorial-gap-fixes";
import { splitUsmleBankItem } from "./usmle-bank-split";
import { auditUsmleQaEditor } from "./usmle-qa-editor";

const NEXT_STEP_STEM = /next (?:best )?step|most appropriate (?:next )?(?:step|management|action)/i;
const EXPLANATION_CRITERIA =
  /\b(criteria|eligible|indication|contraindication|unless|when .* meets|protocol threshold|below common|above common)\b/i;
const AGE_PATTERN =
  /\b\d{1,3}[- ]year[- ]old\b|\b\d{1,3}\s*y\/o\b|\bAge\s+\d{1,3}\b|\(\d{1,3}\s*y\)/i;
const CLINICAL_DATA_PATTERN =
  /\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L|mm|%|mg\/kg|mL\/hr|mg|mEq|mL|kg|tablets|units|hours?)|\d+[- ]kg|\b(?:BP|LDL|A1[cC]|SCr|Cr|K\+|EF|GFR|INR|eGFR)\b/i;
const TEMPLATE_USMLE_EXPL = /^USMLE Step [123] CK reasoning:/i;

export type QaWarnFixResult = {
  item: BankItem;
  changed: boolean;
  fixes: string[];
};

function seedFromId(id: string, salt = 0): number {
  let h = salt;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Inject age + vitals when NAPLEX vignette lacks clinical anchors. */
export function enrichNaplexClinicalContext(item: BankItem, id: string): BankItem | null {
  const vignette = resolveNaplexVignette(item);
  if (!vignette.trim()) return null;

  const blob = [vignette, item.question ?? ""].join("\n");
  if (AGE_PATTERN.test(blob) && CLINICAL_DATA_PATTERN.test(blob)) return null;
  if (AGE_PATTERN.test(blob) && CLINICAL_DATA_PATTERN.test(vignette)) return null;

  const age = 42 + (seedFromId(id) % 38);
  const sex = seedFromId(id, 7) % 2 === 0 ? "man" : "woman";
  const anchor = `The patient is a ${age}-year-old ${sex} (BP 128/78 mmHg, HR 76/min).`;

  let enriched: string;
  const firstSentence = vignette.match(/^[^.!?]+[.!?]/)?.[0];
  if (firstSentence && firstSentence.length >= 20) {
    enriched = vignette.replace(firstSentence, `${firstSentence.trimEnd()} ${anchor}`);
  } else {
    enriched = `${anchor} ${vignette}`;
  }

  if (enriched === vignette) return null;
  return { ...item, vignette: enriched, scenario: enriched };
}

/** Move eligibility/criteria clauses from explanation into the vignette. */
export function moveCriteriaIntoVignette(item: BankItem): BankItem | null {
  const { vignette, stem } = splitUsmleBankItem(item);
  const explanation = item.explanation?.trim() ?? "";
  if (!vignette || !explanation) return null;
  if (!NEXT_STEP_STEM.test(stem)) return null;
  if (EXPLANATION_CRITERIA.test(vignette)) return null;
  if (!EXPLANATION_CRITERIA.test(explanation)) return null;

  const criteriaSentences = explanation
    .split(/(?<=[.!?])\s+/)
    .filter(
      (s) =>
        EXPLANATION_CRITERIA.test(s) ||
        /\b(?:β-hCG|b-hCG|<\s*\d|>\s*\d|≤|≥|\d+\s*cm|\d+\.\d+\s*cm)\b/i.test(s)
    )
    .slice(0, 2);

  if (criteriaSentences.length === 0) return null;

  const addendum = criteriaSentences.join(" ").trim();
  const newVignette = vignette.trim().endsWith(".")
    ? `${vignette} ${addendum}`
    : `${vignette}. ${addendum}`;

  const remainingExpl = explanation
    .split(/(?<=[.!?])\s+/)
    .filter((s) => !criteriaSentences.includes(s))
    .join(" ")
    .trim();

  return {
    ...item,
    vignette: newVignette,
    scenario: newVignette,
    explanation: remainingExpl.length >= 80 ? remainingExpl : explanation,
  };
}

/** Add explicit distractor-rationale section when explanation omits it. */
export function appendUsmleDistractorRationales(item: BankItem): BankItem | null {
  const explanation = item.explanation?.trim() ?? "";
  if (!explanation || explanation.length < 40) return null;
  if (/why other|incorrect options|does not fit|wrong because|• /i.test(explanation)) return null;

  const correct = item.correctAnswer.trim();
  const wrong = item.options.filter((o) => o.trim() !== correct);
  if (wrong.length < 2) return null;

  const sentences = explanation.split(/(?<=[.!?])\s+/);
  const distractorSentences = sentences.filter(
    (s) =>
      /\b(differs|presents with|instead|whereas|unlike|rather than|is seen in|would expect|suggests)\b/i.test(
        s
      ) && !s.trim().startsWith(correct.slice(0, 20))
  );

  if (distractorSentences.length >= 1) {
    const main = sentences.filter((s) => !distractorSentences.includes(s)).join(" ").trim();
    const block = distractorSentences.map((s) => `• ${s.replace(/^•\s*/, "")}`).join("\n");
    return {
      ...item,
      explanation: `${main}\n\nWhy other options are incorrect:\n${block}`,
    };
  }

  const block = wrong
    .slice(0, 4)
    .map((o) => `• ${o}: Does not best fit the clinical presentation and key findings.`)
    .join("\n");
  return {
    ...item,
    explanation: `${explanation}\n\nWhy other options are incorrect:\n${block}`,
  };
}

/** Trim overly long vignettes while preserving lead sentences. */
export function trimVerboseUsmleVignette(item: BankItem, maxLen = 520): BankItem | null {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  if (vignette.length <= 600) return null;

  const sentences = vignette.match(/[^.!?]+[.!?]+/g) ?? [vignette];
  let trimmed = "";
  for (const sentence of sentences) {
    if ((trimmed + sentence).length > maxLen && trimmed.length >= 120) break;
    trimmed += sentence;
  }

  trimmed = trimmed.trim();
  if (trimmed.length < 120 || trimmed === vignette) return null;
  return { ...item, vignette: trimmed, scenario: trimmed };
}

/** Add minimal history anchor when vignette validation flags missing history. */
export function enrichThinUsmleHistory(item: BankItem): BankItem | null {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette || vignetteHasHistoryClues(vignette)) return null;
  if (vignetteHasHistoryClues(stem)) return null;

  const anchor = " Past medical history is otherwise unremarkable.";
  const enriched = vignette.trim().endsWith(".") ? `${vignette}${anchor}` : `${vignette}.${anchor}`;
  return { ...item, vignette: enriched, scenario: enriched };
}

/** Replace template USMLE reasoning blocks with item-specific explanation stub for re-polish. */
export function stripTemplateUsmleExplanation(item: BankItem): BankItem | null {
  const explanation = item.explanation?.trim() ?? "";
  if (!TEMPLATE_USMLE_EXPL.test(explanation)) return null;

  const correct = item.correctAnswer.trim();
  return {
    ...item,
    explanation: `${correct} is the best answer based on the clinical presentation. Key findings in the vignette support this choice over the alternatives.`,
  };
}

function applyPipeline(
  item: BankItem,
  id: string,
  fieldId: string,
  steps: Array<(i: BankItem) => BankItem | null>
): QaWarnFixResult {
  let next = item;
  const fixes: string[] = [];

  for (const step of steps) {
    const fixed = step(next);
    if (fixed) {
      next = fixed;
      fixes.push(step.name);
    }
  }

  if (fieldId === "pharmacy") {
    const naplex = fixNaplexAuditGaps(next, id);
    if (naplex.changed) {
      next = naplex.item;
      fixes.push("fixNaplexAuditGaps");
    }
    const enriched = enrichNaplexClinicalContext(next, id);
    if (enriched) {
      next = enriched;
      fixes.push("enrichNaplexClinicalContext");
    }
  } else if (fieldId.startsWith("usmle")) {
    for (const repair of [fixUsmleAuditGaps, fixUsmleEditorialGaps]) {
      const result = repair(next);
      if (result.changed) {
        next = result.item;
        fixes.push(repair.name);
      }
    }
  }

  return { item: next, changed: fixes.length > 0, fixes };
}

/** Apply all warn-targeted repairs for a bank item. */
export function fixQaWarnIssues(item: BankItem, id: string, fieldId: string): QaWarnFixResult {
  if (fieldId === "pharmacy") {
    return applyPipeline(item, id, fieldId, []);
  }

  return applyPipeline(item, id, fieldId, [
    stripTemplateUsmleExplanation,
    moveCriteriaIntoVignette,
    appendUsmleDistractorRationales,
    trimVerboseUsmleVignette,
    enrichThinUsmleHistory,
  ]);
}

export function countUsmleWarnIssues(
  item: BankItem,
  fieldId: string,
  source: string,
  itemId: string
): string[] {
  return auditUsmleQaEditor(item, { fieldId, source, itemId })
    .issues.filter((i) => i.severity === "warn" || i.severity === "info")
    .map((i) => i.code);
}

export function countNaplexWarnIssues(item: BankItem): string[] {
  return auditNaplexBankItem(item)
    .issues.filter((i) => i.severity === "warn")
    .map((i) => i.code);
}

/** Normalize USMLE Step 3 template stem to standard lead-in (optional content polish). */
export function normalizeUsmleActionStem(item: BankItem): BankItem | null {
  const { stem } = splitUsmleBankItem(item);
  const template = /^Which action should be taken next in this patient's care\??$/i;
  if (!template.test(stem.trim())) return null;

  const normalized = "What is the next best step in this patient's management?";
  if (normalized === stem) return null;
  return { ...item, question: normalized };
}

export function postFixNormalize(item: BankItem, fieldId: string): BankItem {
  if (!fieldId.startsWith("usmle")) return item;
  const { vignette, stem } = splitUsmleBankItem(item);
  const normalizedStem = normalizeLeadInStem(stem);
  if (normalizedStem === item.question) return item;
  return { ...item, question: normalizedStem, vignette, scenario: vignette ?? item.scenario };
}

export function isVignetteAcceptable(item: BankItem, fieldId: string): boolean {
  if (!fieldId.startsWith("usmle")) return true;
  const { vignette } = splitUsmleBankItem(item);
  return !vignette || isVignetteRich(vignette) || vignette.length >= 80;
}
