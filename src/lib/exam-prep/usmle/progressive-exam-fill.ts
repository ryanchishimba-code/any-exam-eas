/**
 * Progressive threshold relaxation for USMLE timed/full exams.
 * Escalates gather and finalize tiers until the requested count is met.
 */
import type { BankItem } from "@/lib/question-bank";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import {
  rawQuestionMeetsBoardBar,
  rawQuestionMeetsMinimalBoardBar,
  rawQuestionMeetsRelaxedBoardBar,
} from "@/lib/exam-prep/board-serve-quality";
import {
  enforceSessionCount,
} from "@/lib/questions/session-quality";
import { prepareQuestionsForSession } from "@/lib/questions/prepare";
import {
  selectSpreadRawInputs,
  type SessionDedupeMode,
} from "@/lib/questions/spread-session-order";
import type { RawQuestionInput, StudyQuestion } from "@/lib/questions/types";

type ExamSessionQualityReport = {
  ok: boolean;
  issues: string[];
  returned: number;
  requested: number;
  poolAllowsDifficultyMix: boolean;
};

type FinalizeTier = {
  id: string;
  meetsBar: (q: RawQuestionInput) => boolean;
  dedupe: SessionDedupeMode;
};

function usmleFinalizeTiers(requested: number): FinalizeTier[] {
  const shortExamDedupe: SessionDedupeMode = requested >= 100 ? "id" : "clinical";
  return [
    { id: "strict", meetsBar: rawQuestionMeetsBoardBar, dedupe: shortExamDedupe },
    { id: "relaxed", meetsBar: rawQuestionMeetsRelaxedBoardBar, dedupe: "id" },
    { id: "minimal", meetsBar: rawQuestionMeetsMinimalBoardBar, dedupe: "id" },
    { id: "fill", meetsBar: () => true, dedupe: "id" },
  ];
}

/**
 * Pull USMLE bank rows with progressive gate relaxation until `limit` unique items
 * are available (or the bank is exhausted).
 */
export async function gatherUsmleTimedExamBankItems(params: {
  fieldId: string;
  limit: number;
  initialSampleCount: number;
  stateCode?: string;
  /** Live exams use 1 round per gate tier (default). */
  maxRoundsPerTier?: number;
}): Promise<BankItem[]> {
  const ladder = timedExamGatherLadderForField(params.fieldId);
  return gatherProgressiveBankPool({
    fieldId: params.fieldId,
    limit: params.limit,
    maxTierIndex: ladder.length - 1,
    initialSampleCount: params.initialSampleCount,
    stateCode: params.stateCode,
    maxRoundsPerTier: params.maxRoundsPerTier ?? 1,
  });
}

function finalizeAtTier(
  raw: RawQuestionInput[],
  requested: number,
  tier: FinalizeTier
): StudyQuestion[] {
  const vetted = raw.filter(tier.meetsBar);
  const selected = selectSpreadRawInputs(vetted, requested, {
    requestedCount: requested,
    dedupeMode: tier.dedupe,
  });
  return enforceSessionCount(
    prepareQuestionsForSession(selected, { shuffleOrder: false }),
    requested
  );
}

/** Build a USMLE session, relaxing quality tiers until the requested count is met. */
export function finalizeUsmleExamSessionQuestions(
  raw: RawQuestionInput[],
  requested: number
): { prepared: StudyQuestion[]; quality: ExamSessionQualityReport } {
  for (const tier of usmleFinalizeTiers(requested)) {
    const prepared = finalizeAtTier(raw, requested, tier);
    if (prepared.length >= requested) {
      return {
        prepared: prepared.slice(0, requested),
        quality: {
          ok: true,
          issues: [],
          returned: requested,
          requested,
          poolAllowsDifficultyMix: true,
        },
      };
    }
  }

  const fallback = finalizeAtTier(raw, requested, {
    id: "fill",
    meetsBar: () => true,
    dedupe: "id",
  });

  const returned = Math.min(fallback.length, requested);
  return {
    prepared: fallback.slice(0, returned),
    quality: {
      ok: returned === requested,
      issues: returned !== requested ? [`count_mismatch:${returned}/${requested}`] : [],
      returned,
      requested,
      poolAllowsDifficultyMix: true,
    },
  };
}
