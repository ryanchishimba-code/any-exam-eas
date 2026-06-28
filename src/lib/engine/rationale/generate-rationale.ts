/**
 * Generate structured rationales via OpenAI — shared across all exam fields.
 */
import { z } from "zod";
import { getOpenAiClient } from "@/lib/openai-client";
import type { BankItem } from "@/lib/question-bank";
import {
  buildRationaleMasterSystemPrompt,
  buildRationaleUserPrompt,
  rationaleInputFromBankItem,
  type RationaleGenerationInput,
  type StructuredRationale,
} from "../prompts/rationale-generation";
import { assembleStructuredRationale, type AssembledRationale } from "./assemble-rationale";
import { validateStructuredRationale } from "./validate-rationale";

const StructuredRationaleSchema = z.object({
  whyCorrect: z.object({
    headline: z.string().min(20),
    conceptBreakdown: z.array(z.string().min(8)).min(2).max(5),
    clinicalContext: z.string().min(20),
  }),
  whyIncorrect: z.array(
    z.object({
      option: z.string().min(1),
      misconception: z.string().min(10),
      correction: z.string().min(20),
      conceptLink: z.string().min(10),
    })
  ),
  keyTakeaway: z.string().min(15),
  memoryHook: z.string().min(5).optional(),
});

export type GenerateRationaleResult = {
  structured: StructuredRationale;
  assembled: AssembledRationale;
  quality: ReturnType<typeof validateStructuredRationale>;
  model: string;
};

export type GenerateRationaleOptions = {
  maxRetries?: number;
  temperature?: number;
};

const openai = getOpenAiClient("enrichment");

export async function generateStructuredRationale(
  input: RationaleGenerationInput,
  opts?: GenerateRationaleOptions
): Promise<GenerateRationaleResult | null> {
  if (!openai) return null;

  const maxRetries = opts?.maxRetries ?? 2;
  const system = buildRationaleMasterSystemPrompt(input.fieldId);
  const user = buildRationaleUserPrompt(input);

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: opts?.temperature ?? 0.25,
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              attempt > 0
                ? `${user}\n\nPrevious response failed validation. Address EVERY wrong option with specific, non-generic corrections. Return valid JSON only.`
                : user,
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) continue;

      const parsed = StructuredRationaleSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) continue;

      const quality = validateStructuredRationale(
        parsed.data,
        input.options,
        input.correctAnswer
      );

      if (!quality.ok && attempt < maxRetries) continue;

      const assembled = assembleStructuredRationale(parsed.data);
      return {
        structured: parsed.data,
        assembled,
        quality,
        model: "gpt-4o-mini",
      };
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) console.warn("[generate-rationale] failed:", lastError);
  return null;
}

/** Apply assembled rationale fields onto a partial bank item shape. */
export function applyAssembledRationale<T extends Record<string, unknown>>(
  item: T,
  assembled: AssembledRationale
): T & {
  explanation: string;
  distractorRationale: Record<string, string>;
  clinicalReasoning: string;
  keyTakeaways: string[];
} {
  return {
    ...item,
    explanation: assembled.explanation,
    distractorRationale: assembled.distractorRationale,
    clinicalReasoning: assembled.clinicalReasoning,
    keyTakeaways: assembled.keyTakeaways,
  };
}

/** Optional post-generation enrich when RATIONALE_ENRICH_ON_GENERATE=1. */
export async function maybeEnrichBankItemRationale(
  item: BankItem,
  fieldId: string
): Promise<BankItem> {
  if (process.env.RATIONALE_ENRICH_ON_GENERATE !== "1") return item;

  const { needsRationaleEnrichment } = await import("./needs-enrichment");
  const check = needsRationaleEnrichment(item);
  if (!check.needs) return item;

  const result = await generateStructuredRationale(rationaleInputFromBankItem(item, fieldId));
  if (!result?.quality.ok) return item;

  return applyAssembledRationale(
    { ...item, keyTakeaways: result.assembled.keyTakeaways },
    result.assembled
  );
}
