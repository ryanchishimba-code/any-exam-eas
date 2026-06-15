import type { BankItem } from "@/lib/question-bank";
import {
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import { serveQaPassedBankItems } from "@/lib/exam-prep/serve-qa-passed";

export type TimedExamFilterFn = (item: BankItem) => boolean;

function itemDedupeKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

/**
 * Pull and vet enough bank rows for a timed/full exam session.
 * Runtime gates (NCLEX best-tier, USMLE clinical, etc.) often reject most of a single sample.
 */
export async function gatherTimedExamBankItems(params: {
  fieldId: string;
  limit: number;
  stateCode?: string;
  filterFn: TimedExamFilterFn;
  initialSampleCount: number;
}): Promise<BankItem[]> {
  const { fieldId, limit, stateCode, filterFn, initialSampleCount } = params;
  const seen = new Set<string>();
  const vetted: BankItem[] = [];
  let pullSize = Math.max(initialSampleCount, limit + 40);
  const maxRounds = 8;

  for (let round = 0; round < maxRounds && vetted.length < limit; round++) {
    const batch = await sampleQuestionBankItemsForField({
      fieldId,
      count: Math.min(pullSize, QUESTION_BANK_SAMPLE_MAX_PULL),
      stateCode,
    });

    for (const item of batch) {
      const key = itemDedupeKey(item);
      if (seen.has(key)) continue;
      seen.add(key);
      if (filterFn(item)) vetted.push(item);
    }

    if (vetted.length >= limit) break;
    pullSize = Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      pullSize + Math.max(limit, Math.ceil(limit * 0.75))
    );
  }

  return serveQaPassedBankItems(vetted, limit);
}
