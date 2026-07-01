import type { BankItem } from "@/lib/question-bank";
import {
  alignNaplexBankItemAnswers,
  correctAnswerMatchesOption,
  extractExplanationCorrectText,
  indexOfMatchingOption,
  inferCorrectFromDistractors,
  inferCorrectFromExplanationRecommendation,
  inferCorrectFromWrongOptionsSection,
} from "./naplex-answer-align";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";
import { repairClinicalNumericMismatch } from "./naplex-clinical-numeric-repair";

export type NaplexFormatIssue = {
  code:
    | "naplex_stem_format_mismatch"
    | "naplex_conflicting_lead_ins"
    | "naplex_mcq_missing_correct_option"
    | "naplex_calc_stem_on_mcq"
    | "naplex_orphan_calc_stem"
    | "naplex_clinical_stem_numeric_options";
  message: string;
  severity: "error";
};

/** Generic calculation stems from blueprint slot rotation — must not attach to non-calc vignettes. */
export const GENERIC_BLUEPRINT_CALC_STEMS = [
  "Calculate the dose in mg. Round to the nearest whole number.",
  "How many tablets should be dispensed for this order?",
  "At what rate (mL/hr) should the infusion pump be set? Round to the nearest whole number.",
  "What is the total volume in mL? Round to one decimal place.",
  "How many milligrams of drug are required for this preparation?",
  "Calculate the concentration in mg/mL. Round to two decimal places.",
] as const;

const MCQ_CLINICAL_VIGNETTE =
  /\b(?:addiction|substance abuse|non-opioid|concern about|exploring|counsel|counseling|alternative therap|most appropriate|next best step|which (?:recommendation|action|finding|medication|alternative)|patient asks|mother asks|expresses concern|monitoring parameter|drug interaction|therapeutic change|immediate follow-up)\b/i;

const CALC_ORDER_CONTEXT =
  /\b(?:order(?:ed)?|Rx:|dispense|infus(?:e|ion)|prepare|compound|dilut|reconstitut|available (?:suspension|vial|stock|concentrate)|bag contains|mg\/kg|mcg\/kg|mg\/m²|mL\/hr|every \d+ hours?.*\d+\s*mg|q\d+h.*\d+\s*mg|round to (?:one|two|nearest))\b/i;

const MCQ_LEAD_IN =
  /\b(?:which (?:finding|action|medication|intervention|recommendation|counseling|monitoring|drug|alternative|statement|laboratory)|what is the (?:most|best|priority|next|appropriate|expected)|most appropriate|best choice|best next|next best step|select all|which of the following|what counseling|expected (?:duration|time frame))\b/i;

const CALC_LEAD_IN =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

const NUMERIC_ANSWER = /^\s*-?\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL|ml|mL\/hr|mcg\/mL|mEq|units|%|tablets|capsules|hr|hours?)?\s*$/i;

function blob(item: BankItem): string {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  return [vignette, stem, item.question].filter(Boolean).join("\n");
}

function hasMcqOptions(item: BankItem): boolean {
  return item.options.filter((o) => o.trim().length > 2).length >= 4;
}

function isNumericOnlyOption(option: string): boolean {
  const trimmed = option.trim();
  if (!trimmed) return false;
  if (NUMERIC_ANSWER.test(trimmed)) return true;
  return /^\d+(?:\.\d+)?$/.test(trimmed);
}

function allOptionsNumericOnly(options: string[]): boolean {
  const usable = options.filter((o) => o.trim().length > 0);
  return usable.length >= 4 && usable.every(isNumericOnlyOption);
}

function isClinicalMcqStem(item: BankItem): boolean {
  const stem = resolveNaplexStem(item);
  return MCQ_LEAD_IN.test(stem) && !CALC_LEAD_IN.test(stem);
}

function isNumericAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed) return false;
  if (NUMERIC_ANSWER.test(trimmed)) return true;
  return /^\d+(?:\.\d+)?$/.test(trimmed.replace(/[^\d.]/g, ""));
}

