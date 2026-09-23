"use client";

import { useQuery } from "@tanstack/react-query";
import type { CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import { fetchCoverageHeatmap } from "@/lib/study/coverage-client";

type UseCoverageHeatmapOptions = {
  initial?: CoverageHeatmap | null;
  initialFieldId?: string | null;
};

export function useCoverageHeatmap(fieldId: string, options: UseCoverageHeatmapOptions = {}) {
  const { initial, initialFieldId } = options;
  const seeded = Boolean(initialFieldId === fieldId && initial);

  return useQuery({
    queryKey: ["coverage-heatmap", fieldId],
    queryFn: () => fetchCoverageHeatmap(fieldId),
    initialData: seeded ? initial! : undefined,
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] === fieldId) return previousData;
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: seeded ? false : "always",
    enabled: Boolean(fieldId),
  });
}
