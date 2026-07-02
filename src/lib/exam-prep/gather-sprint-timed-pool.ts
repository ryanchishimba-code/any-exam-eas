/**
 * Fast timed exam gather — one or two DB pulls with a single serve gate.
 * Avoids blueprint compose and multi-tier progressive pulls on live requests.
 */
import type { BankItem } from "@/lib/question-bank";
import { sampleQuestionBankItemsForField } from "@/lib/question-bank-db";
import { prepareBoardBankItem } from "@/lib/exam-prep/board-serve-registry";
import { timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import { timedExamPrepareItemForField } from "@/lib/exam-prep/compose/exam-compose-config";

const SPRINT_MAX = 100;

export function isSprintTimedExamLimit(limit: number): boolean {
  return limit > 0 && limit <= SPRINT_MAX;
}

/** DB pull size for fast gather — scales with session length, capped for latency. */
export function resolveFastTimedPullSize(limit: number): number {
  if (limit <= SPRINT_MAX) {
    return Math.min(180, Math.max(limit + 28, Math.ceil(limit * 1.35)));
  }
  return Math.min(420, Math.max(limit + 48, Math.ceil(limit * 1.22)));
}

function itemKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

/** Prefer the serve gate when present; fall back to structural. */
function sprintFilterForField(fieldId: string) {
  const ladder = timedExamGatherLadderForField(fieldId);
  return (
    ladder.find((t) => t.id === "serve") ??
    ladder.find((t) => t.id === "best") ??
    ladder.find((t) => t.id === "structural") ??
    ladder[0]!
  ).filter;
}

function collectFromBatch(
  batch: BankItem[],
  filterFn: (item: BankItem) => boolean,
  prepareItem: ((item: BankItem) => BankItem) | undefined,
  limit: number,
  seen: Set<string>,
  out: BankItem[]
): void {
  for (const item of batch) {
    if (out.length >= limit) break;
    const key = itemKey(item);
    if (seen.has(key)) continue;
    const prepared = prepareItem ? prepareItem(item) : item;
    if (!filterFn(prepared)) continue;
    seen.add(key);
    out.push(prepared);
  }
}

function resolveSprintPrepareItem(
  fieldId: string,
  prepareItem?: (item: BankItem) => BankItem
): (item: BankItem) => BankItem {
  if (prepareItem) return prepareItem;
  const fromConfig = timedExamPrepareItemForField(fieldId);
  if (fromConfig) return fromConfig;
  return (item) => prepareBoardBankItem(fieldId, item);
}

export async function gatherSprintTimedExamPool(params: {
  fieldId: string;
  limit: number;
  prepareItem?: (item: BankItem) => BankItem;
}): Promise<BankItem[]> {
  const { fieldId, limit } = params;
  const prepareItem = resolveSprintPrepareItem(fieldId, params.prepareItem);
  if (limit <= 0) return [];

  const filterFn = sprintFilterForField(fieldId);
  const pullSize = resolveFastTimedPullSize(limit);
  const seen = new Set<string>();
  const selected: BankItem[] = [];

  const first = await sampleQuestionBankItemsForField({
    fieldId,
    count: pullSize,
  });
  collectFromBatch(first, filterFn, prepareItem, limit, seen, selected);

  if (selected.length < limit) {
    const retry = await sampleQuestionBankItemsForField({
      fieldId,
      count: pullSize,
      skipEnsure: true,
    });
    collectFromBatch(retry, filterFn, prepareItem, limit, seen, selected);
  }

  return selected.slice(0, limit);
}
