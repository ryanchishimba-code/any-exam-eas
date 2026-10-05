"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchSubjectCounts,
  type SubjectCountsClient,
} from "@/lib/study/subject-counts-client";

export { fetchSubjectCounts };

type UseSubjectCountsOptions = {
  initial?: SubjectCountsClient | null;
  initialFieldId?: string | null;
};

export function useSubjectCounts(fieldId: string, options: UseSubjectCountsOptions = {}) {
  const { initial, initialFieldId } = options;
  const seeded = Boolean(initialFieldId === fieldId && initial);

  return useQuery({
    queryKey: ["subject-counts", fieldId],
    queryFn: () => fetchSubjectCounts(fieldId),
    initialData: seeded ? initial! : undefined,
    placeholderData: (previousData, previousQuery) => {
      if (previousQuery?.queryKey[1] === fieldId) return previousData;
      return undefined;
    },
    // The page already rendered these counts. Refetching on mount repeats the
    // inventory read and repaints the hub after load. A field change uses a new key.
    staleTime: seeded ? 5 * 60 * 1000 : 0,
    refetchOnMount: seeded ? false : "always",
    enabled: Boolean(fieldId),
  });
}
