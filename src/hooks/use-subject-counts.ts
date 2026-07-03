"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSubjectCounts } from "@/lib/study/subject-counts-client";

export { fetchSubjectCounts };

type UseSubjectCountsOptions = {
  initialCounts?: Record<string, number> | null;
  initialFieldId?: string | null;
};

export function useSubjectCounts(fieldId: string, options: UseSubjectCountsOptions = {}) {
  const { initialCounts, initialFieldId } = options;
  const seeded = Boolean(initialFieldId === fieldId && initialCounts);

  return useQuery({
    queryKey: ["subject-counts", fieldId],
    queryFn: () => fetchSubjectCounts(fieldId),
    initialData: seeded ? initialCounts! : undefined,
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] === fieldId) return previousData;
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: seeded ? false : "always",
    enabled: Boolean(fieldId),
  });
}
