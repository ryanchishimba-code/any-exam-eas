import {
  dedupeBankItemsById,
  QUESTION_BANK_SAMPLE_MAX_PULL,
  sampleQuestionBankItems,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import type { BankItem } from "@/lib/question-bank";
import { isMpjeField } from "@/lib/mpje/config";
import { isPracticeFieldId } from "@/lib/subjects/field-ids";
import { filterBankItemsForSessionPool } from "@/lib/exam-prep/prepare-bank-session";
import { filterItemsForNclexBlueprintTopics } from "@/lib/exam-prep/nclex/topic-blueprint-match";
import { filterItemsForNaplexBlueprintTopics } from "@/lib/exam-prep/naplex/topic-blueprint-match";
import { filterItemsForUsmleBlueprintTopics } from "@/lib/exam-prep/usmle/topic-blueprint-match";
import { filterItemsForPanceBlueprintTopics } from "@/lib/exam-prep/pance/topic-blueprint-match";
import { filterItemsForAanpFnpBlueprintTopics } from "@/lib/exam-prep/aanp-fnp/topic-blueprint-match";
import { filterItemsForNptePtBlueprintTopics } from "@/lib/exam-prep/npte-pt/topic-blueprint-match";
import { isNaplexCalcTopicSlug, isNaplexCalculationItem } from "@/lib/exam-prep/naplex/calc-topic-qa";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";

/** Single-subject question bank sessions (not mixed-field / not timed full exams). */
export function supportsTopicBankPractice(fieldId: string): boolean {
  return isPracticeFieldId(fieldId) || isMpjeField(fieldId);
}

/** DB pull size — large enough to survive runtime gates without template-stem collapse. */
export function resolveTopicBankSampleCount(limit: number): number {
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(limit * 6, 80));
}

const TOPIC_GATHER_MAX_ROUNDS = 2;
const NAPLEX_TOPIC_GATHER_MAX_ROUNDS = 8;
const USMLE_TOPIC_GATHER_MAX_ROUNDS = 8;
const EXAM_TOPIC_GATHER_MAX_ROUNDS = 8;

type ExamBlueprintFilterFn = (items: BankItem[], blueprintTopics: string[]) => BankItem[];

/** Step 3 topics that need explicit itemType pulls from the bank. */
const USMLE_STEP3_ITEM_TYPE_PULLS: Partial<Record<string, readonly string[]>> = {
  "pharmaceutical-ads-abstracts": ["abstract", "drug_ad"],
  "biostatistics-epidemiology": ["biostats"],
  "nnt-arr": ["biostats"],
  "medical-ethics-legal": ["ethics"],
  "ccs-case-management": ["ccs_prompt"],
  "ccs-initial-workup": ["ccs_prompt"],
  "ccs-monitoring-escalation": ["ccs_prompt"],
};

function naplexBlueprintFilter(
  items: BankItem[],
  blueprintTopics: string[],
  naplexTopic?: string
): BankItem[] {
  return filterItemsForNaplexBlueprintTopics(items, blueprintTopics, {
    contentMatch: true,
    topicSlug: naplexTopic,
  });
}

async function gatherNaplexBlueprintTopicPool(params: {
  fieldId: string;
  subjectId: string;
  sessionLimit: number;
  poolTarget: number;
  minVetted: number;
  blueprintTopics: string[];
  naplexTopic?: string;
  taskCategory?: string | null;
  stateCode?: string;
}): Promise<BankItem[]> {
  const seen = new Set<string>();
  const merged: BankItem[] = [];

  const mergeAligned = (items: BankItem[]) => {
    for (const item of items) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  };

  for (let round = 0; round < NAPLEX_TOPIC_GATHER_MAX_ROUNDS; round++) {
    const pull = await sampleQuestionBankItems({
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      count: params.poolTarget,
      poolMultiplier: 4,
      taskCategory: params.taskCategory,
      stateCode: params.stateCode,
    });
    const vetted = filterBankItemsForSessionPool({
      fieldId: params.fieldId,
      items: pull,
    });
    mergeAligned(
      naplexBlueprintFilter(vetted, params.blueprintTopics, params.naplexTopic)
    );
    if (merged.length >= params.minVetted) break;
    if (merged.length >= params.sessionLimit) break;
  }

  if (merged.length < params.sessionLimit) {
    for (let round = 0; round < NAPLEX_TOPIC_GATHER_MAX_ROUNDS; round++) {
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, params.poolTarget * 3),
        taskCategory: params.taskCategory,
      });
      const fieldVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      });
      mergeAligned(
        naplexBlueprintFilter(fieldVetted, params.blueprintTopics, params.naplexTopic)
      );
      if (merged.length >= params.minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }
  }

  if (params.naplexTopic && isNaplexCalcTopicSlug(params.naplexTopic)) {
    for (const subjectId of [params.subjectId, "compounding-calculations", "cardiovascular-rx"] as const) {
      const calcPull = await sampleQuestionBankItems({
        fieldId: params.fieldId,
        subjectId,
        count: params.poolTarget,
        poolMultiplier: 4,
        itemType: "constructed_response",
      });
      const calcVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: calcPull,
      });
      mergeAligned(
        naplexBlueprintFilter(calcVetted, params.blueprintTopics, params.naplexTopic)
      );
    }

    if (merged.length < params.sessionLimit) {
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: QUESTION_BANK_SAMPLE_MAX_PULL,
        taskCategory: params.taskCategory,
      });
      const calcLike = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      }).filter((item) => isNaplexCalculationItem(item));
      mergeAligned(
        naplexBlueprintFilter(calcLike, params.blueprintTopics, params.naplexTopic)
      );
    }
  }

  if (merged.length < params.sessionLimit) {
    mergeAligned(
      await naplexFallbackTopicScan({
        fieldId: params.fieldId,
        blueprintTopics: params.blueprintTopics,
        naplexTopic: params.naplexTopic,
      })
    );
  }

  return dedupeBankItemsById(merged).slice(0, params.poolTarget);
}

