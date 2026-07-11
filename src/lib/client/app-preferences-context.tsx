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
  /** Immediate UI update after saving a new exam (before navigation completes). */
  setExamSlug: (slug: ExamSlug | null) => void;
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
  const [examSlug, setExamSlugState] = useState<ExamSlug | null>(initialExamSlug);
  const [mpjeStateCode, setMpjeStateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(status === "authenticated" && !initialExamSlug);

  const setExamSlug = useCallback((slug: ExamSlug | null) => {
    setExamSlugState(slug);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/user/exam-preference", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        examSlug?: string | null;
        mpjeStateCode?: string | null;
      };
      setExamSlugState(data.examSlug && isExamSlug(data.examSlug) ? data.examSlug : null);
      setMpjeStateCode(data.mpjeStateCode ?? null);
    } catch {
      setExamSlugState(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync from server layout props only when they actually change to a new value.
  // Avoid clobbering an optimistic setExamSlug during soft refresh races.
  useEffect(() => {
    if (initialExamSlug === undefined) return;
    setExamSlugState((prev) => (prev === initialExamSlug ? prev : initialExamSlug));
  }, [initialExamSlug]);

  useEffect(() => {
    if (status !== "authenticated") {
      setExamSlugState(null);
      setMpjeStateCode(null);
      setLoading(false);
      return;
    }

    if (initialExamSlug) {
      setLoading(false);
      return;
    }

    void refresh();
  }, [status, initialExamSlug, refresh]);

  const value = useMemo(
    () => ({ examSlug, mpjeStateCode, loading, refresh, setExamSlug }),
    [examSlug, mpjeStateCode, loading, refresh, setExamSlug]
  );

  return (
    <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>
  );
}

function useLocalAppPreferences(active: boolean): AppPreferences {
  const { status } = useSession();
  const [examSlug, setExamSlugState] = useState<ExamSlug | null>(null);
  const [mpjeStateCode, setMpjeStateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(active && status === "authenticated");

  const setExamSlug = useCallback((slug: ExamSlug | null) => {
    setExamSlugState(slug);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/user/exam-preference", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        examSlug?: string | null;
        mpjeStateCode?: string | null;
      };
      setExamSlugState(data.examSlug && isExamSlug(data.examSlug) ? data.examSlug : null);
      setMpjeStateCode(data.mpjeStateCode ?? null);
    } catch {
      setExamSlugState(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    if (status !== "authenticated") {
      setLoading(false);
      setExamSlugState(null);
      setMpjeStateCode(null);
      return;
    }
    void refresh();
  }, [active, status, refresh]);

  return { examSlug, mpjeStateCode, loading, refresh, setExamSlug };
}

export function useAppPreferences(): AppPreferences {
  const context = useContext(AppPreferencesContext);
  const local = useLocalAppPreferences(context == null);
  return context ?? local;
}
