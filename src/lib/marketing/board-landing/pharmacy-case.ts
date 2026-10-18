import { unstable_cache } from "next/cache";
import { sqlQuery } from "@/lib/db";
import { collectedDistractorReasons, contentFromStoredItem } from "@/lib/exam-prep/item-qa/rationale-schema";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";
import type { HeroCaseScene } from "@/lib/marketing/board-landing/hero-case";
import { landingQuestionFromPublic, type LandingQuestion } from "@/lib/marketing/board-landing/model";
import { readStoredCitations, type PublicSampleQuestion } from "@/lib/marketing/public-sample";

const QUERY_TIMEOUT_MS = 5_000;
const UNIT =
  "mEq\\/L|mg\\/dL|g\\/dL|mcg\\/mL|ng\\/mL|mmol\\/L|mm Hg|mL\\/min|U\\/L|bpm|\\/mm3|%";
const MEASURE = new RegExp(
  `(?:^|[,;]|\\band\\b)\\s*([A-Za-z][A-Za-z0-9⁺+\\/\\-\\s]{0,48}?)(?:\\s+of)?\\s+(\\d[\\d,]*(?:\\.\\d+)?(?:\\/\\d+)?)\\s*(${UNIT})`,
  "gi"
);

export type NaplexPractice = {
  sample: LandingQuestion;
  scene: HeroCaseScene | null;
};

type PracticeRow = {
  id: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: unknown;
};

function sentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((part) => part.split(/(?<=[.!?])\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
}

function cleanMeasureName(raw: string): string {
  return raw
    .replace(/^.*\b(?:show|shows|indicate|indicates|reveal|reveals|include|includes)\s+/i, "")
    .replace(/^(?:his|her|the|a|an)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function measuresIn(sentence: string): string[][] {
  const rows: string[][] = [];
  for (const match of sentence.matchAll(MEASURE)) {
    const name = cleanMeasureName(match[1] ?? "");
    const unit = match[3] ?? "";
    const value = `${match[2] ?? ""}${unit.startsWith("/") ? "" : " "}${unit}`.replace(/\s+/g, " ").trim();
    if (name.length < 2 || name.length > 48 || !value) continue;
    rows.push([name, value]);
  }
  return rows;
}

/** Narrative notes plus a lab or vital table copied from the stem. Null when the stem has neither. */
export function pharmacyChartFromStem(stem: string): {
  setting: string;
  notes: string[];
  tableLabel: string;
  columns: string[];
  rows: string[][];
  question: string;
} | null {
  const parts = sentences(stem);
  if (parts.length < 2) return null;
  const question = [...parts].reverse().find((part) => part.endsWith("?")) ?? "";
  const body = parts.filter((part) => part !== question);
  const chartSentences = body.filter((part) => /\b(?:labs?|laboratory|vital signs)\b/i.test(part));
  const rows = chartSentences.flatMap(measuresIn);
  const notes = body.filter((part) => !chartSentences.includes(part));
  if (!question || notes.length === 0 || rows.length < 2) return null;
  const hasLabs = chartSentences.some((part) => /\blabs?|laboratory\b/i.test(part));
  const hasVitals = chartSentences.some((part) => /vital signs/i.test(part));
  const tableLabel = hasLabs && hasVitals ? "Labs and vitals" : hasVitals ? "Vital signs" : "Laboratory values";
  return {
    setting: notes[0]!.slice(0, 180),
    notes: notes.slice(0, 3),
    tableLabel,
    columns: ["Measure", "Result"],
    rows: rows.slice(0, 6),
    question,
  };
}

export function pharmacyHeroFromQuestion(question: LandingQuestion): HeroCaseScene | null {
  const chart = pharmacyChartFromStem(question.stem);
  if (!chart) return null;
  const keyed = question.options.find((option) => option.correct)?.text.trim() ?? "";
  const whyNot = question.options.find((option) => !option.correct && option.rationale)?.rationale ?? null;
  if (!keyed) return null;
  return {
    setting: chart.setting,
    notesLabel: "Patient case",
    notes: chart.notes,
    vitalsLabel: chart.tableLabel,
    columns: chart.columns,
    rows: chart.rows,
    stem: chart.question,
    options: question.options.map((option) => option.text),
    keyedAnswer: keyed,
    whyNot,
  };
}

function letterReasons(explanation: string, count: number): Array<string | null> {
  const reasons: Array<string | null> = Array.from({ length: count }, () => null);
  for (const chunk of explanation.split(/(?=\b[A-F]\.\s)/)) {
    const match = /^([A-F])\.\s+([\s\S]+)/.exec(chunk.trim());
    if (!match) continue;
    const index = match[1]!.charCodeAt(0) - 65;
    const text = match[2]!.replace(/\s+/g, " ").trim();
    if (index >= 0 && index < count && text.length >= 20) reasons[index] = text;
  }
  return reasons;
}

function questionFromRow(row: PracticeRow): LandingQuestion | null {
  const stem = row.question?.trim() ?? "";
  const rationale = row.explanation?.trim() ?? "";
  const sources = readStoredCitations(row.references);
  if (!stem || !rationale || sources.length === 0) return null;
  const content = contentFromStoredItem({
    question: stem,
    options: row.options ?? "",
    correctAnswer: row.correctAnswer ?? "",
    explanation: rationale,
    references: row.references,
  });
  const options = (content.options ?? []).map((option) => option.trim()).filter(Boolean);
  const correct = options.find((option) => option.toLowerCase() === (content.correctAnswer ?? "").trim().toLowerCase());
  if (!correct || options.length < 2 || new Set(options).size !== options.length) return null;
  const stored = collectedDistractorReasons({ ...content, options, correctAnswer: correct, explanation: rationale });
  const letters = letterReasons(rationale, options.length);
  const sample: PublicSampleQuestion = {
    id: row.id,
    fieldId: "pharmacy",
    examLabel: "NAPLEX",
    stem,
    options,
    correct,
    rationale,
    sources,
  };
  const question = landingQuestionFromPublic(sample);
  return {
    ...question,
    options: question.options.map((option, index) => ({
      ...option,
      rationale: option.correct ? option.rationale : (stored[option.text] ?? letters[index] ?? option.rationale),
    })),
  };
}

/** Prefer a case the device can show, then any item that has a stored reason for a wrong option. */
export function selectNaplexPractice(rows: readonly PracticeRow[]): NaplexPractice | null {
  const ready = rows.flatMap((row) => {
    const sample = questionFromRow(row);
    if (!sample) return [];
    const wrong = sample.options.filter((option) => !option.correct);
    const explained = wrong.filter((option) => option.rationale).length;
    if (explained === 0) return [];
    return [{ sample, scene: pharmacyHeroFromQuestion(sample), explained }];
  });
  const best =
    ready.find((row) => row.scene && row.explained === row.sample.options.filter((option) => !option.correct).length) ??
    ready.find((row) => row.scene) ??
    ready[0];
  if (!best) return null;
  return { sample: best.sample, scene: best.scene };
}

async function readNaplexPractice(): Promise<NaplexPractice | null> {
  const rows = await sqlQuery<PracticeRow[]>(
    `
    SELECT id, question, options, "correctAnswer", explanation, "references"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" = 'pharmacy'
      AND "itemType" IN ('mcq', 'vignette')
      AND length(btrim(question)) BETWEEN 80 AND 900
      AND length(btrim(explanation)) BETWEEN 80 AND 1600
      AND position('|||' IN "correctAnswer") = 0
      AND "references" IS NOT NULL
      AND jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND question ~* 'lab(oratory|s)?|vital signs'
      ${studentEligibleAndSql()}
    ORDER BY
      CASE WHEN explanation ILIKE '%other options%' OR options::text ILIKE '%distractorRationale%' THEN 0 ELSE 1 END,
      length(explanation) DESC
    LIMIT 12
    `,
    [],
    { timeoutMs: QUERY_TIMEOUT_MS }
  );
  return selectNaplexPractice(Array.isArray(rows) ? rows : []);
}

const loadCachedNaplexPractice = unstable_cache(readNaplexPractice, ["naplex-landing-practice-v1"], {
  revalidate: 300,
  tags: [ACTIVE_INVENTORY_CACHE_TAG],
});

/** One live NAPLEX question for the hero and the free sample. Null when the bank cannot be read. */
export async function loadNaplexPractice(): Promise<NaplexPractice | null> {
  try {
    return await loadCachedNaplexPractice();
  } catch {
    return null;
  }
}
