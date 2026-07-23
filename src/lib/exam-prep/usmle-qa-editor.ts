/**
 * Automated USMLE editorial QA — 7-dimension scoring for databank audit CSV.
 */
import type { ExamQuestion } from "@/lib/ai";
import {
  hasDuplicateVignette,
  scoreUsmleBankItem,
} from "@/lib/engine/polish/usmle-polish";
import {
  hasOrphanDeicticStem,
  isVignetteRich,
  validateClinicalVignette,
  vignetteHasEtiologyClues,
  vignetteHasHistoryClues,
} from "@/lib/engine/prompts/vignette";
import type { BankItem } from "@/lib/question-bank";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";
import { splitUsmleBankItem } from "./usmle-bank-split";
import { USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "./usmle/steps";

export type UsmleQaDimension =
  | "vignetteQuality"
  | "highYieldValue"
  | "distractors"
  | "correctAnswerExplanation"
  | "integrationThinking"
  | "overallPolish"
  | "platformFit";

export type UsmleQaIssue = {
  code: string;
  message: string;
  severity: "error" | "warn" | "info";
  dimension: UsmleQaDimension;
};

export type UsmleQaReport = {
  itemId?: string;
  fieldId: string;
  subjectId: string;
  source: string;
  scores: Record<UsmleQaDimension, number>;
  overallScore: number;
  issues: UsmleQaIssue[];
  recommendations: string[];
  difficultySuggestion: "Easy" | "Medium" | "Hard";
  tagsSuggestion: string;
  testedConcepts: string;
  examReady: boolean;
  polishScore: number;
};

const HIGH_YIELD_SUBJECTS = new Set([
  "cardiology",
  "nephrology",
  "pulmonology",
  "neurology",
  "pharmacology",
  "pathology",
  "biochemistry",
  "microbiology",
  "pediatrics",
  "obgyn",
  "hematology",
  "gastroenterology",
  "internal-medicine",
  "emergency-medicine",
]);

const AI_TELLTALES =
  /\bit is important to note\b|\bas an ai\b|\bin conclusion\b|\bfurthermore\b|\bmoreover\b|\bcomprehensive understanding\b|\bdelves into\b|\bplays a crucial role\b/i;

const WEAK_OPTION =
  /defer all assessment|discharge without|reassure only|no testing|6 months|withhold all treatment|artifact that invalidates|opposite of established|normal variant requiring no follow-up in every patient/i;

const WEAK_CORRECT =
  /^Focused .* evaluation with targeted history|^Pathophysiology of .* explains the dominant finding|^High-yield fact about/i;

const LEAD_IN =
  /most likely|most appropriate|best explains|best described|next step|next best|which action should be taken next|taken next in this patient|diagnosis|management|mechanism|initial test|complication|highest risk|adverse outcome|underlying pathophysiology|which explanation|which mechanism|what is the|which of the following|involves deficiency|irreversibly inhibits|primarily infects|best described as|downstream effect|must include|interpretation of the lab|most accurate|primarily by inhibiting|primarily supports|passes through|treated with|appears as|contribute to|which structure|which fibers|which vertebral|which downstream|which interpretation|inhibiting:|most critical|greatest risk|should the pharmacist take first|should be taken next/i;

const STEP1_RECALL_STEM =
  /involves deficiency|irreversibly inhibits|primarily infects|best described as|appears as|treated with|must include|end-systole|rate-limiting|residual volume|caseous necrosis|reed-sternberg|oral sabin|type iii hypersensitivity|urea cycle occurs|von gierke|organophosphate|staphylococcus|statins inhibit|primary contributor|mlf lesion|positive symptoms of schizophrenia|kussmaul|first-line for|epiglottitis classically|jaundice within|kawasaki disease|postpartum hemorrhage|dka features|atrial fibrillation stroke|tension pneumothorax|asthma pathophysiology|most filtered glucose|which structure|which fibers|which vertebral|passes through the diaphragm|downstream effect|interpretation of the lab/i;

function isStep1FoundationRecall(
  fieldId: string,
  subjectId: string,
  vignette: string,
  stem: string
): boolean {
  return (
    fieldId === "usmle-step-1" &&
    isUsmleStep1Subject(subjectId) &&
    !vignette &&
    STEP1_RECALL_STEM.test(stem)
  );
}

const NEXT_STEP_STEM = /next (?:best )?step|most appropriate (?:next )?(?:step|management|action)/i;

const EXPLANATION_CRITERIA_IN_EXPLANATION =
  /\b(criteria|eligible|indication|contraindication|unless|when .* meets|protocol threshold)\b/i;

function clampScore(n: number): number {
  return Math.max(1, Math.min(10, Math.round(n * 10) / 10));
}

function toExamQuestion(item: BankItem, vignette: string, stem: string): ExamQuestion {
  const parsedId = Number.parseInt(item.id ?? "0", 10);
  return {
    id: Number.isFinite(parsedId) ? parsedId : 0,
    type: "multiple_choice",
    question: stem,
    vignette: vignette || undefined,
    options: item.options ?? [],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation ?? "",
  };
}

function pushIssue(
  issues: UsmleQaIssue[],
  code: string,
  message: string,
  dimension: UsmleQaDimension,
  severity: UsmleQaIssue["severity"] = "warn"
) {
  issues.push({ code, message, severity, dimension });
}

/** Pull Step 3 abstract / drug-ad / CCS stimulus text from ngnPayload when vignette is empty. */
function formatStimulusFromPayload(item: BankItem): string {
  const payload = item.ngnPayload;
  if (!payload || typeof payload !== "object") return "";
  const p = payload as Record<string, unknown>;
  const abstract = p.abstract;
  if (abstract && typeof abstract === "object") {
    const a = abstract as Record<string, unknown>;
    return [a.title, a.source, a.body].filter((x) => typeof x === "string" && x.trim()).join("\n");
  }
  const ad = p.ad;
  if (ad && typeof ad === "object") {
    const d = ad as Record<string, unknown>;
    return [d.drug, d.headline, d.indications, d.warnings]
      .filter((x) => typeof x === "string" && x.trim())
      .join("\n");
  }
  const caseData = p.caseData;
  if (caseData && typeof caseData === "object") {
    const c = caseData as Record<string, unknown>;
    return [c.setting, c.presentation, c.vitals, c.timeline]
      .filter((x) => typeof x === "string" && x.trim())
      .join("\n");
  }
  return "";
}

export function auditUsmleQaEditor(
  item: BankItem,
  meta: { fieldId: string; source?: string; itemId?: string; difficulty?: number | null }
): UsmleQaReport {
  const issues: UsmleQaIssue[] = [];
  const recommendations: string[] = [];
  const itemType = item.itemType ?? "mcq";
  const step3Format =
    meta.fieldId === "usmle-step-3" && USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType);
  const { vignette: splitVignette, stem } = splitUsmleBankItem(item);
  let vignette = splitVignette?.trim() ?? "";
  if (!vignette && step3Format) {
    vignette = formatStimulusFromPayload(item).trim();
  }
  const options = Array.isArray(item.options) ? item.options : [];
  const explanation = item.explanation?.trim() ?? "";
  const tags = item.tags ?? [];
  const source = meta.source ?? "unknown";
  const examQ = toExamQuestion(item, vignette, stem);
  const combined = `${vignette}\n${stem}\n${explanation}`;
  const step1Recall = isStep1FoundationRecall(meta.fieldId, item.subjectId ?? "", vignette, stem);

  // ── Vignette quality ──
  let vignetteQuality = 5;
  if (!vignette) {
    if (step1Recall || step3Format) {
      // Step 1 recall and Step 3 format stimuli (abstract/ad/CCS) may omit classic patient vignettes.
      vignetteQuality = step3Format ? 6 : 7;
      if (step3Format) {
        pushIssue(
          issues,
          "format_stimulus_thin",
          "Step 3 format item lacks abstract/ad/CCS stimulus text.",
          "vignetteQuality",
          "warn"
        );
      }
    } else {
      vignetteQuality -= 3;
      pushIssue(issues, "missing_vignette", "No clinical vignette separated from stem.", "vignetteQuality", "error");
    }
  } else if (step3Format) {
    // Format stimulus: score on substance, not demographics/vitals.
    if (vignette.length >= 80) vignetteQuality += 2;
    else pushIssue(issues, "format_stimulus_thin", "Format stimulus is short.", "vignetteQuality", "warn");
    if (vignette.length >= 160) vignetteQuality += 1;
    if (/\d/.test(vignette)) vignetteQuality += 0.5;
  } else {
    if (isVignetteRich(vignette)) vignetteQuality += 2;
    else pushIssue(issues, "thin_vignette", "Vignette lacks demographics, objective data, or depth.", "vignetteQuality", "error");

    if (vignette.length >= 120 && vignette.length <= 480) vignetteQuality += 1;
    else if (vignette.length > 600) {
      vignetteQuality -= 0.5;
      pushIssue(issues, "verbose_vignette", "Vignette may be too long for USMLE pacing.", "vignetteQuality", "info");
    }

    if (/\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|°C|°F|U\/L)/.test(vignette)) vignetteQuality += 1;
    if (/\b\d{1,3}[- ](?:year|month|week|day)[- ]old\b/i.test(vignette)) vignetteQuality += 0.5;
    if (vignetteHasHistoryClues(vignette)) vignetteQuality += 0.5;
    if (vignetteHasEtiologyClues(vignette)) vignetteQuality += 0.5;
  }

  if (!step1Recall && !step3Format) {
    for (const msg of validateClinicalVignette(examQ)) {
      vignetteQuality -= 0.8;
      pushIssue(issues, "vignette_validation", msg, "vignetteQuality", "warn");
    }
  }
  if (!step3Format && hasOrphanDeicticStem(examQ)) {
    vignetteQuality -= 1.5;
    pushIssue(issues, "orphan_stem", "Stem references findings without adequate vignette.", "vignetteQuality", "error");
  }

  // ── High-yield value ──
  let highYieldValue = 6;
  if (tags.includes("physician-educator")) highYieldValue += 2;
  if (source === "seed" || source.includes("physician")) highYieldValue += 0.5;
  if (tags.includes("usmle-polished")) highYieldValue -= 0.5;
  if (tags.includes("generated") || tags.includes("bulk-bank")) highYieldValue -= 1.5;
  if (HIGH_YIELD_SUBJECTS.has(item.subjectId ?? "")) highYieldValue += 1;
  if (NEXT_STEP_STEM.test(stem) || /most likely diagnosis/i.test(stem)) highYieldValue += 0.5;

  // ── Distractors ──
  let distractors = 5;
  if (options.length >= 4 && options.length <= 6) distractors += 1;
  else pushIssue(issues, "options_count", `Expected 4–6 options; got ${options.length}.`, "distractors", "error");

  const unique = new Set(options.map((o) => o.trim().toLowerCase()));
  if (unique.size === options.length) distractors += 1;
  else pushIssue(issues, "duplicate_options", "Duplicate answer choices detected.", "distractors", "error");

  if (options.includes(item.correctAnswer)) distractors += 1;
  else pushIssue(issues, "correct_not_in_options", "Correct answer not in option list.", "distractors", "error");

  const weakCount = options.filter((o) => WEAK_OPTION.test(o)).length;
  if (weakCount === 0) distractors += 1.5;
  else {
    distractors -= weakCount * 1.2;
    pushIssue(issues, "weak_distractors", `${weakCount} implausible/obvious distractor(s).`, "distractors", "warn");
  }

  // ── Correct answer & explanation ──
  let correctAnswerExplanation = 5;
  if (explanation.length >= 200) correctAnswerExplanation += 1.5;
  else if (explanation.length >= 120) correctAnswerExplanation += 0.5;
  else {
    correctAnswerExplanation -= 1.5;
    pushIssue(issues, "short_explanation", "Explanation under 120 characters.", "correctAnswerExplanation", "warn");
  }

  if (/incorrect|why other|distractor|does not|wrong because|• /i.test(explanation)) correctAnswerExplanation += 1.5;
  else {
    pushIssue(
      issues,
      "no_distractor_rationale",
      "Explanation lacks explicit why-other-options-are-wrong structure.",
      "correctAnswerExplanation",
      "warn"
    );
  }

  if (/mechanism|pathophys|guideline|first-line|evidence|trial|ACC|AHA|IDSA|CDC/i.test(explanation)) {
    correctAnswerExplanation += 1;
  }

  if (WEAK_CORRECT.test(item.correctAnswer)) {
    correctAnswerExplanation -= 2;
    pushIssue(issues, "weak_correct", "Correct answer uses generic/template phrasing.", "correctAnswerExplanation", "error");
  }

  if (
    NEXT_STEP_STEM.test(stem) &&
    EXPLANATION_CRITERIA_IN_EXPLANATION.test(explanation) &&
    !EXPLANATION_CRITERIA_IN_EXPLANATION.test(vignette)
  ) {
    correctAnswerExplanation -= 1;
    pushIssue(
      issues,
      "criteria_only_in_explanation",
      "Management criteria referenced in explanation but not stated in vignette.",
      "correctAnswerExplanation",
      "warn"
    );
    recommendations.push("Move all eligibility criteria for the keyed answer into the vignette.");
  }

  // ── Integration & thinking ──
  let integrationThinking = 5;
  const dataPoints = (vignette.match(/\d+\s*(?:mg\/dL|mEq\/L|mm Hg|\/min|× 10|g\/dL|mIU\/mL|U\/L|%)/g) ?? []).length;
  if (dataPoints >= 3) integrationThinking += 1.5;
  else if (dataPoints >= 1) integrationThinking += 0.5;

  if (vignette && /exam|auscult|tender|mass|murmur|edema|rash|wheeze/i.test(vignette)) integrationThinking += 1;
  if (NEXT_STEP_STEM.test(stem) || /most likely diagnosis|underlying mechanism|pathophysiologic/i.test(stem)) {
    integrationThinking += 1.5;
  }
  if (vignette && stem && vignette.length > 80 && stem.length > 20) integrationThinking += 0.5;

  // ── Overall polish ──
  let overallPolish = 7;
  if (hasDuplicateVignette(item.question)) {
    overallPolish -= 2;
    pushIssue(issues, "duplicate_vignette", "Vignette duplicated in question stem.", "overallPolish", "error");
  }
  if (/^Case\s+\d+:/i.test(item.question)) {
    overallPolish -= 1;
    pushIssue(issues, "case_prefix", "Legacy Case N: prefix in stem.", "overallPolish", "warn");
  }
  if (AI_TELLTALES.test(combined)) {
    overallPolish -= 1;
    pushIssue(issues, "ai_phrasing", "AI telltale phrasing detected.", "overallPolish", "warn");
  }
  if (!stem.endsWith("?")) {
    overallPolish -= 0.5;
    if (!step1Recall) {
      pushIssue(issues, "stem_punctuation", "Lead-in should end with a question mark.", "overallPolish", "info");
    }
  }
  if (!LEAD_IN.test(stem) && !step1Recall) {
    overallPolish -= 0.5;
    pushIssue(issues, "stem_lead_in", "Stem lacks USMLE-style lead-in phrasing.", "overallPolish", "warn");
  }

  // ── Platform fit ──
  let platformFit = 6;
  if (tags.includes("physician-educator")) platformFit += 1.5;
  if (tags.length >= 2) platformFit += 0.5;
  if (item.difficulty != null && item.difficulty >= 1 && item.difficulty <= 5) platformFit += 0.5;
  if (item.keyTakeaways?.length) platformFit += 1;
  if (explanation.length >= 150 && /key finding|pearl|takeaway|remember/i.test(explanation)) platformFit += 0.5;
  if (source === "polished") platformFit += 0.5;

  const scores: Record<UsmleQaDimension, number> = {
    vignetteQuality: clampScore(vignetteQuality),
    highYieldValue: clampScore(highYieldValue),
    distractors: clampScore(distractors),
    correctAnswerExplanation: clampScore(correctAnswerExplanation),
    integrationThinking: clampScore(integrationThinking),
    overallPolish: clampScore(overallPolish),
    platformFit: clampScore(platformFit),
  };

  const overallScore =
    clampScore(
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    );

  const polishScore = scoreUsmleBankItem(item, meta.fieldId);

  if (overallScore < 8 && recommendations.length === 0) {
    const worst = (Object.entries(scores) as [UsmleQaDimension, number][]).sort((a, b) => a[1] - b[1])[0];
    if (worst) recommendations.push(`Priority: improve ${worst[0]} (scored ${worst[1]}/10).`);
  }

  const difficultySuggestion: UsmleQaReport["difficultySuggestion"] =
    meta.difficulty != null && meta.difficulty <= 2
      ? "Easy"
      : meta.difficulty != null && meta.difficulty >= 4
        ? "Hard"
        : "Medium";

  const tagsSuggestion = [...new Set([...(tags ?? []), item.subjectId ?? "usmle"].filter(Boolean))].join("; ");
  const testedConcepts =
    tags.filter((t) => !["physician-educator", "usmle-polished", "generated", "bulk-bank"].includes(t)).join("; ") ||
    item.subjectId ||
    "";

  return {
    itemId: meta.itemId,
    fieldId: meta.fieldId,
    subjectId: item.subjectId ?? "",
    source,
    scores,
    overallScore,
    issues,
    recommendations,
    difficultySuggestion,
    tagsSuggestion,
    testedConcepts,
    /** Automated serve bar (UWorld-ready). Manual editorial A+ target is ≥8.5. */
    examReady: overallScore >= 8 && !issues.some((i) => i.severity === "error"),
    polishScore,
  };
}

