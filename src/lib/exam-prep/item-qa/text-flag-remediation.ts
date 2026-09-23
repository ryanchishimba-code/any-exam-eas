/**
 * Classify active Item QA text flags and plan the safe write.
 *
 * Dry-run listing is the default. The only writes are:
 * - retire: active=false for an unrepairable stem or a row that is not a question
 * - clear: drop a text flag the lint no longer supports
 *
 * Choice text is never rewritten here. A high-confidence completion is reported
 * as fix_content and left in the queue. Near-duplicate rows are left alone.
 */
import {
  ITEM_QA_PIPELINE,
  NEAR_DUPLICATE_CODE,
  readItemQaRecord,
  withItemQaRecord,
  type ItemQaRecord,
  type ItemQaRetiredReason,
} from "./flag";
import { studentFacingChoiceTexts, structuredNgnChoiceTexts, optionsAreLetterPlaceholders } from "./text-choices";
import { choiceTextDefect, stemIsTooShort } from "./text-lint";

export const TEXT_FLAG_CODES = [
  "truncated_option",
  "empty_stem",
  "letter_only_option",
  "empty_option",
] as const;

export type TextFlagCode = (typeof TEXT_FLAG_CODES)[number];

export type TextRetireReason = Exclude<ItemQaRetiredReason, "near_duplicate">;

export type TextFlagAction = "retire" | "fix_content" | "clear_false_positive" | "needs_human";

const TEXT_CODE_SET = new Set<string>(TEXT_FLAG_CODES);

const RETIRE_REASON_ORDER: readonly TextRetireReason[] = [
  "empty_stem",
  "letter_only_option",
  "empty_option",
  "truncated_option",
];

const DANGLING_TAIL = /(?:^|\s)(?:and|or|the|a|an|to|of|with|for)\s*$/i;

export type TextFlagBankRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  itemType: string | null;
  active: boolean;
  qaPassed: boolean;
  reviewFlag: boolean | null;
  reviewStatus: string | null;
  stem: string;
  scenario: string | null;
  options: readonly string[];
  ngnPayload?: unknown;
  correctAnswer: string;
  explanation: string;
  curationMeta: unknown;
};

export type TextFlagProposedFix = {
  option: string;
  completion: string;
};

export type TextFlagClassification = {
  action: TextFlagAction;
  reason: string;
  /** Stored text codes this row was queued for. */
  textCodes: TextFlagCode[];
  /** Choice strings the stored flag was reacting to. */
  triggeringOptions: string[];
  /** Choices a student sees. Letter placeholders are replaced when NGN text is real. */
  studentFacingChoices: string[];
  retireReason?: TextRetireReason;
  proposedFixes: TextFlagProposedFix[];
};

export type TextFlagPlanItem = TextFlagClassification & {
  id: string;
  fieldId: string;
  subjectId: string;
  itemType: string | null;
  qaPassed: boolean;
  reviewStatus: string | null;
  stemPreview: string;
  scenarioPreview: string;
  summary: string;
};

export type TextFlagSkipReason = "inactive" | "other_field" | "not_flagged" | "no_text_code";

export type TextFlagSkip = {
  id: string;
  reason: TextFlagSkipReason;
};

export type TextFlagRemediationPlan = {
  fieldId: string;
  retire: TextFlagPlanItem[];
  clear: TextFlagPlanItem[];
  fixContent: TextFlagPlanItem[];
  needsHuman: TextFlagPlanItem[];
  skipped: TextFlagSkip[];
  /** Flagged rows that are not these text codes. Near-duplicates stay in this count. */
  leftInQueue: number;
  /** Retired rows that currently count in the public inventory (qaPassed). */
  publishedInventoryDrop: number;
};

function textCodesOf(codes: readonly string[]): TextFlagCode[] {
  return codes.filter((code): code is TextFlagCode => TEXT_CODE_SET.has(code));
}

