import { readFileSync } from "node:fs";
import path from "node:path";
import { bankItemContentHash } from "../../../src/lib/sync-question-bank";
import { joinStoredCorrectAnswer } from "../../../src/lib/questions/multi-answer";
import { matrixCellKey, matrixOptionsFromLayout } from "../../../src/lib/questions/ngn-structures";
import { serializeBankOptions } from "../../../src/lib/mpje/parse-bank-options";
import { JUDGMENT10_BATCH_ID, JUDGMENT10_TAG } from "../../../src/lib/judgment-pilot/constants";
import type { EnrichedBankItem } from "../../../src/lib/exam-prep/seed-helpers";
import type { ExamReference } from "../../../src/lib/exam-prep/types";

export const DATA_DIR = path.join(process.cwd(), "scripts/data/judgment10-20261025");
export const ITEMS_PATH = path.join(DATA_DIR, "items.json");

export type JudgmentSource = { name: string; url: string };

export type JudgmentItem = {
  id: string;
  board: "NCLEX-RN" | "NAPLEX";
  format: string;
  topic: string;
  stem: string;
  bowtie?: {
    condition_options: string[];
    action_options: string[];
    parameter_options: string[];
  };
  matrix?: { columns: string[]; rows: string[] };
  options?: Record<string, string>;
  answer:
    | string
    | string[]
    | {
        condition?: string;
        actions?: string[];
        parameters?: string[];
        [row: string]: string | string[] | undefined;
      };
  explanation: string;
  sources: JudgmentSource[];
};

const SUPPORTED_FORMATS = new Set([
  "NGN bow-tie",
  "NGN matrix (multiple response grid)",
  "SATA",
  "MCQ (4-option)",
]);

/** Collapse Standard MCQ / NAPLEX MCQ variants onto the supported bank shapes. */
export function normalizeJudgmentFormat(format: string): string {
  if (format === "Standard MCQ" || format.startsWith("MCQ (4-option")) return "MCQ (4-option)";
  return format;
}

export function loadJudgmentItems(filePath = ITEMS_PATH): JudgmentItem[] {
  const rows = JSON.parse(readFileSync(filePath, "utf8")) as JudgmentItem[];
  if (rows.length !== 10) {
    throw new Error(`expected 10 judgment items, found ${rows.length}`);
  }
  for (const row of rows) {
    row.format = normalizeJudgmentFormat(row.format);
    if (!SUPPORTED_FORMATS.has(row.format)) {
      throw new Error(`unsupported format for ${row.id}: ${row.format}`);
    }
  }
  return rows;
}

function fieldForBoard(board: JudgmentItem["board"]): "nursing" | "pharmacy" {
  return board === "NCLEX-RN" ? "nursing" : "pharmacy";
}

function subjectForItem(item: JudgmentItem): string {
  const t = item.topic.toLowerCase();
  if (item.board === "NAPLEX") return "pharmacology";
  if (t.includes("preeclampsia") || t.includes("maternal")) return "maternal-child";
  if (t.includes("switching") || t.includes("ace inhibitor") || t.includes("sacubitril")) {
    return "pharmacology-nursing";
  }
  if (t.includes("enoxaparin") || t.includes("digoxin") || t.includes("pharm")) {
    return "pharmacology-nursing";
  }
  return "physiological-adaptation";
}

function blueprintDomain(fieldId: "nursing" | "pharmacy", subjectId: string): string {
  if (fieldId === "pharmacy") return "naplex-pharmacotherapy";
  if (subjectId === "management-of-care" || subjectId === "reduction-risk") return "nclex-safe-care";
  if (subjectId === "psychosocial") return "nclex-psychosocial";
  return "nclex-physiological";
}

function toReferences(sources: JudgmentSource[]): ExamReference[] {
  return sources.map((s) => ({ label: s.name, url: s.url, citation: s.name }));
}

function optionLetters(options: Record<string, string>): string[] {
  return Object.keys(options)
    .sort()
    .map((k) => options[k]!);
}

function letterKey(options: Record<string, string>, answer: string): string {
  const text = options[answer.trim().toUpperCase()];
  if (!text) throw new Error(`missing option ${answer}`);
  return text;
}