export type UsmleQaBatchSummary = {
  total: number;
  averageOverall: number;
  examReadyCount: number;
  examReadyRate: number;
  averageByDimension: Record<UsmleQaDimension, number>;
  byField: Record<string, { total: number; avg: number; ready: number }>;
  bySource: Record<string, { total: number; avg: number }>;
  topIssueCodes: Array<{ code: string; count: number }>;
  readinessScore: number;
};

export function summarizeUsmleQaBatch(reports: UsmleQaReport[]): UsmleQaBatchSummary {
  const dimensions = Object.keys(reports[0]?.scores ?? {}) as UsmleQaDimension[];
  const averageByDimension = {} as Record<UsmleQaDimension, number>;
  for (const d of dimensions) {
    averageByDimension[d] =
      reports.length === 0
        ? 0
        : clampScore(reports.reduce((s, r) => s + r.scores[d], 0) / reports.length);
  }

  const byField: UsmleQaBatchSummary["byField"] = {};
  const bySource: UsmleQaBatchSummary["bySource"] = {};
  const codeCounts: Record<string, number> = {};

  for (const r of reports) {
    if (!byField[r.fieldId]) byField[r.fieldId] = { total: 0, avg: 0, ready: 0 };
    byField[r.fieldId]!.total++;
    byField[r.fieldId]!.avg += r.overallScore;
    if (r.examReady) byField[r.fieldId]!.ready++;

    if (!bySource[r.source]) bySource[r.source] = { total: 0, avg: 0 };
    bySource[r.source]!.total++;
    bySource[r.source]!.avg += r.overallScore;

    for (const issue of r.issues) {
      codeCounts[issue.code] = (codeCounts[issue.code] ?? 0) + 1;
    }
  }

  for (const f of Object.values(byField)) f.avg = clampScore(f.avg / f.total);
  for (const s of Object.values(bySource)) s.avg = clampScore(s.avg / s.total);

  const averageOverall =
    reports.length === 0 ? 0 : clampScore(reports.reduce((s, r) => s + r.overallScore, 0) / reports.length);
  const examReadyCount = reports.filter((r) => r.examReady).length;
  const examReadyRate = reports.length ? examReadyCount / reports.length : 0;

  return {
    total: reports.length,
    averageOverall,
    examReadyCount,
    examReadyRate,
    averageByDimension,
    byField,
    bySource,
    topIssueCodes: Object.entries(codeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([code, count]) => ({ code, count })),
    readinessScore: clampScore(averageOverall * 0.6 + examReadyRate * 4),
  };
}

export function csvEscape(value: string | number | boolean): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
