import { unstable_cache } from "next/cache";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { sqlQuery } from "@/lib/db";

export type PublicSampleQuestion = {
  id: string;
  fieldId: string;
  examLabel: string;
  stem: string;
  options: string[];
  correct: string;
  rationale: string;
  sources: string[];
};

const SAMPLE_BOARDS = [
  { fieldId: "nursing", examLabel: "NCLEX" },
  { fieldId: "usmle-step-2", examLabel: "USMLE Step 2 CK" },
  { fieldId: "pharmacy", examLabel: "NAPLEX" },
  { fieldId: "aanp-fnp", examLabel: "AANP FNP" },
  { fieldId: "pance", examLabel: "PANCE" },
] as const;

const FIELD_IDS = SAMPLE_BOARDS.map((board) => board.fieldId);
const LABEL_BY_FIELD = new Map(SAMPLE_BOARDS.map((board) => [board.fieldId, board.examLabel]));

type SampleRow = {
  id: string;
  fieldId: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: unknown;
};

export function readStoredCitations(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const sources: string[] = [];
  for (const entry of raw) {
    if (typeof entry === "string") {
      const text = entry.trim();
      if (text) sources.push(text);
      continue;
    }
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const citation = typeof record.citation === "string" ? record.citation.trim() : "";
    const text = [label, citation].filter(Boolean).join(" — ");
    if (text) sources.push(text);
  }
  return sources.slice(0, 4);
}

/** Keep a row only when it is a clean single-best-answer item with a stored source. */
export function toPublicSampleQuestion(row: SampleRow): PublicSampleQuestion | null {
  const examLabel = LABEL_BY_FIELD.get(row.fieldId as (typeof FIELD_IDS)[number]);
  const stem = row.question?.trim() ?? "";
  const rationale = row.explanation?.trim() ?? "";
  const sources = readStoredCitations(row.references);
  if (!examLabel || !stem || !rationale || sources.length === 0) return null;

  const parsed = parseBankOptions(row.options ?? "");
  const options = parsed.options.map((option) => option.trim()).filter(Boolean);
  if (options.length < 2 || options.length > 6) return null;
  if (new Set(options).size !== options.length) return null;

  const key = row.correctAnswer?.trim() ?? "";
  if (!key || key.includes("|||")) return null;
  const correct =
    options.find((option) => option === key) ??
    options.find((option) => option.toLowerCase() === key.toLowerCase());
  if (!correct) return null;

  return {
    id: row.id,
    fieldId: row.fieldId,
    examLabel,
    stem,
    options,
    correct,
    rationale,
    sources,
  };
}

export function pickPublicSamples(rows: SampleRow[]): PublicSampleQuestion[] {
  const picked: PublicSampleQuestion[] = [];
  for (const board of SAMPLE_BOARDS) {
    const match = rows.find(
      (row) => row.fieldId === board.fieldId && toPublicSampleQuestion(row)
    );
    const sample = match ? toPublicSampleQuestion(match) : null;
    if (sample) picked.push(sample);
  }
  return picked;
}

async function queryPublicSampleRows(): Promise<SampleRow[]> {
  const fieldList = FIELD_IDS.map((id) => `'${id}'`).join(", ");
  return sqlQuery<SampleRow[]>(
    `
    SELECT id, "fieldId", question, options, "correctAnswer", explanation, "references"
    FROM (
      SELECT
        id,
        "fieldId",
        question,
        options,
        "correctAnswer",
        explanation,
        "references",
        row_number() OVER (PARTITION BY "fieldId" ORDER BY length(explanation), id) AS rn
      FROM "QuestionBankItem"
      WHERE active = true
        AND "qaPassed" = true
        AND "itemType" IN ('mcq', 'vignette')
        AND "fieldId" IN (${fieldList})
        AND length(btrim(question)) BETWEEN 40 AND 900
        AND length(btrim(explanation)) BETWEEN 80 AND 1600
        AND position('|||' IN "correctAnswer") = 0
        AND "references" IS NOT NULL
        AND jsonb_typeof("references") = 'array'
        AND jsonb_array_length("references") > 0
        ${studentEligibleAndSql()}
    ) ranked
    WHERE rn <= 8
    ORDER BY "fieldId", rn
    `,
    []
  );
}

async function loadPublicSampleQuestions(): Promise<PublicSampleQuestion[]> {
  try {
    const rows = await queryPublicSampleRows();
    return pickPublicSamples(rows);
  } catch {
    return [];
  }
}

const loadCachedPublicSamples = unstable_cache(
  loadPublicSampleQuestions,
  ["public-sample-questions-v3"],
  { revalidate: 3600 }
);

/** Up to one real, student-eligible question per board. Empty when the bank is unreachable. */
export async function getPublicSampleQuestions(): Promise<PublicSampleQuestion[]> {
  return loadCachedPublicSamples();
}
