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

type PreferencePayload = {
  examSlug: ExamSlug | null;
  mpjeStateCode: string | null;
};

/**
 * `Navigation` renders as a sibling of `{children}` in the root layout, so it sits
 * outside the `(app)` provider and every consumer there falls back to its own fetch.
 * GlobalExamSwitcher and AvatarDropdown mount in the same commit, which made two
 * identical requests per page load. Coalesce them the way user-access-context does.
 */
let cachedPreference: PreferencePayload | null = null;
let inflightPreference: Promise<PreferencePayload | null> | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("aee:clear-access-cache", () => {
    cachedPreference = null;
    inflightPreference = null;
  });
}

function readPreferencePayload(data: {
  examSlug?: string | null;
  mpjeStateCode?: string | null;
}): PreferencePayload {
  return {
    examSlug: data.examSlug && isExamSlug(data.examSlug) ? data.examSlug : null,
    mpjeStateCode: data.mpjeStateCode ?? null,
  };
}

/** `null` means the server declined (e.g. 401) — callers keep their current slug. */
async function fetchPreferenceOnce(): Promise<PreferencePayload | null> {
  const res = await fetch("/api/user/exam-preference", { cache: "no-store" });
  if (!res.ok) return null;
  return readPreferencePayload(await res.json());
}

/** Shared across provider and fallback consumers; `force` bypasses the cache after a save. */
async function fetchPreference(force = false): Promise<PreferencePayload | null> {
  if (force) {
    cachedPreference = null;
    inflightPreference = null;
  } else if (cachedPreference) {
    return cachedPreference;
  }

  if (inflightPreference) return inflightPreference;

  const pending = fetchPreferenceOnce()
    .then((value) => {
      // Only a real payload is worth caching; a declined read stays retryable.
      if (value) cachedPreference = value;
      if (inflightPreference === pending) inflightPreference = null;
      return value;
    })
    .catch((err) => {
      if (inflightPreference === pending) inflightPreference = null;
      throw err;
    });

  inflightPreference = pending;
  return pending;
}

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

  const load = useCallback(async (force: boolean) => {
    try {
      const payload = await fetchPreference(force);
      if (!payload) return;
      setExamSlugState(payload.examSlug);
      setMpjeStateCode(payload.mpjeStateCode);
    } catch {
      setExamSlugState(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Callers refresh after saving a new exam, so never serve them a stale slug.
  const refresh = useCallback(() => load(true), [load]);

  // Sync from server layout props only when they actually change to a new value.
  // Avoid clobbering an optimistic setExamSlug during soft refresh races.
  useEffect(() => {
    if (initialExamSlug === undefined) return;
    setExamSlugState((prev) => (prev === initialExamSlug ? prev : initialExamSlug));
  }, [initialExamSlug]);

  useEffect(() => {
    // `useSession` reports "loading" until it resolves. Treating that as signed
    // out discards the slug the server already resolved, and the authenticated
    // pass below returns early without restoring it — leaving the app stuck on
    // "Select exam" with exam-scoped nav hidden.
    if (status === "loading") return;

    if (status !== "authenticated") {
      setExamSlugState(null);
      setMpjeStateCode(null);
      setLoading(false);
      return;
    }

    if (initialExamSlug) {
      setExamSlugState((prev) => prev ?? initialExamSlug);
      setLoading(false);
      return;
    }

    void load(false);
  }, [status, initialExamSlug, load]);

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

  const load = useCallback(async (force: boolean) => {
    try {
      const payload = await fetchPreference(force);
      if (!payload) return;
      setExamSlugState(payload.examSlug);
      setMpjeStateCode(payload.mpjeStateCode);
    } catch {
      setExamSlugState(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    if (!active) return;
    if (status === "loading") return;
    if (status !== "authenticated") {
      setLoading(false);
      setExamSlugState(null);
      setMpjeStateCode(null);
      return;
    }
    void load(false);
  }, [active, status, load]);

  return { examSlug, mpjeStateCode, loading, refresh, setExamSlug };
}

export function useAppPreferences(): AppPreferences {
  const context = useContext(AppPreferencesContext);
  const local = useLocalAppPreferences(context == null);
  return context ?? local;
}
