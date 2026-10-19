import { unstable_cache } from "next/cache";
import { sqlQuery } from "@/lib/db";
import { TOP_500_COUNT, TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import { collectedDistractorReasons, contentFromStoredItem } from "@/lib/exam-prep/item-qa/rationale-schema";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { ACTIVE_INVENTORY_CACHE_TAG } from "@/lib/inventory/active-inventory-cache";
import { landingQuestionFromPublic, type LandingQuestion } from "@/lib/marketing/board-landing/model";
import { readStoredCitations, type PublicSampleQuestion } from "@/lib/marketing/public-sample";

const QUERY_TIMEOUT_MS = 5_000;

export type PharmacyMonograph = {
  generic: string;
  brand: string;
  className: string;
  line: string;
};

/** Pharmacy device. Not the nursing case frame. */
export type PharmacyHeroScene = {
  kicker: "Dosing calculation" | "Drug interaction";
  stem: string;
  options: string[];
  keyedAnswer: string;
  work: string;
  monograph: PharmacyMonograph | null;
  topDrugCount: number;
};

export type NaplexPractice = {
  sample: LandingQuestion;
  hero: PharmacyHeroScene | null;
};

type PracticeRow = {
  id: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: unknown;
};

function plainExplanation(explanation: string): string {
  return explanation.replace(/[#*`]/g, " ").replace(/\s+/g, " ").trim();
}

/** The stored calculation sentence, not a rewritten formula. */
export function dosingWork(explanation: string): string {
  const plain = plainExplanation(explanation);
  const sentences = plain.split(/(?<=\.)\s+/).filter(Boolean);
  const math =
    sentences.find((sentence) => sentence.length > 40 && /[=]|mg\/kg|mL/.test(sentence)) ?? sentences[0] ?? plain;
  if (math.length <= 240) return math;
  return `${math.slice(0, 237).replace(/\s+\S*$/, "")}…`;
}

export function monographForStem(stem: string): PharmacyMonograph | null {
  const hay = stem.toLowerCase();
  const match = TOP_500_DRUGS.filter(
    (drug) => drug.generic.length >= 5 && hay.includes(drug.generic.toLowerCase())
  ).sort((a, b) => b.generic.length - a.generic.length)[0];
  if (!match) return null;
  const indication = match.indications.split(",")[0]?.trim() ?? "";
  return {
    generic: match.generic,
    brand: match.brand,
    className: match.therapeuticClass,
    line: indication ? `${match.therapeuticClass}. ${indication}.` : match.therapeuticClass,
  };
}

function heroKind(stem: string): PharmacyHeroScene["kicker"] | null {
  if (/mg\/kg|mL\/hr|how many mL|round to/i.test(stem)) return "Dosing calculation";
  if (/\binteraction\b/i.test(stem)) return "Drug interaction";
  return null;
}

export function pharmacyHeroFromQuestion(question: LandingQuestion): PharmacyHeroScene | null {
  const kicker = heroKind(question.stem);
  const keyed = question.options.find((option) => option.correct)?.text.trim() ?? "";
  const work = dosingWork(question.rationale);
  if (!kicker || !keyed || work.length < 20) return null;
  return {
    kicker,
    stem: question.stem,
    options: question.options.map((option) => option.text),
    keyedAnswer: keyed,
    work,
    monograph: monographForStem(question.stem),
    topDrugCount: TOP_500_COUNT,
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
    return [{ sample, hero: pharmacyHeroFromQuestion(sample), explained }];
  });
  const best =
    ready.find((row) => row.hero && row.explained === row.sample.options.filter((option) => !option.correct).length) ??
    ready.find((row) => row.hero) ??
    ready[0];
  if (!best) return null;
  return { sample: best.sample, hero: best.hero };
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
      AND length(btrim(question)) BETWEEN 120 AND 650
      AND length(btrim(explanation)) BETWEEN 80 AND 1600
      AND position('|||' IN "correctAnswer") = 0
      AND "references" IS NOT NULL
      AND jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND (
        question ~* 'mg/kg'
        OR question ~* 'how many mL'
        OR question ~* 'mL/hr'
        OR question ~* 'interaction'
      )
      ${studentEligibleAndSql()}
    ORDER BY
      CASE WHEN question ~* 'mg/kg' AND question ~* 'mL' THEN 0 ELSE 1 END,
      length(question) ASC
    LIMIT 8
    `,
    [],
    { timeoutMs: QUERY_TIMEOUT_MS }
  );
  return selectNaplexPractice(Array.isArray(rows) ? rows : []);
}

const loadCachedNaplexPractice = unstable_cache(readNaplexPractice, ["naplex-landing-practice-v2"], {
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
