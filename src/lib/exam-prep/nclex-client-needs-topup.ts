/**
 * When a nursing sitting's gathered window is short of a client-needs minimum,
 * read more of that category from the bank. Specialty subjects are not a
 * stand-in for the category.
 */
import type { Prisma } from "@prisma/client";
import type { BankItem } from "@/lib/question-bank";
import { ineligibleServedIds, retainStudentEligibleBankItems } from "@/lib/exam-prep/student-eligibility";
import {
  clientNeedsDeficits,
  clientNeedsOptionTexts,
  clientNeedsStoredValues,
  clientNeedsTargets,
  examClientNeedsCategory,
} from "@/lib/exam-prep/nclex-client-needs-quota";
import type { NclexClientNeedsId } from "@/lib/exam-prep/nclex/types";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { sampleQuestionBankRows } from "@/lib/question-bank/random-sample";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";

const NURSING_FIELD_ID = "nursing";

/** Served rows whose own category is `categoryId`. Subject-only specialties stay out. */
export function nursingClientNeedsWhere(
  categoryId: NclexClientNeedsId,
  excludeIds: readonly string[]
): Prisma.QuestionBankItemWhereInput {
  const stored = clientNeedsStoredValues(categoryId);
  const displays = clientNeedsOptionTexts(categoryId);
  const exclude = [...new Set(excludeIds.map((id) => id.trim()).filter(Boolean))];
  return {
    fieldId: NURSING_FIELD_ID,
    active: true,
    qaPassed: true,
    ...(exclude.length > 0 ? { id: { notIn: exclude } } : {}),
    OR: [
      ...stored.map((value) => ({ clientNeeds: { equals: value, mode: "insensitive" as const } })),
      {
        AND: [
          { subjectId: categoryId },
          { OR: [{ clientNeeds: null }, { clientNeeds: "" }] },
        ],
      },
      { options: { contains: `"clientNeedsCategory":"${categoryId}"` } },
      { options: { contains: `"clientNeedsCategory": "${categoryId}"` } },
      ...displays.flatMap((value) => [
        { options: { contains: `"clientNeedsCategory":"${value}"` } },
        { options: { contains: `"clientNeedsCategory": "${value}"` } },
      ]),
      { tags: { contains: `cn:${categoryId}` } },
    ],
  };
}

export async function sampleNursingClientNeedsItems(params: {
  categoryId: NclexClientNeedsId;
  count: number;
  excludeIds?: readonly string[];
}): Promise<BankItem[]> {
  const want = Math.max(1, params.count);
  const pull = Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(want * 3, want + 20));
  let blocked: string[] = [];
  try {
    blocked = await ineligibleServedIds(NURSING_FIELD_ID);
  } catch (error) {
    console.warn(
      "[assemble] nursing eligibility list unavailable",
      error instanceof Error ? error.message : error
    );
  }
  const rows = await sampleQuestionBankRows({
    where: nursingClientNeedsWhere(params.categoryId, [...(params.excludeIds ?? []), ...blocked]),
    pull,
  });
  return retainStudentEligibleBankItems(rows.map((row) => enrichBankItemFromRow(row)))
    .filter((item) => examClientNeedsCategory(item) === params.categoryId)
    .slice(0, want);
}

/**
 * Extra bank rows for categories under their minimum. Empty when the window
 * already covers every minimum, or when the bank read fails.
 */
export async function topUpNursingClientNeedsPool(
  items: readonly BankItem[],
  limit: number
): Promise<BankItem[]> {
  const targets = clientNeedsTargets(limit);
  const deficits = clientNeedsDeficits(items, limit);
  if (!targets || deficits.length === 0) return [];
  const exclude = items.map((item) => item.id?.trim() ?? "").filter(Boolean);
  const extra: BankItem[] = [];
  for (const deficit of deficits) {
    const row = targets.find((target) => target.id === deficit.id);
    if (!row) continue;
    const want = Math.max(row.max - deficit.have, deficit.min - deficit.have);
    try {
      extra.push(
        ...(await sampleNursingClientNeedsItems({
          categoryId: deficit.id,
          count: want,
          excludeIds: exclude,
        }))
      );
    } catch (error) {
      console.warn(
        "[assemble] client-needs top-up unavailable",
        deficit.id,
        error instanceof Error ? error.message : error
      );
    }
  }
  return extra;
}