async function naplexFallbackTopicScan(params: {
  fieldId: string;
  blueprintTopics: string[];
  naplexTopic?: string;
}): Promise<BankItem[]> {
  const { getPrisma } = await import("@/lib/prisma");
  const { enrichBankItemFromRow } = await import("@/lib/mpje/parse-bank-options");
  const prisma = getPrisma();
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: params.fieldId, active: true, qaPassed: true },
    orderBy: { id: "asc" },
  });
  const items = rows.map((row) => enrichBankItemFromRow(row));
  const vetted = filterBankItemsForSessionPool({
    fieldId: params.fieldId,
    items,
  });
  return naplexBlueprintFilter(vetted, params.blueprintTopics, params.naplexTopic);
}

function usmleBlueprintFilter(
  items: BankItem[],
  blueprintTopics: string[],
  usmleTopic?: string
): BankItem[] {
  return filterItemsForUsmleBlueprintTopics(items, blueprintTopics, {
    contentMatch: true,
    topicSlug: usmleTopic,
  });
}

async function gatherUsmleBlueprintTopicPool(params: {
  fieldId: string;
  subjectId: string;
  sessionLimit: number;
  poolTarget: number;
  minVetted: number;
  blueprintTopics: string[];
  usmleTopic?: string;
  taskCategory?: string | null;
  stateCode?: string;
}): Promise<BankItem[]> {
  const seen = new Set<string>();
  const merged: BankItem[] = [];

  const mergeAligned = (items: BankItem[]) => {
    for (const item of items) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  };

  for (let round = 0; round < USMLE_TOPIC_GATHER_MAX_ROUNDS; round++) {
    const pull = await sampleQuestionBankItems({
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      count: params.poolTarget,
      poolMultiplier: 4,
      taskCategory: params.taskCategory,
      stateCode: params.stateCode,
      blueprintTopics: params.blueprintTopics,
    });
    const vetted = filterBankItemsForSessionPool({
      fieldId: params.fieldId,
      items: pull,
    });
    mergeAligned(usmleBlueprintFilter(vetted, params.blueprintTopics, params.usmleTopic));
    if (merged.length >= params.minVetted) break;
    if (merged.length >= params.sessionLimit) break;
  }

  if (merged.length < params.sessionLimit) {
    for (let round = 0; round < USMLE_TOPIC_GATHER_MAX_ROUNDS; round++) {
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, params.poolTarget * 3),
        taskCategory: params.taskCategory,
      });
      const fieldVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      });
      mergeAligned(usmleBlueprintFilter(fieldVetted, params.blueprintTopics, params.usmleTopic));
      if (merged.length >= params.minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }
  }

  if (merged.length < params.sessionLimit) {
    mergeAligned(
      await usmleFallbackTopicScan({
        fieldId: params.fieldId,
        blueprintTopics: params.blueprintTopics,
        usmleTopic: params.usmleTopic,
      })
    );
  }

  const itemTypePulls = params.usmleTopic
    ? USMLE_STEP3_ITEM_TYPE_PULLS[params.usmleTopic]
    : undefined;
  if (itemTypePulls?.length && merged.length < params.sessionLimit) {
    for (const itemType of itemTypePulls) {
      const typedPull = await sampleQuestionBankItems({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        count: params.poolTarget,
        poolMultiplier: 4,
        itemType,
      });
      const typedVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: typedPull,
      });
      mergeAligned(usmleBlueprintFilter(typedVetted, params.blueprintTopics, params.usmleTopic));
      if (merged.length >= params.sessionLimit) break;
    }

    if (merged.length < params.sessionLimit) {
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: QUESTION_BANK_SAMPLE_MAX_PULL,
        taskCategory: params.taskCategory,
      });
      const typedLike = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      }).filter((item) => itemTypePulls.includes(item.itemType ?? "mcq"));
      mergeAligned(usmleBlueprintFilter(typedLike, params.blueprintTopics, params.usmleTopic));
    }
  }

  return dedupeBankItemsById(merged).slice(0, params.poolTarget);
}