export function isGenericBlueprintCalcStem(stem: string): boolean {
  const normalized = stem.trim();
  return GENERIC_BLUEPRINT_CALC_STEMS.some(
    (template) => normalized === template || normalized.startsWith(template.replace(/\.$/, ""))
  );
}

/** True when vignette contains enough order/dispensing data to support a calculation stem. */
export function vignetteSupportsCalculation(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item);
  if (!vignette || vignette.length < 20) return false;

  const numericAnchors =
    vignette.match(
      /\d+(?:\.\d+)?\s*(?:mg\/kg|mcg\/kg|mg\/m²|mg\/mL|mcg\/mL|mL\/hr|g\/kg|mEq\/mL|units\/mL|mg\/\d+\s*mL)/gi
    ) ?? [];
  if (numericAnchors.length >= 1) return true;

  const dosePairs =
    vignette.match(/\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL|L|units|tablets?|capsules?|mEq)/gi) ?? [];
  const hasOrder = CALC_ORDER_CONTEXT.test(vignette);
  if (hasOrder && dosePairs.length >= 2) return true;

  if (/\d+\s*(?:mg|mcg|g|mL)\b.*(?:every|q\d+h|over \d+|× \d+ day)/i.test(vignette)) return true;
  if (/(?:BSA|CrCl|ideal body weight|IBW|4-2-1|alligation|C1V1)/i.test(vignette)) return true;

  return false;
}

export function orphanGenericCalcStemIssue(item: BankItem): { codes: string[] } | null {
  const itemType = item.itemType ?? "mcq";
  if (itemType !== "constructed_response") return null;

  const stem = resolveNaplexStem(item);
  const genericStem = isGenericBlueprintCalcStem(stem);
  const calcLeadIn = CALC_LEAD_IN.test(stem);
  if (!genericStem && !calcLeadIn) return null;

  if (vignetteSupportsCalculation(item)) return null;

  const vignette = resolveNaplexVignette(item);
  const clinicalMcq =
    MCQ_CLINICAL_VIGNETTE.test(vignette) ||
    MCQ_LEAD_IN.test(vignette) ||
    (!calcLeadIn && hasMcqOptions(item));

  if (!genericStem && !clinicalMcq) return null;

  return { codes: ["naplex_orphan_calc_stem"] };
}

export function detectOrphanGenericCalcStem(item: BankItem): NaplexFormatIssue | null {
  const issue = orphanGenericCalcStemIssue(item);
  if (!issue) return null;
  return {
    code: "naplex_orphan_calc_stem",
    message:
      "Generic calculation stem is attached to a clinical vignette without calculable order data (e.g. counseling-only case).",
    severity: "error",
  };
}

function inferMcqStemFromVignette(vignette: string): string {
  const v = vignette.toLowerCase();
  if (/addiction|non-opioid|substance abuse|concern about.*(?:addict|opioid)/.test(v)) {
    return "Which alternative therapy is most appropriate?";
  }
  if (/counsel|mother asks|patient asks|counseling point/.test(v)) {
    return "Which counseling point is most important?";
  }
  if (/drug interaction|concomitant|polypharmacy/.test(v)) {
    return "Which drug interaction poses the greatest risk?";
  }
  if (/laboratory|lab value|a1c|creatinine|potassium|inr/.test(v)) {
    return "Which laboratory value warrants a therapeutic change?";
  }
  if (/monitor|follow-up|parameter/.test(v)) {
    return "Which monitoring parameter is most critical?";
  }
  if (/emergency|severe|chest pain|st-segment|st elevation/.test(v)) {
    return "What is the next best step in management?";
  }
  return "Which recommendation is most appropriate for this patient?";
}

