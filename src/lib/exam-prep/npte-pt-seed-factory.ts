import type { EnrichedBankItem, RelatedStudyMeta } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { ExamReference } from "./types";

type NptePtMeta = Partial<EnrichedBankItem> & {
  blueprintDomain?: string;
  blueprintSystem?: string;
  taskCategory?: string;
  blueprintTopic?: string;
  references?: ExamReference[];
  related?: RelatedStudyMeta;
};

function baseTags(meta: NptePtMeta, extra: string[] = []) {
  return [
    "npte-pt",
    "v1",
    "NPTE-PT-2024",
    ...(meta.blueprintSystem ? [meta.blueprintSystem] : []),
    ...extra,
    ...(meta.tags ?? []),
  ];
}

function payload(meta: NptePtMeta, extra: Record<string, unknown> = {}) {
  return {
    blueprintSystem: meta.blueprintSystem,
    taskCategory: meta.taskCategory,
    blueprintTopic: meta.blueprintTopic,
    ...meta.related,
    ...extra,
  };
}

/** Clinical scenario + separate stem (NPTE-PT case-style). */
export function nptePtVignette(
  subjectId: string,
  vignette: string,
  stem: string,
  options: readonly [string, string, string, string] | readonly string[],
  correct: string,
  explanation: string,
  meta: NptePtMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: [...options],
      correctAnswer: correct,
      explanation,
      itemType: "vignette",
      ngnPayload: payload(meta, { kind: "vignette" }),
      tags: baseTags(meta, ["clinical-vignette"]),
      blueprintDomain: meta.blueprintDomain ?? subjectId,
      difficulty: meta.difficulty ?? 4,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "vignette", difficulty: meta.difficulty ?? 4 }
  );
}