function letterKeys(options: Record<string, string>, answers: string[]): string {
  const texts = answers.map((letter) => letterKey(options, letter));
  return joinStoredCorrectAnswer("select_all", texts);
}

function splitScenarioAndQuestion(stem: string, fallbackQuestion: string): { scenario: string; question: string } {
  const markers = [
    /\n\n(?=Which )/,
    /\n\n(?=Complete the bow-tie)/i,
    /\n\n(?=For each )/i,
    /\n\n(?=Bow-tie)/i,
  ];
  for (const re of markers) {
    const idx = stem.search(re);
    if (idx > 40) {
      return {
        scenario: stem.slice(0, idx).trim(),
        question: stem.slice(idx).replace(/^\s+/, "").trim() || fallbackQuestion,
      };
    }
  }
  return { scenario: stem.trim(), question: fallbackQuestion };
}

export type MappedJudgmentRow = {
  pilotId: string;
  fieldId: "nursing" | "pharmacy";
  bankItem: EnrichedBankItem & { subjectId: string };
  contentHash: string;
  itemType: string;
};

export function mapJudgmentItem(item: JudgmentItem): MappedJudgmentRow {
  const fieldId = fieldForBoard(item.board);
  const subjectId = subjectForItem(item);
  const references = toReferences(item.sources);
  const baseTags = [
    JUDGMENT10_TAG,
    "clinical-judgment",
    "judgment-pilot",
    "curated",
    item.id.toLowerCase(),
  ];

  let bankItem: EnrichedBankItem & { subjectId: string };
  let itemType: string;

  if (item.format === "NGN bow-tie") {
    if (!item.bowtie || typeof item.answer !== "object" || Array.isArray(item.answer)) {
      throw new Error(`${item.id}: invalid bow-tie payload`);
    }
    const ans = item.answer as {
      condition: string;
      actions: string[];
      parameters: string[];
    };
    const { scenario, question } = splitScenarioAndQuestion(
      item.stem,
      "Complete the bow-tie: choose the condition, actions to take, and parameters to monitor."
    );
    const actions = item.bowtie.action_options;
    const monitors = item.bowtie.parameter_options;
    const conditionOptions = item.bowtie.condition_options;
    const keyed = [...ans.actions, ...ans.parameters];
    const correctAnswer = joinStoredCorrectAnswer("bow_tie", keyed);
    itemType = "ngn_bowtie";
    bankItem = {
      subjectId,
      vignette: scenario,
      question,
      options: ["A", "B", "C", "D"],
      correctAnswer,
      explanation: item.explanation,
      itemType,
      difficulty: 5,
      topicCategory: subjectId,
      blueprintDomain: blueprintDomain(fieldId, subjectId),
      tags: [...baseTags, "ngn", "bow-tie"],
      references,
      ngnPayload: {
        kind: "bow_tie",
        condition: ans.condition,
        conditionOptions,
        actions,
        monitors,
        actionPickCount: ans.actions.length,
        monitorPickCount: ans.parameters.length,
      },
      generationMeta: {
        batchId: JUDGMENT10_BATCH_ID,
        pilotItemId: item.id,
        curatedAt: "2026-10-25",
      },
    };
  } else if (item.format === "NGN matrix (multiple response grid)") {
    if (!item.matrix || typeof item.answer !== "object" || Array.isArray(item.answer)) {
      throw new Error(`${item.id}: invalid matrix payload`);
    }
    const { scenario, question } = splitScenarioAndQuestion(
      item.stem,
      "For each finding, indicate the appropriate column."
    );
    const rows = item.matrix.rows;
    const columns = item.matrix.columns;
    const layout = { rows, columns, rowHeader: "Finding" };
    const cells = matrixOptionsFromLayout(layout);
    const answerObj = item.answer as Record<string, string>;
    const correctParts = rows.map((row) => {
      const col = answerObj[row];
      if (!col) throw new Error(`${item.id}: missing matrix answer for row ${row}`);
      return matrixCellKey(row, col);
    });
    itemType = "ngn_matrix";
    bankItem = {
      subjectId,
      vignette: scenario,
      question,
      options: cells,
      correctAnswer: correctParts.join(","),
      explanation: item.explanation,
      itemType,
      difficulty: 5,
      topicCategory: subjectId,
      blueprintDomain: blueprintDomain(fieldId, subjectId),
      tags: [...baseTags, "ngn", "matrix"],
      references,
      ngnPayload: {
        kind: "matrix",
        rows,
        columns,
        rowHeader: "Finding",
        options: cells,
      },
      generationMeta: {
        batchId: JUDGMENT10_BATCH_ID,
        pilotItemId: item.id,
        curatedAt: "2026-10-25",
      },
    };
  } else if (item.format === "SATA") {
    if (!item.options || !Array.isArray(item.answer)) {
      throw new Error(`${item.id}: invalid SATA payload`);
    }
    const opts = optionLetters(item.options);
    const { scenario, question } = splitScenarioAndQuestion(
      item.stem,
      "Which actions should the nurse take? Select all that apply."
    );
    itemType = "select_all";
    bankItem = {
      subjectId,
      vignette: scenario,
      question,
      options: opts,
      correctAnswer: letterKeys(item.options, item.answer),
      explanation: item.explanation,
      itemType,
      difficulty: 5,
      topicCategory: subjectId,
      blueprintDomain: blueprintDomain(fieldId, subjectId),
      tags: [...baseTags, "sata"],
      references,
      ngnPayload: { kind: "select_all" },
      generationMeta: {
        batchId: JUDGMENT10_BATCH_ID,
        pilotItemId: item.id,
        curatedAt: "2026-10-25",
      },
    };
  } else if (item.format === "MCQ (4-option)") {
    if (!item.options || typeof item.answer !== "string") {
      throw new Error(`${item.id}: invalid MCQ payload`);
    }
    const opts = optionLetters(item.options);
    const { scenario, question } = splitScenarioAndQuestion(item.stem, "Which action is most appropriate?");
    itemType = fieldId === "nursing" ? "vignette" : "vignette";
    bankItem = {
      subjectId,
      vignette: scenario,
      question,
      options: opts,
      correctAnswer: letterKey(item.options, item.answer),
      explanation: item.explanation,
      itemType,
      difficulty: 5,
      topicCategory: subjectId,
      blueprintDomain: blueprintDomain(fieldId, subjectId),
      tags: [...baseTags, "mcq"],
      references,
      generationMeta: {
        batchId: JUDGMENT10_BATCH_ID,
        pilotItemId: item.id,
        curatedAt: "2026-10-25",
      },
    };
  } else {
    throw new Error(`${item.id}: unhandled format ${item.format}`);
  }

  const contentHash = bankItemContentHash(fieldId, subjectId, {
    question: bankItem.question,
    vignette: bankItem.vignette,
  });

  return { pilotId: item.id, fieldId, bankItem, contentHash, itemType };
}

