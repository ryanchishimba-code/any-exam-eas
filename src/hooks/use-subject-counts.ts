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
    staleTime: 0,
    refetchOnMount: "always",
    enabled: Boolean(fieldId),
  });
}
