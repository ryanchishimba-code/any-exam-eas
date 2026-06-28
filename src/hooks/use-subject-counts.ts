"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchSubjectCounts(fieldId: string): Promise<Record<string, number>> {
  const res = await fetch(
    `/api/questions/subject-counts?field=${encodeURIComponent(fieldId)}`,
    { cache: "force-cache" }
  );

  if (res.ok) {
    const data = await res.json();
    if (data?.counts && Object.keys(data.counts).length > 0) {
      return data.counts as Record<string, number>;
    }
  }

  if (res.status === 503) {
    const data = await res.json().catch(() => null);
    if (data?.dbError) {
      await new Promise((r) => setTimeout(r, 600));
      const retry = await fetch(
        `/api/questions/subject-counts?field=${encodeURIComponent(fieldId)}`,
        { cache: "no-store" }
      );
      if (retry.ok) {
        const retryData = await retry.json();
        if (retryData?.counts && Object.keys(retryData.counts).length > 0) {
          return retryData.counts as Record<string, number>;
        }
      }
    }
  }

  throw new Error("subject-counts-unavailable");
}

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
    placeholderData: seeded ? initialCounts! : undefined,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(fieldId),
  });
}