export function mapAllJudgmentItems(items = loadJudgmentItems()): MappedJudgmentRow[] {
  return items.map(mapJudgmentItem);
}

export function serializeMappedRow(row: MappedJudgmentRow, id: string) {
  const { bankItem, fieldId, contentHash } = row;
  const options = serializeBankOptions(bankItem);
  const tagsJson = JSON.stringify(bankItem.tags ?? []);
  return {
    id,
    fieldId,
    subjectId: bankItem.subjectId,
    scenario: bankItem.vignette ?? null,
    question: bankItem.question,
    options,
    correctAnswer: bankItem.correctAnswer,
    explanation: bankItem.explanation,
    itemType: bankItem.itemType ?? "vignette",
    difficulty: bankItem.difficulty ?? 5,
    topicCategory: bankItem.topicCategory ?? bankItem.subjectId,
    blueprintDomain: bankItem.blueprintDomain ?? null,
    tags: tagsJson,
    references: bankItem.references ?? [],
    source: "judgment-pilot",
    contentHash,
    active: true,
    manualCorrection: true,
    qaPassed: true,
    reviewStatus: "approved",
    generationMeta: bankItem.generationMeta ?? { batchId: JUDGMENT10_BATCH_ID },
    pilotId: row.pilotId,
  };
}
