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
  status: string | null;
  role: string | null;
};

const defaultState: UserAccessState = {
  loading: true,
  hasPremiumAccess: false,
  hasAppAccess: false,
  status: null,
  role: null,
};

const loggedOutState: UserAccessState = {
  loading: false,
  hasPremiumAccess: false,
  hasAppAccess: false,
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

async function fetchUserAccess(): Promise<UserAccessState> {
  if (cachedAccess && !cachedAccess.loading) {
    return cachedAccess;
  }

  if (inflightAccess) {
    return inflightAccess;
  }

  inflightAccess = (async () => {
    try {
      const res = await fetch("/api/subscription/status?lite=1", { cache: "no-store" });
      if (!res.ok) throw new Error("status fetch failed");
      const data = (await res.json()) as {
        hasAccess?: boolean;
        hasAppAccess?: boolean;
        status?: string;
        role?: string;
      };
      const next: UserAccessState = {
        loading: false,
        hasPremiumAccess: Boolean(data.hasAccess),
        hasAppAccess: Boolean(data.hasAppAccess ?? data.hasAccess),
        status: data.status ?? null,
        role: data.role ?? null,
      };
      cachedAccess = next;
      return next;
    } catch {
      return loggedOutState;
    } finally {
      inflightAccess = null;
    }
  })();

  return inflightAccess;
}

const UserAccessContext = createContext<UserAccessState | null>(null);

/** Single subscription fetch for nav, footer, home, and other chrome. */
export function UserAccessProvider({ children }: { children: ReactNode }) {
  const { status: sessionStatus } = useSession();
  const [access, setAccess] = useState<UserAccessState>(() => {
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

    let cancelled = false;
    void fetchUserAccess().then((next) => {
      if (!cancelled) setAccess(next);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionStatus]);

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