async function usmleFallbackTopicScan(params: {
  fieldId: string;
  blueprintTopics: string[];
  usmleTopic?: string;
}): Promise<BankItem[]> {
  const { getPrisma } = await import("@/lib/prisma");
  const { enrichBankItemFromRow } = await import("@/lib/mpje/parse-bank-options");
  const prisma = getPrisma();
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: params.fieldId, active: true, qaPassed: true },
    orderBy: { id: "asc" },
  });
  const items = rows.map((row) => enrichBankItemFromRow(row));
  const vetted = filterBankItemsForSessionPool({
    fieldId: params.fieldId,
    items,
  });
  return usmleBlueprintFilter(vetted, params.blueprintTopics, params.usmleTopic);
}

async function gatherExamBlueprintTopicPool(params: {
  fieldId: string;
  subjectId: string;
  sessionLimit: number;
  poolTarget: number;
  minVetted: number;
  blueprintTopics: string[];
  taskCategory?: string | null;
  stateCode?: string;
  filterItems: ExamBlueprintFilterFn;
}): Promise<BankItem[]> {
  const seen = new Set<string>();
  const merged: BankItem[] = [];

  const mergeAligned = (items: BankItem[]) => {
    for (const item of items) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  };

  for (let round = 0; round < EXAM_TOPIC_GATHER_MAX_ROUNDS; round++) {
    const pull = await sampleQuestionBankItems({
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      count: params.poolTarget,
      poolMultiplier: 4,
      taskCategory: params.taskCategory,
      stateCode: params.stateCode,
      blueprintTopics: params.blueprintTopics,
    });
    const vetted = filterBankItemsForSessionPool({
      fieldId: params.fieldId,
      items: pull,
    });
    mergeAligned(params.filterItems(vetted, params.blueprintTopics));
    if (merged.length >= params.minVetted) break;
    if (merged.length >= params.sessionLimit) break;
  }

  if (merged.length < params.sessionLimit) {
    for (let round = 0; round < EXAM_TOPIC_GATHER_MAX_ROUNDS; round++) {
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, params.poolTarget * 3),
        taskCategory: params.taskCategory,
      });
      const fieldVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      });
      mergeAligned(params.filterItems(fieldVetted, params.blueprintTopics));
      if (merged.length >= params.minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }
  }

  if (merged.length < params.sessionLimit) {
    const { getPrisma } = await import("@/lib/prisma");
    const { enrichBankItemFromRow } = await import("@/lib/mpje/parse-bank-options");
    const prisma = getPrisma();
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: params.fieldId, active: true, qaPassed: true },
      orderBy: { id: "asc" },
    });
    const items = rows.map((row) => enrichBankItemFromRow(row));
    const vetted = filterBankItemsForSessionPool({
      fieldId: params.fieldId,
      items,
    });
    mergeAligned(params.filterItems(vetted, params.blueprintTopics));
  }

  return dedupeBankItemsById(merged).slice(0, params.poolTarget);
}

/**
 * Pull and vet enough single-topic rows for an exact-count session.
 * Re-samples when serve gates thin the first pull.
 */
