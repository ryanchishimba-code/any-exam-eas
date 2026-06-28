/**
 * Generate UWorld-caliber expert NCLEX rationales via OpenAI.
 */
import { z } from "zod";
import { getOpenAiClient } from "@/lib/openai-client";
import {
  buildNclexExpertSystemPrompt,
  buildNclexExpertUserPrompt,
} from "../prompts/nclex-expert-rationale";
import type { RationaleGenerationInput } from "../prompts/rationale-generation";
import { validateStructuredRationale } from "./validate-rationale";
import {
  assembleExpertRationale,
  type AssembledExpertRationale,
} from "./assemble-expert-rationale";
import type { ExpertStructuredRationale } from "./expert-rationale-types";
import { EXPERT_RATIONALE_META_KEY, EXPERT_RATIONALE_VERSION } from "./expert-rationale-types";

const ExpertRationaleSchema = z.object({
  whyCorrect: z.object({
    headline: z.string().min(20),
    conceptBreakdown: z.array(z.string().min(8)).min(2).max(5),
    clinicalContext: z.string().min(20),
  }),
  stepByStepReasoning: z.array(z.string().min(15)).min(3).max(7),
  whyIncorrect: z.array(
    z.object({
      option: z.string().min(1),
      misconception: z.string().min(10),
      correction: z.string().min(25),
      conceptLink: z.string().min(10),
    })
  ),
  clinicalPearl: z.string().min(20),
  pharmacologyTieIn: z.string().optional(),
  highYieldFacts: z.array(z.string().min(10)).min(2).max(5),
  commonPitfalls: z.array(z.string().min(10)).min(1).max(4),
  nextStepInCare: z.string().min(15).optional(),
  testTakingTip: z.string().min(15),
  realWorldApplication: z.string().min(20),
  layeredDepth: z
    .object({
      basic: z.string().min(15),
      intermediate: z.string().min(20),
      advanced: z.string().min(20),
    })
    .optional(),
  visualCues: z
    .array(
      z.object({
        label: z.string().min(3),
        description: z.string().min(10),
      })
    )
    .optional(),
  crossReferences: z
    .array(
      z.object({
        exam: z.string().min(2),
        topic: z.string().min(3),
        note: z.string().min(10),
      })
    )
    .optional(),
  keyTakeaway: z.string().min(15),
  memoryHook: z.string().min(5).optional(),
});

export type GenerateExpertRationaleResult = {
  structured: ExpertStructuredRationale;
  assembled: AssembledExpertRationale;
  quality: ReturnType<typeof validateStructuredRationale>;
  model: string;
  version: string;
};

const openai = getOpenAiClient("enrichment");

export async function generateExpertNclexRationale(
  input: RationaleGenerationInput,
  opts?: { maxRetries?: number; temperature?: number }
): Promise<GenerateExpertRationaleResult | null> {
  if (!openai) return null;

  const maxRetries = opts?.maxRetries ?? 2;
  const system = buildNclexExpertSystemPrompt();
  const user = buildNclexExpertUserPrompt(input);

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: opts?.temperature ?? 0.28,
        max_tokens: 3200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              attempt > 0
                ? `${user}\n\nPrevious JSON failed validation. Include ALL wrong options with vignette-specific corrections, 3+ stepByStepReasoning steps, and 2+ highYieldFacts. JSON only.`
                : user,
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) continue;

      const parsed = ExpertRationaleSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) continue;

      const quality = validateStructuredRationale(
        parsed.data,
        input.options,
        input.correctAnswer
      );

      if (!quality.ok && attempt < maxRetries) continue;

      const assembled = assembleExpertRationale(parsed.data as ExpertStructuredRationale);
      return {
        structured: parsed.data as ExpertStructuredRationale,
        assembled,
        quality,
        model: "gpt-4o-mini",
        version: EXPERT_RATIONALE_VERSION,
      };
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) console.warn("[generate-expert-rationale] failed:", lastError);
  return null;
}

/** Expert-tier enrich for NCLEX generation when RATIONALE_ENRICH_ON_GENERATE=1. */
export async function maybeEnrichExpertBankItemRationale(
  item: import("@/lib/question-bank").BankItem,
  fieldId: string
): Promise<import("@/lib/question-bank").BankItem> {
  if (process.env.RATIONALE_ENRICH_ON_GENERATE !== "1") return item;
  if (fieldId !== "nursing") {
    const { maybeEnrichBankItemRationale } = await import("./generate-rationale");
    return maybeEnrichBankItemRationale(item, fieldId);
  }

  const { needsRationaleEnrichment } = await import("./needs-enrichment");
  const { rationaleInputFromBankItem } = await import("../prompts/rationale-generation");
  const { applyAssembledRationale, maybeEnrichBankItemRationale } = await import(
    "./generate-rationale"
  );
  const check = needsRationaleEnrichment(item);
  if (!check.needs) return item;

  const result = await generateExpertNclexRationale(rationaleInputFromBankItem(item, fieldId));
  if (!result?.quality.ok) {
    return maybeEnrichBankItemRationale(item, fieldId);
  }

  const applied = applyAssembledRationale(
    {
      ...item,
      keyTakeaways: result.assembled.keyTakeaways,
      expertRationale: result.structured,
    },
    result.assembled
  );

  const priorMeta =
    typeof item.ngnPayload?.generationMeta === "object" && item.ngnPayload.generationMeta
      ? (item.ngnPayload.generationMeta as Record<string, unknown>)
      : {};

  return {
    ...applied,
    ngnPayload: {
      ...(item.ngnPayload ?? {}),
      generationMeta: {
        ...priorMeta,
        [EXPERT_RATIONALE_META_KEY]: result.structured,
        expertRationaleVersion: result.version,
        rationaleQualityScore: result.quality.score,
      },
    },
  };
}
