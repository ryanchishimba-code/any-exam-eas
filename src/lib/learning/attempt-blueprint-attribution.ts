/**
 * Map saved QuestionAttempt rows to blueprint category ids — same rule as inventory
 * chips and active-question counts (blueprintCategoryIdForQuestion), plus legacy
 * nursing subject slugs that predate Client Needs alignment.
 */

import { SUBJECT_TO_BLUEPRINT_DOMAIN } from "@/lib/exam-prep/nclex/infer-blueprint-topic";
import { blueprintCategoryIdForQuestion } from "@/lib/inventory/blueprint-domain-pool";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { prisma } from "@/lib/prisma";

const UNMAPPED_SUBJECTS = new Set([
  "",
  "__mixed__",
  "mixed",
  "unknown",
  "general",
]);

/** Legacy infer-blueprint-topic domain ids → official blueprint category ids. */
const NCLEX_LEGACY_CATEGORY_ID: Record<string, string> = {
  "basic-care": "basic-care-comfort",
  "risk-reduction": "reduction-risk",
};

const PRACTICE_SUBJECT_ALIASES: Record<string, Record<string, string>> = {
  pance: { ethics: "professional-practice" },
  "npte-pt": { ethics: "professional-responsibilities" },
};

export type AttemptAreaSource = {
  subjectId?: string | null;
  clientNeeds?: string | null;
  topicCategory?: string | null;
  blueprintDomain?: string | null;
};

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function isUsableSubject(subjectId: string): boolean {
  const key = subjectId.toLowerCase();
  return !UNMAPPED_SUBJECTS.has(key);
}

/** Resolve one attempt row to a blueprint category id, or null when unmapped. */
export function resolveBlueprintCategoryIdForAttempt(
  fieldId: string,
  source: AttemptAreaSource
): string | null {
  const canonical = normalizeFieldId(fieldId);
  const explicitClientNeeds = clean(source.clientNeeds);
  if (explicitClientNeeds) {
    const fromClient = blueprintCategoryIdForQuestion(canonical, {
      subjectId: clean(source.subjectId) || "unassigned",
      clientNeeds: explicitClientNeeds,
    });
    if (fromClient) return fromClient;
  }

  const rawSubject = clean(source.subjectId);
  const alias =
    rawSubject && PRACTICE_SUBJECT_ALIASES[canonical]?.[rawSubject.toLowerCase()];
  const subjectId = alias ?? rawSubject;

  const candidates = [
    subjectId,
    clean(source.topicCategory),
    clean(source.blueprintDomain),
  ].filter((value) => value && isUsableSubject(value));

  for (const candidate of candidates) {
    const fromBlueprint = blueprintCategoryIdForQuestion(canonical, {
      subjectId: candidate,
      clientNeeds: null,
    });
    if (fromBlueprint) return fromBlueprint;

    if (canonical === "nursing") {
      const legacy = SUBJECT_TO_BLUEPRINT_DOMAIN[candidate];
      if (legacy) {
        return NCLEX_LEGACY_CATEGORY_ID[legacy] ?? legacy;
      }
    }
  }

  return null;
}

export type CategoryAttemptStats = { attempts: number; correct: number };

function attemptItemKey(row: {
  bankItemId?: string | null;
  questionKey?: string | null;
}): string | null {
  if (row.bankItemId) return row.bankItemId;
  if (row.questionKey) return row.questionKey;
  return null;
}

/** Distinct answered items and attempt totals per blueprint category. */
export function aggregateAttemptsByBlueprintCategory(
  fieldId: string,
  rows: Array<{
    subjectId?: string | null;
    correct: boolean;
    bankItemId?: string | null;
    questionKey?: string | null;
    clientNeeds?: string | null;
    topicCategory?: string | null;
    blueprintDomain?: string | null;
  }>
): {
  statsByCategory: Map<string, CategoryAttemptStats>;
  seenByCategory: Map<string, number>;
} {
  const statsByCategory = new Map<string, CategoryAttemptStats>();
  const seenSets = new Map<string, Set<string>>();

  for (const row of rows) {
    const categoryId = resolveBlueprintCategoryIdForAttempt(fieldId, row);
    if (!categoryId) continue;

    const stats = statsByCategory.get(categoryId) ?? { attempts: 0, correct: 0 };
    stats.attempts += 1;
    if (row.correct) stats.correct += 1;
    statsByCategory.set(categoryId, stats);

    const itemKey = attemptItemKey(row);
    if (!itemKey) continue;
    const set = seenSets.get(categoryId) ?? new Set<string>();
    set.add(itemKey);
    seenSets.set(categoryId, set);
  }

  const seenByCategory = new Map<string, number>();
  for (const [categoryId, set] of seenSets) {
    seenByCategory.set(categoryId, set.size);
  }

  return { statsByCategory, seenByCategory };
}

/** Fill missing subject/clientNeeds from bank rows so category attribution matches inventory. */
export async function hydrateAttemptAreaFromBank<
  T extends {
    bankItemId?: string | null;
    questionKey?: string | null;
    subjectId?: string | null;
    clientNeeds?: string | null;
    topicCategory?: string | null;
    blueprintDomain?: string | null;
  },
>(attempts: T[]): Promise<T[]> {
  const missingIds = new Set<string>();
  for (const row of attempts) {
    if (clean(row.subjectId) || clean(row.clientNeeds)) continue;
    const id = clean(row.bankItemId) || clean(row.questionKey);
    if (id) missingIds.add(id);
  }
  if (missingIds.size === 0) return attempts;

  const ids = [...missingIds].slice(0, 4000);
  const bankRows = await prisma.questionBankItem.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      subjectId: true,
      clientNeeds: true,
      topicCategory: true,
      blueprintDomain: true,
    },
  });
  const byId = new Map(bankRows.map((row) => [row.id, row]));

  return attempts.map((row) => {
    if (clean(row.subjectId) || clean(row.clientNeeds)) return row;
    const id = clean(row.bankItemId) || clean(row.questionKey);
    if (!id) return row;
    const bank = byId.get(id);
    if (!bank) return row;
    return {
      ...row,
      subjectId: row.subjectId ?? bank.subjectId,
      clientNeeds: row.clientNeeds ?? bank.clientNeeds,
      topicCategory: row.topicCategory ?? bank.topicCategory,
      blueprintDomain: row.blueprintDomain ?? bank.blueprintDomain,
    };
  });
}
