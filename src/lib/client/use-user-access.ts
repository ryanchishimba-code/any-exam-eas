"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export type UserAccessState = {
  loading: boolean;
  hasPremiumAccess: boolean;
  status: string | null;
  role: string | null;
};

const defaultState: UserAccessState = {
  loading: true,
  hasPremiumAccess: false,
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
      const res = await fetch("/api/subscription/status", { cache: "no-store" });
      if (!res.ok) throw new Error("status fetch failed");
      const data = (await res.json()) as {
        hasAccess?: boolean;
        status?: string;
        role?: string;
      };
      const next: UserAccessState = {
        loading: false,
        hasPremiumAccess: Boolean(data.hasAccess),
        status: data.status ?? null,
        role: data.role ?? null,
      };
      cachedAccess = next;
      return next;
    } catch {
      const fallback: UserAccessState = {
        loading: false,
        hasPremiumAccess: false,
        status: null,
        role: null,
      };
      return fallback;
    } finally {
      inflightAccess = null;
    }
  })();

  return inflightAccess;
}

export function useUserAccess(): UserAccessState {
  const { status: sessionStatus } = useSession();
  const [access, setAccess] = useState<UserAccessState>(() =>
    sessionStatus === "authenticated" && cachedAccess ? cachedAccess : defaultState
  );

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus !== "authenticated") {
      cachedAccess = null;
      inflightAccess = null;
      setAccess({ loading: false, hasPremiumAccess: false, status: null, role: null });
      return;
    }

    let cancelled = false;

    void fetchUserAccess().then((next) => {
      if (cancelled) return;
      setAccess(next);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionStatus]);

  return access;
}
