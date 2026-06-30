import { getOpenAiClient } from "@/lib/openai-client";
import { assessNclexItemQuality } from "@/lib/exam-prep/nclex-quality-gate";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { QuestionBankItem } from "@prisma/client";
import { buildQualityPromptText } from "./embedding-text";
import {
  KEEP_MIN_SCORE,
  REVIEW_MIN_SCORE,
  type CurationQuestionRow,
  type QualityDimensionScores,
  type QualityScoreResult,
} from "./types";

export const NCLEX_QUALITY_RUBRIC_PROMPT = `You are a senior NCLEX-RN item writer and psychometric reviewer for the NCSBN Clinical Judgment Measurement Model.

Score the following question on each dimension from 0.0 to 10.0 (one decimal):

1. nclexRealism — Tests clinical judgment at application/analysis level (not pure recall).
2. distractorQuality — One clearly best answer; distractors are plausible and homogeneous.
3. rationaleQuality — Rationale teaches the decision rule; addresses why wrong options fail.
4. freshness — Non-repetitive stem/concept; not a template clone.
5. clarity — Professional, unambiguous, NCLEX-style wording.
6. examAuthenticity — Overall "would this appear on a real NCLEX?" feel.

Return ONLY valid JSON:
{
  "nclexRealism": number,
  "distractorQuality": number,
  "rationaleQuality": number,
  "freshness": number,
  "clarity": number,
  "examAuthenticity": number,
  "composite": number,
  "issues": string[],
  "recommendation": "keep" | "review" | "drop"
}

Scoring guidance:
- 8.0+ = strong keep candidate
- 7.0–7.9 = human review
- below 7.0 = drop from curated bank
- Penalize heavily: cartoon distractors, generic delegation/UAP templates, duplicate PPE/isolation stems, answer leaked in vignette, unstable patient with routine tasks as correct answer.`;

function tierBonus(tier: string): number {
  if (tier === "best") return 1.2;
  if (tier === "acceptable") return 0.6;
  if (tier === "serve") return 0.8;
  return 0;
}

function ruleScoreToTen(item: ReturnType<typeof enrichBankItemFromRow>, source: string | null): QualityScoreResult {
  const raw = scoreNclexBankItem(item);
  const verdict = assessNclexItemQuality(item, { source, mode: "best" });
  const ruleScore = Math.round((raw * 10 + tierBonus(verdict.tier)) * 10) / 10;
  const composite = Math.min(10, ruleScore - verdict.issues.length * 0.35);

  let tier: QualityScoreResult["tier"] = "drop";
  if (composite >= KEEP_MIN_SCORE && verdict.tier !== "reject") tier = "keep";
  else if (composite >= REVIEW_MIN_SCORE && verdict.tier !== "reject") tier = "review";

  return {
    composite,
    ruleScore,
    llmScore: null,
    dimensions: {},
    tier,
    issues: verdict.issues,
    scoredBy: "rule",
  };
}

function parseLlmScore(content: string): Partial<QualityDimensionScores & { composite: number; issues: string[]; recommendation: string }> | null {
  try {
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) return null;
    return JSON.parse(content.slice(jsonStart, jsonEnd + 1)) as Partial<
      QualityDimensionScores & { composite: number; issues: string[]; recommendation: string }
    >;
  } catch {
    return null;
  }
}

export async function scoreQuestionWithLlm(row: CurationQuestionRow): Promise<QualityScoreResult | null> {
  const openai = getOpenAiClient("curation");
  if (!openai) return null;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NCLEX_QUALITY_RUBRIC_PROMPT },
      { role: "user", content: buildQualityPromptText(row) },
    ],
  });

  const parsed = parseLlmScore(res.choices[0]?.message?.content ?? "");
  if (!parsed || typeof parsed.composite !== "number") return null;

  const llmScore = Math.round(parsed.composite * 10) / 10;
  let tier: QualityScoreResult["tier"] = "drop";
  if (llmScore >= KEEP_MIN_SCORE) tier = "keep";
  else if (llmScore >= REVIEW_MIN_SCORE) tier = "review";

  return {
    composite: llmScore,
    ruleScore: 0,
    llmScore,
    dimensions: {
      nclexRealism: parsed.nclexRealism,
      distractorQuality: parsed.distractorQuality,
      rationaleQuality: parsed.rationaleQuality,
      freshness: parsed.freshness,
      clarity: parsed.clarity,
      examAuthenticity: parsed.examAuthenticity,
    },
    tier: parsed.recommendation === "keep" ? "keep" : parsed.recommendation === "review" ? "review" : tier,
    issues: parsed.issues ?? [],
    scoredBy: "llm",
  };
}

export async function scoreQuestion(
  row: CurationQuestionRow,
  opts: { useLlm?: boolean } = {}
): Promise<QualityScoreResult> {
  const bankRow = {
    ...row,
    fieldId: "nursing",
    itemType: "vignette",
    active: true,
    qaPassed: false,
    contentHash: row.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as QuestionBankItem;

  const item = enrichBankItemFromRow(bankRow);
  const rule = ruleScoreToTen(item, row.source);

  if (!opts.useLlm) return rule;

  const llm = await scoreQuestionWithLlm(row);
  if (!llm) return rule;

  const composite = Math.round((llm.composite * 0.65 + rule.composite * 0.35) * 10) / 10;
  let tier: QualityScoreResult["tier"] = "drop";
  if (composite >= KEEP_MIN_SCORE) tier = "keep";
  else if (composite >= REVIEW_MIN_SCORE) tier = "review";

  return {
    composite,
    ruleScore: rule.ruleScore,
    llmScore: llm.llmScore,
    dimensions: llm.dimensions,
    tier,
    issues: [...new Set([...rule.issues, ...llm.issues])],
    scoredBy: "blended",
  };
}

export function scoreQuestionSync(row: CurationQuestionRow): QualityScoreResult {
  const bankRow = {
    ...row,
    fieldId: "nursing",
    itemType: "vignette",
    active: true,
    qaPassed: false,
    contentHash: row.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as QuestionBankItem;
  return ruleScoreToTen(enrichBankItemFromRow(bankRow), row.source);
}
