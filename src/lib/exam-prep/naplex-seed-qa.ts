/**
 * QA gate for NAPLEX_QUALITY_V2 and related hand-authored seed batches.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import { polishNaplexBankItem } from "@/lib/engine/polish/naplex-polish";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "./naplex-quality-gate";
import { auditBankItem } from "./bank-audit";
import { auditNaplexBankItem, resolveNaplexStem } from "./naplex-bank-audit";
import type { BankItem } from "@/lib/question-bank";

export type NaplexSeedQaIssue = {
  batch: string;
  index: number;
  subjectId?: string;
  stem: string;
  codes: string[];
};

export function assertNaplexSeedBatchQuality(
  items: EnrichedBankItem[],
  batchName: string,
  opts?: { requireBest?: boolean }
): void {
  const failures: NaplexSeedQaIssue[] = [];

  items.forEach((raw, index) => {
    const subjectId = raw.subjectId ?? "pharmacology";
    const polished = polishNaplexBankItem(raw as BankItem, subjectId, subjectId, index);
    const item = polished.item;

    const shared = auditBankItem(item, "pharmacy");
    const naplex = auditNaplexBankItem(item);
    const verdict = assessNaplexItemQuality(item, { source: "seed" });
    const blockingIssues = [
      ...shared.issues.filter((i) => i.severity === "error").map((i) => i.code),
      ...naplex.issues.filter((i) => i.severity === "error").map((i) => i.code),
      ...verdict.issues,
    ];

    const clinicalOk = blockingIssues.length === 0;
    const bestOk = !opts?.requireBest || isNaplexBestQuality(item, { source: "seed" });

    if (!clinicalOk || !bestOk) {
      failures.push({
        batch: batchName,
        index,
        subjectId,
        stem: resolveNaplexStem(item).slice(0, 120),
        codes: [...new Set(blockingIssues)],
      });
    }
  });

  if (failures.length > 0) {
    const preview = failures
      .slice(0, 8)
      .map((f) => `  [${f.batch} #${f.index}] ${f.subjectId}: ${f.stem} → ${f.codes.join(", ")}`)
      .join("\n");
    throw new Error(
      `${batchName}: ${failures.length}/${items.length} item(s) failed NAPLEX QA gate.\n${preview}`
    );
  }
}