export async function gatherTopicBankSessionPool(params: {
  fieldId: string;
  subjectId: string;
  sessionLimit: number;
  taskCategory?: string | null;
  stateCode?: string;
  /** NCLEX/NAPLEX: granular blueprint slugs for topic-faithful practice. */
  blueprintTopics?: string[];
  /** NAPLEX: Study Hub topic slug for calc subtopic filters. */
  naplexTopic?: string;
  /** USMLE: Study Hub topic slug for Step 3 format subtopic filters. */
  usmleTopic?: string;
  panceTopic?: string;
  aanpFnpTopic?: string;
  nptePtTopic?: string;
}): Promise<BankItem[]> {
  const poolTarget = resolveTopicBankSampleCount(params.sessionLimit);
  const minVetted = Math.min(poolTarget, params.sessionLimit + 40);
  const blueprintTopics = params.blueprintTopics?.filter(Boolean);

  const seen = new Set<string>();
  const merged: BankItem[] = [];

  const mergeVetted = (vetted: BankItem[]) => {
    for (const item of vetted) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  };

  if (blueprintTopics?.length) {
    if (params.fieldId === "pharmacy") {
      return gatherNaplexBlueprintTopicPool({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        sessionLimit: params.sessionLimit,
        poolTarget,
        minVetted,
        blueprintTopics,
        naplexTopic: params.naplexTopic,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
      });
    }

    if (isUsmleFieldId(params.fieldId)) {
      return gatherUsmleBlueprintTopicPool({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        sessionLimit: params.sessionLimit,
        poolTarget,
        minVetted,
        blueprintTopics,
        usmleTopic: params.usmleTopic,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
      });
    }

    if (params.fieldId === "pance") {
      return gatherExamBlueprintTopicPool({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        sessionLimit: params.sessionLimit,
        poolTarget,
        minVetted,
        blueprintTopics,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
        filterItems: (items, topics) =>
          filterItemsForPanceBlueprintTopics(items, topics, { contentMatch: true }),
      });
    }

    if (params.fieldId === "aanp-fnp") {
      return gatherExamBlueprintTopicPool({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        sessionLimit: params.sessionLimit,
        poolTarget,
        minVetted,
        blueprintTopics,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
        filterItems: (items, topics) =>
          filterItemsForAanpFnpBlueprintTopics(items, topics, { contentMatch: true }),
      });
    }

    if (params.fieldId === "npte-pt") {
      return gatherExamBlueprintTopicPool({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        sessionLimit: params.sessionLimit,
        poolTarget,
        minVetted,
        blueprintTopics,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
        filterItems: (items, topics) =>
          filterItemsForNptePtBlueprintTopics(items, topics, { contentMatch: true }),
      });
    }

    for (let round = 0; round < TOPIC_GATHER_MAX_ROUNDS; round++) {
      const pull = await sampleQuestionBankItems({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        count: poolTarget,
        poolMultiplier: 2,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
        blueprintTopics,
      });

      const vetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: pull,
      });

      const blueprintFiltered = filterItemsForNclexBlueprintTopics(vetted, blueprintTopics, {
        contentMatch: true,
      });
      mergeVetted(blueprintFiltered);

      if (merged.length >= minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }

    if (merged.length >= params.sessionLimit) {
      return dedupeBankItemsById(merged).slice(0, poolTarget);
    }

    // Blueprint tags may be sparse — widen subject/field pulls but keep blueprint alignment.
    for (let round = 0; round < TOPIC_GATHER_MAX_ROUNDS; round++) {
      const pull = await sampleQuestionBankItems({
        fieldId: params.fieldId,
        subjectId: params.subjectId,
        count: poolTarget,
        poolMultiplier: 3,
        taskCategory: params.taskCategory,
        stateCode: params.stateCode,
      });

      const vetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: pull,
      });

      mergeVetted(
        params.fieldId === "nursing"
          ? filterItemsForNclexBlueprintTopics(vetted, blueprintTopics, {
              contentMatch: true,
            })
          : vetted
      );

      if (merged.length >= minVetted) break;
      if (merged.length >= params.sessionLimit) break;
    }

    if (params.fieldId === "nursing") {
      // Sparse blueprint tags often live outside the topic's Client Needs subject —
      // widen field-wide, but keep blueprint alignment (do not dilute with off-topic items).
      const fieldPull = await sampleQuestionBankItemsForField({
        fieldId: params.fieldId,
        count: Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, poolTarget * 3),
      });
      const fieldVetted = filterBankItemsForSessionPool({
        fieldId: params.fieldId,
        items: fieldPull,
      });
      mergeVetted(
        filterItemsForNclexBlueprintTopics(fieldVetted, blueprintTopics, {
          contentMatch: true,
        })
      );
    }

    return dedupeBankItemsById(merged).slice(0, poolTarget);
  }

  for (let round = 0; round < TOPIC_GATHER_MAX_ROUNDS; round++) {
    const pull = await sampleQuestionBankItems({
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      count: poolTarget,
      poolMultiplier: 2,
      taskCategory: params.taskCategory,
      stateCode: params.stateCode,
    });

    const vetted = filterBankItemsForSessionPool({
      fieldId: params.fieldId,
      items: pull,
    });

    mergeVetted(vetted);

    if (merged.length >= minVetted) break;
    if (merged.length >= params.sessionLimit) break;
  }

  return dedupeBankItemsById(merged).slice(0, poolTarget);
}
