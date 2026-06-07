"use client";

import { useCallback, useEffect, useState } from "react";
import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

export type AppPreferences = {
  examSlug: ExamSlug | null;
  mpjeStateCode: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useAppPreferences(): AppPreferences {
  const [examSlug, setExamSlug] = useState<ExamSlug | null>(null);
  const [mpjeStateCode, setMpjeStateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/user/exam-preference", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        examSlug?: string | null;
        mpjeStateCode?: string | null;
      };
      setExamSlug(data.examSlug && isExamSlug(data.examSlug) ? data.examSlug : null);
      setMpjeStateCode(data.mpjeStateCode ?? null);
    } catch {
      setExamSlug(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { examSlug, mpjeStateCode, loading, refresh };
}
