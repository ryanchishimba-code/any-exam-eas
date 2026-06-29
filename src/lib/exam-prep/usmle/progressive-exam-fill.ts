/**
 * Progressive threshold relaxation for USMLE timed/full exams.
 * Escalates gather and finalize tiers until the requested count is met.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  dedupeBankItemsById,
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import {
  rawQuestionMeetsBoardBar,
  rawQuestionMeetsMinimalBoardBar,
  rawQuestionMeetsRelaxedBoardBar,
} from "@/lib/exam-prep/board-serve-quality";
import {
  usmleBankItemPassesBasicTimedGate,
  usmleBankItemPassesMinimalTimedGate,
  usmleBankItemPassesStructuralGate,
} from "@/lib/exam-prep/usmle-clinical-gate";
import type { TimedExamFilterFn } from "@/lib/questions/timed-exam-sampling";
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

type GatherTier = {
  id: string;
  filter: TimedExamFilterFn;
};

type FinalizeTier = {
  id: string;
  meetsBar: (q: RawQuestionInput) => boolean;
  dedupe: SessionDedupeMode;
};

function resolveTimedExamPoolTarget(limit: number): number {
  const base = Math.max(limit + 16, Math.ceil(limit * 1.35));
  const dedupeHeadroom = limit >= 100 ? Math.ceil(limit * 0.08) : 0;
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, base + dedupeHeadroom);
}

function resolveTimedExamPullSize(limit: number, poolTarget: number): number {
  return Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(Math.ceil(poolTarget / 0.92), limit + 16, 32)
  );
}

function itemDedupeKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

function usmleGatherTiers(fieldId: string): GatherTier[] {
  return [
    {
      id: "structural",
      filter: (item) => usmleBankItemPassesStructuralGate(item, fieldId),
    },
    {
      id: "basic_mcq",
      filter: (item) => usmleBankItemPassesBasicTimedGate(item, fieldId),
    },
    {
      id: "minimal",
      filter: (item) => usmleBankItemPassesMinimalTimedGate(item),
    },
  ];
}

function usmleFinalizeTiers(requested: number): FinalizeTier[] {
  const shortExamDedupe: SessionDedupeMode = requested >= 100 ? "id" : "clinical";
  return [
    { id: "strict", meetsBar: rawQuestionMeetsBoardBar, dedupe: shortExamDedupe },
    { id: "relaxed", meetsBar: rawQuestionMeetsRelaxedBoardBar, dedupe: "id" },
    { id: "minimal", meetsBar: rawQuestionMeetsMinimalBoardBar, dedupe: "id" },
    { id: "fill", meetsBar: () => true, dedupe: "id" },
  ];
}

function appendTierMatches(
  selected: BankItem[],
  selectedIds: Set<string>,
  candidates: BankItem[],
  filterFn: TimedExamFilterFn,
  target: number
): void {
  for (const item of candidates) {
    if (dedupeBankItemsById(selected).length >= target) break;
    const key = itemDedupeKey(item);
    if (selectedIds.has(key)) continue;
    if (!filterFn(item)) continue;
    selectedIds.add(key);
    selected.push(item);
  }
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
}): Promise<BankItem[]> {
  const { fieldId, limit, stateCode } = params;
  const poolTarget = resolveTimedExamPoolTarget(limit);
  const exportTarget = Math.max(limit, poolTarget);
  const tiers = usmleGatherTiers(fieldId);

  const seen = new Set<string>();
  const candidates: BankItem[] = [];
  const selected: BankItem[] = [];
  const selectedIds = new Set<string>();
  const gateCache = new Map<string, boolean>();

  const passFilter = (item: BankItem, tierId: string, filterFn: TimedExamFilterFn): boolean => {
    const cacheKey = `${tierId}:${item.id ?? itemDedupeKey(item)}`;
    const cached = gateCache.get(cacheKey);
    if (cached !== undefined) return cached;
    const ok = filterFn(item);
    gateCache.set(cacheKey, ok);
    return ok;
  };

  const countSelected = () => dedupeBankItemsById(selected).length;

  let pullSize = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(params.initialSampleCount, resolveTimedExamPullSize(limit, poolTarget))
  );

  for (const tier of tiers) {
    appendTierMatches(
      selected,
      selectedIds,
      candidates,
      (item) => passFilter(item, tier.id, tier.filter),
      exportTarget
    );
    if (countSelected() >= limit) break;

    for (let round = 0; round < 5 && countSelected() < limit; round++) {
      const batch = await sampleQuestionBankItemsForField({
        fieldId,
        count: pullSize,
        stateCode,
        skipEnsure: round > 0 || candidates.length > 0,
      });

      for (const item of batch) {
        const key = itemDedupeKey(item);
        if (seen.has(key)) continue;
        seen.add(key);
        candidates.push(item);
      }

      appendTierMatches(
        selected,
        selectedIds,
        candidates,
        (item) => passFilter(item, tier.id, tier.filter),
        exportTarget
      );

      if (countSelected() >= limit) break;
      pullSize = Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.ceil(pullSize * 1.25));
    }
  }

  return dedupeBankItemsById(selected).slice(0, Math.min(exportTarget, countSelected()));
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
