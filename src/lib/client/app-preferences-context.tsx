"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";

export type AppPreferences = {
  examSlug: ExamSlug | null;
  mpjeStateCode: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AppPreferencesContext = createContext<AppPreferences | null>(null);

type ProviderProps = {
  initialExamSlug?: ExamSlug | null;
  children: ReactNode;
};

export function AppPreferencesProvider({
  initialExamSlug = null,
  children,
}: ProviderProps) {
  const { status } = useSession();
  const [examSlug, setExamSlug] = useState<ExamSlug | null>(initialExamSlug);
  const [mpjeStateCode, setMpjeStateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(status === "authenticated" && !initialExamSlug);

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
    if (status !== "authenticated") {
      setExamSlug(null);
      setMpjeStateCode(null);
      setLoading(false);
      return;
    }
    if (initialExamSlug) {
      setExamSlug(initialExamSlug);
      setLoading(false);
      return;
    }
    void refresh();
  }, [status, initialExamSlug, refresh]);

  const value = useMemo(
    () => ({ examSlug, mpjeStateCode, loading, refresh }),
    [examSlug, mpjeStateCode, loading, refresh]
  );

  return (
    <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>
  );
}

function useLocalAppPreferences(active: boolean): AppPreferences {
  const { status } = useSession();
  const [examSlug, setExamSlug] = useState<ExamSlug | null>(null);
  const [mpjeStateCode, setMpjeStateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(active && status === "authenticated");

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
    if (!active) return;
    if (status !== "authenticated") {
      setLoading(false);
      setExamSlug(null);
      setMpjeStateCode(null);
      return;
    }
    void refresh();
  }, [active, status, refresh]);

  return { examSlug, mpjeStateCode, loading, refresh };
}

export function useAppPreferences(): AppPreferences {
  const context = useContext(AppPreferencesContext);
  const local = useLocalAppPreferences(context == null);
  return context ?? local;
}