function preview(text: string, max = 180): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function triggeringOptionTexts(options: readonly string[]): string[] {
  return options.filter((option) => {
    if (choiceTextDefect(option)) return true;
    return DANGLING_TAIL.test(option.trim());
  });
}

function hopelessChoice(option: string): boolean {
  const defect = choiceTextDefect(option);
  if (defect === "empty_option" || defect === "letter_only_option") return true;
  if (defect === "truncated_option" && option.trim().length <= 1) return true;
  return false;
}

function retireReasonForHopeless(options: readonly string[]): TextRetireReason {
  const defects = options.map((option) => choiceTextDefect(option));
  if (defects.every((defect) => defect === "letter_only_option")) return "letter_only_option";
  if (defects.every((defect) => defect === "empty_option")) return "empty_option";
  return "truncated_option";
}

function truncationPrefix(option: string): string | null {
  const trimmed = option.trim();
  const withoutEllipsis = trimmed.replace(/(?:\.{3}|…)\s*$/u, "").trim();
  if (withoutEllipsis !== trimmed) return withoutEllipsis.length >= 8 ? withoutEllipsis : null;
  if (choiceTextDefect(trimmed) !== "truncated_option") return null;
  if (/[([]\s*$/.test(trimmed) || trimmed.length < 8) return null;
  return trimmed;
}

function uniqueCompletion(prefix: string, corpus: string): string | null {
  const needle = prefix.trim();
  if (needle.length < 8 || !corpus.trim()) return null;
  const haystack = corpus.toLowerCase();
  const look = needle.toLowerCase();
  const found: string[] = [];
  let from = 0;
  while (from < haystack.length) {
    const at = haystack.indexOf(look, from);
    if (at < 0) break;
    const extra = corpus.slice(at + needle.length).match(/^[^.?\n]{1,120}/);
    if (extra?.[0]) {
      const completion = `${corpus.slice(at, at + needle.length)}${extra[0]}`.trim();
      if (completion.length > needle.length && !choiceTextDefect(completion)) found.push(completion);
    }
    from = at + Math.max(needle.length, 1);
  }
  const unique = [...new Set(found)];
  return unique.length === 1 ? unique[0]! : null;
}

function completionCorpus(row: Pick<TextFlagBankRow, "explanation" | "correctAnswer" | "scenario">): string {
  return [row.explanation, row.correctAnswer, row.scenario ?? ""].filter(Boolean).join("\n");
}

export function classifyTextFlagItem(
  row: Pick<
    TextFlagBankRow,
    "stem" | "scenario" | "options" | "ngnPayload" | "correctAnswer" | "explanation" | "curationMeta"
  >
): TextFlagClassification | null {
  const record = readItemQaRecord(row.curationMeta);
  if (!record) return null;
  const textCodes = textCodesOf(record.codes);
  if (!textCodes.length) return null;

  const studentFacingChoices = studentFacingChoiceTexts({
    options: row.options,
    ngnPayload: row.ngnPayload,
  });
  const triggeringOptions = triggeringOptionTexts(row.options);
  const base = {
    textCodes,
    triggeringOptions,
    studentFacingChoices,
    proposedFixes: [] as TextFlagProposedFix[],
  };

  if (record.codes.includes(NEAR_DUPLICATE_CODE)) {
    return {
      ...base,
      action: "needs_human",
      reason: "Also queued as a near-duplicate. This tool does not change near-duplicate rows.",
    };
  }

  const otherCodes = record.codes.filter((code) => code !== NEAR_DUPLICATE_CODE && !TEXT_CODE_SET.has(code));
  if (otherCodes.length) {
    return {
      ...base,
      action: "needs_human",
      reason: `Other Item QA codes stay on the row (${otherCodes.join(", ")}).`,
    };
  }

  if (stemIsTooShort(row.stem)) {
    const shown = preview(row.stem, 40) || "(blank)";
    return {
      ...base,
      action: "retire",
      retireReason: "empty_stem",
      reason: `Stem is too short to be a question ("${shown}"). It is not rewritten from the scenario.`,
    };
  }

  const defective = studentFacingChoices.filter((option) => choiceTextDefect(option));
  if (!defective.length) {
    const structured = structuredNgnChoiceTexts(row.ngnPayload);
    const reason = optionsAreLetterPlaceholders(row.options) && structured.length >= 2
      ? "Letter placeholders are not the student-facing choices. The structured choices are complete."
      : triggeringOptions.some((option) => DANGLING_TAIL.test(option.trim()))
        ? "Choice text is complete. A trailing function word such as \"watch for\" is not a cut-off."
        : "Stored text flag does not match the current text lint.";
    return { ...base, action: "clear_false_positive", reason };
  }

  if (studentFacingChoices.length > 0 && studentFacingChoices.every(hopelessChoice)) {
    const retireReason = retireReasonForHopeless(studentFacingChoices);
    return {
      ...base,
      action: "retire",
      retireReason,
      reason:
        retireReason === "letter_only_option"
          ? "Every choice is only a letter and there is no structured question text."
          : "Every choice is empty or a single character. This is not a question.",
    };
  }

  const corpus = completionCorpus(row);
  const proposedFixes: TextFlagProposedFix[] = [];
  for (const option of defective) {
    const defect = choiceTextDefect(option);
    if (defect !== "truncated_option") {
      return {
        ...base,
        action: "needs_human",
        reason: "A choice is missing or letter-only beside real answer text. A person needs to write it.",
      };
    }
    const prefix = truncationPrefix(option);
    const completion = prefix ? uniqueCompletion(prefix, corpus) : null;
    if (!prefix || !completion) {
      return {
        ...base,
        action: "needs_human",
        reason: "Cut-off choice text is not uniquely recoverable from the rationale.",
      };
    }
    proposedFixes.push({ option, completion });
  }

  return {
    ...base,
    action: "fix_content",
    proposedFixes,
    reason: "Cut-off choice text has one completion in the rationale. This tool does not write it.",
  };
}

function planItem(row: TextFlagBankRow, classification: TextFlagClassification): TextFlagPlanItem {
  const record = readItemQaRecord(row.curationMeta);
  return {
    ...classification,
    id: row.id,
    fieldId: row.fieldId,
    subjectId: row.subjectId,
    itemType: row.itemType,
    qaPassed: row.qaPassed,
    reviewStatus: row.reviewStatus,
    stemPreview: preview(row.stem),
    scenarioPreview: preview(row.scenario ?? ""),
    summary: record?.summary ?? "",
  };
}

export function planTextFlagRemediation(input: {
  fieldId: string;
  rows: readonly TextFlagBankRow[];
}): TextFlagRemediationPlan {
  const retire: TextFlagPlanItem[] = [];
  const clear: TextFlagPlanItem[] = [];
  const fixContent: TextFlagPlanItem[] = [];
  const needsHuman: TextFlagPlanItem[] = [];
  const skipped: TextFlagSkip[] = [];
  let leftInQueue = 0;

  for (const row of input.rows) {
    if (row.fieldId !== input.fieldId) {
      skipped.push({ id: row.id, reason: "other_field" });
      continue;
    }
    if (!row.active) {
      skipped.push({ id: row.id, reason: "inactive" });
      continue;
    }
    if (row.reviewFlag !== true) {
      skipped.push({ id: row.id, reason: "not_flagged" });
      continue;
    }
    const record = readItemQaRecord(row.curationMeta);
    if (!record) {
      leftInQueue += 1;
      continue;
    }
    if (!textCodesOf(record.codes).length) {
      leftInQueue += 1;
      continue;
    }
    const classification = classifyTextFlagItem(row);
    if (!classification) {
      leftInQueue += 1;
      continue;
    }
    const item = planItem(row, classification);
    if (item.action === "retire") retire.push(item);
    else if (item.action === "clear_false_positive") clear.push(item);
    else if (item.action === "fix_content") fixContent.push(item);
    else needsHuman.push(item);
  }

  const byId = (a: TextFlagPlanItem, b: TextFlagPlanItem) => a.id.localeCompare(b.id);
  retire.sort(byId);
  clear.sort(byId);
  fixContent.sort(byId);
  needsHuman.sort(byId);
  skipped.sort((a, b) => a.id.localeCompare(b.id) || a.reason.localeCompare(b.reason));

  return {
    fieldId: input.fieldId,
    retire,
    clear,
    fixContent,
    needsHuman,
    skipped,
    leftInQueue,
    publishedInventoryDrop: retire.filter((item) => item.qaPassed).length,
  };
}

function primaryRetireReason(item: Pick<TextFlagClassification, "retireReason" | "textCodes">): TextRetireReason {
  if (item.retireReason && RETIRE_REASON_ORDER.includes(item.retireReason)) return item.retireReason;
  for (const reason of RETIRE_REASON_ORDER) {
    if (item.textCodes.includes(reason)) return reason;
  }
  return "truncated_option";
}

/**
 * Columns the retire path is allowed to write. qaPassed is intentionally absent.
 * Text codes are removed. Any other code, including near_duplicate, stays.
 */
export function textFlagRetireWrite(input: {
  curationMeta: unknown;
  retiredAt: string;
  retiredReason: TextRetireReason;
}): { active: false; reviewFlag: boolean; curationMeta: Record<string, unknown> } | null {
  const record = readItemQaRecord(input.curationMeta);
  if (!record || !textCodesOf(record.codes).length) return null;
  if (!RETIRE_REASON_ORDER.includes(input.retiredReason)) return null;
  const remaining = record.codes.filter((code) => !TEXT_CODE_SET.has(code));
  const summary = remaining.length
    ? `Retired for ${input.retiredReason}. Remaining item QA: ${remaining.join(", ")}.`
    : `Retired for ${input.retiredReason}.`;
  const next: ItemQaRecord = {
    pipeline: ITEM_QA_PIPELINE,
    checkedAt: record.checkedAt,
    codes: remaining,
    summary,
    ...(record.partnerId ? { partnerId: record.partnerId } : {}),
    retiredAt: input.retiredAt,
    retiredReason: input.retiredReason,
  };
  return {
    active: false,
    reviewFlag: remaining.length > 0,
    curationMeta: withItemQaRecord(input.curationMeta, next),
  };
}

/**
 * Drop text codes after the lint agrees the choice text is fine.
 * Does not change active or qaPassed. A near-duplicate code is left in place.
 */
export function textFlagClearWrite(input: {
  curationMeta: unknown;
}): { reviewFlag: boolean; curationMeta: Record<string, unknown> } | null {
  const record = readItemQaRecord(input.curationMeta);
  if (!record || !textCodesOf(record.codes).length) return null;
  const remaining = record.codes.filter((code) => !TEXT_CODE_SET.has(code));
  if (!remaining.length) {
    return {
      reviewFlag: false,
      curationMeta: withItemQaRecord(input.curationMeta, null),
    };
  }
  const next: ItemQaRecord = {
    pipeline: ITEM_QA_PIPELINE,
    checkedAt: record.checkedAt,
    codes: remaining,
    summary: `Cleared false-positive text flags. Remaining item QA: ${remaining.join(", ")}.`,
    ...(record.partnerId ? { partnerId: record.partnerId } : {}),
    ...(record.retiredAt ? { retiredAt: record.retiredAt } : {}),
    ...(record.retiredReason ? { retiredReason: record.retiredReason } : {}),
  };
  return {
    reviewFlag: true,
    curationMeta: withItemQaRecord(input.curationMeta, next),
  };
}

export function textFlagRetireReason(item: Pick<TextFlagClassification, "retireReason" | "textCodes">): TextRetireReason {
  return primaryRetireReason(item);
}
