import { selectionForGrading } from "@/lib/full-exam/answer-serialize";
import { parseMatrixKey } from "@/lib/questions/ngn-structures";

export type NgnReviewLine = {
  /** Row label for matrix / drag-drop prompts; empty for flat lists. */
  label: string;
  yourText: string;
  correctText: string;
  match: boolean;
};

const PIPE_FORMATS = new Set([
  "matrix",
  "drag_drop",
  "highlight",
  "ordered_response",
  "select_all",
  "bow_tie",
  "dropdown",
  "ngn_matrix",
  "ngn_highlight",
  "ngn_dropdown",
]);

function storageKind(ngnFormat?: string): string {
  const key = (ngnFormat ?? "").trim().toLowerCase();
  if (key === "ngn_matrix" || key === "matrix") return "matrix";
  if (key === "ngn_highlight" || key === "highlight") return "highlight";
  if (key === "ngn_dropdown" || key === "dropdown") return "dropdown";
  return key;
}

function partsForReview(stored: string, ngnFormat?: string): string[] {
  const trimmed = stored.trim();
  if (!trimmed) return [];
  const kind = storageKind(ngnFormat);
  if (kind === "matrix" || trimmed.includes(";;") || trimmed.startsWith("[")) {
    return selectionForGrading("matrix", trimmed);
  }
  if (kind === "drag_drop") {
    if (trimmed.includes(";;")) {
      return trimmed.split(";;").map((part) => part.trim()).filter(Boolean);
    }
    const parts = trimmed
      .split("|||")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 2 && parts.length % 2 === 0) {
      const cells: string[] = [];
      for (let i = 0; i < parts.length; i += 2) {
        cells.push(`${parts[i]}|||${parts[i + 1]}`);
      }
      return cells;
    }
    return parts;
  }
  if (kind === "highlight" || kind === "ordered_response" || kind === "dropdown") {
    return selectionForGrading(kind, trimmed);
  }
  if (kind === "bow_tie" || kind === "select_all") {
    return selectionForGrading(kind, trimmed);
  }
  if (trimmed.includes("|||")) {
    return selectionForGrading("select_all", trimmed);
  }
  return [trimmed];
}

function formatPart(part: string, ngnFormat?: string): string {
  const kind = storageKind(ngnFormat);
  if (part.includes("|||")) {
    const { row, col } = parseMatrixKey(part);
    if (row && col) return `${row} → ${col}`;
  }
  if (kind === "ordered_response") return part;
  return part;
}

/** Whether post-exam review should use structured NGN rows instead of option chips. */
export function shouldUseNgnReviewDisplay(input: {
  ngnFormat?: string;
  optionsLength: number;
  selected?: string;
  correctAnswer?: string;
}): boolean {
  const kind = storageKind(input.ngnFormat);
  if (kind && PIPE_FORMATS.has(kind) && kind !== "bow_tie") return true;
  const stored = `${input.selected ?? ""} ${input.correctAnswer ?? ""}`;
  if (stored.includes(";;") || /^\s*\[/.test(stored)) return true;
  if (
    input.optionsLength === 0 &&
    (stored.includes("|||") || kind === "highlight" || kind === "ordered_response")
  ) {
    return true;
  }
  return false;
}

/** Per-row student vs key lines for matrix, drag-drop, SATA, ordered response, etc. */
export function ngnReviewLines(input: {
  selected: string;
  correctAnswer: string;
  ngnFormat?: string;
}): NgnReviewLine[] {
  const kind = storageKind(input.ngnFormat);
  const yours = partsForReview(input.selected, input.ngnFormat);
  const correct = partsForReview(input.correctAnswer, input.ngnFormat);

  if (kind === "matrix" || kind === "drag_drop" || yours.some((p) => p.includes("|||")) || correct.some((p) => p.includes("|||"))) {
    const mapYours = new Map<string, string>();
    for (const part of yours) {
      const { row, col } = parseMatrixKey(part);
      if (row) mapYours.set(row, col);
    }
    const mapCorrect = new Map<string, string>();
    for (const part of correct) {
      const { row, col } = parseMatrixKey(part);
      if (row) mapCorrect.set(row, col);
    }
    const labels = [...new Set([...mapYours.keys(), ...mapCorrect.keys()])];
    return labels.map((label) => {
      const yourCol = mapYours.get(label) ?? "—";
      const correctCol = mapCorrect.get(label) ?? "—";
      return {
        label,
        yourText: yourCol === "—" ? "—" : formatPart(`${label}|||${yourCol}`, input.ngnFormat),
        correctText: correctCol === "—" ? "—" : formatPart(`${label}|||${correctCol}`, input.ngnFormat),
        match: yourCol !== "—" && yourCol === correctCol,
      };
    });
  }

  if (kind === "ordered_response") {
    const max = Math.max(yours.length, correct.length);
    const lines: NgnReviewLine[] = [];
    for (let i = 0; i < max; i++) {
      const yourText = yours[i] ? formatPart(yours[i], input.ngnFormat) : "—";
      const correctText = correct[i] ? formatPart(correct[i], input.ngnFormat) : "—";
      lines.push({
        label: `${i + 1}`,
        yourText,
        correctText,
        match: yourText !== "—" && yourText === correctText,
      });
    }
    return lines;
  }

  const allParts = [...new Set([...yours, ...correct])];
  return allParts.map((part) => {
    const text = formatPart(part, input.ngnFormat);
    const inYours = yours.some((p) => p === part);
    const inCorrect = correct.some((p) => p === part);
    return {
      label: "",
      yourText: inYours ? text : "—",
      correctText: inCorrect ? text : "—",
      match: inYours && inCorrect,
    };
  });
}

/** Single-string fallback for simple UI. */
export function formatAnswerDisplay(value: string, ngnFormat?: string): string {
  if (!value.trim()) return "—";
  const parts = partsForReview(value, ngnFormat);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return formatPart(parts[0], ngnFormat);
  return parts.map((part) => formatPart(part, ngnFormat)).join("; ");
}
