import type { BankItem } from "@/lib/question-bank";
import {
  alignNaplexBankItemAnswers,
  correctAnswerMatchesOption,
  extractExplanationCorrectText,
  indexOfMatchingOption,
  inferCorrectFromDistractors,
} from "./naplex-answer-align";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";

export type NaplexFormatIssue = {
  code:
    | "naplex_stem_format_mismatch"
    | "naplex_conflicting_lead_ins"
    | "naplex_mcq_missing_correct_option"
    | "naplex_calc_stem_on_mcq";
  message: string;
  severity: "error";
};

const MCQ_LEAD_IN =
  /\b(?:which (?:finding|action|medication|intervention|recommendation|counseling|monitoring|drug|alternative|statement|laboratory)|what is the (?:most|best|priority)|most appropriate|best choice|best next|select all|which of the following)\b/i;

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

function isNumericAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed) return false;
  if (NUMERIC_ANSWER.test(trimmed)) return true;
  return /^\d+(?:\.\d+)?$/.test(trimmed.replace(/[^\d.]/g, ""));
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
    mcqStem &&
    !calcStem &&
    hasMcqOptions(item)
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
    // Ignore slot-index artifacts like "12" on a 4-option counseling item.
  } else if (isNumericAnswer(stored) && CALC_LEAD_IN.test(resolveNaplexStem(item))) {
    return null;
  }

  const fromExplanation = extractExplanationCorrectText(item.explanation ?? "");
  if (fromExplanation) {
    const idx = indexOfMatchingOption(options, fromExplanation);
    if (idx >= 0) return options[idx]!;
  }

  const fromBody = inferCorrectFromExplanationBody(item);
  if (fromBody) return fromBody;

  const fromNumericOption = inferCorrectFromNumericInOptions(item);
  if (fromNumericOption) return fromNumericOption;

  const fromPayload = inferCorrectFromConstructedPayload(item);
  if (fromPayload) return fromPayload;

  const fromDistractors = inferCorrectFromDistractors(options, item.distractorRationale);
  if (fromDistractors) return fromDistractors;

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
  return detectNaplexFormatIssues(item).length > 0;
}
