import { matrixRowHeader } from "@/lib/assessment/matrix-row-header";
import type { ExamQuestion } from "@/lib/ai";
import { cleanOptionText } from "@/lib/question-format";
import { joinStoredCorrectAnswer } from "@/lib/questions/multi-answer";
import type { StudyQuestion } from "./types";

export type NgnLayoutInput = Pick<
  ExamQuestion,
  "type" | "question" | "options" | "correctAnswer" | "vignette" | "chartData" | "ngnPayload"
>;

function resolveChartData(
  input: NgnLayoutInput & { ngnPayload?: Record<string, unknown> }
): Record<string, unknown> | undefined {
  if (input.chartData && isRecord(input.chartData)) return input.chartData;
  const payload = input.ngnPayload;
  if (!payload?.kind) return undefined;
  const kind = String(payload.kind);
  if (kind === "bow_tie" || kind === "matrix") return payload;
  if (kind === "highlight") {
    const text = String(payload.text ?? "");
    const highlights = (payload.highlights as string[]) ?? [];
    const parts = text.split(/,\s*/).filter(Boolean);
    return {
      kind: "highlight",
      segments: parts.map((p, i) => ({
        id: `seg-${i}`,
        text: p.trim(),
      })),
      highlights,
    };
  }
  return payload;
}

function toLayoutInput(q: NgnLayoutInput | StudyQuestion): NgnLayoutInput {
  if ("stem" in q) {
    return {
      type: (q.ngnFormat ?? q.type) as ExamQuestion["type"],
      question: q.stem,
      options: q.options,
      correctAnswer: joinStoredCorrectAnswer(q.type, q.correctAnswers),
      vignette: q.vignette,
      chartData: q.chartData ?? resolveChartData({ ngnPayload: q.ngnPayload } as NgnLayoutInput),
      ngnPayload: q.ngnPayload,
    };
  }
  return {
    ...q,
    chartData: resolveChartData(q),
  };
}

export type BowTieLayout = {
  condition: string;
  /** Choices for the center column. Empty when the item has no condition bank. */
  conditionOptions: string[];
  /**
   * True when the item listed a condition column, including an empty one.
   * A narrative center label with no column stays false so action-and-monitor
   * items can still be completed.
   */
  conditionChoicesListed: boolean;
  actions: string[];
  monitors: string[];
  /** How many actions the learner must pick. Bank bow-ties stay at 1. */
  actionPickCount: number;
  /** How many monitors the learner must pick (default 2). */
  monitorPickCount: number;
};

export function bowTiePickInstruction(
  layout: Pick<BowTieLayout, "actionPickCount" | "monitorPickCount" | "conditionOptions">
): string {
  const actions = `${layout.actionPickCount} action${layout.actionPickCount === 1 ? "" : "s"}`;
  const parameters = `${layout.monitorPickCount} parameter${layout.monitorPickCount === 1 ? "" : "s"}`;
  return `Choose the condition, ${actions} to take, and ${parameters} to monitor`;
}

export type MatrixLayout = {
  rows: string[];
  columns: string[];
  rowHeader: string;
};

export type HighlightSegment = {
  id: string;
  text: string;
};

export type HighlightLayout = {
  segments: HighlightSegment[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function choiceText(value: unknown): string {
  if (typeof value === "string") return cleanOptionText(value);
  if (!isRecord(value)) return "";
  const text = value.text ?? value.label ?? value.name;
  return typeof text === "string" ? cleanOptionText(text) : "";
}

function choiceList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const texts = value.map(choiceText).filter((text) => text.length > 0);
  return [...new Set(texts)];
}

/** Condition choices from either a string list or `{ text }` rows. */
export function readConditionChoices(
  chart: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
): { options: string[]; listed: boolean } {
  const sources = [chart, payload];
  const keys = ["conditionOptions", "conditions", "conditionChoices", "potentialConditions"];
  let listed = false;
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      listed = true;
      const options = choiceList(source[key]);
      if (options.length > 0) return { options, listed: true };
    }
  }
  return { options: [], listed };
}

