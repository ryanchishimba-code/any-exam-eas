/**
 * Hybrid ingest gate for AANP FNP — same bar students see, with repair-first speed.
 *
 * Fast path: deterministic repair → bankItemPassesIngestGate (no extra qcScore threshold).
 * Slow path: AI repair only when salvageable (no hard structural errors).
 * Advisory: assessAanpFnpBankItem qcScore stored in metadata, not used to block ingest.
 */
import type { BankItem } from "@/lib/question-bank";
import { bankItemPassesIngestGate } from "../bank-ingest-gate";
import { auditBankItem } from "../bank-audit";
import { assessAanpFnpBankItem } from "./quality-gate";
import {
  repairAanpFnpBankItemDeterministic,
  repairAanpFnpBankItemWithAi,
} from "./vignette-repair";
import type { AanpFnpReviewStatus } from "./types";

const FIELD_ID = "aanp-fnp";

export type AanpFnpHybridTier = "ready" | "rejected";

export type AanpFnpHybridGateResult = {
  item: BankItem;
  tier: AanpFnpHybridTier;
  /** Matches db:qa-gate / practice session serve bar. */
  ingestReady: boolean;
  repairMethod: "none" | "deterministic" | "ai";
  qcScore: number;
  reviewStatus: AanpFnpReviewStatus;
  flags: string[];
};

/** True when item meets the same bar enforced by db:qa-gate and practice sessions. */
export function aanpFnpPassesHybridIngestGate(
  item: BankItem,
  source: string | null = "generated"
): boolean {
  return bankItemPassesIngestGate(FIELD_ID, item, source);
}

/** Hard structural failures — skip expensive AI repair. */
export function aanpFnpHasHardReject(item: BankItem): boolean {
  const audit = auditBankItem(item, FIELD_ID);
  if (!audit.ok) return true;
  if (!item.correctAnswer?.trim()) return true;
  if (!item.options?.length || item.options.length < 4) return true;
  if (!item.question?.trim() || item.question.trim().length < 12) return true;
  return false;
}

function enrichWithQcMeta(
  item: BankItem,
  repairMethod: AanpFnpHybridGateResult["repairMethod"],
  source: string | null
): AanpFnpHybridGateResult {
  const qc = assessAanpFnpBankItem(item, { fieldId: FIELD_ID, source });
  const ingestReady = aanpFnpPassesHybridIngestGate(item, source);

  return {
    item: {
      ...item,
      ngnPayload: {
        ...item.ngnPayload,
        generationMeta: {
          ...(item.ngnPayload?.generationMeta as Record<string, unknown> | undefined),
          qcScore: qc.qcScore,
          qcFlags: qc.flags,
          repairMethod,
          hybridGate: ingestReady ? "ready" : "rejected",
        },
      },
    },
    tier: ingestReady ? "ready" : "rejected",
    ingestReady,
    repairMethod,
    qcScore: qc.qcScore,
    reviewStatus: qc.reviewStatus,
    flags: qc.flags,
  };
}

/**
 * Repair-first hybrid gate — maximizes additions that would pass db:qa-gate
 * without the stricter inline qcScore >= 60 bar.
 */
export async function runAanpFnpHybridGate(
  item: BankItem,
  opts: { source?: string | null; useAiRepair?: boolean } = {}
): Promise<AanpFnpHybridGateResult> {
  const source = opts.source ?? "generated";
  const original = item;

  let candidate = repairAanpFnpBankItemDeterministic(item);
  let repairMethod: AanpFnpHybridGateResult["repairMethod"] =
    candidate === original ? "none" : "deterministic";

  if (aanpFnpPassesHybridIngestGate(candidate, source)) {
    return enrichWithQcMeta(candidate, repairMethod, source);
  }

  const salvageable = !aanpFnpHasHardReject(candidate);
  if (salvageable && opts.useAiRepair !== false) {
    const qc = assessAanpFnpBankItem(candidate, { fieldId: FIELD_ID, source });
    const aiFixed = await repairAanpFnpBankItemWithAi(candidate, qc.issues);
    if (aiFixed) {
      candidate = aiFixed;
      repairMethod = "ai";
    }
  }

  return enrichWithQcMeta(candidate, repairMethod, source);
}

/** Sync wrapper for seeds / tests. */
export function runAanpFnpHybridGateSync(
  item: BankItem,
  opts: { source?: string | null } = {}
): AanpFnpHybridGateResult {
  const source = opts.source ?? "generated";
  const original = item;
  const candidate = repairAanpFnpBankItemDeterministic(item);
  const repairMethod: AanpFnpHybridGateResult["repairMethod"] =
    candidate === original ? "none" : "deterministic";
  return enrichWithQcMeta(candidate, repairMethod, source);
}
