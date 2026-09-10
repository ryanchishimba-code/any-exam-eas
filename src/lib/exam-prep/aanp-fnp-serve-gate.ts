/**
 * Runtime serve gate for AANP FNP — prepare exhibits + FNP quality bar.
 * Stops leaning solely on the shared USMLE clinical gate for session serve.
 */
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { rawQuestionMeetsBoardBar } from "@/lib/exam-prep/board-serve-quality";
import { serveQaPassedBankItems } from "@/lib/exam-prep/serve-qa-passed";
import {
  usmleBankItemIsExamFillReady,
  usmleBankItemPassesStructuralGate,
} from "@/lib/exam-prep/usmle-clinical-gate";
import {
  aanpFnpBankItemIsServeReady as qualityServeReady,
} from "@/lib/exam-prep/aanp-fnp/quality-gate";
import { prepareAanpFnpBankItem } from "@/lib/exam-prep/aanp-fnp/normalize-exhibit";
import { bankItemToAanpFnpRaw } from "@/lib/exam-prep/aanp-fnp-bank-bridge";
import { parseSelectAllCorrectAnswers } from "@/lib/question-format";

export { prepareAanpFnpBankItem } from "@/lib/exam-prep/aanp-fnp/normalize-exhibit";

function selectAllAnswerIsScorable(item: BankItem): boolean {
  const type = item.itemType ?? "";
  if (type !== "select_all" && type !== "sata") return true;
  if ((item.options?.length ?? 0) < 4) return false;
  const answer =
    typeof item.correctAnswer === "string"
      ? item.correctAnswer
      : Array.isArray(item.correctAnswer)
        ? (item.correctAnswer as string[]).join("|||")
        : String(item.correctAnswer ?? "");
  const keys = parseSelectAllCorrectAnswers(item.options, answer);
  return keys.length >= 2;
}

/** Best-tier serve readiness after exhibit normalize + SATA answer check. */
export function aanpFnpBankItemIsServeReady(
  item: BankItem,
  _opts?: { source?: string | null }
): boolean {
  const prepared = prepareAanpFnpBankItem(item);
  if (!selectAllAnswerIsScorable(prepared)) return false;
  return qualityServeReady(prepared, "aanp-fnp");
}

/** Structural timed path — vignette shape + scorable answer (includes SATA). */
export function aanpFnpItemPassesStructuralTimedGate(item: BankItem): boolean {
  const prepared = prepareAanpFnpBankItem(item);
  if (!selectAllAnswerIsScorable(prepared)) return false;
  if (!auditBankItem(prepared, "aanp-fnp").ok) return false;
  if (!usmleBankItemPassesStructuralGate(prepared, "aanp-fnp")) return false;
  const raw = bankItemToAanpFnpRaw(prepared, 0, {
    field: "aanp-fnp",
    subjectId: prepared.subjectId ?? "aanp-fnp",
  });
  return rawQuestionMeetsBoardBar(raw);
}

export function aanpFnpItemPassesTimedExamGate(item: BankItem): boolean {
  return aanpFnpBankItemIsServeReady(item, { source: item.source ?? null });
}

/** Acceptable-tier when best-only pool cannot fill the exam. */
export function aanpFnpItemPassesRelaxedExamGate(item: BankItem): boolean {
  const prepared = prepareAanpFnpBankItem(item);
  if (!selectAllAnswerIsScorable(prepared)) return false;
  return usmleBankItemIsExamFillReady(prepared, "aanp-fnp");
}

export function prepareAanpFnpItemsForSession(params: {
  items: BankItem[];
  limit: number;
}): BankItem[] {
  const vetted = params.items
    .map((item) => prepareAanpFnpBankItem(item))
    .filter((item) => aanpFnpBankItemIsServeReady(item, { source: item.source ?? null }));
  return serveQaPassedBankItems(vetted, params.limit);
}

export function filterAanpFnpItemsForSession(items: BankItem[]): BankItem[] {
  return items
    .map((item) => prepareAanpFnpBankItem(item))
    .filter((item) => aanpFnpBankItemIsServeReady(item, { source: item.source ?? null }));
}