function stripRolePrefix(opt: string): { role: "action" | "monitor" | "neutral"; text: string } {
  const actionMatch = opt.match(/^\[(?:action|actions)\]\s*/i) ?? opt.match(/^action:\s*/i);
  if (actionMatch) return { role: "action", text: cleanOptionText(opt.slice(actionMatch[0].length)) };
  const monitorMatch = opt.match(/^\[(?:monitor|monitors)\]\s*/i) ?? opt.match(/^monitor:\s*/i);
  if (monitorMatch) return { role: "monitor", text: cleanOptionText(opt.slice(monitorMatch[0].length)) };
  return { role: "neutral", text: cleanOptionText(opt) };
}

export function parseBowTieLayout(q: NgnLayoutInput | StudyQuestion): BowTieLayout {
  const input = toLayoutInput(q);
  const chart = input.chartData;
  if (isRecord(chart) && chart.kind === "bow_tie") {
    const conditions = readConditionChoices(chart, input.ngnPayload);
    return {
      condition: String(chart.condition ?? "Clinical condition"),
      conditionOptions: conditions.options,
      conditionChoicesListed: conditions.listed,
      actions: (chart.actions as string[]) ?? [],
      monitors: (chart.monitors as string[]) ?? [],
      actionPickCount: Number(chart.actionPickCount ?? 1) || 1,
      monitorPickCount: Number(chart.monitorPickCount ?? 2) || 2,
    };
  }

  const options = (input.options ?? []).map(cleanOptionText);
  const actions: string[] = [];
  const monitors: string[] = [];

  for (const opt of options) {
    const { role, text } = stripRolePrefix(opt);
    if (role === "action") actions.push(text);
    else if (role === "monitor") monitors.push(text);
  }

  if (actions.length === 0 && monitors.length === 0) {
    const mid = Math.ceil(options.length / 2);
    const conditions = readConditionChoices(undefined, input.ngnPayload);
    return {
      condition: input.vignette?.split(/[.!?]/)[0]?.trim() || "Patient presentation",
      conditionOptions: conditions.options,
      conditionChoicesListed: conditions.listed,
      actions: options.slice(0, mid),
      monitors: options.slice(mid),
      actionPickCount: 1,
      monitorPickCount: 2,
    };
  }

  const neutral = options.filter((o) => {
    const { role } = stripRolePrefix(o);
    return role === "neutral";
  });

  if (actions.length === 0 || monitors.length === 0) {
    for (const opt of neutral) {
      if (actions.length <= monitors.length) actions.push(opt);
      else monitors.push(opt);
    }
  }

  const conditions = readConditionChoices(isRecord(chart) ? chart : undefined, input.ngnPayload);
  return {
    condition: input.vignette?.split(/[.!?]/)[0]?.trim() || "Patient presentation",
    conditionOptions: conditions.options,
    conditionChoicesListed: conditions.listed,
    actions,
    monitors,
    actionPickCount: 1,
    monitorPickCount: 2,
  };
}

export function matrixCellKey(row: string, col: string): string {
  return `${row}|||${col}`;
}

export function parseMatrixKey(key: string): { row: string; col: string } {
  const [row, col] = key.split("|||");
  return { row: row ?? "", col: col ?? "" };
}

function layoutRowHeader(
  chart: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
): string {
  return matrixRowHeader(chart?.rowHeader, payload?.rowHeader);
}

