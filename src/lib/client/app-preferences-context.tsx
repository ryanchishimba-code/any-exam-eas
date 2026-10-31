"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { isExamSlug } from "@/lib/edtech/exams";
import { EXAM_SWITCH_EVENT } from "@/lib/client/exam-switch-reset";
import {
  clearOptimisticExamSlug,
  displayedExamSlug,
  optimisticExamIsFresh,
  readOptimisticExamChoice,
  readOptimisticExamSlug,
  writeOptimisticExamSlug,
} from "@/lib/client/header-exam-slug";
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
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

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

/**
 * Bumped on every optimistic exam write. An in-flight preference fetch that
 * started before the write must not paint the previous board back onto nav.
 */
let preferenceWriteRevision = 0;
/** Server prop has caught up to the latest optimistic write. */
let confirmedPreferenceRevision = 0;

function publishOptimisticExamSlug(slug: ExamSlug | null) {
  writeOptimisticExamSlug(slug);
  preferenceWriteRevision += 1;
  cachedPreference = {
    examSlug: slug,
    mpjeStateCode: cachedPreference?.mpjeStateCode ?? null,
  };
}

function shownExam(accountExam: ExamSlug | null): ExamSlug | null {
  const choice = readOptimisticExamChoice();
  return displayedExamSlug({
    accountExam,
    optimisticExam: choice?.slug ?? null,
    optimisticAt: choice?.at,
  });
}

function dropStaleOptimistic(accountExam: ExamSlug | null): void {
  const choice = readOptimisticExamChoice();
  if (!choice) return;
  // A board chosen in the last minute must survive a cached read of the previous one.
  if (optimisticExamIsFresh(choice) && choice.slug !== accountExam) return;
  clearOptimisticExamSlug();
  if (choice.slug === accountExam) {
    confirmedPreferenceRevision = preferenceWriteRevision;
  }
}

function rememberConfirmedPreference(value: PreferencePayload, revision: number): void {
  const choice = readOptimisticExamChoice();
  if (choice && optimisticExamIsFresh(choice) && value.examSlug !== choice.slug) {
    return;
  }
  cachedPreference = value;
  confirmedPreferenceRevision = revision;
}

function applyFetchedExamSlug(
  payload: PreferencePayload,
  setExam: (slug: ExamSlug | null) => void
): void {
  dropStaleOptimistic(payload.examSlug);
  setExam(shownExam(payload.examSlug));
}

/** Shared across provider and fallback consumers; `force` bypasses the cache after a save. */
async function fetchPreference(force = false): Promise<PreferencePayload | null> {
  const revision = preferenceWriteRevision;
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
      // A newer optimistic write wins over this response.
      if (value && revision === preferenceWriteRevision) {
        rememberConfirmedPreference(value, revision);
      }
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
  const [examSlug, setExamSlugState] = useState<ExamSlug | null>(() => {
    if (preferenceWriteRevision > confirmedPreferenceRevision && cachedPreference?.examSlug) {
      return cachedPreference.examSlug;
    }
    return initialExamSlug;
  });
  const [mpjeStateCode, setMpjeStateCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(status === "authenticated" && !initialExamSlug);

  const setExamSlug = useCallback((slug: ExamSlug | null) => {
    publishOptimisticExamSlug(slug);
    setExamSlugState(slug);
  }, []);

  const load = useCallback(async (force: boolean) => {
    const revision = preferenceWriteRevision;
    try {
      const payload = await fetchPreference(force);
      if (!payload || revision !== preferenceWriteRevision) return;
      applyFetchedExamSlug(payload, setExamSlugState);
      setMpjeStateCode(payload.mpjeStateCode);
    } catch {
      if (revision !== preferenceWriteRevision) return;
      if (readOptimisticExamSlug()) return;
      setExamSlugState(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Callers refresh after saving a new exam, so never serve them a stale slug.
  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    function onExamSwitch(event: Event) {
      const slug = (event as CustomEvent<{ examSlug?: string }>).detail?.examSlug;
      if (!slug || !isExamSlug(slug)) return;
      publishOptimisticExamSlug(slug);
      setExamSlugState(slug);
    }
    window.addEventListener(EXAM_SWITCH_EVENT, onExamSwitch);
    return () => window.removeEventListener(EXAM_SWITCH_EVENT, onExamSwitch);
  }, []);

  // A switch in this session paints immediately. The layout can still be the
  // previous board for the preference cache window; that must not rewind the chip
  // or the feed link before the first click.
  useIsoLayoutEffect(() => {
    if (initialExamSlug === undefined) return;
    const shown = shownExam(initialExamSlug);
    dropStaleOptimistic(initialExamSlug);
    setExamSlugState((prev) => (prev === shown ? prev : shown));
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
      const shown = shownExam(initialExamSlug);
      dropStaleOptimistic(initialExamSlug);
      setExamSlugState((prev) => (prev === shown ? prev : shown));
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
    publishOptimisticExamSlug(slug);
    setExamSlugState(slug);
  }, []);

  const load = useCallback(async (force: boolean) => {
    const revision = preferenceWriteRevision;
    try {
      const payload = await fetchPreference(force);
      if (!payload || revision !== preferenceWriteRevision) return;
      applyFetchedExamSlug(payload, setExamSlugState);
      setMpjeStateCode(payload.mpjeStateCode);
    } catch {
      if (revision !== preferenceWriteRevision) return;
      if (readOptimisticExamSlug()) return;
      setExamSlugState(null);
      setMpjeStateCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    if (!active) return;
    function onExamSwitch(event: Event) {
      const slug = (event as CustomEvent<{ examSlug?: string }>).detail?.examSlug;
      if (!slug || !isExamSlug(slug)) return;
      publishOptimisticExamSlug(slug);
      setExamSlugState(slug);
    }
    window.addEventListener(EXAM_SWITCH_EVENT, onExamSwitch);
    return () => window.removeEventListener(EXAM_SWITCH_EVENT, onExamSwitch);
  }, [active]);

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
