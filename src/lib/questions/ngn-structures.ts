import type { ExamQuestion } from "@/lib/ai";
import { cleanOptionText } from "@/lib/question-format";
import type { StudyQuestion } from "./types";

export type NgnLayoutInput = Pick<
  ExamQuestion,
  "type" | "question" | "options" | "correctAnswer" | "vignette" | "chartData"
>;

function toLayoutInput(q: NgnLayoutInput | StudyQuestion): NgnLayoutInput {
  if ("stem" in q) {
    return {
      type: (q.ngnFormat ?? q.type) as ExamQuestion["type"],
      question: q.stem,
      options: q.options,
      correctAnswer: q.correctAnswers.join(","),
      vignette: q.vignette,
      chartData: q.chartData,
    };
  }
  return q;
}

export type BowTieLayout = {
  condition: string;
  actions: string[];
  monitors: string[];
  /** How many monitors the learner must pick (default 2). */
  monitorPickCount: number;
};

export type MatrixLayout = {
  rows: string[];
  columns: string[];
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
    return {
      condition: String(chart.condition ?? "Clinical condition"),
      actions: (chart.actions as string[]) ?? [],
      monitors: (chart.monitors as string[]) ?? [],
      monitorPickCount: Number(chart.monitorPickCount ?? 2),
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
    return {
      condition: input.vignette?.split(/[.!?]/)[0]?.trim() || "Patient presentation",
      actions: options.slice(0, mid),
      monitors: options.slice(mid),
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

  return {
    condition: input.vignette?.split(/[.!?]/)[0]?.trim() || "Patient presentation",
    actions,
    monitors,
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

export function parseMatrixLayout(q: NgnLayoutInput | StudyQuestion): MatrixLayout {
  const input = toLayoutInput(q);
  const chart = input.chartData;
  if (isRecord(chart) && chart.kind === "matrix") {
    return {
      rows: (chart.rows as string[]) ?? [],
      columns: (chart.columns as string[]) ?? [],
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
    return { rows: [...rows], columns: [...cols] };
  }

  return {
    rows: ["Assessment A", "Assessment B", "Assessment C"],
    columns: ["Indicated", "Contraindicated", "Requires further data"],
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
    return { segments: (chart.segments as HighlightSegment[]) ?? [] };
  }

  const text = input.vignette ?? input.question;
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
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
  return actionCount === 1 && monitorCount === layout.monitorPickCount;
}
