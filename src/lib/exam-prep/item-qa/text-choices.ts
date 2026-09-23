/**
 * Choice strings text lint should judge.
 *
 * Structured NGN rows store the real bow-tie, matrix, or highlight choices
 * beside a letter placeholder list (`A`–`D`). Students see the structured
 * choices. Linting the placeholders reports a cut-off that is not on the item.
 */
import { choiceTextDefect } from "./text-lint";

function choiceStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry).trim()).filter(Boolean);
}

export function optionsAreLetterPlaceholders(options: readonly string[]): boolean {
  const present = options.map((option) => option.trim()).filter(Boolean);
  return present.length >= 3 && present.every((option) => choiceTextDefect(option) === "letter_only_option");
}

/** Actions, monitors, matrix rows/columns, or highlight phrases. Empty when absent. */
export function structuredNgnChoiceTexts(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const record = payload as Record<string, unknown>;
  const kind = typeof record.kind === "string" ? record.kind : "";
  if (kind === "bow_tie") return [...choiceStrings(record.actions), ...choiceStrings(record.monitors)];
  if (kind === "matrix") return [...choiceStrings(record.rows), ...choiceStrings(record.columns)];
  if (kind === "highlight") {
    const highlights = choiceStrings(record.highlights);
    if (highlights.length) return highlights;
    const text = typeof record.text === "string" ? record.text.trim() : "";
    return text ? [text] : [];
  }
  return [];
}

export function studentFacingChoiceTexts(input: {
  options: readonly string[];
  ngnPayload?: unknown;
}): string[] {
  const structured = structuredNgnChoiceTexts(input.ngnPayload);
  if (optionsAreLetterPlaceholders(input.options) && structured.length >= 2) return structured;
  return [...input.options];
}
