"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

const STUDY_SESSION_PREFIX = "aee-study-v1";

function clearStudySessionsLocally() {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(`${STUDY_SESSION_PREFIX}:`)) keys.push(key);
    }
    for (const key of keys) window.localStorage.removeItem(key);
  } catch {
    /* private mode / quota */
  }
}

/**
 * Root React Query provider.
 * Kept dependency-light so the client chunk for RootLayout stays stable.
 */
export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    const onSignOut = () => {
      client.clear();
      clearStudySessionsLocally();
    };
    window.addEventListener("aee:clear-access-cache", onSignOut);
    return () => window.removeEventListener("aee:clear-access-cache", onSignOut);
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
