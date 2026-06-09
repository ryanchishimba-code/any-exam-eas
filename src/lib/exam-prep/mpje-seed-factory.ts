import type { EnrichedBankItem } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { BlueprintDomain } from "./types";

type MpjeMeta = Partial<EnrichedBankItem> & {
  blueprintDomain?: BlueprintDomain;
  stateCode?: string | null;
};

function baseTags(meta: MpjeMeta, extra: string[] = []) {
  const stateCode = meta.stateCode ?? null;
  return [
    "mpje",
    ...(stateCode ? [`state-${stateCode}`] : ["federal"]),
    ...extra,
    ...(meta.tags ?? []),
  ];
}

/** Scenario vignette + separate stem (MPJE case-style). */
export function mpjeCase(
  subjectId: string,
  vignette: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  meta: MpjeMeta
): EnrichedBankItem {
  const stateCode = meta.stateCode ?? null;
  return enrichItem(
    {
      subjectId,
      stateCode,
      vignette,
      question: stem,
      options: options as EnrichedBankItem["options"],
      correctAnswer: correct,
      explanation,
      itemType: "vignette",
      tags: baseTags(meta, ["case-vignette"]),
      blueprintDomain: meta.blueprintDomain ?? (stateCode ? "mpje-jurisprudence" : "umpje-uniform"),
      difficulty: meta.difficulty ?? 3,
      references: meta.references,
      distractorRationale: meta.distractorRationale,
      ngnPayload: meta.ngnPayload,
    },
    { topicCategory: subjectId, itemType: "vignette", difficulty: meta.difficulty ?? 3 }
  );
}

/** Pure law or short-context MCQ (optional vignette). */
export function mpjeMcq(
  subjectId: string,
  vignette: string,
  stem: string,
  options: [string, string, string, string] | [string, string, string, string, string],
  correct: string,
  explanation: string,
  meta: MpjeMeta
): EnrichedBankItem {
  const stateCode = meta.stateCode ?? null;
  const hasVignette = Boolean(vignette?.trim());
  return enrichItem(
    {
      subjectId,
      stateCode,
      vignette: hasVignette ? vignette : undefined,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: hasVignette ? "vignette" : "mcq",
      tags: baseTags(meta),
      blueprintDomain: meta.blueprintDomain ?? (stateCode ? "mpje-jurisprudence" : "umpje-uniform"),
      difficulty: meta.difficulty ?? 3,
      references: meta.references,
      distractorRationale: meta.distractorRationale,
      ngnPayload: meta.ngnPayload,
    },
    { topicCategory: subjectId, itemType: hasVignette ? "vignette" : "mcq" }
  );
}