export function parseMatrixLayout(q: NgnLayoutInput | StudyQuestion): MatrixLayout {
  const input = toLayoutInput(q);
  const chart = isRecord(input.chartData) ? input.chartData : undefined;
  const rowHeader = layoutRowHeader(chart, input.ngnPayload);
  if (chart?.kind === "matrix") {
    return {
      rows: (chart.rows as string[]) ?? [],
      columns: (chart.columns as string[]) ?? [],
      rowHeader,
    };
  }

  const rows = new Set<string>();
  const cols = new Set<string>();
  for (const opt of input.options ?? []) {
    const parts = opt.split(/\s*[—–|]\s*/);
    if (parts.length >= 2) {
      rows.add(cleanOptionText(parts[0]));
      cols.add(cleanOptionText(parts[1]));
    }
  }

  if (rows.size > 0 && cols.size > 0) {
    return { rows: [...rows], columns: [...cols], rowHeader };
  }

  return {
    rows: ["Assessment A", "Assessment B", "Assessment C"],
    columns: ["Indicated", "Contraindicated", "Requires further data"],
    rowHeader,
  };
}

export function matrixOptionsFromLayout(layout: MatrixLayout): string[] {
  const cells: string[] = [];
  for (const row of layout.rows) {
    for (const col of layout.columns) {
      cells.push(matrixCellKey(row, col));
    }
  }
  return cells;
}

export function parseHighlightLayout(q: NgnLayoutInput | StudyQuestion): HighlightLayout {
  const input = toLayoutInput(q);
  const chart = input.chartData;
  if (isRecord(chart) && chart.kind === "highlight") {
    const segs = (chart.segments as HighlightSegment[]) ?? [];
    if (segs.length) return { segments: segs };
    const highlights = (chart.highlights as string[]) ?? [];
    const text = String(chart.text ?? input.vignette ?? input.question);
    const parts = text.includes(",")
      ? text.split(/,\s*/).filter(Boolean)
      : text.split(/(?<=[.!?])\s+/).filter(Boolean);
    return {
      segments: parts.map((s, i) => ({ id: `seg-${i}`, text: s.trim() })),
      ...(highlights.length ? { highlights } : {}),
    };
  }

  const text = input.vignette ?? input.question;
  const sentences = text.includes(",")
    ? text.split(/,\s*/).filter(Boolean)
    : text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return {
    segments: sentences.map((s, i) => ({
      id: `seg-${i}`,
      text: s.trim(),
    })),
  };
}

export function bowTieSelectionValid(
  selected: string[],
  layout: BowTieLayout
): boolean {
  const actionCount = selected.filter((s) => layout.actions.includes(s)).length;
  const monitorCount = selected.filter((s) => layout.monitors.includes(s)).length;
  const actionPick = layout.actionPickCount ?? 1;
  const conditionOptions = layout.conditionOptions ?? [];
  const conditionCount = selected.filter((s) => conditionOptions.includes(s)).length;
  const conditionMissing = layout.conditionChoicesListed === true && conditionOptions.length === 0;
  const conditionOk = conditionMissing
    ? false
    : conditionOptions.length === 0 || conditionCount === 1;
  return actionCount === actionPick && monitorCount === layout.monitorPickCount && conditionOk;
}

/** Toggle one bow-tie choice while keeping one action and N monitors. */
export function toggleBowTieSelection(
  prev: string[],
  option: string,
  layout: BowTieLayout
): string[] {
  if (prev.includes(option)) return prev.filter((o) => o !== option);
  if (layout.actions.includes(option)) {
    const actionPick = layout.actionPickCount ?? 1;
    const actions = prev.filter((entry) => layout.actions.includes(entry));
    const base =
      actions.length >= actionPick ? prev.filter((entry) => entry !== actions[0]) : prev;
    return [...base, option];
  }
  if (layout.monitors.includes(option)) {
    const monitors = prev.filter((o) => layout.monitors.includes(o));
    const next =
      monitors.length >= layout.monitorPickCount
        ? prev.filter((o) => o !== monitors[0])
        : prev;
    return [...next, option];
  }
  if ((layout.conditionOptions ?? []).includes(option)) {
    const rest = prev.filter((entry) => !layout.conditionOptions.includes(entry));
    return [...rest, option];
  }
  return [...prev, option];
}