export function detectNaplexFormatIssues(item: BankItem): NaplexFormatIssue[] {
  const issues: NaplexFormatIssue[] = [];
  const itemType = item.itemType ?? "mcq";
  const stem = resolveNaplexStem(item);
  const text = blob(item);
  const mcqStem = MCQ_LEAD_IN.test(stem);
  const calcStem = CALC_LEAD_IN.test(stem);

  const questionMarks = stem.split("?").length - 1;
  if (questionMarks > 1) {
    issues.push({
      code: "naplex_conflicting_lead_ins",
      message: "Stem contains multiple question prompts — only one lead-in is allowed.",
      severity: "error",
    });
  }

  if (
    itemType === "constructed_response" &&
    hasMcqOptions(item) &&
    !calcStem
  ) {
    issues.push({
      code: "naplex_stem_format_mismatch",
      message:
        "Calculation item uses a multiple-choice lead-in with four options — should be vignette MCQ, not numeric entry.",
      severity: "error",
    });
  } else if (
    itemType === "constructed_response" &&
    mcqStem &&
    !calcStem &&
    !hasMcqOptions(item) &&
    !isNumericAnswer(item.correctAnswer)
  ) {
    issues.push({
      code: "naplex_stem_format_mismatch",
      message:
        "Calculation item uses a multiple-choice lead-in (e.g. Which finding…) but correctAnswer is not numeric.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    calcStem &&
    isNumericAnswer(item.correctAnswer) &&
    hasMcqOptions(item) &&
    !correctAnswerMatchesOption(item.options, item.correctAnswer, itemType)
  ) {
    issues.push({
      code: "naplex_calc_stem_on_mcq",
      message: "MCQ item has a calculation lead-in and numeric correctAnswer not present in options.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    hasMcqOptions(item) &&
    item.correctAnswer.trim() &&
    !correctAnswerMatchesOption(item.options, item.correctAnswer, itemType) &&
    !item.correctAnswer.includes("|||")
  ) {
    issues.push({
      code: "naplex_mcq_missing_correct_option",
      message: "MCQ correctAnswer does not match any option — item is unscorable.",
      severity: "error",
    });
  }

  if (/enter (?:a |your )?numeric answer/i.test(text) && mcqStem && itemType !== "constructed_response") {
    issues.push({
      code: "naplex_stem_format_mismatch",
      message: "Stem embeds numeric-entry instructions alongside a multiple-choice lead-in.",
      severity: "error",
    });
  }

  if (
    (itemType === "mcq" || itemType === "vignette" || itemType === "case_based") &&
    hasMcqOptions(item) &&
    isClinicalMcqStem(item) &&
    allOptionsNumericOnly(item.options)
  ) {
    issues.push({
      code: "naplex_clinical_stem_numeric_options",
      message:
        "Clinical or counseling MCQ stem expects qualitative answer choices, but all options are bare numeric values.",
      severity: "error",
    });
  }

  const orphanCalc = detectOrphanGenericCalcStem(item);
  if (orphanCalc) issues.push(orphanCalc);

  return issues;
}

/** Hypertensive emergency vignette mis-labeled as constructed_response / numeric entry. */
function isHypertensiveEmergencyMismatch(item: BankItem): boolean {
  const text = blob(item).toLowerCase();
  return (
    (/210\s*\/\s*120|210\/120/.test(text) || /blood pressure is 2\d{2}/.test(text)) &&
    /headache/.test(text) &&
    (/blurred vision|visual/.test(text) || /amlodipine/.test(text)) &&
    (/amlodipine/.test(text) || /lisinopril/.test(text)) &&
    (MCQ_LEAD_IN.test(resolveNaplexStem(item)) ||
      /which finding requires immediate follow-up/i.test(resolveNaplexStem(item)))
  );
}

function buildHypertensiveEmergencyMcq(item: BankItem): BankItem {
  const vignette =
    resolveNaplexVignette(item) ||
    "A 40-year-old man with hypertension presents to the emergency department with sudden severe headache and blurred vision.";
  const options = [
    "Continue home antihypertensives and arrange outpatient follow-up within 1 week",
    "Give clonidine 0.2 mg orally once and discharge if blood pressure improves",
    "Start continuous IV nicardipine with a goal to lower systolic blood pressure by about 10–20% over the first hour",
    "Give IV hydralazine 20 mg bolus and target systolic blood pressure below 120 mmHg within 30 minutes",
  ] as BankItem["options"];
  const correctAnswer = options[2]!;
  return {
    ...item,
    vignette,
    scenario: vignette,
    question:
      "Which intervention is most appropriate in the emergency department at this time?",
    options,
    correctAnswer,
    explanation:
      "Correct: Start continuous IV nicardipine with a goal to lower systolic blood pressure by about 10–20% over the first hour — this is hypertensive emergency (BP ≥180/120 mmHg with symptoms suggesting acute end-organ involvement). ACC/AHA recommends parenteral therapy in a monitored setting with controlled initial reduction (~10–20% SBP in the first hour), not immediate normalization. Continue home antihypertensives alone is insufficient for symptomatic severe hypertension. Oral clonidine is not first-line for hypertensive emergency and discharge is unsafe. IV hydralazine with rapid normalization risks cerebral hypoperfusion in neurologic presentations.",
    itemType: "vignette",
    ngnPayload: undefined,
    subjectId: item.subjectId || "cardiovascular-rx",
    topicCategory: item.topicCategory ?? "Hypertensive Emergency",
  };
}

/** Pull keyed option text from constructed-response payload segments (AI calc artifacts). */
function inferCorrectFromConstructedPayload(item: BankItem): string | null {
  const payload = item.ngnPayload;
  if (!payload || payload.kind !== "constructed") return null;
  const segments = payload.segments as Array<{ text?: string }> | undefined;
  if (!Array.isArray(segments)) return null;
  for (const seg of segments) {
    const text = seg.text?.trim();
    if (!text) continue;
    const idx = indexOfMatchingOption(item.options, text);
    if (idx >= 0) return item.options[idx]!;
  }
  return null;
}

/** True when a bare integer answer is unlikely to be a real calculation result. */
function isCorruptedConstructedNumericAnswer(item: BankItem): boolean {
  const answer = item.correctAnswer.trim();
  if (!/^\d+(?:\.\d+)?$/.test(answer)) return false;
  const stem = resolveNaplexStem(item);
  if (CALC_LEAD_IN.test(stem)) return false;
  if (MCQ_LEAD_IN.test(stem) && hasMcqOptions(item)) return true;
  const n = parseFloat(answer);
  return Number.isFinite(n) && n > 0 && n <= item.options.length * 4;
}

/** Find an option whose text appears in the explanation body. */
function inferCorrectFromExplanationBody(item: BankItem): string | null {
  const explanation = item.explanation?.trim() ?? "";
  if (!explanation) return null;
  const lower = explanation.toLowerCase();
  let best: { option: string; index: number } | null = null;
  for (let i = 0; i < item.options.length; i++) {
    const option = item.options[i]!.trim();
    if (option.length < 12) continue;
    if (!lower.includes(option.toLowerCase())) continue;
    if (!best || option.length > best.option.length) {
      best = { option, index: i };
    }
  }
  return best?.option ?? null;
}

/** Match bare numeric keys (e.g. "4.5", "30") to the one option containing that value. */
function inferCorrectFromNumericInOptions(item: BankItem): string | null {
  const answer = item.correctAnswer.trim();
  if (!/^\d+(?:\.\d+)?$/.test(answer)) return null;
  const escaped = answer.replace(".", "\\.");
  const pattern = new RegExp(`\\b${escaped}\\b`);
  const matches = item.options.filter((o) => pattern.test(o));
  if (matches.length === 1) return matches[0]!;
  return null;
}

/** Match option text using dose/time phrases repeated in the explanation body. */
function inferCorrectFromExplanationContext(item: BankItem): string | null {
  const explanation = item.explanation?.trim().toLowerCase() ?? "";
  if (explanation.length < 40) return null;

  type Scored = { option: string; score: number };
  const scored: Scored[] = item.options.map((option) => {
    const words = option
      .toLowerCase()
      .split(/[^a-z0-9%/]+/)
      .filter((w) => w.length > 2);
    const score = words.reduce((sum, word) => sum + (explanation.includes(word) ? 1 : 0), 0);
    return { option, score };
  });

  const best = scored.reduce<Scored | null>(
    (acc, row) => (!acc || row.score > acc.score ? row : acc),
    null
  );
  if (!best || best.score < 3) return null;

  const tied = scored.filter((row) => row.score === best.score);
  return tied.length === 1 ? tied[0]!.option : null;
}

/** Recover schedule answers corrupted into one integer (e.g. 12512 → 125 mg q12h). */
function inferCorrectFromConcatenatedSchedule(item: BankItem): string | null {
  const answer = item.correctAnswer.trim();
  if (!/^\d{4,6}$/.test(answer)) return null;
  for (const option of item.options) {
    const digits = option.replace(/\D/g, "");
    if (digits && answer.includes(digits) && digits.length >= 3) return option;
  }
  return null;
}

/** Last resort: small integer keys may be 1-based option indices from bad generation. */
function inferCorrectFromOptionIndex(item: BankItem): string | null {
  const n = parseInt(item.correctAnswer.trim(), 10);
  if (!Number.isFinite(n) || n < 1 || n > item.options.length) return null;
  if (item.options.length !== 4) return null;
  // Only when the stored answer is a single digit index, not a clinical quantity.
  if (!/^[1-4]$/.test(item.correctAnswer.trim())) return null;
  return item.options[n - 1] ?? null;
}

function resolveMcqCorrectAnswer(item: BankItem): string | null {
  const options = item.options;
  const stored = item.correctAnswer.trim();

  if (correctAnswerMatchesOption(options, stored, "mcq")) {
    const idx = indexOfMatchingOption(options, stored);
    return idx >= 0 ? options[idx]! : stored;
  }

  if (isCorruptedConstructedNumericAnswer(item)) {
    const fromNumericOption = inferCorrectFromNumericInOptions(item);
    if (fromNumericOption) return fromNumericOption;

    const fromIndex = inferCorrectFromOptionIndex(item);
    if (fromIndex) return fromIndex;
  } else if (isNumericAnswer(stored) && CALC_LEAD_IN.test(resolveNaplexStem(item))) {
    return null;
  }

  const fromExplanation = extractExplanationCorrectText(item.explanation ?? "");
  if (fromExplanation) {
    const idx = indexOfMatchingOption(options, fromExplanation);
    if (idx >= 0) return options[idx]!;
  }

  const fromWrongSection = inferCorrectFromWrongOptionsSection(options, item.explanation ?? "");
  if (fromWrongSection) return fromWrongSection;

  const fromPriority = inferCorrectFromExplanationRecommendation(options, item.explanation ?? "");
  if (fromPriority) return fromPriority;

  const fromBody = inferCorrectFromExplanationBody(item);
  if (fromBody) return fromBody;

  const fromNumericOption = inferCorrectFromNumericInOptions(item);
  if (fromNumericOption) return fromNumericOption;

  const fromPayload = inferCorrectFromConstructedPayload(item);
  if (fromPayload) return fromPayload;

  const fromDistractors = inferCorrectFromDistractors(options, item.distractorRationale);
  if (fromDistractors) return fromDistractors;

  const fromContext = inferCorrectFromExplanationContext(item);
  if (fromContext) return fromContext;

  const fromSchedule = inferCorrectFromConcatenatedSchedule(item);
  if (fromSchedule) return fromSchedule;

  const fromIndex = inferCorrectFromOptionIndex(item);
  if (fromIndex) return fromIndex;

  return null;
}

function reclassifyConstructedToMcq(item: BankItem): BankItem | null {
  if (!hasMcqOptions(item)) return null;

  const resolved = resolveMcqCorrectAnswer(item);
  if (!resolved) return null;

  const withoutCalcPayload =
    item.ngnPayload?.kind === "constructed"
      ? { ...item, ngnPayload: undefined }
      : item;

  return {
    ...withoutCalcPayload,
    itemType: "vignette",
    options: item.options,
    correctAnswer: resolved,
  };
}

function reclassifyMcqToConstructed(item: BankItem): BankItem | null {
  const numeric = item.correctAnswer.replace(/[^\d.]/g, "").replace(/^\.+|\.+$/g, "").trim();
  if (!/\d/.test(numeric)) return null;
  const unitMatch = item.correctAnswer.match(/\b(mg|mcg|g|mL|mL\/hr|mEq|units|%|tablets|capsules)\b/i);
  const unit = unitMatch?.[1] ?? "mg";
  return {
    ...item,
    itemType: "constructed_response",
    options: [],
    correctAnswer: numeric,
    ngnPayload: { kind: "constructed", unit },
  };
}

function stripConflictingLeadIns(item: BankItem): BankItem | null {
  const stem = resolveNaplexStem(item);
  if ((stem.split("?").length - 1) <= 1) return null;

  const parts = stem
    .split("?")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;

  const kept =
    parts.find((p) => MCQ_LEAD_IN.test(p) || CALC_LEAD_IN.test(p)) ??
    parts[parts.length - 1];
  const question = `${kept}?`.replace(/\?\?$/, "?");
  return { ...item, question };
}

export type NaplexFormatFixResult = {
  item: BankItem;
  changed: boolean;
  note?: string;
};

/** Rule-based repairs for stem/format/answer alignment defects. */
export function fixNaplexFormatCoherence(item: BankItem): NaplexFormatFixResult {
  let working = { ...item };
  let changed = false;
  let note: string | undefined;

  const beforeIssues = detectNaplexFormatIssues(working);
  if (beforeIssues.length === 0) {
    return { item: working, changed: false };
  }

  const stripped = stripConflictingLeadIns(working);
  if (stripped) {
    working = stripped;
    changed = true;
    note = "removed conflicting lead-ins";
  }

  if (isHypertensiveEmergencyMismatch(working)) {
    working = buildHypertensiveEmergencyMcq(working);
    changed = true;
    note = "rewrote hypertensive emergency as MCQ";
    return { item: working, changed, note };
  }

  const clinicalNumeric = repairClinicalNumericMismatch(working);
  if (clinicalNumeric.changed) {
    working = clinicalNumeric.item;
    changed = true;
    note = clinicalNumeric.note;
  }

  if (orphanGenericCalcStemIssue(working)) {
    const vignette = resolveNaplexVignette(working) || working.vignette || working.scenario || "";
    const mcqStem = inferMcqStemFromVignette(vignette);
    if (hasMcqOptions(working)) {
      const mcq = reclassifyConstructedToMcq({
        ...working,
        question: mcqStem,
        ngnPayload: working.ngnPayload?.kind === "constructed" ? undefined : working.ngnPayload,
      });
      if (mcq) {
        working = mcq;
        changed = true;
        note = "repaired orphan calc stem → clinical vignette MCQ";
      }
    }
  }

  const itemType = working.itemType ?? "mcq";
  if (itemType === "constructed_response" && hasMcqOptions(working)) {
    const mcq = reclassifyConstructedToMcq(working);
    if (mcq) {
      working = mcq;
      changed = true;
      note = "reclassified constructed_response → vignette MCQ";
    }
  }

  if (
    (working.itemType === "mcq" || working.itemType === "vignette") &&
    CALC_LEAD_IN.test(resolveNaplexStem(working)) &&
    isNumericAnswer(working.correctAnswer) &&
    !correctAnswerMatchesOption(working.options, working.correctAnswer, working.itemType)
  ) {
    const calc = reclassifyMcqToConstructed(working);
    if (calc) {
      working = calc;
      changed = true;
      note = "reclassified MCQ → constructed_response calculation";
    }
  }

  const aligned = alignNaplexBankItemAnswers(working);
  if (aligned.changed) {
    working = aligned.item;
    changed = true;
    note = note ? `${note}; ${aligned.note}` : aligned.note;
  }

  return { item: working, changed, note };
}

export function itemHasFormatCoherenceIssue(item: BankItem): boolean {
  return detectNaplexFormatIssues(item).length > 0 || orphanGenericCalcStemIssue(item) !== null;
}

/** Full prep pipeline for serve/timed exams: format repair then answer alignment. */
export function prepareNaplexBankItem(item: BankItem): BankItem {
  const formatFixed = fixNaplexFormatCoherence(item);
  const aligned = alignNaplexBankItemAnswers(formatFixed.item);
  return aligned.item;
}
