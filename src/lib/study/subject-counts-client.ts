/** Client fetch for per-topic serve-ready counts — shared by React Query and prefetch. */
export async function fetchSubjectCounts(fieldId: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `/api/questions/subject-counts?field=${encodeURIComponent(fieldId)}`,
      { cache: "no-store" }
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
  } catch (error) {
    console.warn("[subject-counts] fetch failed:", error instanceof Error ? error.message : error);
  }

  // Soft-fail so the question bank UI stays usable during Neon blips.
  return {};
}
