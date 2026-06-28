import type { ExamQuestion } from "@/lib/ai";
import { stripShiftNotes } from "@/lib/questions/shift-notes";
import type { BankItem } from "@/lib/question-bank";
import type { ExamItemType } from "./types";

/** Map DB itemType → runtime NGN / study format. */
export function itemTypeToNgnFormat(itemType?: string): string | undefined {
  switch (itemType) {
    case "ngn_bowtie":
      return "bow_tie";
    case "ngn_matrix":
      return "matrix";
    case "ngn_highlight":
      return "highlight";
    case "case_study":
      return "unfolding_case";
    case "ordered_response":
      return "ordered_response";
    case "select_all":
      return "select_all";
    case "vignette":
    case "mcq":
      return "multiple_choice";
    default:
      return undefined;
  }
}

export function itemTypeToExamType(itemType?: string): ExamQuestion["type"] {
  const fmt = itemTypeToNgnFormat(itemType);
  if (!fmt) return "multiple_choice";
  if (
    fmt === "bow_tie" ||
    fmt === "matrix" ||
    fmt === "highlight" ||
    fmt === "select_all" ||
    fmt === "ordered_response" ||
    fmt === "unfolding_case"
  ) {
    return fmt as ExamQuestion["type"];
  }
  return "multiple_choice";
}

/** Convert stored ngnPayload → chartData for layout parsers. */
export function ngnPayloadToChartData(
  payload?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!payload?.kind) return undefined;
  const kind = String(payload.kind);

  if (kind === "bow_tie") {
    return {
      kind: "bow_tie",
      condition: payload.condition,
      actions: payload.actions,
      monitors: payload.monitors,
      monitorPickCount: payload.monitorPickCount ?? 2,
    };
  }

  if (kind === "matrix") {
    return {
      kind: "matrix",
      rows: payload.rows,
      columns: payload.columns,
    };
  }

  if (kind === "highlight") {
    const text = String(payload.text ?? "");
    const highlights = (payload.highlights as string[]) ?? [];
    const parts = text.split(/,\s*/).filter(Boolean);
    const segments = parts.map((p, i) => ({
      id: `seg-${i}`,
      text: p.trim(),
      isKey: highlights.some(
        (h) => p.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(p.toLowerCase())
      ),
    }));
    return { kind: "highlight", segments, highlights };
  }

  if (kind === "case_study") {
    return { kind: "case_study", caseStep: payload.caseStep ?? 1 };
  }

  return payload;
}

function splitStemAndVignette(item: BankItem): { vignette?: string; stem: string } {
  const vignette = stripShiftNotes(item.vignette?.trim() || item.scenario?.trim() || "");
  const q = item.question.trim();
  if (vignette && q.startsWith(vignette)) {
    const stem = q.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
    return { vignette, stem: stem || q };
  }
  if (vignette) return { vignette, stem: q };
  const parts = q.split(/\n\n+/);
  if (parts.length >= 2 && parts[0].length >= 40) {
    return { vignette: parts[0].trim(), stem: parts.slice(1).join("\n\n").trim() };
  }
  return { stem: q };
}

/** Build ExamQuestion from a bank row with full NGN layout preserved. */
export function bankItemToExamQuestion(
  item: BankItem,
  index: number,
  extras?: { field?: string; subjectId?: string }
): ExamQuestion {
  const { vignette, stem } = splitStemAndVignette(item);
  const chartData = ngnPayloadToChartData(item.ngnPayload);
  const type = itemTypeToExamType(item.itemType);
  const ngnFormat = itemTypeToNgnFormat(item.itemType);

  let options = [...item.options];
  if (item.itemType === "select_all" || item.ngnPayload?.kind === "select_all") {
    const fromPayload = item.ngnPayload?.options;
    if (Array.isArray(fromPayload)) options = fromPayload.map(String);
  }
  if (item.itemType === "ordered_response" || item.ngnPayload?.kind === "ordered_response") {
    const fromPayload = item.ngnPayload?.options;
    if (Array.isArray(fromPayload)) options = fromPayload.map(String);
  }

  const caseStep =
    typeof item.ngnPayload?.caseStep === "number"
      ? item.ngnPayload.caseStep
      : typeof chartData?.caseStep === "number"
        ? chartData.caseStep
        : undefined;

  return {
    id: index + 1,
    type,
    vignette,
    question: stem,
    options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    clinicalReasoning: item.clinicalReasoning,
    distractorRationale: item.distractorRationale,
    solutionSteps: item.solutionSteps ?? item.keyTakeaways,
    tags: item.tags,
    highYield: true,
    ngnFormat,
    ngnPayload: item.ngnPayload,
    chartData,
    caseStep,
    topicCategory: item.topicCategory,
    difficultyLabel:
      item.difficulty != null
        ? item.difficulty <= 2
          ? "Easy"
          : item.difficulty >= 4
            ? "Hard"
            : "Medium"
        : undefined,
    references: item.references?.map((r) => r.citation ?? r.label),
    expertRationale: item.expertRationale,
  };
}

/** RawQuestionInput with session metadata for prepare pipeline. */
export function bankItemToRawQuestion(
  item: BankItem,
  index: number,
  extras?: { field?: string; subjectId?: string }
) {
  return {
    ...bankItemToExamQuestion(item, index, extras),
    field: extras?.field,
    subjectId: extras?.subjectId ?? item.subjectId,
    bankItemId: item.id,
  };
}

export function isNgnBankItem(item: BankItem): boolean {
  const t = item.itemType as ExamItemType | undefined;
  return Boolean(
    t &&
      t !== "mcq" &&
      (t.startsWith("ngn_") ||
        t === "case_study" ||
        t === "select_all" ||
        t === "ordered_response" ||
        t === "vignette")
  );
}
