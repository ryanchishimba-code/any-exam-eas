import type { BankItem } from "@/lib/question-bank";
import { cleanOptionText, selectAllAnswersMatchOptions } from "@/lib/question-format";
import { itemTypeToNgnFormat } from "./ngn-bank-bridge";

const NGN_ITEM_TYPES = new Set([
  "ngn_bowtie",
  "bow_tie",
  "ngn_matrix",
  "matrix",
  "select_all",
  "sata",
  "ordered_response",
  "ngn_highlight",
  "highlight",
  "unfolding_case",
  "case_study",
  "drag_drop",
]);

function norm(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function splitMatrixPairs(correctAnswer: string): string[] {
  return correctAnswer
    .split(/,(?=[^,]+\|\|\|)/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitCompositeAnswer(correctAnswer: string): string[] {
  const trimmed = correctAnswer.trim();
  if (!trimmed) return [];
  if (trimmed.includes("|||")) {
    return trimmed
      .split("|||")
      .map((part) => cleanOptionText(part.trim()))
      .filter(Boolean);
  }
  return trimmed
    .split(",")
    .map((part) => cleanOptionText(part.trim()))
    .filter(Boolean);
}

export function isNclexNgnItem(item: BankItem): boolean {
  const itemType = item.itemType ?? "mcq";
  if (NGN_ITEM_TYPES.has(itemType)) return true;
  const kind = item.ngnPayload?.kind;
  return typeof kind === "string" && NGN_ITEM_TYPES.has(kind);
}

/** Real selectable strings for SATA / ordered-response items stored with A–D placeholders. */
export function resolveNclexNgnSelectableOptions(item: BankItem): string[] | null {
  const payload = item.ngnPayload;
  if (!payload) return null;

  if (Array.isArray(payload.options) && payload.options.length >= 3) {
    return payload.options.map(String);
  }

  const kind = String(payload.kind ?? item.itemType ?? "");
  if (kind === "bow_tie" || item.itemType === "ngn_bowtie") {
    const actions = Array.isArray(payload.actions) ? payload.actions.map(String) : [];
    const monitors = Array.isArray(payload.monitors) ? payload.monitors.map(String) : [];
    const combined = [...actions, ...monitors];
    return combined.length > 0 ? combined : null;
  }

  if (kind === "matrix" || item.itemType === "ngn_matrix") {
    const rows = Array.isArray(payload.rows) ? payload.rows.map(String) : [];
    const columns = Array.isArray(payload.columns) ? payload.columns.map(String) : [];
    if (rows.length === 0 || columns.length === 0) return null;
    return rows.flatMap((row) => columns.map((column) => `${row}|||${column}`));
  }

  if (kind === "highlight" || item.itemType === "ngn_highlight") {
    if (Array.isArray(payload.highlights)) return payload.highlights.map(String);
    if (typeof payload.text === "string") return [payload.text];
  }

  return null;
}

function validateBowTieAnswer(item: BankItem): boolean {
  const payload = item.ngnPayload ?? {};
  const actions = Array.isArray(payload.actions) ? payload.actions.map(String) : [];
  const monitors = Array.isArray(payload.monitors) ? payload.monitors.map(String) : [];
  const parts = splitCompositeAnswer(item.correctAnswer);
  if (parts.length < 3 || actions.length === 0 || monitors.length === 0) return false;

  const actionOk = actions.some((action) => norm(action) === norm(parts[0]!));
  const monitorOk = parts.slice(1).every((part) => monitors.some((monitor) => norm(monitor) === norm(part)));
  return actionOk && monitorOk;
}

function validateMatrixAnswer(item: BankItem): boolean {
  const payload = item.ngnPayload ?? {};
  const rows = Array.isArray(payload.rows) ? payload.rows.map(String) : [];
  const columns = Array.isArray(payload.columns) ? payload.columns.map(String) : [];
  if (rows.length === 0 || columns.length === 0) return false;

  const pairs = splitMatrixPairs(item.correctAnswer);
  if (pairs.length < 2) return false;

  return pairs.every((pair) => {
    const [row, column] = pair.includes("|||") ? pair.split("|||") : [pair, ""];
    const rowOk = rows.some((candidate) => norm(candidate) === norm(row.trim()));
    const columnOk = columns.some((candidate) => norm(candidate) === norm((column ?? "").trim()));
    return rowOk && columnOk;
  });
}

function validateHighlightAnswer(item: BankItem): boolean {
  const payload = item.ngnPayload ?? {};
  const highlights = Array.isArray(payload.highlights) ? payload.highlights.map(String) : [];
  const parts = splitCompositeAnswer(item.correctAnswer);
  if (parts.length === 0) return false;
  if (highlights.length === 0) return parts.length >= 1;

  return parts.every((part) =>
    highlights.some((highlight) => {
      const partNorm = norm(part);
      const highlightNorm = norm(highlight);
      return partNorm === highlightNorm || highlightNorm.includes(partNorm) || partNorm.includes(highlightNorm);
    })
  );
}

function validateOrderedResponseAnswer(item: BankItem, options: string[]): boolean {
  const parts = splitCompositeAnswer(item.correctAnswer);
  if (parts.length < 2) return false;
  const optionKeys = new Set(options.map(norm));
  return parts.every((part) => optionKeys.has(norm(part)));
}

/** Validate NGN stored answers against payload structure instead of A–D placeholders. */
export function nclexNgnCorrectAnswerValid(item: BankItem): boolean {
  if (!isNclexNgnItem(item)) return false;

  const kind = String(item.ngnPayload?.kind ?? itemTypeToNgnFormat(item.itemType) ?? item.itemType ?? "");
  const correctAnswer = item.correctAnswer?.trim() ?? "";
  if (!correctAnswer) return false;

  // Unfolding case steps are single-best-answer MCQs even when itemType is case_study.
  if (
    item.itemType === "case_study" ||
    item.itemType === "unfolding_case" ||
    kind === "case_study" ||
    kind === "unfolding_case"
  ) {
    const options = (item.options ?? []).map(String);
    if (options.length < 2) return false;
    return options.some((option) => norm(option) === norm(correctAnswer));
  }

  if (kind === "bow_tie" || item.itemType === "ngn_bowtie") {
    return validateBowTieAnswer(item);
  }

  if (kind === "matrix" || item.itemType === "ngn_matrix") {
    return validateMatrixAnswer(item);
  }

  if (kind === "highlight" || item.itemType === "ngn_highlight") {
    return validateHighlightAnswer(item);
  }

  const selectable = resolveNclexNgnSelectableOptions(item);
  if (!selectable || selectable.length === 0) {
    // SATA / ordered without payload.options: fall back to item.options.
    if (
      (kind === "select_all" || item.itemType === "select_all" || item.itemType === "sata") &&
      (item.options?.length ?? 0) >= 3
    ) {
      return selectAllAnswersMatchOptions(item.options, correctAnswer);
    }
    if (
      (kind === "ordered_response" || item.itemType === "ordered_response") &&
      (item.options?.length ?? 0) >= 3
    ) {
      return validateOrderedResponseAnswer(item, item.options.map(String));
    }
    return false;
  }

  if (kind === "select_all" || item.itemType === "select_all" || item.itemType === "sata") {
    return selectAllAnswersMatchOptions(selectable, correctAnswer);
  }

  if (kind === "ordered_response" || item.itemType === "ordered_response") {
    return validateOrderedResponseAnswer(item, selectable);
  }

  return false;
}

export function shouldSkipMcqCorrectAnswerCheck(item: BankItem): boolean {
  return isNclexNgnItem(item) && nclexNgnCorrectAnswerValid(item);
}

/** Remove duplicated vignette text from the stored question column. */
export function splitNclexDuplicateVignette(item: BankItem): BankItem | null {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  const question = item.question?.trim() ?? "";
  if (!vignette || !question) return null;

  if (question.startsWith(vignette)) {
    const stem = question.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
    if (!stem || stem === question) return null;
    return { ...item, vignette, scenario: vignette, question: stem };
  }

  if (question.includes("\n\n")) {
    const [head, ...rest] = question.split("\n\n");
    const stem = rest.join("\n\n").trim();
    if (head?.trim() === vignette && stem) {
      return { ...item, vignette, scenario: vignette, question: stem };
    }
  }

  return null;
}
