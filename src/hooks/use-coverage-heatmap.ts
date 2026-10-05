"use client";

import { useQuery } from "@tanstack/react-query";
import type { CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import {
  fetchCoverageHeatmap,
  type QuestionBankCoveragePayload,
} from "@/lib/study/coverage-client";

type UseCoverageHeatmapOptions = {
  initial?: CoverageHeatmap | QuestionBankCoveragePayload | null;
  initialFieldId?: string | null;
};

export function useCoverageHeatmap(fieldId: string, options: UseCoverageHeatmapOptions = {}) {
  const { initial, initialFieldId } = options;
  const seeded = Boolean(initialFieldId === fieldId && initial);
  const seededPayload: QuestionBankCoveragePayload | undefined =
    seeded && initial
      ? {
          ...initial,
          openIncorrectCount:
            "openIncorrectCount" in initial && typeof initial.openIncorrectCount === "number"
              ? initial.openIncorrectCount
              : null,
          weakTopics: "weakTopics" in initial && Array.isArray(initial.weakTopics) ? initial.weakTopics : [],
        }
      : undefined;

  return useQuery({
    queryKey: ["coverage-heatmap", fieldId],
    queryFn: () => fetchCoverageHeatmap(fieldId),
    initialData: seededPayload,
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] === fieldId) return previousData;
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: seeded ? false : "always",
    enabled: Boolean(fieldId),
  });
}
