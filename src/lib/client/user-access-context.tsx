"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type UserAccessState = {
  loading: boolean;
  hasPremiumAccess: boolean;
  hasAppAccess: boolean;
  hasStudyAccess: boolean;
  hasFreeTierAccess: boolean;
  status: string | null;
  role: string | null;
};

const defaultState: UserAccessState = {
  loading: true,
  hasPremiumAccess: false,
  hasAppAccess: false,
  hasStudyAccess: false,
  hasFreeTierAccess: false,
  status: null,
  role: null,
};

const loggedOutState: UserAccessState = {
  loading: false,
  hasPremiumAccess: false,
  hasAppAccess: false,
  hasStudyAccess: false,
  hasFreeTierAccess: false,
  status: null,
  role: null,
};

let cachedAccess: UserAccessState | null = null;
let inflightAccess: Promise<UserAccessState> | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("aee:clear-access-cache", () => {
    cachedAccess = null;
    inflightAccess = null;
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUserAccessOnce(): Promise<UserAccessState> {
  const res = await fetch("/api/subscription/status?lite=1", { cache: "no-store" });
  if (!res.ok) throw new Error(`status fetch failed (${res.status})`);
  const data = (await res.json()) as {
    hasAccess?: boolean;
    hasAppAccess?: boolean;
    hasStudyAccess?: boolean;
    hasFreeTierAccess?: boolean;
    status?: string;
    role?: string;
  };
  return {
    loading: false,
    hasPremiumAccess: Boolean(data.hasAccess),
    hasAppAccess: Boolean(data.hasAppAccess ?? data.hasAccess),
    hasStudyAccess: Boolean(data.hasStudyAccess ?? data.hasAccess),
    hasFreeTierAccess: Boolean(data.hasFreeTierAccess),
    status: data.status ?? null,
    role: data.role ?? null,
  };
}

async function fetchUserAccess(): Promise<UserAccessState> {
  if (cachedAccess && !cachedAccess.loading) {
    return cachedAccess;
  }

  if (inflightAccess) {
    return inflightAccess;
  }

  inflightAccess = (async () => {
    const maxAttempts = 2;
    try {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const next = await fetchUserAccessOnce();
          cachedAccess = next;
          return next;
        } catch (error) {
          const isLast = attempt + 1 >= maxAttempts;
          if (isLast) throw error;
          await sleep(300 * 2 ** attempt);
        }
      }
      throw new Error("status fetch exhausted retries");
    } catch {
      if (cachedAccess) return { ...cachedAccess, loading: false };
      return loggedOutState;
    } finally {
      inflightAccess = null;
    }
  })();

  return inflightAccess;
}

const UserAccessContext = createContext<UserAccessState | null>(null);

/** Single subscription fetch for nav, footer, home, and other chrome. */
export function UserAccessProvider({
  children,
  initialAccess = null,
}: {
  children: ReactNode;
  initialAccess?: UserAccessState | null;
}) {
  const { status: sessionStatus } = useSession();
  const [access, setAccess] = useState<UserAccessState>(() => {
    if (initialAccess && !initialAccess.loading) return initialAccess;
    if (sessionStatus === "authenticated" && cachedAccess) return cachedAccess;
    if (sessionStatus === "unauthenticated") return loggedOutState;
    return defaultState;
  });

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus !== "authenticated") {
      cachedAccess = null;
      inflightAccess = null;
      setAccess(loggedOutState);
      return;
    }

    if (initialAccess && !initialAccess.loading) {
      cachedAccess = initialAccess;
      setAccess(initialAccess);
      return;
    }

    cachedAccess = null;

    let cancelled = false;
    void fetchUserAccess().then((next) => {
      if (!cancelled) setAccess(next);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, initialAccess]);

  const value = useMemo(() => access, [access]);

  return (
    <UserAccessContext.Provider value={value}>{children}</UserAccessContext.Provider>
  );
}

export function useUserAccess(): UserAccessState {
  const context = useContext(UserAccessContext);
  const { status: sessionStatus } = useSession();
  const [localAccess, setLocalAccess] = useState<UserAccessState>(() =>
    sessionStatus === "authenticated" && cachedAccess ? cachedAccess : defaultState
  );

  useEffect(() => {
    if (context != null) return;

    if (sessionStatus === "loading") return;

    if (sessionStatus !== "authenticated") {
      setLocalAccess(loggedOutState);
      return;
    }

    let cancelled = false;
    void fetchUserAccess().then((next) => {
      if (!cancelled) setLocalAccess(next);
    });

    return () => {
      cancelled = true;
    };
  }, [context, sessionStatus]);

  return context ?? localAccess;
}
